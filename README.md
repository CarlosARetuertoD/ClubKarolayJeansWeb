# Club Karolay Jeans - Web

Sitio web oficial de **Club Karolay Jeans**, tienda especializada en jeans y moda denim para dama y varón en Arequipa, Peru.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Estilos:** Tailwind CSS
- **Base de datos / Auth:** Supabase
- **QR:** qrcode (generacion client-side)
- **Deploy:** Vercel
- **Dominio:** clubkarolayjeans.com

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx                 # Landing principal
│   ├── layout.tsx               # Layout global + SEO + JSON-LD
│   ├── globals.css              # Estilos globales
│   ├── sitemap.ts               # Sitemap dinamico
│   ├── bio/                     # Tarjeta digital del club
│   ├── canjear/[token]/         # Pagina de canje QR (vendedor escanea)
│   ├── catalogo/                # Catalogo de productos
│   ├── cuenta/                  # Mi cuenta (datos, contraseña, enlaces rapidos)
│   ├── libro-reclamaciones/     # Libro de reclamaciones (acceso por QR)
│   ├── login/                   # Inicio de sesion
│   ├── mapa/                    # Mapa del centro comercial
│   ├── mis-codigos/             # Codigos promo del usuario + generacion QR
│   ├── privacidad/              # Politica de privacidad
│   ├── promo/[slug]/            # Detalle de promo individual
│   ├── promociones/             # Promos exclusivas (requiere login)
│   ├── registro/                # Registro al club
│   └── api/
│       ├── registro/            # Crear cuenta + bono de bienvenida
│       ├── canje/               # Generar token QR (POST) + validar/canjear (GET)
│       ├── mis-codigos/         # Listar codigos del usuario (globales + personales)
│       └── track/               # Tracking de eventos
├── components/
│   ├── Header.tsx               # Navbar con auth condicional
│   ├── Footer.tsx               # Footer
│   ├── WhatsAppButton.tsx       # Boton flotante de WhatsApp
│   ├── TrackingProvider.tsx     # Tracking de visitas
│   └── SmoothScroll.tsx         # Scroll suave
├── hooks/
│   └── useScrollReveal.ts       # Animacion de secciones al scroll
└── lib/
    ├── constants.ts             # Datos del negocio, marcas, categorias, promos
    ├── supabase.ts              # Cliente Supabase + tipos
    └── tracking.ts              # Funciones de tracking
```

## Paginas

| Ruta | Descripcion | Auth |
|------|-------------|------|
| `/` | Landing principal | No |
| `/catalogo` | Catalogo de productos | No |
| `/promociones` | Promociones (dinamica: codigos si logueado, registro si no) | No |
| `/registro` | Registro al club (auto-genera bono bienvenida) | No |
| `/login` | Inicio de sesion | No |
| `/cuenta` | Datos personales, cambio contraseña, enlaces rapidos | Si |
| `/bio` | Tarjeta digital del club (standalone, tipo Linktree) | No |
| `/mis-codigos` | Codigos promo + generacion de QR para canje | Si |
| `/canjear/[token]` | Validacion y canje automatico (vendedor escanea QR) | No |
| `/privacidad` | Politica de privacidad | No |
| `/libro-reclamaciones` | Libro de reclamaciones | No (acceso por QR) |
| `/mapa` | Mapa del centro comercial | No |
| `/promo/[slug]` | Detalle de promo | No |

## Secciones del landing

1. **Hero** - Imagen de fondo + titulo animado + H1 con SEO
2. **Sobre nosotros** - Info de la tienda + imagen lateral
3. **Marcas** - Carrusel infinito de marcas
4. **Nueva Temporada** - Promo principal con imagen de fondo
5. **Tendencias** - Grid editorial con fotos reales
6. **Club VIP** - Tarjeta de membresia + beneficios
7. **Clasicos** - Jean clasico, drill, jean recto
8. **Contacto** - Datos de la tienda + ubicacion

## Sistema de codigos promo

### Tipos de codigos
- **Personal** (`cliente_id` = UUID): asignado a un usuario especifico. Se marca `canjeado=true` al usar.
- **Global** (`cliente_id` = null): disponible para todos los miembros. Cada usuario puede canjearlo una vez (registrado en `web_codigo_canjes`).
- **Bono de bienvenida**: se crea automaticamente al registrarse. Personal, 10% OFF, valido 30 dias.

### Flujo de canje
1. Cliente entra a `/mis-codigos` y ve sus codigos disponibles
2. Toca "Canjear en tienda" → se genera un **QR temporal** (5 minutos)
3. Pantalla muestra "Muestra este QR al vendedor" con countdown
4. Vendedor escanea el QR → se abre `/canjear/[token]`
5. Codigo se marca como canjeado automaticamente → pantalla de exito
6. Si el QR expiro o ya fue usado, muestra error

### Gestion desde RedelERP
Los codigos se crean y gestionan desde **RedelERP > Marketing > Codigos Promo**:
- CRUD completo con sync automatico a Supabase al crear/editar/eliminar
- El boton "Sincronizar" hace push de codigos locales + pull de datos web
- Filtros: todos, activos, canjeados
- Muestra nombre del cliente asignado

## SEO

- **JSON-LD**: ClothingStore (con geo, marcas, catalogo) + WebSite
- **Open Graph**: por pagina con titulo, descripcion, imagen, canonical
- **Sitemap**: dinamico con 10 rutas
- **Robots**: bloquea /cuenta, /login, /api
- **Keywords**: 30 terminos (marcas, fits, ubicacion, busqueda local)
- **H1**: texto oculto con sr-only para keywords sin afectar diseño
- **Alt texts**: descriptivos en imagenes clave
- **googleBot**: max-image-preview large, max-snippet -1

## Imagenes

```
public/images/
├── catalogo/        # jeans.webp, casacas.webp, bermudas.webp, etc.
├── clasicos/        # clasico-1.webp, clasico-2.webp, clasico-3.webp
├── fotos/           # Fotos originales con nombres descriptivos
├── hero/            # hero-lg/md/sm.webp, promo-temporada.webp
├── logo/            # logoKarolay.png
├── mapa/            # mapa-centro-comercial.svg
├── promos/          # promo-landing-1.webp, promo-landing-2.webp
└── tendencias/      # tendencia-1.webp, tendencia-2.webp, tendencia-3.webp
```

Para cambiar una imagen, solo reemplaza el archivo `.webp` con el mismo nombre.

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
NEXT_PUBLIC_WHATSAPP=51993084496
NEXT_PUBLIC_SITE_URL=https://www.clubkarolayjeans.com
```

## Datos del negocio

Centralizados en `src/lib/constants.ts`:
- Telefono WhatsApp: 993 084 496
- Direccion: Av. Siglo XX 209-213, C.C. Don Ramon, INT. B-77
- Horario: Lun-Sab 9am-8pm, Dom 9am-7pm
- Marcas: Pionier, Tayssir, Wrangler, Lee, Lois, Brooklyn, Element, Kansas, Norton, American Colt, Filippo Alpi

## Funcionalidades

- **Club VIP**: Registro con email/password o Google. Miembros acceden a promos exclusivas.
- **Tarjeta digital** (`/bio`): Standalone tipo Linktree. Logo clickeable a inicio. Saludo con nombre completo, "Miembro desde..." alineado a la derecha. Botones: catalogo, redes (modal con Instagram/TikTok/Facebook), promos+codigos (solo logueado), WhatsApp, ubicacion. Cache en localStorage para carga instantanea sin parpadeo. Cerrar sesion limpia todo el cache.
- **Promociones** (`/promociones`): Pagina dinamica. Si logueado: muestra codigos disponibles con boton "Canjear en tienda" (genera QR). Si no: muestra "Crea tu cuenta gratis" con beneficios.
- **Landing Club VIP**: Seccion dinamica. Si logueado: "Ver mis descuentos" → /mis-codigos. Si no: "Unirme al Club gratis" → /registro.
- **Codigos promo**: Sistema completo de codigos de descuento con QR temporal (5 min). Personales y globales. Gestion desde RedelERP.
- **Bono de bienvenida**: 10% OFF automatico al registrarse, valido 30 dias.
- **Mi cuenta**: Editar nombre, celular, DNI, fecha nacimiento, genero. Cambio de contraseña (solo email auth). Enlaces rapidos a tarjeta, codigos y promos.
- **Cache de auth**: Nombre de usuario y datos de bio en localStorage. Carga instantanea sin flash al recargar. Se limpia al cerrar sesion.
- **Tracking**: Registro de clics, visitas, scans QR en Supabase. Parametro `?ref=` para tracking de QR fisicos.
- **Libro de reclamaciones**: Formulario de 5 pasos conforme a Ley N. 29571. Acceso solo por QR en tienda.
- **SEO**: JSON-LD (ClothingStore + WebSite), Open Graph por pagina, canonical, sitemap dinamico, robots.txt.

## Supabase

### Tablas
- `web_clientes` - Datos de miembros (nombre, celular, dni, fecha_nacimiento, genero, email, auth)
- `web_codigos_promo` - Codigos de descuento (personales y globales)
- `web_codigo_canjes` - Registro de canjes por usuario (para codigos globales)
- `web_canje_tokens` - Tokens temporales QR (5 min de vida)
- `web_reclamaciones` - Libro de reclamaciones
- `web_visitas` - Visitas a paginas
- `web_clicks` - Clics y eventos

### RLS Policies
- `web_clientes`: SELECT own profile, UPDATE own profile
- `web_codigos_promo`: SELECT own codes (personal + global via API)
- `web_canje_tokens`: sin policy publica (solo service key via API)
- `web_codigo_canjes`: sin policy publica (solo service key via API)

### Config importante
- **Authentication > URL Configuration > Site URL**: `https://www.clubkarolayjeans.com`
- **Authentication > Email Auth**: Desactivar "Confirm email" (recomendado)
- **Authentication > Email Templates**: Personalizar con branding de Club Karolay Jeans
- **Authentication > Providers > Google**: Configurar con OAuth 2.0 de Google Cloud Console

## Integracion con RedelERP

Este proyecto se sincroniza con **RedelERP** (sistema de inventario central):

```
RedelERP (PostgreSQL local) ──push codigos──► Supabase
                             ◄──pull marketing──
Web (Next.js) ──────────────────────────────► Supabase
```

- RedelERP crea/edita codigos promo → sync automatico a Supabase (si hay internet)
- Boton "Sincronizar" en Marketing hace push completo + pull de visitas/clicks/clientes
- Dashboard de Marketing en RedelERP muestra metricas de codigos (total, activos, canjeados)

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # Build de produccion
```

## Deploy

Push a `main` y Vercel despliega automaticamente.
