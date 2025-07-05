export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'USER';
  image?: string;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'DRAFT' | 'PUBLISHED';
  type: 'ARTICLE' | 'ANALYSIS' | 'VIDEO' | 'CHART';
  authorId: string;
  featuredImage?: string;
  media?: MediaItem[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaItem {
  id: number;
  url: string;
  type: 'IMAGE' | 'VIDEO' | 'FILE' | 'CHART';
  altText?: string;
  filename: string;
  size: number;
  order: number;
}

// Junction tables for many-to-many relationships
export interface PostCategory {
  postId: string;
  categoryId: string;
}

export interface PostTag {
  postId: string;
  tagId: string;
} 