# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Contexto del ecosistema Redel

Este proyecto es parte del ecosistema Redel de Carlos Retuerto. Antes de hacer cambios grandes, sigue el protocolo del vault `C:\Users\DELL\OneDrive\Escritorio\ClaudIAMemory`, página `wiki/conceptos/Protocolo de arranque en una app existente.md`:

1. Lee la página de esta app y de su empresa en `wiki/empresas/`.
2. Lee las fuentes de verdad: `wiki/conceptos/Arquitectura Redel.md`, `Estándar de diseño Redel.md`, `Requisitos de seguridad Redel.md`, `Requisitos de integridad de datos Redel.md` y `wiki/Errores a no repetir.md`.
3. Verifica el estado REAL del código (`git log`, `git status`) antes de confiar en lo que diga el wiki — puede estar desactualizado.

## Qué es

Web pública de **Club Karolay Jeans** (`clubkarolayjeans.com`) — marca comercial de Negocios e Inversiones Karolay EIRL, tienda de jeans y moda denim para dama y varón en el C.C. Don Ramón, Arequipa, Perú. Combina landing de marketing (SEO fuerte) con un **club de membresía**: registro, login, códigos promo personales/globales y canje por QR en tienda.

Parte del ecosistema Karolay (ver `../CLAUDE.md` del workspace). Es la única app del ecosistema que no toca inventario: solo consume las tablas web del club (`marketing_web*`) en RedelBD.

## Comandos

```bash
npm run dev      # puerto 3002
npm run build    # build de producción (usar para verificar antes de push)
npm start        # puerto 3002
```

No hay lint ni tests configurados. Deploy: push a `main` → Vercel despliega automático.

## Arquitectura

### Sin base de datos propia — todo va a KarolayJeansERP (Railway)

**Supabase quedó fuera por completo (2026-07-11).** El README todavía documenta Supabase en varias secciones — está desactualizado; esta arquitectura es la vigente.

```
Navegador ──► API routes de Next (src/app/api/*) ──► KarolayJeansERP /api/web/* (Railway)
              [BFF: única capa con credenciales]      [X-Web-Key → tablas marketing_web* en RedelBD]
```

- `src/lib/erp.ts` es el único cliente HTTP hacia el ERP: `erpGet` / `erpSend` + `ErpError` (conserva status y body del ERP). Toda ruta API nueva debe usarlo, no `fetch` directo.
- La key `WEB_API_KEY` y la URL `REDELERP_URL` **nunca llegan al navegador** — solo viven en las API routes (server-side).
- Patrón de las rutas API: proxy delgado que reenvía el body al ERP y traduce `ErpError` a la respuesta JSON con su status. La lógica de negocio (validaciones, canjes, bonos) vive en Django, no aquí.

Rutas API existentes: `login` (con anti fuerza bruta), `registro`, `cuenta` (GET/PATCH datos del cliente), `mis-codigos`, `canje` (POST genera token QR de 5 min, GET valida y canjea), `reclamaciones`, `track`, `health`.

### Sesión del club (sin cookies, sin JWT)

`src/lib/session.ts`: el login/registro devuelve los datos del cliente y se guardan en `localStorage` bajo `ckj_session` (el `id` es la fila de `web_clientes` en RedelBD). Claves legadas que otras partes de la web leen: `ckj_cliente_id`, `ckj_user_name`, `ckj_bio_cliente` (cache de /bio). `clearSession()` limpia todas. Las rutas API reciben `cliente_id` explícito del cliente — no hay verificación de sesión server-side.

Google OAuth se perdió con la salida de Supabase; re-agregarlo requiere credenciales OAuth propias.

### Anti fuerza bruta del login

`src/lib/loginRateLimit.ts` — lockout progresivo en memoria del proceso: 3 intentos por usuario / 10 por IP → bloqueo 15 min que se duplica en cada reincidencia (tope 24 h). Solo válido para una instancia; si se escala, mover a BD/Redis (y la defensa definitiva debe vivir también en Django, porque Railway es alcanzable directo).

### Páginas

Patrón de todas las páginas: `page.tsx` es server component (solo `metadata` + render) y la interactividad vive en un client component hermano (`*Content.tsx` / `*Form.tsx`).

| Ruta | Qué hace |
|------|----------|
| `/` | Landing (hero, marcas, tendencias, club VIP — sección dinámica según login) |
| `/promociones` | Dinámica: códigos si logueado, invitación a registro si no |
| `/mis-codigos` | Códigos del usuario + genera QR temporal de canje (lib `qrcode`) |
| `/canjear/[token]` | El vendedor escanea el QR → valida y canjea automático |
| `/bio` | Tarjeta digital tipo Linktree (standalone, cache en localStorage para carga sin parpadeo) |
| `/cuenta`, `/login`, `/registro` | Cuenta del club (registro crea bono de bienvenida 10% OFF, 30 días — lo hace el ERP) |
| `/libro-reclamaciones` | Formulario 5 pasos (Ley N.° 29571), acceso por QR en tienda |
| `/catalogo`, `/mapa`, `/privacidad`, `/promo/[slug]` | Estáticas / semi-estáticas |

Los códigos promo se crean y gestionan desde **KarolayJeansERP → Marketing → Códigos Promo**.

### Tracking

`TrackingProvider` + `src/lib/tracking.ts` → `POST /api/track` → ERP. Registra pageviews (UTM, device, navegador, referrer) y clicks (con `cliente_id` si hay sesión). Parámetro `?ref=` para QR físicos.

### Monitoreo

`/api/health` sigue el estándar Redel Monitor: sin token responde `{status: 'ok'}`; con header `X-Monitor-Token` (env `MONITOR_TOKEN`, comparación timing-safe) devuelve versión desplegada y timestamp.

## Reglas del negocio en el código

- **WhatsApp del club: `51993084496`, hardcodeado A PROPÓSITO en `src/lib/constants.ts`** — una env var de Vercel lo pisó una vez; no convertirlo a env var. El número anterior (940 403 984) ahora es de Redel, no del club.
- Todos los datos del negocio (dirección, horarios, marcas, categorías, redes, promos del landing) están centralizados en `src/lib/constants.ts` — editar ahí, no inline en componentes.
- SEO es prioridad: JSON-LD (ClothingStore + WebSite) en `layout.tsx`, metadata Open Graph por página, `sitemap.ts` dinámico, robots bloquea `/cuenta`, `/login`, `/api`. Cambios de contenido deben mantener esto.
- Imágenes en `public/images/` (webp): para cambiar una, reemplazar el archivo con el mismo nombre.

## Tema visual

Paleta mocha/gold/dark definida en `tailwind.config.ts` (`mocha-*`, `gold`, `dark-*`), fuentes Roboto (body) y Montserrat (headings), animaciones de entrada (`fade-in-up`, `slide-in-*`, etc.) usadas con `useScrollReveal`. Todo el copy visible al usuario es en español (Perú).

## Variables de entorno

```env
REDELERP_URL=       # URL del ERP en Railway (server-only)
WEB_API_KEY=        # X-Web-Key, debe coincidir con el ERP (server-only)
MONITOR_TOKEN=      # detalle de /api/health (server-only)
NEXT_PUBLIC_SITE_URL=https://www.clubkarolayjeans.com
```

Las vars `SUPABASE_*` del README ya no existen.
