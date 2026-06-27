import { blogPosts } from '@/lib/blog-data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PredinexLogo } from '@/components/PredinexLogo';
import { ArrowLeft, ArrowRight, Calendar, User } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag).replace(/-/g, ' ');

  return {
    title: `${decodedTag} Articles | Predinex Journal`,
    description: `Read all clinical articles, research, and guides related to ${decodedTag} at Predinex.`,
    alternates: {
      canonical: `/blog/category/${tag}`,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag).replace(/-/g, ' ');

  const filteredPosts = blogPosts.filter((post) => 
    post.tags.some((t) => t.toLowerCase() === decodedTag.toLowerCase())
  );

  if (filteredPosts.length === 0) {
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
        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-teal-500 font-bold hover:text-teal-400 transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Journal
          </Link>

          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 capitalize">
              Topic: <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">{decodedTag}</span>
            </h1>
            <p className="text-xl text-gray-400">
              Exploring all clinical research and actionable guides related to {decodedTag}.
            </p>
          </div>

          <div className="space-y-8">
            {filteredPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <article className="group relative bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-all duration-300 hover:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/10 overflow-hidden">
                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                    <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-teal-400 transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-400 leading-relaxed mb-6">
                    {post.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-2">
                      {post.tags.map((t) => (
                        <span key={t} className="px-3 py-1 bg-black/50 border border-white/10 rounded-full text-xs font-bold text-gray-300">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-teal-400 font-bold group-hover:translate-x-2 transition-transform">
                      Read Article <ArrowRight size={16} />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
