import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (type === 'pageview') {
      await supabase.from('web_visitas').insert(data)
    } else if (type === 'click') {
      await supabase.from('web_clicks').insert(data)
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error tracking' }, { status: 500 })
  }
}
