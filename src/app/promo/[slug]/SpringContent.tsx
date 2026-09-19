'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SPRING_CAMPAIGN as campaign, WHATSAPP_URL } from '@/lib/constants'
import Footer from '@/components/Footer'
import { trackClick } from '@/lib/tracking'
import styles from './spring.module.css'

const looks = [
  { name: 'Denim sin reglas', detail: 'Tu jean, tu forma de llevarlo.', image: '/images/fotos/chica-jean-calle.webp', query: 'jeans de primavera' },
  { name: 'Espacio para moverte', detail: 'Descubre los cortes Baggy y Wide Leg.', image: '/images/tendencias/tendencia-1.webp', query: 'Baggy y Wide Leg' },
  { name: 'El clásico se renueva', detail: 'Drill para tus planes de todos los días.', image: '/images/clasicos/clasico-2.webp', query: 'pantalones Drill' },
]

function Arrow() { return <span aria-hidden="true">↗</span> }

export default function SpringContent() {
  const [today, setToday] = useState('')
  const [fit, setFit] = useState('Baggy')
  const [size, setSize] = useState('')
  const path = `/promo/${campaign.slug}`
  useEffect(() => {
    const update = () => setToday(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(new Date()))
    update()
    const timer = setInterval(update, 60000)
    trackClick('promo', `view_${campaign.slug}`, path)
    return () => clearInterval(timer)
  }, [path])
  const ended = !!today && today > campaign.dates[campaign.dates.length - 1]
  const active = campaign.dates.some(date => date === today)
  const whatsapp = (message: string) => `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
  const track = (label: string) => trackClick('whatsapp', `primavera_${label}`, path)

  return (
    <>
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="Navegación de primavera">
        <Link href="/" className={styles.brand}>
          <Image src="/images/logo/logoKarolay.png" alt="Club Karolay Jeans — inicio" width={48} height={48} />
          <span>CLUB KAROLAY JEANS<small>DENIM & FASHION · AREQUIPA</small></span>
        </Link>
        <Link href="/#promociones" className={styles.back}>Volver al inicio <span aria-hidden="true">↗</span></Link>
      </nav>

      <section className={styles.hero} aria-labelledby="spring-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>NUEVA TEMPORADA / 2026</p>
          <h1 id="spring-title">Primavera<br /><em>a tu estilo.</em></h1>
          <p className={styles.intro}>Días más ligeros. Jeans que van contigo.<br />Encuentra ese fit que se siente muy tú.</p>
          <div className={styles.actions}>
            <a href="#oferta" className={styles.primary}>Descubrir la oferta <Arrow /></a>
            <a href="#tu-fit" className={styles.textLink}>Encuentra tu fit <span aria-hidden="true">↓</span></a>
          </div>
          <p className={styles.heroNote}>DAMA & VARÓN <span>—</span> HECHO PARA TUS PLANES</p>
        </div>
        <div className={styles.heroPhoto}>
          <Image src={campaign.heroImage} alt="Inspiración de looks denim en lavados claros para primavera" fill priority sizes="100vw" />
        </div>
      </section>

      <section className={styles.offer} id="oferta" aria-labelledby="offer-title">
        <div className={styles.offerIntro}>
          <p className={styles.eyebrow}>UN BUEN PLAN PARA EL SÁBADO</p>
          <h2 id="offer-title">Estrenar se<br />siente <em>mejor.</em></h2>
          <p>Renueva ese favorito de tu clóset. Elige entre los pantalones seleccionados de la campaña y ven a probártelos.</p>
          <a href="#condiciones" className={styles.textLink}>Ver fechas y condiciones <span aria-hidden="true">↓</span></a>
        </div>
        <div className={styles.ticket}>
          <div className={styles.ticketTop}><span>ESPECIAL PRIMAVERA</span><span>{ended ? 'FINALIZADA' : active ? 'VÁLIDA HOY' : 'SÁBADOS DE ESTRENO'}</span></div>
          <p className={styles.discount}>{ended ? 'Nos vemos' : '15%'}<span>{ended ? 'en la próxima promo' : 'OFF'}</span></p>
          <h3>{campaign.products}</h3>
          <p className={styles.ticketDate}>{campaign.dateLabel}</p>
          <div className={styles.ticketBottom}>
            <p>{ended ? 'Estas fechas ya terminaron. Consulta las novedades y promociones disponibles.' : 'Muestra esta oferta en caja y consulta los modelos participantes.'}</p>
            <a href={whatsapp(ended ? 'Hola, quiero conocer las promociones actuales de Club Karolay Jeans.' : `Hola, vi la oferta de primavera del 15% en ${campaign.products} (${campaign.dateLabel}). Quiero consultar modelos y mi talla.`)} target="_blank" rel="noopener noreferrer" onClick={() => track('oferta')} className={styles.primary}>
              {ended ? 'Consultar novedades' : 'Consultar la oferta'} <Arrow />
            </a>
            <small>{campaign.location} · Sujeto a stock</small>
          </div>
        </div>
      </section>

      <section className={styles.edit} aria-labelledby="looks-title">
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>EL DENIM, A TU MANERA</p><h2 id="looks-title">Un look para <em>cada plan.</em></h2></div><span>LA SELECCIÓN DE PRIMAVERA / 01—03</span></div>
        <div className={styles.lookGrid}>
          {looks.map((look, index) => <article key={look.name} className={styles.look}>
            <a href={whatsapp(`Hola, estoy viendo Primavera a tu estilo. Quiero consultar ${look.query}, modelos y tallas disponibles.`)} target="_blank" rel="noopener noreferrer" onClick={() => track(look.query)} aria-label={`Consultar ${look.query}`}>
              <div className={styles.lookImage}><Image src={look.image} alt={`Inspiración: ${look.name}`} fill sizes="(max-width: 640px) 90vw, 31vw" /><span>0{index + 1}</span><b aria-hidden="true">↗</b></div>
              <h3>{look.name}</h3><p>{look.detail}</p>
            </a>
          </article>)}
        </div>
        <p className={styles.caption}>Imágenes de inspiración. Consulta los modelos, precios y tallas disponibles en tienda.</p>
      </section>

      <section className={styles.fitSection} id="tu-fit">
        <div><p className={styles.eyebrow}>ANTES DE VENIR, ENCUENTRA TU FIT</p><h2>Menos dudas.<br /><em>Más tú.</em></h2><p>Cuéntanos qué corte te gusta y qué talla buscas. Te ayudamos por WhatsApp antes de que nos visites.</p></div>
        <div className={styles.fitForm}>
          <fieldset><legend>01. Elige tu corte</legend><div className={styles.fitOptions}>{['Baggy', 'Wide Leg', 'Mom', 'Campana', 'Recto', 'Drill'].map(value => <button key={value} type="button" aria-pressed={fit === value} onClick={() => setFit(value)}>{value}</button>)}</div></fieldset>
          <label htmlFor="spring-size">02. Tu talla habitual <span>(opcional)</span></label>
          <input id="spring-size" value={size} maxLength={20} onChange={event => setSize(event.target.value)} placeholder="Por ejemplo: 30 o M" />
          <a href={whatsapp(`Hola, vengo de Primavera a tu estilo. Me interesa el corte ${fit}${size.trim() ? ` en talla ${size.trim()}` : ''}. ¿Qué modelos y precios tienen disponibles?`)} target="_blank" rel="noopener noreferrer" className={styles.primary} onClick={() => track('consulta_talla')}>Consultar mi talla por WhatsApp <Arrow /></a>
          <small>Te confirmamos la disponibilidad. Esta consulta no reserva prendas.</small>
        </div>
      </section>

      <section className={styles.club}>
        <p className={styles.eyebrow}>LOS BUENOS LOOKS SE COMPARTEN</p>
        <h2>Tu próxima temporada<br /><em>empieza en el Club.</em></h2>
        <p>Crea tu cuenta gratis y recibe tu código de bienvenida del 10%, válido por 30 días. Revisa las condiciones de tu código y muéstralo por QR en caja.</p>
        <Link href="/registro" className={styles.primary}>Quiero ser parte <Arrow /></Link>
        <Link href="/mis-codigos" className={styles.textLink}>Ya soy miembro: ver mis códigos</Link>
      </section>

      <section id="condiciones" className={styles.conditions}>
        <h2>Todo claro, antes de estrenar.</h2>
        <div><p><strong>Fechas y productos.</strong> Oferta del 15% en Drill y Baggy seleccionados, únicamente el {campaign.dateLabel}, durante el horario de atención y sujeto al stock disponible.</p><p><strong>Cómo acceder.</strong> Muestra esta página o la pieza de la campaña en caja en {campaign.location}. Confirma con la tienda los modelos, tallas y precio final antes de comprar.</p><p><strong>Beneficios del Club.</strong> El código de bienvenida es un beneficio distinto. Consulta en caja si puede combinarse con esta oferta; no se garantiza acumulación.</p></div>
      </section>

    </main>
    <Footer />
    </>
  )
}
