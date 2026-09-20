import type { Metadata } from 'next'
import Link from 'next/link'
import { BUSINESS } from '@/lib/constants'
import { LegalBox, LegalDocument, LegalSection, legalListClass } from '@/components/LegalDocument'

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de uso del sitio, promociones y Club de Clientes de Club Karolay Jeans.',
  alternates: { canonical: 'https://www.clubkarolayjeans.com/terminos' },
  robots: { index: true, follow: true },
}

const strong = 'text-white/90'

export default function TerminosPage() {
  return (
    <LegalDocument
      title="Términos y Condiciones"
      updated="19 de septiembre de 2026"
      intro={
        <p>
          Estos términos regulan el uso de <strong className={strong}>clubkarolayjeans.com</strong>, el Club de
          Clientes, los códigos promocionales y los canales digitales de <strong className={strong}>{BUSINESS.name}</strong>.
          El proveedor es {BUSINESS.legalName}, RUC {BUSINESS.ruc}, con atención en {BUSINESS.address}, {BUSINESS.city}.
        </p>
      }
    >
      <LegalSection title="1. Alcance del sitio" number="01">
        <p>La web brinda información sobre la tienda, productos, campañas, membresía y beneficios. Salvo que una pantalla indique expresamente un proceso de compra y cobro en línea, el catálogo y las consultas por WhatsApp son informativos: no constituyen por sí solos una venta, reserva ni separación de stock. La compra se perfecciona cuando la tienda confirma el producto, el precio y el pago.</p>
      </LegalSection>

      <LegalSection title="2. Información de productos" number="02">
        <p>Procuramos que descripciones, fotografías, tallas, colores y disponibilidad sean correctos. La apariencia puede variar por iluminación o pantalla. Las imágenes de campañas pueden ser referenciales y no acreditan inventario disponible. Antes de pagar, el cliente debe confirmar modelo, talla, color, estado, precio y condiciones aplicables.</p>
        <p className="mt-3">Estas precisiones no limitan el deber de idoneidad ni los derechos reconocidos por la Ley N.° 29571, Código de Protección y Defensa del Consumidor.</p>
      </LegalSection>

      <LegalSection title="3. Precios, pagos y comprobantes" number="03">
        <ul className={legalListClass}>
          <li>Los precios dirigidos al consumidor se expresan en soles e incluyen los tributos y cargos aplicables. Cualquier costo adicional de un servicio opcional se informa antes de contratarlo.</li>
          <li>El precio y medio de pago final se confirman antes de concluir la compra. Ningún cobro se efectúa actualmente dentro de esta web.</li>
          <li>Por cada venta se emite el comprobante de pago que corresponda conforme a las reglas de SUNAT. La boleta corresponde al consumidor final; la factura requiere los datos tributarios válidos antes de su emisión.</li>
          <li>Las anulaciones, devoluciones o ajustes que procedan se documentarán mediante el comprobante o nota electrónica aplicable.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Promociones y códigos" number="04">
        <p>Cada promoción se rige por las fechas, productos participantes, stock, tienda, canal y demás restricciones informadas en su pieza o página. La publicidad y las condiciones anunciadas son vinculantes durante su vigencia. Salvo que se indique expresamente, los beneficios no son acumulables.</p>
        <ul className={legalListClass}>
          <li>Los códigos personales son de uso del titular, pueden tener fecha de vencimiento y se aplican una sola vez cuando así se informe.</li>
          <li>La generación de un QR no reserva prendas ni extiende la vigencia del beneficio.</li>
          <li>Un código puede rechazarse si está vencido, ya fue utilizado, no corresponde a la cuenta o existe evidencia razonable de alteración, duplicación o fraude.</li>
          <li>Un error manifiesto de publicación será corregido oportunamente, respetando los derechos adquiridos y las reglas de protección al consumidor.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Cuenta y Club de Clientes" number="05">
        <p>El registro es gratuito. La persona usuaria debe proporcionar información veraz, mantenerla actualizada y proteger sus credenciales. Es responsable de la actividad realizada desde su cuenta cuando derive de un uso bajo su control. Debe avisarnos de inmediato si sospecha acceso no autorizado.</p>
        <p className="mt-3">Podremos suspender temporalmente una cuenta cuando sea necesario para investigar fraude, abuso, afectación a terceros o riesgos de seguridad, informando la razón cuando sea legalmente posible. La cancelación de una cuenta no elimina registros que debamos conservar por ley.</p>
      </LegalSection>

      <LegalSection title="6. Cambios, garantías y falta de idoneidad" number="06">
        <p>Las solicitudes por defectos, producto distinto al ofrecido o falta de idoneidad se evalúan conforme al Código de Protección y Defensa del Consumidor. Según el caso, pueden corresponder reparación, reposición, nueva ejecución, devolución u otra medida prevista por ley.</p>
        <p className="mt-3">Los cambios voluntarios por talla, color o preferencia se sujetan a la política comunicada en tienda al momento de la compra, al estado de la prenda, sus etiquetas, el comprobante y la disponibilidad. Esta política comercial adicional no reduce las garantías legales por productos defectuosos o no idóneos.</p>
      </LegalSection>

      <LegalSection title="7. Uso permitido" number="07">
        <p>No está permitido intentar acceder a cuentas ajenas, interferir con el sitio, eludir controles, automatizar consultas abusivas, alterar códigos o QR, introducir software malicioso, suplantar identidades ni usar contenidos o beneficios con fines fraudulentos. Podemos adoptar medidas técnicas proporcionales y comunicar hechos a la autoridad cuando corresponda.</p>
      </LegalSection>

      <LegalSection title="8. Propiedad intelectual" number="08">
        <p>La marca, textos, fotografías, diseños, logotipos y software del sitio pertenecen a sus respectivos titulares o se usan con autorización. Se permite navegar y compartir enlaces para uso personal. Cualquier reproducción, explotación comercial, modificación o distribución requiere autorización previa, salvo los usos permitidos por ley.</p>
      </LegalSection>

      <LegalSection title="9. Servicios y enlaces de terceros" number="09">
        <p>La web puede enlazar a WhatsApp, redes sociales, mapas u otros servicios independientes. Sus condiciones, disponibilidad y tratamiento de datos son responsabilidad de sus operadores. No controlamos interrupciones externas, pero responderemos por nuestras propias obligaciones y por aquello que la ley nos atribuya.</p>
      </LegalSection>

      <LegalSection title="10. Disponibilidad y responsabilidad" number="10">
        <p>Podemos realizar mantenimiento, corregir errores o actualizar funciones. No garantizamos disponibilidad ininterrumpida frente a fallas razonablemente ajenas a nuestro control. Ninguna cláusula excluye responsabilidad por dolo, culpa inexcusable, falta de idoneidad, daños a la integridad del consumidor ni otros derechos que la ley peruana considere irrenunciables.</p>
      </LegalSection>

      <LegalSection title="11. Privacidad y comunicaciones" number="11">
        <p>El tratamiento de datos se detalla en la <Link href="/privacidad" className="text-mocha-500 hover:underline">Política de Privacidad</Link>. Las comunicaciones publicitarias requieren consentimiento o base legal válida y siempre ofrecerán un medio gratuito para dejar de recibirlas.</p>
      </LegalSection>

      <LegalSection title="12. Atención, reclamos y Libro de Reclamaciones" number="12">
        <LegalBox>
          <p><strong className={strong}>Atención:</strong> {BUSINESS.email} · {BUSINESS.phone}</p>
          <p><strong className={strong}>Libro de Reclamaciones:</strong> <Link href="/libro-reclamaciones" className="text-mocha-500 hover:underline">Registrar un reclamo o queja</Link></p>
        </LegalBox>
        <p className="mt-3">Los reclamos y quejas presentados en el Libro de Reclamaciones se responden por escrito en un plazo máximo de 15 días hábiles improrrogables, conforme a la Ley N.° 31435. Su presentación no impide acudir a Indecopi ni a otra autoridad competente.</p>
      </LegalSection>

      <LegalSection title="13. Normativa y solución de controversias" number="13">
        <p>Se aplica la legislación de la República del Perú. Procuraremos resolver cualquier diferencia mediante atención directa y de buena fe. El consumidor conserva el derecho de acudir a Indecopi, al Poder Judicial, al arbitraje de consumo cuando resulte aplicable o a cualquier mecanismo reconocido por ley. Ninguna referencia territorial restringe los fueros imperativos que protegen al consumidor.</p>
      </LegalSection>

      <LegalSection title="14. Cambios, validez y contacto" number="14">
        <p>Podemos actualizar estos términos por cambios normativos o del servicio. La versión aplicable a una operación es la informada al momento de realizarla; una modificación posterior no reduce derechos ya adquiridos. Si una cláusula resulta inválida, las demás se mantienen vigentes en cuanto puedan operar legalmente.</p>
        <p className="mt-3">Para consultas, escribe a <a href={`mailto:${BUSINESS.email}`} className="text-mocha-500 hover:underline">{BUSINESS.email}</a> o visita {BUSINESS.address}, {BUSINESS.city}.</p>
      </LegalSection>
    </LegalDocument>
  )
}
