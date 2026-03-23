import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, celular, dni, fecha_nacimiento, genero, email, auth_provider, auth_uid } = body

    // Check if client already exists
    const { data: existing } = await supabase
      .from('web_clientes')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Ya existe una cuenta con este correo.' }, { status: 409 })
    }

    const { data, error } = await supabase.from('web_clientes').insert({
      nombre,
      celular,
      dni: dni || null,
      fecha_nacimiento: fecha_nacimiento || null,
      genero: genero || null,
      email,
      auth_provider: auth_provider || 'email',
      auth_uid: auth_uid || null,
    }).select().single()

    if (error) throw error

    // Auto-create welcome bonus code
    if (data?.id) {
      const code = `BIENVENIDO-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      const fechaFin = new Date()
      fechaFin.setDate(fechaFin.getDate() + 30)

      const { error: bonusError } = await supabase.from('web_codigos_promo').insert({
        codigo: code,
        tipo: 'bienvenida',
        descuento: '10% OFF en tu primera compra',
        descripcion: 'Código de bienvenida por registrarte en el Club Karolay Jeans.',
        cliente_id: data.id,
        activo: true,
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: fechaFin.toISOString().split('T')[0],
        canjeado: false,
      })

      if (bonusError) {
        console.error('Error creating welcome bonus:', bonusError.message)
      }
    }

    return NextResponse.json({ ok: true, cliente: data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al registrar'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
