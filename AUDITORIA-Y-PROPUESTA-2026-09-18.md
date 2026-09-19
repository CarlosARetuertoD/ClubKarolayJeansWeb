# Auditoría y propuesta — Club Karolay Jeans

Fecha: 2026-09-18. Revisión del código local (HEAD c2510ec), web pública y documentación de campaña. No se modificó ni publicó la aplicación.

## Evaluación

**6/10 global**, valoración editorial de lo revisado, no una puntuación Lighthouse. Promedio simple de cinco dimensiones: arquitectura 8, diseño 7, contenido/SEO 6, conversión comercial 6 y seguridad 3. El riesgo de autenticación tiene prioridad aunque el promedio resulte aceptable.

La web tiene una base aprovechable: identidad visual consistente, catálogo editorial, WhatsApp, registro, promociones, tarjeta digital y QR. Necesita resolver autenticación y actualizar el contenido para acompañar la campaña de primavera.

## Cómo está hecha

- Next.js 14.2.35 instalado, React 18, TypeScript y Tailwind CSS. Desarrollo a medida; sin WordPress ni un editor visual de contenidos.
- Hosting Vercel según documentación. El navegador llama a las rutas API de Next; estas llaman al ERP Django mediante una clave guardada en servidor. Los datos del club viven en el ERP, sin base de datos propia en este proyecto.
- Catálogo, tendencias y promociones editoriales definidos en código, principalmente `src/lib/constants.ts`. Las fotos están en `public/images/`. No hay consulta de inventario para el catálogo público.
- Cuenta, códigos, canjes y tracking consumen el ERP. La sesión visible se guarda en localStorage; no existe prueba de sesión de usuario en las rutas API revisadas.
- El wiki de la aplicación conserva referencias obsoletas a Supabase y dice que no existe CLAUDE.md propio. El código y README actuales contradicen esos apartados: sí hay CLAUDE.md y se usa el ERP.

## Hallazgos por prioridad

### P0 — Identidad del usuario sin verificar en servidor

`src/app/api/cuenta/route.ts:6` recibe `cliente_id` por URL, y PATCH reenvía el cuerpo sin autenticar al visitante. `src/app/api/mis-codigos/route.ts` y POST de `src/app/api/canje/route.ts` siguen el mismo patrón. `src/lib/session.ts` acepta un objeto local que tenga id; eso sirve de estado de interfaz, pero no acredita identidad.

La clave entre Next y Django identifica a la aplicación, no al cliente. Existe riesgo de acceso o acciones sobre otra cuenta si se conoce su identificador y el ERP acepta ese contrato. La ausencia de validación en Next está confirmada; no se intentó acceder a cuentas reales ni se auditó el backend en esta sesión. Solución: sesión autenticada verificable en servidor, identidad derivada de esa sesión y autorización por recurso en Django.

### P1 — Manejo de errores del login roto y limitador volátil

`src/app/api/login/route.ts:17` consume el body con `request.json()`. En el catch, línea 36, intenta `request.clone()`. Una reproducción local con Request de Node produce `TypeError: unusable`; el `.catch()` de la promesa no intercepta el error síncrono de clone. El camino de credenciales inválidas puede fallar antes de contabilizar el intento y devolver el error previsto. Reutilizar los datos ya parseados.

Además, `src/lib/loginRateLimit.ts:26` almacena contadores en un Map del proceso. No es una protección compartida o persistente entre instancias/reinicios; mover la defensa a almacenamiento compartido o al backend.

### P1 — Dependencias con avisos de seguridad

`npm audit --omit=dev --json` reportó 3 paquetes afectados: Next (critical), nanoid (high) y PostCSS anidado en Next (high). Son severidades del inventario de dependencias, no confirmación de explotación en este despliegue. Algunos avisos dependen de Windows, self-hosting, procesamiento de imágenes o rutas específicas. Requiere actualización planificada y verificación de compatibilidad; evitar un cambio mayor automático sin revisar.

### P1 — La oferta pública no acompaña la campaña

La web publicada y `PROMOS_DATA` siguen mostrando Otoño 2026. La campaña vigente es Primavera 2026. La portada da protagonismo a la marca, pero no muestra inmediatamente la oferta o productos de la campaña. El catálogo presenta fits genéricos, sin precio, modelo identificable, tallas ni disponibilidad.

Las categorías Casacas, Bermudas y Faldas enlazan a `#casacas`, `#bermudas` y `#faldas`, pero no hay secciones con esos ids en el catálogo. Crear contenido real para esas categorías o cambiar su acción por una consulta específica.

### P2 — Información local y mecánica promocional incoherentes

- Web: lunes a sábado 09:00–20:00, domingo 09:00–19:00. La memoria de creación de Google Business Profile indica 09:00–21:00 y domingo 10:00–19:00. Unificar tras determinar el horario vigente.
- JSON-LD conserva coordenadas distintas de las del enlace actualizado de Google Maps.
- La pieza 56 de primavera muestra INT. A-11; la pieza 7 de Drill muestra B-77; la web orienta principalmente a B-77. No asumir que A-11 es un error: documentar productos/ofertas y ubicación por puesto.
- Las piezas indican mostrar la imagen; la web habla de tarjeta y el sistema tiene QR de canje. Definir condiciones visibles y coherentes por promoción.

### P2 — Experiencia y mantenimiento

La portada tiene una fotografía muy oscurecida y textos secundarios de baja opacidad; mejorar legibilidad y visibilidad de prendas. Esto es una observación visual, no una medición WCAG. La revisión móvil fue limitada; falta una prueba completa de navegación y formularios en dispositivo.

Hay WebP y next/image, algo positivo. La página /bio conserva un fondo PNG en CSS y las fuentes usan import externo: oportunidades para revisar carga. El tamaño del repositorio no equivale al peso descargado por el visitante. No se midieron Core Web Vitals ni Lighthouse.

No hay scripts propios de pruebas ni lint en package.json. La compilación verifica tipos, pero no prueba login, autorización ni canje. Priorizar pruebas de esos flujos al corregirlos.

## Contexto de campaña verificado

Leídos CLAUDE.md e índice de ClaudIAMemory, la página de la empresa, de la web, la base de conocimiento y buyer personas. Consultados el calendario final y Seguimiento-Final del proyecto de marketing.

- Inicio adelantado al 16 de septiembre; 78 piezas únicas, 26 días base y cinco días puente con reutilización de piezas. Cierre previsto el 16 de octubre.
- Horarios de publicaciones: 09:00, 13:00 y 17:00.
- El seguimiento local incluye programación hasta el día 11 (1 de octubre). Es información del archivo, no una comprobación en Meta.
- Viernes 18: 10% OFF según calendario. Sábado 19: 15% en Drill y Baggy seleccionados. No generalizar el 15% a todos los días ni a todo el inventario.
- Se inspeccionaron visualmente las piezas 56 y 7. Son diseños publicitarios; según la documentación, la campaña partió de imágenes IA retocadas en Canva. No acreditan que cada prenda retratada corresponda a un SKU real.
- Los buyer personas señalan como dolor principal no saber si existe su talla: el CTA debe ayudar a resolverlo.

## Propuesta recomendada: «Primavera a tu estilo»

Combinar una colección permanente de primavera con el bloque de oferta que corresponda a cada fecha del calendario. Mantener logo y tonos de marca; introducir fondos crema, fotografía más luminosa y azul denim.

### Portada propuesta

1. Hero con foto de producto/modelo de la colección: «Tu próximo jean favorito está aquí». Bajada: «Descubre los fits de primavera y consulta tu talla antes de visitarnos». Botones «Ver colección» y «Consultar mi talla».
2. Oferta vigente con fecha absoluta, productos aplicables, puesto y condiciones. Sin oferta vencida ni contador artificial.
3. Seis a ocho productos destacados con foto real, nombre/modelo, fit, tallas y precio confirmado. Hasta tener inventario conectado, disponibilidad por consulta sin prometer stock en tiempo real.
4. Selector sencillo de fit: Baggy, Wide Leg, Mom, Campana, Recto y Drill, según surtido confirmado. Mensaje de WhatsApp con modelo y talla.
5. Club: explicar el bono de bienvenida del 10% y el procedimiento de canje, sin prometer acumulación con ofertas de fin de semana.
6. Fotos del local y orientación por puesto; botón para Maps y referencia del pasadizo.

### Tres líneas comerciales

| Propuesta | Beneficio | Estado y límites |
|---|---|---|
| Primavera a tu estilo | Novedades + ayuda para elegir fit y talla | Recomendación principal; puede funcionar sin descuento adicional. |
| Fin de semana Karolay | Viernes 10%, sábado 15% en Drill/Baggy seleccionados | Ya aparece en el calendario; implementar por fechas y condiciones verificadas, no como descuento permanente. |
| Arma tu dúo | Beneficio al comprar dos prendas seleccionadas | Idea nueva. Definir importe y surtido con margen real; no anunciar todavía un 2×1 ni un porcentaje arbitrario. |

Recomendación: lanzar la primera y usar la segunda como incentivo temporal. Reservar «Arma tu dúo» para una prueba posterior con rentabilidad calculada.

### Uso de fotografías y piezas existentes

- Pieza 56: referencia de colección primavera, pero adaptar a formato web y confirmar la orientación a A-11.
- Piezas 7 y 6: módulos de promoción de Drill y Baggy, según vigencia; revisar la 6 visualmente antes de reutilizar.
- Preparar portada horizontal y recorte vertical móvil; imágenes de producto 4:5, optimizadas en WebP/AVIF cuando corresponda.
- Mantener títulos, porcentajes, fechas y botones como texto HTML legible. No convertir toda la portada en un afiche con texto incrustado.
- Para catálogo, usar fotos reales de productos vendidos por la tienda. Las piezas IA sirven como material creativo de campaña, sin presentarlas como prueba de un producto exacto disponible.

### Medición

Reutilizar el tracking existente: visitas con UTM por red/pieza, clics a colección, consultas por modelo/talla, registros y canjes. Los clics de WhatsApp no equivalen a conversaciones ni ventas; el cierre requiere registro en tienda/ERP. Comparar cada semana consultas útiles y ventas atribuibles, no solo visitas.

## Orden de trabajo

1. Corregir autenticación, error del login y actualizar dependencias; verificar autorización con cuentas de prueba.
2. Publicar una portada coherente con primavera, navegación de catálogo funcional y datos de ubicación/horario acordados.
3. Cargar fotos de productos identificados y oferta fechada consistente con redes.
4. Medir el recorrido hasta consulta y venta; después evaluar el combo de dos prendas.

## Verificación realizada

- `npm run build`: terminado con exit code 0; compilación y tipos correctos, 22 páginas generadas. Home: 114 kB de First Load JS según Next; no es el peso completo de la página ni una prueba de velocidad.
- `npm audit --omit=dev --json`: completado; 1 paquete crítico y 2 altos.
- Reproducción local del patrón de Request consumido del login: TypeError al clonar.
- Inspección pública de portada y catálogo; captura de escritorio y revisión móvil limitada.
- No se enviaron formularios, canjearon códigos ni accedió a datos de clientes. No se verificó el código del ERP ni la configuración de producción contra el checkout local.
- Git permaneció sin cambios en código; este informe es el único archivo agregado.

## Fuentes locales principales

- `C:/Users/DELL/OneDrive/Escritorio/ClaudIAMemory/CLAUDE.md`
- `C:/Users/DELL/OneDrive/Escritorio/ClaudIAMemory/wiki/index.md`
- `C:/Users/DELL/OneDrive/Escritorio/ClaudIAMemory/wiki/empresas/Negocios e Inversiones Karolay/Negocios e Inversiones Karolay.md`
- `C:/Users/DELL/OneDrive/Escritorio/ClaudIAMemory/wiki/empresas/Negocios e Inversiones Karolay/apps/ClubKarolayJeansWeb.md`
- `C:/Users/DELL/OneDrive/Escritorio/ClaudIAMemory/wiki/resumenes/Buyer Personas y Journey Map Karolay.md`
- `C:/Users/DELL/OneDrive/Escritorio/ClubKarolayJeans-Marketing/05-Calendario-Final/Calendario-Final-Reconstruido.md`
- `C:/Users/DELL/OneDrive/Escritorio/ClubKarolayJeans-Marketing/Seguimiento-Final.md`
- Web observada: https://clubkarolayjeans.com/ y https://clubkarolayjeans.com/catalogo
