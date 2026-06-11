import { blogPosts } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PredinexLogo } from '@/components/PredinexLogo';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import type { Metadata } from 'next';

// Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);
  
  if (!post) {
    return { title: 'Post Not Found | Predinex' };
  }

  return {
    title: `${post.title} | Predinex Journal`,
    description: post.description,
    keywords: post.tags,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    }
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-teal-500/30">
      <header className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <PredinexLogo />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
              All Articles
            </Link>
            <Link href="/login" className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-colors">
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6">
        <article className="max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-teal-500 font-bold hover:text-teal-400 transition-colors mb-12">
            <ArrowLeft size={16} /> Back to Journal
          </Link>

          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">
              <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10"><Calendar size={16} className="text-teal-500"/> {post.date}</span>
              <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10"><User size={16} className="text-teal-500"/> {post.author}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-400 leading-relaxed border-l-4 border-teal-500 pl-6 py-2">
              {post.description}
            </p>
          </header>

          <div 
            className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight prose-a:text-teal-400 prose-a:no-underline hover:prose-a:text-teal-300 prose-p:text-gray-300 prose-p:leading-relaxed prose-li:text-gray-300"
            dangerouslySetInnerHTML={{ __html: post.content as string }}
          />

          <hr className="my-12 border-white/10" />

          <div className="bg-gradient-to-br from-teal-900/20 to-emerald-900/20 border border-teal-500/20 rounded-[2rem] p-8 text-center">
            <h3 className="text-2xl font-black mb-4">Ready to take control of your metabolic health?</h3>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Join Predinex today to track your exact glucose response, get personalized lifestyle plans, and reverse pre-diabetes naturally.
            </p>
            <Link href="/register" className="inline-block px-8 py-4 bg-white text-black font-black rounded-xl hover:scale-105 transition-transform shadow-xl shadow-white/10">
              Start Your Free Trial
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
