# Club Karolay Jeans - Web

Sitio web oficial de **Club Karolay Jeans**, tienda especializada en jeans y moda denim para dama y varón en Arequipa, Peru.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Estilos:** Tailwind CSS
- **Base de datos / Auth:** KarolayJeansERP (Django en Railway) vía `/api/web/*` con header `X-Web-Key` — sin base de datos propia
- **QR:** qrcode (generacion client-side)
- **Deploy:** Vercel
- **Dominio:** clubkarolayjeans.com

> **Migracion (2026-07):** Supabase quedo fuera del ecosistema. Todos los datos del club
> (clientes, codigos, canjes, reclamaciones, tracking) viven en RedelBD (tablas `marketing_web*`)
> y se leen/escriben a traves de los endpoints `/api/web/` de KarolayJeansERP.

## Arquitectura

```
Navegador ──► API routes de Next (src/app/api/*) ──► KarolayJeansERP /api/web/* (Railway)
              [BFF: unica capa con credenciales]      [X-Web-Key → tablas marketing_web* en RedelBD]
```

- El navegador **nunca** habla con Railway directo: las API routes de Next actúan como BFF.
- `src/lib/erp.ts` es el único cliente HTTP hacia el ERP (`erpGet`/`erpSend` + `ErpError`).
- La lógica de negocio (validaciones, canjes, bono de bienvenida) vive en Django, no aquí.
- Sesión del club en `localStorage` (`src/lib/session.ts`, clave `ckj_session`) — el `id` es la fila de clientes web en RedelBD.

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
│   └── api/                     # Proxies delgados hacia el ERP
│       ├── login/               # Login + anti fuerza bruta (lockout progresivo)
│       ├── registro/            # Crear cuenta (el ERP genera el bono de bienvenida)
│       ├── cuenta/              # GET/PATCH datos del cliente
│       ├── canje/               # Generar token QR (POST) + validar/canjear (GET)
│       ├── mis-codigos/         # Listar codigos del usuario (globales + personales)
│       ├── reclamaciones/       # Enviar reclamo al libro de reclamaciones
│       ├── track/               # Tracking de eventos
│       └── health/              # Health check (estandar Redel Monitor, X-Monitor-Token)
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
    ├── erp.ts                   # Cliente HTTP server-side hacia KarolayJeansERP
    ├── session.ts               # Sesion del club en localStorage
    ├── loginRateLimit.ts        # Anti fuerza bruta del login (en memoria)
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
- **Personal** (con cliente asignado): asignado a un usuario especifico. Se marca canjeado al usar.
- **Global** (sin cliente): disponible para todos los miembros. Cada usuario puede canjearlo una vez.
- **Bono de bienvenida**: se crea automaticamente al registrarse. Personal, 10% OFF, valido 30 dias.

### Flujo de canje
1. Cliente entra a `/mis-codigos` y ve sus codigos disponibles
2. Toca "Canjear en tienda" → se genera un **QR temporal** (5 minutos)
3. Pantalla muestra "Muestra este QR al vendedor" con countdown
4. Vendedor escanea el QR → se abre `/canjear/[token]`
5. Codigo se marca como canjeado automaticamente → pantalla de exito
6. Si el QR expiro o ya fue usado, muestra error

### Gestion desde KarolayJeansERP
Los codigos se crean y gestionan desde **KarolayJeansERP > Marketing > Codigos Promo**,
directo sobre RedelBD (sin sync intermedio). Filtros: todos, activos, canjeados.
Muestra nombre del cliente asignado.

## Autenticacion

- **Login**: email + contraseña contra KarolayJeansERP (`/api/web/login/`, hash en el ERP).
- **Anti fuerza bruta** (`src/lib/loginRateLimit.ts`): 3 intentos por usuario / 10 por IP →
  bloqueo de 15 min que se duplica en cada reincidencia (tope 24 h). Estado en memoria del
  proceso — valido para una instancia; si se escala, mover a BD/Redis.
- **Sesion**: los datos del cliente se guardan en `localStorage` (`ckj_session`). Cerrar
  sesion limpia tambien las claves legadas (`ckj_cliente_id`, `ckj_user_name`, `ckj_bio_cliente`).
- **Google OAuth** quedo fuera con la salida de Supabase — re-agregarlo requiere credenciales
  OAuth propias.

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
REDELERP_URL=        # URL de KarolayJeansERP en Railway (server-only)
WEB_API_KEY=         # X-Web-Key, debe coincidir con el ERP (server-only)
MONITOR_TOKEN=       # detalle de /api/health (server-only)
NEXT_PUBLIC_SITE_URL=https://www.clubkarolayjeans.com
```

> El numero de WhatsApp **no** es env var: esta hardcodeado a proposito en
> `src/lib/constants.ts` (una env var de Vercel lo piso una vez).

## Datos del negocio

Centralizados en `src/lib/constants.ts`:
- Telefono WhatsApp: 993 084 496
- Direccion: Av. Siglo XX 209-213, C.C. Don Ramon, INT. B-77
- Horario: Lun-Sab 9am-8pm, Dom 9am-7pm
- Marcas: Pionier, Tayssir, Wrangler, Lee, Lois, Brooklyn, Element, Kansas, Norton, American Colt, Filippo Alpi

## Funcionalidades

- **Club VIP**: Registro con email/password. Miembros acceden a promos exclusivas.
- **Tarjeta digital** (`/bio`): Standalone tipo Linktree. Logo clickeable a inicio. Saludo con nombre completo, "Miembro desde..." alineado a la derecha. Botones: catalogo, redes (modal con Instagram/TikTok/Facebook), promos+codigos (solo logueado), WhatsApp, ubicacion. Cache en localStorage para carga instantanea sin parpadeo. Cerrar sesion limpia todo el cache.
- **Promociones** (`/promociones`): Pagina dinamica. Si logueado: muestra codigos disponibles con boton "Canjear en tienda" (genera QR). Si no: muestra "Crea tu cuenta gratis" con beneficios.
- **Landing Club VIP**: Seccion dinamica. Si logueado: "Ver mis descuentos" → /mis-codigos. Si no: "Unirme al Club gratis" → /registro.
- **Codigos promo**: Sistema completo de codigos de descuento con QR temporal (5 min). Personales y globales. Gestion desde KarolayJeansERP.
- **Bono de bienvenida**: 10% OFF automatico al registrarse, valido 30 dias.
- **Mi cuenta**: Editar nombre, celular, DNI, fecha nacimiento, genero. Cambio de contraseña. Enlaces rapidos a tarjeta, codigos y promos.
- **Cache de auth**: Nombre de usuario y datos de bio en localStorage. Carga instantanea sin flash al recargar. Se limpia al cerrar sesion.
- **Tracking**: Registro de clics, visitas y scans QR en RedelBD (via ERP). Parametro `?ref=` para tracking de QR fisicos.
- **Libro de reclamaciones**: Formulario de 5 pasos conforme a Ley N. 29571. Acceso solo por QR en tienda.
- **Health check** (`/api/health`): estandar Redel Monitor — sin token responde `{status}`; con `X-Monitor-Token` devuelve version desplegada y timestamp.
- **SEO**: JSON-LD (ClothingStore + WebSite), Open Graph por pagina, canonical, sitemap dinamico, robots.txt.

## Integracion con KarolayJeansERP

Este proyecto consume **KarolayJeansERP** (sistema de inventario central, Django en Railway):

- Endpoints `/api/web/*` autenticados con header `X-Web-Key` (env `WEB_API_KEY` en ambos lados).
- Tablas del club (`marketing_web*`) en RedelBD: clientes, codigos promo, canjes, tokens QR, reclamaciones, visitas, clicks.
- El modulo Marketing del ERP muestra metricas de la web (visitas, clicks, clientes, codigos) leyendo los mismos modelos — sin sync intermedio.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3002
npm run build      # Build de produccion
```

## Deploy

Push a `main` y Vercel despliega automaticamente.
