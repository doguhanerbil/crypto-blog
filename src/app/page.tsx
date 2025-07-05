import BlogList from '@/components/BlogList';
import Hero from '@/components/Hero';
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
    <main>
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Son Yazılar</h2>
        <BlogList posts={posts} />
      </div>
    </main>
  );
}
