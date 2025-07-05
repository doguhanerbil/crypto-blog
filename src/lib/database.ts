import { supabaseAdmin } from './supabase';
import type { User, Post, Category, Tag, ContactMessage, PostCategory, PostTag } from '@/types/database';

// User operations
export const userService = {
  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async findByEmail(email: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async findById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<User>) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Post operations
export const postService = {
  async create(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert([postData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async findAll(options?: {
    page?: number;
    limit?: number;
    status?: 'DRAFT' | 'PUBLISHED';
    type?: string;
    categoryId?: string;
    tagId?: string;
  }) {
    let query = supabaseAdmin
      .from('posts')
      .select(`
        *,
        author:users(name, email),
        categories:post_categories(category:categories(*)),
        tags:post_tags(tag:tags(*))
      `)
      .order('createdAt', { ascending: false });

    if (options?.status) {
      query = query.eq('status', options.status);
    }
    if (options?.type) {
      query = query.eq('type', options.type);
    }
    if (options?.categoryId) {
      query = query.eq('post_categories.categoryId', options.categoryId);
    }
    if (options?.tagId) {
      query = query.eq('post_tags.tagId', options.tagId);
    }

    if (options?.page && options?.limit) {
      const offset = (options.page - 1) * options.limit;
      query = query.range(offset, offset + options.limit - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async findBySlug(slug: string) {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select(`
        *,
        author:users(name, email),
        categories:post_categories(category:categories(*)),
        tags:post_tags(tag:tags(*))
      `)
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(slug: string, updates: Partial<Post>) {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .update(updates)
      .eq('slug', slug)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(slug: string) {
    const { error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('slug', slug);
    
    if (error) throw error;
    return true;
  }
};

// Category operations
export const categoryService = {
  async create(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert([categoryData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async findAll(activeOnly: boolean = true) {
    let query = supabaseAdmin
      .from('categories')
      .select('*')
      .order('name');

    if (activeOnly) {
      query = query.eq('isActive', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async findBySlug(slug: string) {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Tag operations
export const tagService = {
  async create(tagData: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabaseAdmin
      .from('tags')
      .insert([tagData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async findAll(activeOnly: boolean = true) {
    let query = supabaseAdmin
      .from('tags')
      .select('*')
      .order('name');

    if (activeOnly) {
      query = query.eq('isActive', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async findBySlug(slug: string) {
    const { data, error } = await supabaseAdmin
      .from('tags')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Contact message operations
export const contactService = {
  async create(messageData: Omit<ContactMessage, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .insert([messageData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async findAll(options?: { page?: number; limit?: number }) {
    let query = supabaseAdmin
      .from('contact_messages')
      .select('*')
      .order('createdAt', { ascending: false });

    if (options?.page && options?.limit) {
      const offset = (options.page - 1) * options.limit;
      query = query.range(offset, offset + options.limit - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async markAsRead(id: string) {
    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .update({ isRead: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}; 