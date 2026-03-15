import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type WebVisita = {
  id?: string
  pagina: string
  referrer: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  dispositivo: 'mobile' | 'tablet' | 'desktop'
  navegador: string | null
  created_at?: string
}

export type WebClick = {
  id?: string
  tipo: 'whatsapp' | 'catalogo' | 'promo' | 'registro' | 'redes' | 'mapa' | 'bio_btn'
  etiqueta: string
  pagina: string
  cliente_id: string | null
  metadata: Record<string, unknown> | null
  created_at?: string
}

export type WebCliente = {
  id?: string
  nombre: string
  celular: string
  email: string | null
  auth_provider: 'email' | 'google'
  auth_uid: string | null
  created_at?: string
}

export type WebPromo = {
  id?: string
  slug: string
  titulo: string
  descripcion: string
  imagen_url: string | null
  activa: boolean
  fecha_inicio: string
  fecha_fin: string | null
  created_at?: string
}
