export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || '51940403984'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`
export const WHATSAPP_DEFAULT_MSG = '?text=Hola%20Club%20Karolay%20Jeans%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20%F0%9F%91%96'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.clubkarolayjeans.com'

export const BUSINESS = {
  name: 'Club Karolay Jeans',
  tagline: 'Denim & Fashion',
  description: 'Tu tienda especializada en jeans y moda denim en Arequipa. Trabajamos con las mejores marcas del mercado para ofrecerte variedad de fits, lavados y estilos — todo en un solo lugar.',
  shortDescription: 'Tienda de jeans y moda denim para dama y varón en Arequipa.',
  address: 'Av. Siglo XX 209-213, C.C. Don Ramón, INT. B-77',
  city: 'Cercado de Arequipa 04001, Perú',
  phone: '+51 940 403 984',
  email: 'ventas@clubkarolayjeans.com',
  whatsapp: WHATSAPP_NUMBER,
  social: {
    instagram: '#',
    tiktok: '#',
    facebook: '#',
  },
  developer: 'REDEL Smart Software Solutions',
} as const

export const MARCAS = [
  'Pionier', 'Tayssir', 'Wrangler', 'Lee', 'Lois',
  'Brooklyn', 'Element', 'Kansas', 'Norton',
  'American Colt', 'Filippo Alpi',
] as const

export const CATEGORIAS = [
  {
    slug: 'jeans',
    nombre: 'Jeans',
    descripcion: 'Slim, skinny, mom, baggy, wide-leg y más. Todos los fits que buscas, de las mejores marcas.',
    imagen: '/images/catalogo/jeans.webp',
    tag: 'Lo más vendido',
  },
  {
    slug: 'casacas',
    nombre: 'Casacas',
    descripcion: 'Casacas en jean, drill y corduroy de marcas reconocidas.',
    imagen: '/images/catalogo/casacas.webp',
    tag: 'Temporada',
  },
  {
    slug: 'bermudas',
    nombre: 'Bermudas',
    descripcion: 'Bermudas en denim y telas ligeras para dama y varón.',
    imagen: '/images/catalogo/bermudas.webp',
    tag: 'Verano',
  },
  {
    slug: 'faldas',
    nombre: 'Faldas & Outfits',
    descripcion: 'Faldas en jean y combinaciones completas para tu look.',
    imagen: '/images/catalogo/faldas.webp',
    tag: 'Nuevo',
  },
] as const

export const TENDENCIAS = [
  {
    slug: 'baggy-jeans',
    nombre: 'Baggy Jeans',
    descripcion: 'El corte suelto domina las calles. Comodidad con actitud.',
    imagen: '/images/tendencias/tendencia-1.webp',
  },
  {
    slug: 'wide-leg',
    nombre: 'Wide Leg',
    descripcion: 'Pierna ancha, silueta estilizada. La tendencia que no para.',
    imagen: '/images/tendencias/tendencia-2.webp',
  },
  {
    slug: 'vintage-wash',
    nombre: 'Lavado Vintage',
    descripcion: 'Ese look gastado con personalidad. Clásico reinventado.',
    imagen: '/images/tendencias/tendencia-3.webp',
  },
] as const

export const CLASICOS = [
  {
    slug: 'jean-clasico',
    nombre: 'Jean Clásico',
    descripcion: 'Para dama y varón. El corte de siempre que nunca pasa de moda.',
    imagen: '/images/clasicos/clasico-1.webp',
  },
  {
    slug: 'drill',
    nombre: 'Drill',
    descripcion: 'Comodidad y versatilidad para cada ocasión.',
    imagen: '/images/clasicos/clasico-2.webp',
  },
  {
    slug: 'jean-recto',
    nombre: 'Jean Recto',
    descripcion: 'El corte tradicional, limpio y elegante.',
    imagen: '/images/clasicos/clasico-3.webp',
  },
] as const

export const PROMOS_DATA = [
  {
    slug: 'temporada-otono-2026',
    titulo: 'Nueva Temporada',
    subtitulo: 'Otoño 2026',
    descripcion: 'Los nuevos lavados y cortes que marcan tendencia esta temporada ya llegaron a tienda.',
    detalle: 'Casacas en jean y corduroy con los tonos de la temporada. Jeans wide-leg y baggy con lavados vintage que combinan con todo. Ven a probártelos — cada cuerpo es diferente y queremos que encuentres tu fit perfecto.',
    cta: 'Quiero ver la nueva temporada',
    imagen: '/images/promos/promo-landing-1.webp',
    badge: 'Nuevo en tienda',
    color: '#9b6d53',
  },
  {
    slug: 'descuento-club',
    titulo: 'Descuento Exclusivo',
    subtitulo: 'Solo para miembros',
    descripcion: 'Regístrate en el Club y accede a precios especiales en cada visita.',
    detalle: 'Los miembros de Club Karolay Jeans tienen descuentos exclusivos que no encontrarás en ningún otro lado. Solo muestra tu tarjeta digital en tienda y el descuento se aplica automáticamente. Así de simple.',
    cta: 'Unirme al Club',
    imagen: '/images/promos/promo-landing-2.webp',
    badge: 'Club VIP',
    color: '#ddb153',
  },
] as const
