"""Run against sibling ERP source with an isolated in-memory DB; never imports production settings."""
import sys
import unittest
import uuid
from pathlib import Path
from unittest.mock import patch

root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root / '.test-python-deps'))
sys.path.insert(0, str(root.parent / 'KarolayJeansERP' / 'backend'))
from django.conf import settings
settings.configure(
    SECRET_KEY='isolated-legal-tests', WEB_API_KEY='test-web-key', USE_TZ=True,
    INSTALLED_APPS=['django.contrib.contenttypes', 'django.contrib.auth', 'apps.marketing'],
    DATABASES={'default': {'ENGINE': 'django.db.backends.sqlite3', 'NAME': ':memory:'}},
    DEFAULT_AUTO_FIELD='django.db.models.BigAutoField',
    REST_FRAMEWORK={'DEFAULT_THROTTLE_CLASSES': [], 'UNAUTHENTICATED_USER': None},
    PASSWORD_HASHERS=['django.contrib.auth.hashers.MD5PasswordHasher'],
)
import django
django.setup()
from django.core.management import call_command
from django.test import TestCase
from rest_framework.test import APIRequestFactory
from apps.marketing.models import WebCliente, WebConsentimiento, WebReclamacion, WebHojaReclamacion
from apps.marketing.views_web import WebRegistroView, WebClienteDetailView, WebReclamacionCreateView

call_command('migrate', verbosity=0)
call_command('makemigrations', 'marketing', check=True, dry_run=True, verbosity=1)


class LegalTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    def post(self, view, body):
        return view.as_view()(self.factory.post('/', body, format='json', HTTP_X_WEB_KEY='test-web-key'))

    def registration(self):
        return {'nombre': 'Cliente ficticio', 'email': 'test@example.invalid', 'password': 'test-password',
                'legal': {'version': '2026-09-19', 'terminos': True, 'email': False, 'whatsapp': True}}

    def complaint(self):
        return {'solicitud_id': str(uuid.uuid4()), 'nombre': 'Prueba ficticia', 'tipo_documento': 'DNI',
                'dni': '00000000', 'direccion': 'Domicilio ficticio', 'respuesta': 'domicilio',
                'tipo_bien': 'servicio', 'descripcion_bien': 'Atención', 'moneda': 'PEN',
                'tipo': 'queja', 'detalle': 'Mal trato.', 'pedido': 'Respuesta.'}

    def test_registration_requires_valid_acceptance(self):
        data = self.registration()
        data['legal']['terminos'] = False
        self.assertEqual(self.post(WebRegistroView, data).status_code, 400)
        self.assertEqual(WebCliente.objects.count(), 0)
        data['legal']['terminos'] = True
        data['legal']['version'] = 'old'
        self.assertEqual(self.post(WebRegistroView, data).status_code, 400)

    def test_consent_saved_and_withdrawal_preserves_history(self):
        response = self.post(WebRegistroView, self.registration())
        self.assertEqual(response.status_code, 201)
        customer = WebCliente.objects.get()
        self.assertEqual(customer.consentimientos.count(), 2)
        self.assertEqual(response.data['cliente']['marketing'], {'email': False, 'whatsapp': True})
        req = self.factory.patch('/', {'cliente_id': str(customer.pk), 'marketing': {'email': False, 'whatsapp': False}}, format='json', HTTP_X_WEB_KEY='test-web-key')
        updated = WebClienteDetailView.as_view()(req)
        self.assertEqual(updated.status_code, 200)
        self.assertEqual(updated.data['cliente']['marketing'], {'email': False, 'whatsapp': False})
        self.assertEqual(customer.consentimientos.count(), 3)
        self.assertTrue(customer.consentimientos.get(finalidad='terminos').created_at)

    def test_short_complaint_without_purchase_persists_and_retries(self):
        data = self.complaint()
        response = self.post(WebReclamacionCreateView, data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data['numero'].startswith('WEB-B77-'))
        self.assertEqual(response.data['contenido']['descripcion_bien'], 'Atención')
        self.assertIsNone(response.data['contenido']['monto'])
        repeated = self.post(WebReclamacionCreateView, data)
        self.assertEqual(repeated.data, response.data)
        self.assertEqual(WebReclamacion.objects.count(), 1)
        data['detalle'] = 'Changed'
        self.assertEqual(self.post(WebReclamacionCreateView, data).status_code, 409)

    def test_amount_and_representative_preserved(self):
        data = self.complaint()
        data.update(menor=True, representante='Representante ficticio, DNI 00000001', monto='99.90')
        response = self.post(WebReclamacionCreateView, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['contenido']['monto'], '99.90')
        self.assertEqual(response.data['contenido']['representante'], data['representante'])

    def test_invalid_representative_and_negative_amount_rejected(self):
        data = self.complaint()
        data['menor'] = True
        self.assertEqual(self.post(WebReclamacionCreateView, data).status_code, 400)
        data.update(menor=False, monto='-1')
        self.assertEqual(self.post(WebReclamacionCreateView, data).status_code, 400)
        self.assertEqual(WebReclamacion.objects.count(), 0)

    def test_receipt_failure_rolls_back_complaint(self):
        with patch.object(WebHojaReclamacion.objects, 'create', side_effect=RuntimeError('simulated')):
            with self.assertRaises(RuntimeError):
                self.post(WebReclamacionCreateView, self.complaint())
        self.assertEqual(WebReclamacion.objects.count(), 0)

    def test_consent_failure_rolls_back_account(self):
        with patch.object(WebConsentimiento.objects, 'create', side_effect=RuntimeError('simulated')):
            with self.assertRaises(RuntimeError):
                self.post(WebRegistroView, self.registration())
        self.assertEqual(WebCliente.objects.count(), 0)


unittest.main()
