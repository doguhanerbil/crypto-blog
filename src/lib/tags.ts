import { supabaseAdmin } from '@/lib/supabase/admin'

export async function getTags() {
  try {
    const { data, error } = await supabaseAdmin
      .from('tags')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching tags:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

export async function getTagBySlug(slug: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('tags')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching tag by slug:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching tag by slug:', error)
    return null
  }
}

// Admin functions
export async function getAllTags() {
  try {
    const { data, error } = await supabaseAdmin
      .from('tags')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching all tags:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching all tags:', error)
    return []
  }
}

export async function createTag(tagData: {
  name: string
  slug: string
  description?: string
}) {
  try {
    const { data, error } = await supabaseAdmin
      .from('tags')
      .insert(tagData)
      .select()
      .single()

    if (error) {
      console.error('Error creating tag:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error creating tag:', error)
    return null
  }
}

export async function updateTag(id: string, tagData: {
  name?: string
  slug?: string
  description?: string
}) {
  try {
    const { data, error } = await supabaseAdmin
      .from('tags')
      .update(tagData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating tag:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error updating tag:', error)
    return null
  }
}

export async function deleteTag(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from('tags')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting tag:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting tag:', error)
    return false
  }
} 