import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FundingNode } from '../types';
import { MagnifyingGlassIcon } from './Icons';
import { semanticSearch } from '../services/geminiService';

interface GlobalSearchProps {
  nodes: FundingNode[];
  onNodeSelect: (node: FundingNode) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ nodes, onNodeSelect }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [aiResults, setAiResults] = useState<FundingNode[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const filteredNodes = useMemo(() => {
    if (!query.trim()) {
      return [];
    }
    const lowerCaseQuery = query.toLowerCase();
    return nodes
      .filter(node =>
        node.label.toLowerCase().includes(lowerCaseQuery) ||
        (node.details.description && node.details.description.toLowerCase().includes(lowerCaseQuery))
      )
      .slice(0, 7); // Limit results to avoid a huge list
  }, [query, nodes]);

  const showResults = isFocused && (filteredNodes.length > 0 || aiResults.length > 0 || isSearching);

  const handleSelect = (node: FundingNode) => {
    onNodeSelect(node);
    setQuery('');
    setIsFocused(false);
    setAiResults([]);
  };

  const handleSemanticSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const ids = await semanticSearch(query, nodes);
      const results = nodes.filter(n => ids.includes(n.id));
      setAiResults(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle clicks outside the component to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const highlightMatch = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    // Escape special regex characters from the highlight string
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <strong key={i} className="font-bold text-brand-secondary dark:text-brand-accent">
              {part}
            </strong>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="relative w-80" ref={searchContainerRef}>
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <div className="h-5 w-5 text-gray-400">
            <MagnifyingGlassIcon />
          </div>
        </div>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSemanticSearch();
            }
          }}
          placeholder="Suche nach Knoten... (Enter für KI-Suche)"
          className="block w-full rounded-md border-0 bg-white dark:bg-gray-800 py-2 pl-10 pr-10 text-gray-900 dark:text-gray-200 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-secondary sm:text-sm"
        />
        {isSearching && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="animate-spin h-5 w-5 text-brand-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>
      {showResults && (
        <ul className="absolute z-20 mt-1 max-h-80 w-full overflow-auto rounded-md bg-white dark:bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-gray-200 dark:border-gray-700">
          {filteredNodes.length > 0 && (
            <li className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-gray-800">
              Direkte Treffer
            </li>
          )}
          {filteredNodes.map(node => (
            <li
              key={`direct-${node.id}`}
              onClick={() => handleSelect(node)}
              className="relative cursor-pointer select-none py-2 px-4 text-gray-900 dark:text-gray-200 hover:bg-brand-accent/20 dark:hover:bg-brand-accent/30"
            >
              <div className="flex flex-col">
                <span className="block truncate font-medium">{highlightMatch(node.label, query)}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{node.group}</span>
              </div>
            </li>
          ))}

          {aiResults.length > 0 && (
            <li className="px-4 py-1 text-xs font-semibold text-brand-secondary uppercase tracking-wider bg-brand-accent/10 mt-2">
              KI-Ergebnisse
            </li>
          )}
          {aiResults.map(node => (
            <li
              key={`ai-${node.id}`}
              onClick={() => handleSelect(node)}
              className="relative cursor-pointer select-none py-2 px-4 text-gray-900 dark:text-gray-200 hover:bg-brand-accent/20 dark:hover:bg-brand-accent/30"
            >
              <div className="flex flex-col">
                <span className="block truncate font-medium">{node.label}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{node.group}</span>
              </div>
            </li>
          ))}
          
          {filteredNodes.length === 0 && aiResults.length === 0 && !isSearching && (
            <li className="px-4 py-2 text-gray-500 text-sm">Keine Ergebnisse. Drücke Enter für KI-Suche.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default GlobalSearch;
