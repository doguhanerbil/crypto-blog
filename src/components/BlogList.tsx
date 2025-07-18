import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Post } from '@/lib/strapi';
import { getStrapiMedia } from '@/lib/utils';
import { Clock, User } from 'lucide-react';

interface BlogListProps {
  posts: Post[];
  title?: string;
  subtitle?: string;
}

export default function BlogList({ posts, title, subtitle }: BlogListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">Henüz yazı bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => {
        if (!post) {
          console.warn('Skipping a malformed post object received from API:', post);
          return null;
        }

        const imageUrl = getStrapiMedia(post.coverImage?.data?.url);
        const category = post.category?.data;
        const tags = post.tags?.data || [];

        return (
          <article key={post.id} className="group">
            <Link href={`/posts/${post.slug}`} className="block">
              <div className="flex gap-6">
                {/* Image */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-32 relative overflow-hidden rounded-lg">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={post.coverImage?.data?.alternativeText || `Cover image for ${post.title}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-400 dark:text-gray-600 text-sm">Görsel Yok</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Category */}
                  {category && (
                    <div className="mb-2">
                      <Badge variant="secondary" className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800">
                        {category.name}
                      </Badge>
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      <span>Admin</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>5 dk okuma</span>
                    </div>
                    <span>•</span>
                    <span>2 saat önce</span>
                  </div>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tags.slice(0, 2).map((tag) => (
                        <Badge key={tag.id} variant="outline" className="text-xs bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                          {tag.name}
                        </Badge>
                      ))}
                      {tags.length > 2 && (
                        <Badge variant="outline" className="text-xs bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                          +{tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
} 