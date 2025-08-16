import { NextResponse, NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    // Check relations in post_categories
    const { count, error: countError } = await supabaseAdmin
      .from('post_categories')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id)

    if (countError) {
      return NextResponse.json({ message: countError.message }, { status: 400 })
    }

    if ((count ?? 0) > 0) {
      return NextResponse.json({ message: 'Bu kategoriye bağlı yazılar var. Silmeden önce yazıların kategorisini değiştirin.', count }, { status: 409 })
    }

    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ message: 'Silme işlemi başarısız' }, { status: 500 })
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await req.json()
    const { name, description } = body as { name?: string; description?: string }

    // Fetch existing
    const { data: existing, error: exErr } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()
    if (exErr || !existing) return NextResponse.json({ message: 'Kategori bulunamadı' }, { status: 404 })

    let updates: Record<string, any> = { description }
    if (typeof name === 'string' && name.trim()) {
      updates.name = name
      // Auto slug from name, ensure unique (excluding current id)
      let base = slugify(name)
      let slug = base
      let i = 1
      while (true) {
        const { data: conflict } = await supabaseAdmin
          .from('categories')
          .select('id')
          .eq('slug', slug)
          .neq('id', id)
          .maybeSingle()
        if (!conflict) break
        slug = `${base}-${i++}`
      }
      updates.slug = slug
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ message: error.message }, { status: 400 })
    const updated = data

    // Propagate slug/name changes to dependent data (static paths/links)
    // 1) Recompute each post's computed path if you store it (optional)
    // 2) No DB change needed for relations because they are via category_id
    // Only return updated category
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ message: 'Güncelleme başarısız' }, { status: 500 })
  }
}

