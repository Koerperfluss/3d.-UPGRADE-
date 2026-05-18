import React from 'react';

interface SectionProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  containerClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  contentClassName?: string;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  children,
  containerClassName = 'py-20 md:py-32 bg-transparent relative overflow-hidden',
  titleClassName = 'text-4xl md:text-6xl lg:text-7xl font-bold font-serif text-white mb-8 text-center tracking-tighter leading-[0.9]', 
  subtitleClassName = 'text-xl md:text-2xl text-zinc-500 mb-16 md:mb-24 text-center max-w-4xl mx-auto leading-relaxed font-light tracking-wide',
  contentClassName = 'container mx-auto px-6 sm:px-8 lg:px-12 relative z-10',
  id
}) => {
  return (
    <section className={containerClassName} id={id}>
      <div className={contentClassName}>
        {title && <h2 className={titleClassName}>{title}</h2>}
        {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
        {children}
      </div>
    </section>
  );
};