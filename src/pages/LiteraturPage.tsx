
import React, { useState, useMemo } from 'react';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { literatureData } from '../data/literatureData';
import { AcademicCapIcon, SearchIcon, FilterIcon, ArrowRightIcon } from '../components/IconComponents';

export const LiteraturPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFachbereich, setSelectedFachbereich] = useState<string>('Alle');
  const [selectedDocType, setSelectedDocType] = useState<string>('Alle');

  // Extract unique filters
  const fachbereiche = useMemo(() => {
    const areas = new Set(literatureData.map(item => item.Fachbereich));
    return ['Alle', ...Array.from(areas).sort()];
  }, []);

  const docTypes = useMemo(() => {
    const types = new Set(literatureData.map(item => item.Dokumenttyp));
    return ['Alle', ...Array.from(types).sort()];
  }, []);

  // Filter logic
  const filteredData = useMemo(() => {
    return literatureData.filter(item => {
      const matchesSearch = 
        item.Titel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Autoren.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Schlagwoerter.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFachbereich = selectedFachbereich === 'Alle' || item.Fachbereich === selectedFachbereich;
      const matchesDocType = selectedDocType === 'Alle' || item.Dokumenttyp === selectedDocType;

      return matchesSearch && matchesFachbereich && matchesDocType;
    });
  }, [searchTerm, selectedFachbereich, selectedDocType]);

  return (
    <div className="animate-fadeInUp bg-transparent min-h-screen pt-40 pb-32 relative overflow-hidden">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[200px] opacity-40"></div>
         <div className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-brand-primary/10 rounded-full blur-[250px] opacity-30"></div>
      </div>

      {/* Header */}
      <Section 
        title="Evidenz-Engine: Studien-Datenbank"
        subtitle="Durchsuchen Sie unsere kuratierte Sammlung von 234 hochwertigen Publikationen, S3-Leitlinien und klinischen Studien für höchste diagnostische Präzision."
        containerClassName="py-0 relative z-10 mb-24"
      />

      {/* Search & Filters */}
      <Section containerClassName="py-12 sticky top-24 z-30 relative z-10">
        <div className="glass-dark !p-8 md:!p-10 rounded-[32px] border-white/5 shadow-2xl flex flex-col lg:flex-row gap-6 items-center justify-between backdrop-blur-3xl">
          
          {/* Search Input */}
          <div className="relative w-full lg:w-1/3 group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-zinc-500 group-focus-within:text-brand-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Suchen nach Titel, Autor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-14 pr-6 py-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-brand-primary/50 transition-all font-light tracking-wide text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
            <div className="relative w-full sm:w-auto group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                   <FilterIcon className="h-5 w-5 text-brand-primary opacity-60 group-focus-within:opacity-100" />
                </div>
                <select
                    value={selectedFachbereich}
                    onChange={(e) => setSelectedFachbereich(e.target.value)}
                    className="block w-full pl-14 pr-12 py-4 bg-black/40 border border-white/5 text-white rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-primary/50 appearance-none cursor-pointer font-light tracking-wide text-sm transition-all"
                >
                    {fachbereiche.map(fb => (
                    <option key={fb} value={fb} className="bg-zinc-900">{fb}</option>
                    ))}
                </select>
            </div>

            <div className="relative w-full sm:w-auto group">
                 <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                   <AcademicCapIcon className="h-5 w-5 text-brand-primary opacity-60 group-focus-within:opacity-100" />
                </div>
                <select
                    value={selectedDocType}
                    onChange={(e) => setSelectedDocType(e.target.value)}
                    className="block w-full pl-14 pr-12 py-4 bg-black/40 border border-white/5 text-white rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-primary/50 appearance-none cursor-pointer font-light tracking-wide text-sm transition-all"
                >
                    {docTypes.map(dt => (
                    <option key={dt} value={dt} className="bg-zinc-900">{dt}</option>
                    ))}
                </select>
            </div>
          </div>
        </div>
      </Section>

      {/* Results List */}
      <Section containerClassName="py-12 relative z-10">
        <div className="mb-10 text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 ml-2">
            Zeige {filteredData.length} von 234 verfügbaren Publikationen
        </div>
        
        <div className="grid grid-cols-1 gap-12">
          {filteredData.map((pub) => (
            <Card key={pub.id} className="flex flex-col md:flex-row gap-10 glass-dark !p-12 md:!p-16 rounded-[48px] border-white/5 hover:scale-[1.01] transition-all duration-1000 group shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
              <div className="flex-grow">
                <div className="flex flex-wrap gap-3 mb-8">
                    <span className="px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-[0.1em] font-black bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                        {pub.Fachbereich}
                    </span>
                    <span className="px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-[0.1em] font-bold text-zinc-500 bg-white/5 border border-white/5">
                        {pub.Unterkategorie}
                    </span>
                     <span className="px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-[0.1em] font-bold text-zinc-400 bg-white/10 border border-white/10">
                        {pub.Dokumenttyp}
                    </span>
                </div>
                <h3 className="text-3xl font-bold font-serif text-white mb-4 tracking-tight leading-tight group-hover:text-brand-primary transition-colors duration-700">
                    {pub.Titel}
                </h3>
                <p className="text-sm text-zinc-500 mb-6 italic font-light tracking-wide">
                    {pub.Autoren} ({pub.Jahr})
                </p>
                <p className="text-sm text-zinc-400 font-light leading-relaxed tracking-wide mb-8 max-w-4xl">
                    {pub.Abstract}
                </p>
                {pub.Schlagwoerter && (
                    <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">
                        <span className="text-zinc-500">Keywords:</span> {pub.Schlagwoerter}
                    </p>
                )}
              </div>
              
              <div className="flex flex-col justify-between items-end min-w-[240px] gap-8 border-l border-white/5 pl-0 md:pl-12 pt-8 md:pt-0 border-t md:border-t-0">
                <div className="text-right w-full">
                    <div className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-600 mb-3">Quelle</div>
                    <div className="text-lg font-serif font-bold text-white mb-2">{pub.Herausgeber}</div>
                    <div className={`text-[10px] uppercase tracking-widest font-black ${pub.Open_Access?.includes('Yes') || pub.Open_Access?.includes('Ja') ? 'text-green-500' : 'text-orange-500'}`}>
                        Open Access: {pub.Open_Access}
                    </div>
                </div>
                
                <div className="w-full">
                    {pub.Downloadlink ? (
                        <Button 
                            onClick={() => window.open(pub.Downloadlink, '_blank')} 
                            variant="primary" 
                            size="sm" 
                            className="w-full py-4 text-[10px] uppercase tracking-[0.3em] font-black shadow-xl shadow-brand-primary/10"
                        >
                            Zum Volltext <ArrowRightIcon className="w-4 h-4 ml-3" />
                        </Button>
                    ) : (
                         <Button disabled variant="secondary" size="sm" className="w-full py-4 text-[10px] uppercase tracking-[0.3em] font-black opacity-30 cursor-not-allowed grayscale">
                            Kein Link verfügbar
                        </Button>
                    )}
                </div>
              </div>
            </Card>
          ))}

          {filteredData.length === 0 && (
            <div className="text-center py-32 glass-dark rounded-[48px] border-white/5">
                <p className="text-2xl text-zinc-500 font-serif mb-8">Keine Publikationen gefunden.</p>
                <Button 
                    onClick={() => { setSearchTerm(''); setSelectedFachbereich('Alle'); setSelectedDocType('Alle'); }}
                    variant="outline"
                    className="px-12 py-6 text-[10px] uppercase tracking-[0.3em] font-bold"
                >
                    Filter zurücksetzen
                </Button>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
};
