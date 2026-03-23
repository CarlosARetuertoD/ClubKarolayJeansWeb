import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

// POST: Generar token temporal de canje (cliente autenticado)
export async function POST(request: NextRequest) {
  try {
    const { codigo_promo_id, cliente_id } = await request.json()

    // Validate cliente_id exists in DB (prevents spoofing)
    if (cliente_id) {
      const { data: clienteCheck } = await supabase
        .from('web_clientes')
        .select('id')
        .eq('id', cliente_id)
        .maybeSingle()
      if (!clienteCheck) {
        return NextResponse.json({ error: 'Cliente no válido.' }, { status: 400 })
      }
    }

    // Verificar que el código existe y está activo
    const { data: codigo, error: codigoError } = await supabase
      .from('web_codigos_promo')
      .select('id, codigo, descuento, canjeado, activo, fecha_fin, cliente_id')
      .eq('id', codigo_promo_id)
      .single()

    if (codigoError || !codigo) {
      return NextResponse.json({ error: 'Código no encontrado.' }, { status: 404 })
    }

    if (!codigo.activo) {
      return NextResponse.json({ error: 'Este código no está activo.' }, { status: 400 })
    }

    if (codigo.fecha_fin && new Date(codigo.fecha_fin) < new Date()) {
      return NextResponse.json({ error: 'Este código ya venció.' }, { status: 400 })
    }

    // For personal codes: check canjeado flag
    if (codigo.cliente_id && codigo.canjeado) {
      return NextResponse.json({ error: 'Este código ya fue canjeado.' }, { status: 400 })
    }

    // For global codes: check if this user already redeemed it
    if (!codigo.cliente_id && cliente_id) {
      const { data: existingCanje } = await supabase
        .from('web_codigo_canjes')
        .select('id')
        .eq('codigo_promo_id', codigo_promo_id)
        .eq('cliente_id', cliente_id)
        .maybeSingle()

      if (existingCanje) {
        return NextResponse.json({ error: 'Ya canjeaste este código.' }, { status: 400 })
      }
    }

    // Invalidar tokens anteriores no canjeados del mismo código + cliente
    await supabase
      .from('web_canje_tokens')
      .update({ canjeado: true })
      .eq('codigo_promo_id', codigo_promo_id)
      .eq('canjeado', false)

    // Crear token con 5 minutos de vida
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    const { data: token, error: tokenError } = await supabase
      .from('web_canje_tokens')
      .insert({
        codigo_promo_id,
        cliente_id: cliente_id || null,
        expires_at: expiresAt,
        canjeado: false,
      })
      .select('token, expires_at')
      .single()

    if (tokenError) throw tokenError

    return NextResponse.json({ token: token.token, expires_at: token.expires_at })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al generar token'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// GET: Validar y canjear token (vendedor escanea)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token requerido.' }, { status: 400 })
    }

    // Buscar token
    const { data: tokenData, error: tokenError } = await supabase
      .from('web_canje_tokens')
      .select('id, codigo_promo_id, cliente_id, expires_at, canjeado')
      .eq('token', token)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({ error: 'QR inválido.', status: 'invalid' }, { status: 404 })
    }

    if (tokenData.canjeado) {
      return NextResponse.json({ error: 'Este QR ya fue usado.', status: 'used' }, { status: 400 })
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Este QR expiró. Pide al cliente que genere uno nuevo.', status: 'expired' }, { status: 400 })
    }

    // Buscar info del código promo
    const { data: codigo } = await supabase
      .from('web_codigos_promo')
      .select('id, codigo, tipo, descuento, descripcion, canjeado, cliente_id')
      .eq('id', tokenData.codigo_promo_id)
      .single()

    if (!codigo) {
      return NextResponse.json({ error: 'Código promo no encontrado.', status: 'invalid' }, { status: 404 })
    }

    // Obtener nombre del cliente
    let clienteNombre = 'Cliente'
    const canjeClienteId = tokenData.cliente_id || codigo.cliente_id
    if (canjeClienteId) {
      const { data: cliente } = await supabase
        .from('web_clientes')
        .select('nombre')
        .eq('id', canjeClienteId)
        .single()
      if (cliente) clienteNombre = cliente.nombre
    }

    // Marcar token como canjeado
    await supabase
      .from('web_canje_tokens')
      .update({ canjeado: true })
      .eq('id', tokenData.id)

    if (codigo.cliente_id) {
      // Personal code: mark the code itself as canjeado
      await supabase
        .from('web_codigos_promo')
        .update({ canjeado: true, fecha_canje: new Date().toISOString() })
        .eq('id', codigo.id)
    } else {
      // Global code: create a canje record for this user
      if (canjeClienteId) {
        await supabase
          .from('web_codigo_canjes')
          .insert({
            codigo_promo_id: codigo.id,
            cliente_id: canjeClienteId,
          })
      }
    }

    return NextResponse.json({
      status: 'success',
      codigo: codigo.codigo,
      descuento: codigo.descuento,
      descripcion: codigo.descripcion,
      tipo: codigo.tipo,
      cliente: clienteNombre,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al validar token'
    return NextResponse.json({ error: message, status: 'error' }, { status: 500 })
  }
}
