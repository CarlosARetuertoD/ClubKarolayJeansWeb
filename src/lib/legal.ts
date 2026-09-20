export const LEGAL_VERSION = '2026-09-19'
export const TERMS_TEXT = 'Acepto los Términos y Condiciones y declaro haber sido informado sobre la Política de Privacidad.'
export const MARKETING_TEXT = 'Autorizo el envío de promociones del Club por los canales seleccionados. Es opcional y puedo retirar mi autorización gratuitamente.'

export type ComplaintForm = {
  nombre: string; tipo_documento: string; dni: string; celular: string; email: string;
  direccion: string; respuesta: string; menor: boolean; representante: string;
  tipo_bien: string; descripcion_bien: string; monto: string | null; moneda: string;
  comprobante: string; tipo: string; detalle: string; pedido: string;
}
export type ComplaintReceipt = { ok: true; id: string; numero: string; fecha: string; contenido: ComplaintForm }
