import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Section } from '../components/Section';
import { blogPosts } from '../data/blogPosts';
import { Button } from '../components/Button';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" />;
  }

  return (
    <div className="animate-fadeInUp bg-black min-h-screen pt-40 pb-32 relative overflow-hidden">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[200px] opacity-40"></div>
         <div className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-brand-primary/10 rounded-full blur-[250px] opacity-30"></div>
      </div>

      <Section containerClassName="py-0 relative z-10" contentClassName="container mx-auto px-8 max-w-4xl">
        <div className="text-center mb-24">
          <p className="text-[10px] text-brand-primary font-black uppercase tracking-[0.4em] mb-8 opacity-80">{post.tags.join(' / ')}</p>
          <h1 className="text-5xl md:text-7xl font-bold font-serif text-white tracking-tight leading-tight mb-8">{post.title}</h1>
          <p className="text-sm text-zinc-500 font-light tracking-wide italic">
            Von <span className="text-white font-medium not-italic">{post.author}</span> am {post.date}
          </p>
        </div>
        
        <div className="glass-dark !p-12 md:!p-20 rounded-[60px] border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
          <div 
            className="prose prose-invert prose-lg md:prose-xl max-w-none mx-auto text-zinc-400 font-light leading-relaxed tracking-wide
              prose-headings:font-serif prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
              prose-strong:text-white prose-strong:font-bold
              prose-a:text-brand-primary prose-a:no-underline hover:prose-a:text-white transition-colors
              prose-img:rounded-[40px] prose-img:shadow-2xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        <div className="text-center mt-24">
          <Button to="/blog" variant="secondary" size="lg" className="px-12 py-6 text-[10px] uppercase tracking-[0.4em] font-black">
            Zurück zum Blog
          </Button>
        </div>
      </Section>
    </div>
  );
};
