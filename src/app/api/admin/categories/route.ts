import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json()
    if (!name) return NextResponse.json({ message: 'Name required' }, { status: 400 })
    let baseSlug = slugify(name)
    let slug = baseSlug

    // ensure unique slug by appending -n if needed
    let i = 1
    while (true) {
      const { data: existing } = await supabaseAdmin
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()
      if (!existing) break
      slug = `${baseSlug}-${i++}`
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert({ name, slug, description })
      .select()
      .single()

    if (error) return NextResponse.json({ message: error.message }, { status: 400 })
    return NextResponse.json(data, { status: 201 })
  } catch (e) {
    return NextResponse.json({ message: 'Failed to create category' }, { status: 500 })
  }
}

