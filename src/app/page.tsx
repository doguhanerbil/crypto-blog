import BlogList from '@/components/BlogList';
import { getPosts } from '@/lib/strapi';

export default async function Home() {
  const posts = await getPosts();

  // --- DEBUGGING LOG ---
  console.log('--- Posts received in Home component ---');
  console.log(`Number of posts: ${posts ? posts.length : 0}`);
  if (posts && posts.length > 0) {
    console.log('First post title:', posts[0].title);
  }
  console.log('------------------------------------');

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Medium-style header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Kripto Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Kripto dünyasının en güncel haberleri ve analizleri
          </p>
        </div>
        
        {/* Blog posts in Medium style */}
        <BlogList posts={posts} />
      </div>
    </main>
  );
}
