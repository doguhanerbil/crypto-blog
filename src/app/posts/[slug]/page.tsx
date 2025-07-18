import { getPostBySlug } from '@/lib/strapi';
import { getStrapiMedia } from '@/lib/utils';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, User, Share2, Bookmark, Heart } from 'lucide-react';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const imageUrl = getStrapiMedia(post.coverImage?.data?.url);
  const category = post.category?.data;
  const tags = post.tags?.data || [];

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Header */}
        <article className="mb-12">
          {/* Category */}
          {category && (
            <div className="mb-4">
              <Badge variant="secondary" className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800">
                {category.name}
              </Badge>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Author and Meta */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" alt="Admin" />
                <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                  A
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Admin</p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                  <span>2 saat önce</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>5 dk okuma</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Beğen
              </Button>
              <Button variant="ghost" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Kaydet
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Paylaş
              </Button>
            </div>
          </div>

          {/* Cover Image */}
          {imageUrl && (
            <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={imageUrl}
                alt={post.coverImage?.data?.alternativeText || `Cover image for ${post.title}`}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div 
              className="text-gray-900 dark:text-white leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Etiketler</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="text-sm bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Articles */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Benzer Yazılar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Placeholder for related articles */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                Bitcoin'in Geleceği: 2024 Analizi
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Bitcoin'in 2024 yılındaki performansı ve gelecek tahminleri...
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                Ethereum 2.0: Değişim Süreci
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Ethereum'un proof-of-stake'e geçiş süreci ve etkileri...
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
} 