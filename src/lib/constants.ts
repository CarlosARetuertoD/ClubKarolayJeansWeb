export const WHATSAPP_NUMBER = '51993084496'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`
export const WHATSAPP_DEFAULT_MSG = '?text=Hola%20Club%20Karolay%20Jeans%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20%F0%9F%91%96'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.clubkarolayjeans.com'

export const BUSINESS = {
  name: 'Club Karolay Jeans',
  legalName: 'Negocios e Inversiones Karolay E.I.R.L.',
  ruc: '20603641656',
  tagline: 'Denim & Fashion',
  description: 'Tu tienda especializada en jeans y moda denim en Arequipa. Trabajamos con las mejores marcas del mercado para ofrecerte variedad de fits, lavados y estilos — todo en un solo lugar.',
  shortDescription: 'Tienda de jeans y moda denim para dama y varón en Arequipa.',
  address: 'Av. Siglo XX 209-213, C.C. Don Ramón, INT. B-77',
  city: 'Cercado de Arequipa 04001, Perú',
  phone: '+51 993 084 496',
  hours: 'Lun - Sáb, 9:00 am - 8:00 pm\nDom, 9:00 am - 7:00 pm',
  latitude: -16.4006985,
  longitude: -71.5290725,
  email: 'ventas@clubkarolayjeans.com',
  whatsapp: WHATSAPP_NUMBER,
  social: {
    instagram: 'https://www.instagram.com/clubkarolayjeans/',
    tiktok: 'https://www.tiktok.com/@clubkarolayjeans',
    facebook: 'https://www.facebook.com/profile.php?id=61590202629771',
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
    slug: 'temporada-primavera-2026',
    titulo: 'Nueva Temporada',
    subtitulo: 'Primavera 2026',
    descripcion: 'Nuevos días, nuevos looks. Descubre tu próximo jean favorito y las ofertas de primavera.',
    detalle: 'Primavera a tu estilo: denim, cortes relajados y nuevas formas de combinar. Consulta tu talla y conoce las promociones de la campaña.',
    cta: 'Descubrir la primavera',
    imagen: '/images/fotos/chicas-jeans.webp',
    badge: 'Primavera a tu estilo',
    color: '#9b6d53',
  },
  {
    slug: 'temporada-otono-2026',
    titulo: 'Fin de temporada',
    subtitulo: 'Otoño 2026',
    descripcion: 'Despide el otoño con tus favoritos de la colección. Consulta los modelos y tallas que siguen disponibles.',
    detalle: 'La colección de otoño se despide para dar paso a la primavera. Encuentra casacas en jean y corduroy, lavados vintage y cortes de siempre. Consulta los modelos, tallas y precios disponibles antes de visitarnos.',
    cta: 'Ver fin de temporada',
    imagen: '/images/promos/promo-landing-1.webp',
    badge: 'Colección de otoño',
    color: '#9b6d53',
  },
  {
    slug: 'descuento-club',
    titulo: 'Descuento Exclusivo',
    subtitulo: 'Solo para miembros',
    descripcion: 'Regístrate en el Club y accede a precios especiales en cada visita.',
    detalle: 'Crea tu cuenta y recibe un código de bienvenida con 10% de descuento, válido por 30 días. Revisa sus condiciones en Mis códigos y genera tu QR cuando estés en caja. Consulta las condiciones de cada promoción antes de comprar.',
    cta: 'Unirme al Club',
    imagen: '/images/promos/promo-landing-2.webp',
    badge: 'Club VIP',
    color: '#ddb153',
  },
] as const

export const SPRING_CAMPAIGN = {
  slug: 'temporada-primavera-2026',
  title: 'Primavera a tu estilo',
  dates: ['2026-09-19', '2026-09-26'],
  dateLabel: '19 y 26 de septiembre de 2026',
  offer: '15% OFF',
  products: 'Drill y Baggy seleccionados',
  location: 'C.C. Don Ramón · Int. B-77',
  heroImage: '/images/fotos/chicas-jeans.webp',
} as const
