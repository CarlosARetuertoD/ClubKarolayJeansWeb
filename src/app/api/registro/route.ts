import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, celular, email, auth_provider, auth_uid } = body

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
      email,
      auth_provider: auth_provider || 'email',
      auth_uid: auth_uid || null,
    }).select().single()

    if (error) throw error

    return NextResponse.json({ ok: true, cliente: data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al registrar'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
