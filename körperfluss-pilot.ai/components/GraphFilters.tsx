import React, { useState } from 'react';
import { NodeStatus, LinkType } from '../types';
import { SparklesIcon, MagnifyingGlassIcon } from './Icons';
import { parseAIFilter } from '../services/geminiService';

export interface Filters {
  groups: Set<string>;
  statuses: Set<NodeStatus>;
  linkTypes: Set<LinkType>;
  isOpen: boolean | null;
}

interface GraphFiltersProps {
  filters: Filters;
  onFilterChange: (newFilters: Filters) => void;
  allGroups: string[];
  allStatuses: NodeStatus[];
  allLinkTypes: LinkType[];
  onReset: () => void;
}

const GraphFilters: React.FC<GraphFiltersProps> = ({ filters, onFilterChange, allGroups, allStatuses, allLinkTypes, onReset }) => {
  const [aiQuery, setAiQuery] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  const handleToggle = (category: keyof Filters, value: string) => {
    if (category === 'isOpen') return;
    const newFilters = {
      groups: new Set(filters.groups),
      statuses: new Set(filters.statuses),
      linkTypes: new Set(filters.linkTypes),
      isOpen: filters.isOpen,
    };
    
    const currentSet = newFilters[category] as Set<string>;

    if (currentSet.has(value)) {
      currentSet.delete(value);
    } else {
      currentSet.add(value);
    }
    onFilterChange(newFilters);
  };

  const handleAIFilter = async () => {
    if (!aiQuery.trim()) return;
    setIsFiltering(true);
    try {
      const currentContext = `Aktuelle Filter: Gruppen=[${Array.from(filters.groups).join(', ')}], Status=[${Array.from(filters.statuses).join(', ')}], LinkTypen=[${Array.from(filters.linkTypes).join(', ')}], NurOffen=${filters.isOpen}`;
      const result = await parseAIFilter(aiQuery, allGroups, allStatuses, allLinkTypes, currentContext);
      onFilterChange({
        groups: new Set(result.groups || []),
        statuses: new Set((result.statuses || []) as NodeStatus[]),
        linkTypes: new Set((result.linkTypes || []) as LinkType[]),
        isOpen: result.isOpen !== undefined ? result.isOpen : null
      });
    } catch (error) {
      console.error("Failed to parse AI filter", error);
    } finally {
      setIsFiltering(false);
    }
  };

  return (
    <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl shadow-black/20 space-y-4">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FilterSection title="Gruppen">
            {allGroups.map(group => (
              <FilterButton key={group} label={group} isActive={filters.groups.has(group)} onClick={() => handleToggle('groups', group)} />
            ))}
          </FilterSection>
          <FilterSection title="Status">
            {allStatuses.map(status => (
              <FilterButton key={status} label={status.replace(/_/g, ' ')} isActive={filters.statuses.has(status)} onClick={() => handleToggle('statuses', status)} />
            ))}
          </FilterSection>
          <FilterSection title="Link-Typen">
            {allLinkTypes.map(type => (
              <FilterButton key={type} label={type} isActive={filters.linkTypes.has(type)} onClick={() => handleToggle('linkTypes', type)} />
            ))}
          </FilterSection>
          <FilterSection title="Offen">
            <FilterButton label="Alle" isActive={filters.isOpen === null} onClick={() => onFilterChange({ ...filters, isOpen: null })} />
            <FilterButton label="Offen" isActive={filters.isOpen === true} onClick={() => onFilterChange({ ...filters, isOpen: true })} />
            <FilterButton label="Geschlossen" isActive={filters.isOpen === false} onClick={() => onFilterChange({ ...filters, isOpen: false })} />
          </FilterSection>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/5">
          <div className="relative flex-1 w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              placeholder="KI-Filter (z.B. 'Nur offene FFG Projekte')" 
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAIFilter()}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold text-white placeholder:text-white/20 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={handleAIFilter} 
              disabled={isFiltering || !aiQuery.trim()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 disabled:opacity-50 text-[11px] font-black transition-all"
            >
              {isFiltering ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <SparklesIcon className="w-4 h-4" />
              )}
              KI Filter
            </button>
            <button onClick={onReset} className="px-4 py-2 bg-white/5 text-white/60 rounded-xl hover:bg-white/10 hover:text-white text-[11px] font-black transition-all">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => {
  const baseClasses = 'px-3 py-1 text-[10px] font-black rounded-lg transition-all border whitespace-nowrap uppercase tracking-wider';
  const activeClasses = 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20 scale-105';
  const inactiveClasses = 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white/60';
  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      {label}
    </button>
  );
};

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-2">
    <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">{title}</h4>
    <div className="flex flex-wrap gap-1.5">{children}</div>
  </div>
);

export default GraphFilters;
