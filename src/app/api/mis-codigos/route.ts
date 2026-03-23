import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clienteId = searchParams.get('cliente_id')

    if (!clienteId) {
      return NextResponse.json({ error: 'cliente_id requerido' }, { status: 400 })
    }

    // Get personal codes (assigned to this client) + global codes (cliente_id is null)
    const { data: codigos, error } = await supabase
      .from('web_codigos_promo')
      .select('id, codigo, tipo, descuento, descripcion, cliente_id, activo, fecha_fin, canjeado, fecha_canje')
      .or(`cliente_id.eq.${clienteId},cliente_id.is.null`)
      .eq('activo', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Get this user's canjes (to know which global codes they already used)
    const { data: canjes } = await supabase
      .from('web_codigo_canjes')
      .select('codigo_promo_id')
      .eq('cliente_id', clienteId)

    const canjeIds = new Set((canjes || []).map(c => c.codigo_promo_id))

    // Enrich codes with "ya_canjeado_por_mi"
    const enriched = (codigos || []).map(c => ({
      ...c,
      ya_canjeado_por_mi: c.cliente_id
        ? c.canjeado  // personal code: use canjeado field directly
        : canjeIds.has(c.id),  // global code: check canjes table
    }))

    return NextResponse.json({ codigos: enriched })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
