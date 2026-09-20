import type { Metadata } from 'next'
import Link from 'next/link'
import { BUSINESS } from '@/lib/constants'
import { LegalBox, LegalDocument, LegalSection, legalListClass } from '@/components/LegalDocument'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y protección de datos personales de Club Karolay Jeans conforme a la normativa peruana vigente.',
  alternates: { canonical: 'https://www.clubkarolayjeans.com/privacidad' },
  robots: { index: true, follow: true },
}

const strong = 'text-white/90'

export default function PrivacidadPage() {
  return (
    <LegalDocument
      title="Política de Privacidad"
      updated="19 de septiembre de 2026"
      intro={
        <p>
          Esta política explica cómo <strong className={strong}>{BUSINESS.name}</strong>, marca operada por
          {BUSINESS.legalName}, trata los datos personales obtenidos mediante este sitio,
          el Club de Clientes, la tienda y sus canales de atención. Se aplica la Ley N.° 29733 y su Reglamento,
          aprobado por D.S. N.° 016-2024-JUS.
        </p>
      }
    >
      <LegalSection title="1. Identidad y canales del responsable" number="01">
        <LegalBox>
          <p><strong className={strong}>Responsable:</strong> {BUSINESS.legalName}</p>
          <p><strong className={strong}>RUC:</strong> {BUSINESS.ruc}</p>
          <p><strong className={strong}>Marca comercial:</strong> {BUSINESS.name}</p>
          <p><strong className={strong}>Domicilio:</strong> {BUSINESS.address}, {BUSINESS.city}</p>
          <p><strong className={strong}>Correo:</strong> <a className="text-mocha-500 hover:underline" href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></p>
          <p><strong className={strong}>Teléfono:</strong> {BUSINESS.phone}</p>
        </LegalBox>
      </LegalSection>

      <LegalSection title="2. Datos que podemos tratar" number="02">
        <p>Según el servicio utilizado, podemos tratar:</p>
        <ul className={legalListClass}>
          <li><strong className={strong}>Identificación y contacto:</strong> nombre, celular, correo, DNI o carné de extranjería, fecha de nacimiento y género cuando los proporciones.</li>
          <li><strong className={strong}>Cuenta y Club:</strong> credenciales protegidas, identificador de cliente, estado de membresía, códigos promocionales y canjes.</li>
          <li><strong className={strong}>Compras y atención:</strong> productos, tallas, preferencias, comprobantes, consultas, reclamos y comunicaciones.</li>
          <li><strong className={strong}>Uso del sitio:</strong> páginas visitadas, campañas de origen, clics, dispositivo, navegador, dirección IP, fecha y hora, según la configuración técnica activa.</li>
        </ul>
        <p className="mt-3">No envíes información de salud, biométrica, financiera u otros datos especialmente protegidos que no hayan sido solicitados expresamente para una finalidad informada.</p>
      </LegalSection>

      <LegalSection title="3. Finalidades y bases que autorizan el tratamiento" number="03">
        <ul className={legalListClass}>
          <li><strong className={strong}>Ejecutar la relación contigo:</strong> crear y administrar tu cuenta, identificarte, mostrar códigos, validar canjes, atender solicitudes y prestar las funciones que solicites.</li>
          <li><strong className={strong}>Cumplir obligaciones legales:</strong> emitir y conservar comprobantes, atender reclamos, responder requerimientos de autoridades y conservar documentación durante los plazos aplicables.</li>
          <li><strong className={strong}>Seguridad:</strong> proteger la cuenta y prestar el servicio solicitado, dentro de las habilitaciones de la Ley N.° 29733. La medición opcional de visitas y clics requiere tu elección previa en las preferencias de privacidad.</li>
          <li><strong className={strong}>Publicidad:</strong> enviar novedades u ofertas únicamente por los canales que autorices de forma previa, expresa y voluntaria. Guardamos la fecha, versión del aviso y canales elegidos. Puedes retirar la autorización desde Mi cuenta o mediante nuestro correo, gratuitamente y sin perder beneficios del Club.</li>
        </ul>
        <p className="mt-3">No condicionamos el acceso a funciones esenciales a aceptar publicidad. La navegación por sí sola no constituye autorización para comunicaciones comerciales.</p>
      </LegalSection>

      <LegalSection title="4. Datos obligatorios y consecuencias" number="04">
        <p>Los campos marcados como obligatorios son necesarios para crear la cuenta, autenticarte, atender una compra o tramitar una solicitud. Si no los proporcionas, no podremos prestar esa función. Los campos opcionales ayudan a personalizar la atención y pueden omitirse sin perder el acceso básico al Club.</p>
      </LegalSection>

      <LegalSection title="5. Destinatarios, encargados y transferencias" number="05">
        <p>Podemos dar acceso limitado a proveedores que alojan u operan el sitio, el sistema de clientes, comunicaciones y soporte, sujetos a instrucciones, confidencialidad y medidas de seguridad. También podremos comunicar datos a SUNAT, Indecopi, autoridades judiciales u otras entidades competentes cuando exista obligación o requerimiento válido.</p>
        <p className="mt-3">Algunos proveedores tecnológicos o canales externos pueden procesar información fuera del Perú. Cuando exista flujo transfronterizo, aplicaremos las garantías exigidas por la normativa peruana. Si decides abrir WhatsApp, Instagram, TikTok, Facebook o Google Maps, el tratamiento posterior se rige además por las políticas de ese tercero.</p>
        <p className="mt-3"><strong className={strong}>No vendemos ni alquilamos datos personales.</strong></p>
      </LegalSection>

      <LegalSection title="6. Conservación" number="06">
        <p>Conservamos los datos durante la vigencia de la cuenta y mientras sean necesarios para las finalidades informadas. Después, podrán bloquearse o mantenerse por los plazos de prescripción y conservación exigidos por normas tributarias, de consumo, contables o para la defensa ante reclamaciones. Los datos usados exclusivamente para publicidad se dejarán de usar cuando revoques tu consentimiento, sin afectar tratamientos exigidos por ley.</p>
      </LegalSection>

      <LegalSection title="7. Seguridad e incidentes" number="07">
        <p>Aplicamos controles técnicos y organizativos razonables según el riesgo, como restricción de accesos, autenticación, comunicaciones cifradas y registro de operaciones. Ningún sistema es infalible; ante un incidente que pueda afectar significativamente tus derechos, actuaremos y notificaremos conforme a la normativa aplicable.</p>
      </LegalSection>

      <LegalSection title="8. Cookies, sesión y medición" number="08">
        <p>La cookie necesaria ckj_auth mantiene la autenticación durante una hora. El navegador conserva también datos de presentación de la cuenta hasta cerrar sesión o borrar el almacenamiento. La cookie ckj_analytics guarda tu elección de medición durante seis meses. No registramos mediciones opcionales antes de que aceptes; puedes rechazarlas o retirar tu autorización con el botón Privacidad. La medición de visitas y clics no envía el identificador del cliente ni registra las páginas de cuenta, acceso, registro, códigos, canjes o reclamaciones. Los registros de seguridad y los servicios externos, como mapas, se tratan separadamente según su finalidad.</p>
      </LegalSection>

      <LegalSection title="9. Tus derechos" number="09">
        <p>Puedes solicitar información, acceso, actualización, inclusión, rectificación, cancelación o supresión, oposición, portabilidad cuando corresponda y revocar el consentimiento. También puedes impedir decisiones con efectos jurídicos basadas únicamente en tratamiento automatizado, en los supuestos previstos por ley.</p>
        <LegalBox>
          <p>Envía tu solicitud a <a className="text-mocha-500 hover:underline" href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> o preséntala en nuestro domicilio. Indica tu nombre, el derecho que ejerces, una explicación clara, un medio de respuesta y los documentos de sustento que correspondan. Podremos pedir una acreditación razonable de identidad, sin recopilar más información de la necesaria.</p>
        </LegalBox>
      </LegalSection>

      <LegalSection title="10. Plazos y tutela ante la Autoridad" number="10">
        <p>Conforme al D.S. N.° 016-2024-JUS, respondemos el derecho de información en un máximo de 8 días, el derecho de acceso en 20 días y los derechos de rectificación, cancelación u oposición en 10 días, contados desde el día siguiente de la solicitud, sin perjuicio de las reglas de subsanación o ampliación legalmente aplicables.</p>
        <p className="mt-3">Si consideras que tu solicitud no fue atendida, puedes acudir a la Autoridad Nacional de Protección de Datos Personales del Ministerio de Justicia y Derechos Humanos mediante el procedimiento de tutela correspondiente.</p>
      </LegalSection>

      <LegalSection title="11. Menores de edad" number="11">
        <p>El registro autónomo está dirigido a mayores de 18 años. No recopilamos intencionalmente datos de menores sin la intervención o autorización exigida a sus padres o representantes. Si adviertes un registro indebido, comunícalo para adoptar las medidas correspondientes.</p>
      </LegalSection>

      <LegalSection title="12. Decisiones automatizadas" number="12">
        <p>No adoptamos decisiones que produzcan efectos jurídicos o afecten significativamente a una persona basándonos exclusivamente en perfiles automatizados. Las mediciones de uso se emplean para estadísticas, seguridad y mejora del servicio.</p>
      </LegalSection>

      <LegalSection title="13. Cambios y contacto" number="13">
        <p>Podemos actualizar esta política por cambios legales, técnicos o del servicio. Publicaremos la nueva versión y su fecha de actualización; si el cambio exige un nuevo consentimiento, lo solicitaremos. Para consultas sobre privacidad, escribe a <a className="text-mocha-500 hover:underline" href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.</p>
        <p className="mt-3">Consulta también nuestros <Link href="/terminos" className="text-mocha-500 hover:underline">Términos y Condiciones</Link>.</p>
      </LegalSection>
    </LegalDocument>
  )
}
