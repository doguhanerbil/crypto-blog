import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug
    if (!slug) return NextResponse.json({ ok: false }, { status: 400 })

    const { error } = await supabaseAdmin.rpc('increment_post_view_by_slug', { p_slug: slug })
    if (error) {
      // RPC yoksa fallback: select id sonra update
      const { data: post, error: selErr } = await supabaseAdmin
        .from('posts')
        .select('id, view_count')
        .eq('slug', slug)
        .single()
      if (selErr || !post) return NextResponse.json({ ok: false }, { status: 404 })
      const { error: updErr } = await supabaseAdmin
        .from('posts')
        .update({ view_count: (post.view_count || 0) + 1 })
        .eq('id', post.id)
      if (updErr) return NextResponse.json({ ok: false }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

