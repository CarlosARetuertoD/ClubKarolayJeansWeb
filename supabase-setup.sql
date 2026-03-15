-- ═══════════════════════════════════════════════════════════════
-- CLUB KAROLAY JEANS WEB - Tablas de tracking y clientes
-- Ejecutar en Supabase SQL Editor (misma instancia de RedelERP)
-- ═══════════════════════════════════════════════════════════════

-- Visitas a páginas (cada pageview)
CREATE TABLE IF NOT EXISTS web_visitas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pagina TEXT NOT NULL,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  dispositivo TEXT CHECK (dispositivo IN ('mobile', 'tablet', 'desktop')),
  navegador TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clicks en botones importantes
CREATE TABLE IF NOT EXISTS web_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL, -- 'whatsapp', 'catalogo', 'promo', 'registro', 'redes', 'mapa', 'bio_btn'
  etiqueta TEXT NOT NULL, -- identificador específico (ej: 'hero_cta', 'promo_verano')
  pagina TEXT NOT NULL, -- desde qué página se hizo click
  cliente_id TEXT, -- si el usuario está logueado
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clientes registrados
CREATE TABLE IF NOT EXISTS web_clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  celular TEXT NOT NULL,
  email TEXT UNIQUE,
  auth_provider TEXT DEFAULT 'email' CHECK (auth_provider IN ('email', 'google')),
  auth_uid TEXT, -- Supabase Auth UID
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promociones (gestionables desde RedelERP en el futuro)
CREATE TABLE IF NOT EXISTS web_promos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  detalle TEXT,
  imagen_url TEXT,
  activa BOOLEAN DEFAULT true,
  fecha_inicio DATE DEFAULT CURRENT_DATE,
  fecha_fin DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para consultas frecuentes desde RedelERP
CREATE INDEX IF NOT EXISTS idx_web_visitas_pagina ON web_visitas(pagina);
CREATE INDEX IF NOT EXISTS idx_web_visitas_created ON web_visitas(created_at);
CREATE INDEX IF NOT EXISTS idx_web_visitas_utm ON web_visitas(utm_source, utm_campaign);
CREATE INDEX IF NOT EXISTS idx_web_clicks_tipo ON web_clicks(tipo);
CREATE INDEX IF NOT EXISTS idx_web_clicks_created ON web_clicks(created_at);
CREATE INDEX IF NOT EXISTS idx_web_clicks_cliente ON web_clicks(cliente_id);
CREATE INDEX IF NOT EXISTS idx_web_clientes_email ON web_clientes(email);
CREATE INDEX IF NOT EXISTS idx_web_promos_slug ON web_promos(slug);
CREATE INDEX IF NOT EXISTS idx_web_promos_activa ON web_promos(activa);

-- ═══════════════════════════════════════════════════════════════
-- VISTAS para métricas rápidas (consultables desde RedelERP)
-- ═══════════════════════════════════════════════════════════════

-- Visitas por página (últimos 30 días)
CREATE OR REPLACE VIEW web_metricas_paginas AS
SELECT
  pagina,
  COUNT(*) as total_visitas,
  COUNT(DISTINCT DATE(created_at)) as dias_con_visitas,
  COUNT(*) FILTER (WHERE dispositivo = 'mobile') as mobile,
  COUNT(*) FILTER (WHERE dispositivo = 'desktop') as desktop,
  COUNT(*) FILTER (WHERE dispositivo = 'tablet') as tablet,
  MAX(created_at) as ultima_visita
FROM web_visitas
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY pagina
ORDER BY total_visitas DESC;

-- Clicks por tipo (últimos 30 días)
CREATE OR REPLACE VIEW web_metricas_clicks AS
SELECT
  tipo,
  etiqueta,
  COUNT(*) as total_clicks,
  COUNT(DISTINCT cliente_id) as clientes_unicos,
  MAX(created_at) as ultimo_click
FROM web_clicks
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY tipo, etiqueta
ORDER BY total_clicks DESC;

-- Tráfico por campaña UTM
CREATE OR REPLACE VIEW web_metricas_campanas AS
SELECT
  COALESCE(utm_source, 'directo') as fuente,
  COALESCE(utm_medium, '-') as medio,
  COALESCE(utm_campaign, '-') as campana,
  COUNT(*) as visitas,
  MIN(created_at) as primera_visita,
  MAX(created_at) as ultima_visita
FROM web_visitas
WHERE utm_source IS NOT NULL OR utm_campaign IS NOT NULL
GROUP BY utm_source, utm_medium, utm_campaign
ORDER BY visitas DESC;

-- Registros de clientes por día
CREATE OR REPLACE VIEW web_metricas_registros AS
SELECT
  DATE(created_at) as fecha,
  COUNT(*) as nuevos_clientes,
  COUNT(*) FILTER (WHERE auth_provider = 'google') as via_google,
  COUNT(*) FILTER (WHERE auth_provider = 'email') as via_email
FROM web_clientes
GROUP BY DATE(created_at)
ORDER BY fecha DESC;

-- Habilitar RLS (Row Level Security) - permite lectura pública para tracking
ALTER TABLE web_visitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_promos ENABLE ROW LEVEL SECURITY;

-- Políticas: la web puede insertar, solo service_role puede leer todo
CREATE POLICY "web_visitas_insert" ON web_visitas FOR INSERT WITH CHECK (true);
CREATE POLICY "web_visitas_select" ON web_visitas FOR SELECT USING (true);

CREATE POLICY "web_clicks_insert" ON web_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "web_clicks_select" ON web_clicks FOR SELECT USING (true);

CREATE POLICY "web_clientes_insert" ON web_clientes FOR INSERT WITH CHECK (true);
CREATE POLICY "web_clientes_select" ON web_clientes FOR SELECT USING (true);

CREATE POLICY "web_promos_select" ON web_promos FOR SELECT USING (true);
