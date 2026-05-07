import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { blogPosts } from '../data/blogPosts';
import { ArrowRightIcon } from '../components/IconComponents';

export const BlogPage: React.FC = () => {
  return (
    <div className="animate-fadeInUp bg-transparent min-h-screen pt-40 pb-32 relative overflow-hidden">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[200px] opacity-40"></div>
         <div className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-brand-primary/10 rounded-full blur-[250px] opacity-30"></div>
      </div>

      <Section containerClassName="py-0 relative z-10 mb-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold font-serif text-white mb-8 tracking-tight leading-tight">Wissen & Ratgeber</h1>
          <p className="text-xl md:text-2xl text-zinc-500 font-light leading-relaxed tracking-wide">
            Wertvolle Tipps, Artikel und tiefgehende Einblicke rund um ganzheitliche Gesundheit, funktionelle Bewegung und Calisthenics.
          </p>
        </div>
      </Section>

      <Section containerClassName="py-0 pb-16 md:pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {blogPosts.map((post) => (
            <Link to={`/blog/${post.slug}`} key={post.slug} className="block group">
              <Card className="glass-dark !p-10 rounded-[40px] border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col h-full hover:border-brand-primary/20 transition-all duration-700">
                <div className="flex flex-col flex-grow">
                  <p className="text-[10px] text-brand-primary font-black uppercase tracking-[0.3em] mb-6 opacity-80">{post.tags.join(' • ')}</p>
                  <h3 className="text-2xl font-bold font-serif text-white mb-6 flex-grow tracking-tight group-hover:text-brand-primary transition-colors duration-700">{post.title}</h3>
                  <p className="text-sm text-zinc-500 font-light leading-relaxed mb-10 tracking-wide">{post.excerpt}</p>
                  <div className="mt-auto text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] flex items-center group-hover:text-white transition-colors duration-700">
                    Weiterlesen <ArrowRightIcon className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
};
