import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Post } from '@/lib/strapi';
import { getStrapiMedia } from '@/lib/utils';

interface BlogListProps {
  posts: Post[];
  title?: string;
  subtitle?: string;
}

export default function BlogList({ posts, title, subtitle }: BlogListProps) {
  if (!posts || posts.length === 0) {
    return <p className="text-center text-muted-foreground">Henüz yazı bulunmuyor.</p>;
  }

  return (
    <section className="container mx-auto px-4 py-12">
      {title && <h2 className="text-3xl font-bold text-center mb-2">{title}</h2>}
      {subtitle && <p className="text-muted-foreground text-center mb-8">{subtitle}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => {
          if (!post) {
            console.warn('Skipping a malformed post object received from API:', post);
            return null;
          }

          const imageUrl = getStrapiMedia(post.coverImage?.data?.url);
          const category = post.category?.data;
          const tags = post.tags?.data || [];

          return (
            <Link href={`/posts/${post.slug}`} key={post.id} className="block group">
              <Card className="flex flex-col h-full overflow-hidden hover:shadow-xl transition-shadow duration-300 rounded-lg">
                <CardHeader className="p-0">
                  <div className="relative w-full h-48 overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={post.coverImage?.data?.alternativeText || `Cover image for ${post.title}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                         <span className="text-muted-foreground text-sm">Görsel Yok</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                  {category && (
                    <Badge variant="default" className="mb-2">
                      {category.name}
                    </Badge>
                  )}
                  <CardTitle className="text-xl font-bold mb-2 leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardContent>
                <CardFooter className="p-6 pt-0 mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
} 