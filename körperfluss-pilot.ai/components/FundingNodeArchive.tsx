import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FundingNode } from '../types';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { 
  ArchiveBoxIcon, 
  ArrowPathIcon, 
  MagnifyingGlassIcon, 
  InformationCircleIcon, 
  BuildingOfficeIcon, 
  TagIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  LinkIcon,
  ArrowTopRightOnSquareIcon
} from './Icons';

interface FundingNodeArchiveProps {
  nodes: FundingNode[];
  setNodes: React.Dispatch<React.SetStateAction<FundingNode[]>>;
}

type SortOption = 'label' | 'group' | 'status';

const AWS_ARCHIVE_DATA: FundingNode[] = [
  { id: 'aws-seed-innovative', type: 'program', label: 'aws Seedfinancing - Innovative Solutions', group: 'AWS', status: 'completed', isArchived: true, details: { description: 'Finanzierung für innovative Gründungsideen mit gesellschaftlichem Mehrwert.', amount: 'bis €400.000', link: 'https://www.aws.at' } },
  { id: 'aws-preseed-deeptech', type: 'program', label: 'aws Preseed - Deep Tech', group: 'AWS', status: 'completed', isArchived: true, details: { description: 'Finanzierung für Deep Tech Unternehmen in der Vorgründungsphase.', amount: 'bis €150.000', link: 'https://www.aws.at' } },
  { id: 'aws-garantie', type: 'program', label: 'aws Garantie', group: 'AWS', status: 'completed', isArchived: true, details: { description: 'Sicherheiten für Bankkredite.', amount: 'bis €2.500.000', link: 'https://www.aws.at' } },
  { id: 'aws-erp-kredit', type: 'program', label: 'aws erp-Kredit', group: 'AWS', status: 'completed', isArchived: true, details: { description: 'Zinsgünstige Kredite für Investitionen.', amount: 'ab €10.000', link: 'https://www.aws.at' } },
  { id: 'aws-seed-deeptech', type: 'program', label: 'aws Seedfinancing - Deep Tech', group: 'AWS', status: 'completed', isArchived: true, details: { description: 'Finanzierung für hochtechnologische Produkte.', amount: 'bis €400.000', link: 'https://www.aws.at' } },
  { id: 'aws-preseed-innovative', type: 'program', label: 'aws Preseed - Innovative Solutions', group: 'AWS', status: 'completed', isArchived: true, details: { description: 'Finanzierung für erste Proof of Concepts.', amount: 'bis €150.000', link: 'https://www.aws.at' } },
  { id: 'aws-first-inkubator', type: 'program', label: 'aws First Inkubator', group: 'AWS', status: 'completed', isArchived: true, details: { description: 'Coaching und finanzielle Unterstützung.', amount: 'Coaching + Finanzierung', link: 'https://www.aws.at' } },
  { id: 'aws-eigenkapital', type: 'program', label: 'aws Eigenkapital', group: 'AWS', status: 'completed', isArchived: true, details: { description: 'Risikokapital für Startups.', amount: 'Risikokapital', link: 'https://www.aws.at' } },
  { id: 'aws-innovationsschutz', type: 'program', label: 'aws Innovationsschutz', group: 'AWS', status: 'completed', isArchived: true, details: { description: 'Sicherung und Verteidigung von geistigem Eigentum.', amount: 'IP-Strategie', link: 'https://www.aws.at' } },
  { id: 'aws-wachstumsinvestition', type: 'program', label: 'aws Wachstumsinvestition', group: 'AWS', status: 'completed', isArchived: true, details: { description: 'Unterstützung bei Wachstums- und F&E&I-Projekten.', amount: 'Wachstum', link: 'https://www.aws.at' } },
  { id: 'aws-digitalisierung', type: 'program', label: 'aws Digitalisierung', group: 'AWS', status: 'completed', isArchived: true, details: { description: 'Digitalisierung von Unternehmensprozessen.', amount: 'Digitalisierung', link: 'https://www.aws.at' } },
  { id: 'aws-energie-klima', type: 'program', label: 'aws Energie und Klima', group: 'AWS', status: 'completed', isArchived: true, details: { description: 'Einführung von Energie-Management-Systemen.', amount: 'Energie-Management', link: 'https://www.aws.at' } },
  { id: 'aws-industry-startup', type: 'program', label: 'aws Industry-Startup.Net', group: 'AWS', status: 'completed', isArchived: true, details: { description: 'Matching-Service für Startups und Corporates.', amount: 'Matching', link: 'https://www.aws.at' } },
  { id: 'aws-i2-business-angels', type: 'program', label: 'aws i2 Business Angels', group: 'AWS', status: 'completed', isArchived: true, details: { description: 'Start-up – Investoren Matching-Service.', amount: 'Matching', link: 'https://www.aws.at' } },
  { id: 'aws-gin', type: 'program', label: 'Global Incubator Network Austria (GIN)', group: 'AWS', status: 'completed', isArchived: true, details: { description: 'Verbindet Start-ups mit Asien.', amount: 'International', link: 'https://www.aws.at' } },
  { id: 'aws-ki-marktplatz', type: 'program', label: 'aws KI-Marktplatz', group: 'AWS', status: 'completed', isArchived: true, details: { description: 'Plattform für Künstliche Intelligenz.', amount: 'KI-Integration', link: 'https://www.aws.at' } },
];

const FundingNodeArchive: React.FC<FundingNodeArchiveProps> = ({ nodes, setNodes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('label');
  const [filterGroup, setFilterGroup] = useState<string>('All');
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);

  const allArchivedNodes = useMemo(() => {
    const fromProps = nodes.filter(n => n.isArchived);
    const combined = [...fromProps];
    AWS_ARCHIVE_DATA.forEach(awsNode => {
      if (!combined.some(n => n.id === awsNode.id)) {
        combined.push(awsNode);
      }
    });
    return combined;
  }, [nodes]);

  const groups = useMemo(() => ['All', ...new Set(allArchivedNodes.map(n => n.group))], [allArchivedNodes]);

  const filteredNodes = useMemo(() => {
    return allArchivedNodes
      .filter(node => {
        const matchesSearch = node.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             node.group.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGroup = filterGroup === 'All' || node.group === filterGroup;
        return matchesSearch && matchesGroup;
      })
      .sort((a, b) => {
        if (sortBy === 'label') return a.label.localeCompare(b.label);
        if (sortBy === 'group') return a.group.localeCompare(b.group);
        if (sortBy === 'status') return a.status.localeCompare(b.status);
        return 0;
      });
  }, [allArchivedNodes, searchTerm, filterGroup, sortBy]);

  const handleRestore = async (nodeId: string) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, isArchived: false } : n));
    try {
      const nodeRef = doc(db, 'nodes', nodeId);
      await updateDoc(nodeRef, { isArchived: false });
    } catch (error) {
      console.error("Error restoring node:", error);
    }
  };

  const toggleExpand = (nodeId: string) => {
    setExpandedNodeId(expandedNodeId === nodeId ? null : nodeId);
  };

  return (
    <div className="h-full flex flex-col space-y-6 text-white font-sans selection:bg-brand-primary/30 p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-primary">
            <ArchiveBoxIcon className="w-5 h-5" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">System Archive // M4-CORE</span>
          </div>
          <h1 className="text-5xl font-light tracking-tight italic font-serif">Förder-Archiv</h1>
          <p className="text-white/40 text-[11px] font-mono max-w-md uppercase tracking-wider">
            Historische Daten und inaktive Förderknoten der M4-Architektur.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-primary transition-colors" />
            <input 
              type="text" 
              placeholder="SEARCH_QUERY..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-sm text-[10px] font-mono tracking-wider focus:ring-1 focus:ring-brand-primary/20 focus:border-brand-primary/40 outline-none transition-all w-64 placeholder:text-white/10 uppercase"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded-sm px-3 py-1.5 gap-3">
            <ArrowsUpDownIcon className="w-3.5 h-3.5 text-white/20" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-[10px] font-mono uppercase tracking-wider text-white/60 outline-none cursor-pointer"
            >
              <option value="label" className="bg-neutral-900">NAME</option>
              <option value="group" className="bg-neutral-900">CATEGORY</option>
              <option value="status" className="bg-neutral-900">STATUS</option>
            </select>
          </div>

          {/* Filter */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded-sm px-3 py-1.5 gap-3">
            <FunnelIcon className="w-3.5 h-3.5 text-white/20" />
            <select 
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="bg-transparent text-[10px] font-mono uppercase tracking-wider text-white/60 outline-none cursor-pointer"
            >
              {groups.map(g => (
                <option key={g} value={g} className="bg-neutral-900">{g.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Table */}
      <div className="flex-grow bg-black/20 border border-white/10 rounded-sm overflow-hidden flex flex-col shadow-2xl backdrop-blur-sm">
        <div className="overflow-y-auto flex-grow custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-black z-20 border-b border-white/20">
              <tr>
                <th className="px-8 py-4 text-[11px] font-serif italic text-white/50 uppercase tracking-[0.2em] border-r border-white/10">Programm & Details</th>
                <th className="px-8 py-4 text-[11px] font-serif italic text-white/50 uppercase tracking-[0.2em] border-r border-white/10">Institution</th>
                <th className="px-8 py-4 text-[11px] font-serif italic text-white/50 uppercase tracking-[0.2em] border-r border-white/10">Status</th>
                <th className="px-8 py-4 text-[11px] font-serif italic text-white/50 uppercase tracking-[0.2em] text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <AnimatePresence mode="popLayout">
                {filteredNodes.length === 0 ? (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={4} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 bg-white/5 rounded-sm flex items-center justify-center border border-white/10">
                          <ArchiveBoxIcon className="w-10 h-10 text-white/10" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xl font-serif italic tracking-tight uppercase">Keine Ergebnisse</p>
                          <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Passen Sie Ihre Filter oder Suchbegriffe an.</p>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filteredNodes.map((node, idx) => (
                    <React.Fragment key={node.id}>
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.01 }}
                        className={`group cursor-pointer transition-all duration-200 border-b border-white/5 ${expandedNodeId === node.id ? 'bg-white text-black' : 'hover:bg-white/5'}`}
                        onClick={() => toggleExpand(node.id)}
                      >
                        <td className="px-8 py-4 border-r border-white/10">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-sm flex items-center justify-center transition-all duration-300 border ${expandedNodeId === node.id ? 'bg-black border-black text-white' : 'bg-white/5 border-white/10 text-white/30 group-hover:border-white/40 group-hover:text-white'}`}>
                              <TagIcon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 space-y-0.5">
                              <div className={`font-bold text-sm tracking-tight truncate max-w-md uppercase ${expandedNodeId === node.id ? 'text-black' : 'text-white'}`}>
                                {node.label}
                              </div>
                              <div className={`flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest ${expandedNodeId === node.id ? 'text-black/60' : 'text-white/40'}`}>
                                <span>REF: {node.id.split('-').pop()}</span>
                                <span className="w-1 h-1 rounded-full bg-current opacity-20" />
                                <div className="flex items-center gap-1">
                                  {expandedNodeId === node.id ? 'CLOSE' : 'EXPAND'}
                                  <ChevronDownIcon className={`w-3 h-3 transition-transform duration-300 ${expandedNodeId === node.id ? 'rotate-180' : ''}`} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-4 border-r border-white/10">
                          <div className={`flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-wider ${expandedNodeId === node.id ? 'text-black/80' : 'text-white/60'}`}>
                            <BuildingOfficeIcon className="w-3.5 h-3.5" />
                            {node.group}
                          </div>
                        </td>
                        <td className="px-8 py-4 border-r border-white/10">
                          <div className="flex items-center">
                            <span className={`px-2 py-0.5 rounded-sm text-[9px] font-mono uppercase tracking-widest border ${
                              node.status === 'completed' 
                                ? (expandedNodeId === node.id ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20')
                                : (expandedNodeId === node.id ? 'bg-black/10 text-black border-black/20' : 'bg-white/5 text-white/30 border-white/10')
                            }`}>
                              {node.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestore(node.id);
                            }}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest border rounded-sm transition-all duration-200 ${
                              expandedNodeId === node.id 
                                ? 'bg-black text-white border-black hover:bg-black/80' 
                                : 'text-brand-primary bg-brand-primary/5 border-brand-primary/20 hover:bg-brand-primary hover:text-white'
                            }`}
                          >
                            <ArrowPathIcon className="w-3 h-3" />
                            RESTORE
                          </motion.button>
                        </td>
                      </motion.tr>
                      
                      {/* Expanded Details Section */}
                      <AnimatePresence>
                        {expandedNodeId === node.id && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white/[0.01]"
                          >
                            <td colSpan={4} className="p-0 border-b border-white/10">
                              <div className="px-24 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 bg-black/40 text-white">
                                {/* Left Column: Description */}
                                <div className="lg:col-span-5 space-y-8">
                                  <div className="space-y-4">
                                    <h4 className="text-[11px] font-serif italic text-brand-primary uppercase tracking-[0.3em]">Programmbeschreibung</h4>
                                    <p className="text-sm text-white/70 leading-relaxed font-light">
                                      {node.details?.description || 'Für dieses Programm liegt keine detaillierte Beschreibung im Archiv vor.'}
                                    </p>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
                                    <div className="p-4 bg-black/40 space-y-1">
                                      <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Max. Volumen</span>
                                      <div className="text-lg font-mono text-white/90 tracking-tight">{node.details?.amount || 'N/A'}</div>
                                    </div>
                                    <div className="p-4 bg-black/40 space-y-1">
                                      <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Kategorie</span>
                                      <div className="text-lg font-mono text-white/90 tracking-tight">{node.group}</div>
                                    </div>
                                  </div>

                                  {node.details?.link && (
                                    <a 
                                      href={node.details.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-sm group/link hover:bg-brand-primary transition-all duration-300"
                                    >
                                      <div className="flex items-center gap-3">
                                        <LinkIcon className="w-5 h-5 text-brand-primary group-hover/link:text-white" />
                                        <span className="text-[10px] font-mono uppercase tracking-widest group-hover/link:text-white">Ausschreibung ansehen</span>
                                      </div>
                                      <ArrowTopRightOnSquareIcon className="w-4 h-4 text-brand-primary group-hover/link:text-white" />
                                    </a>
                                  )}
                                </div>

                                {/* Middle Column: Documents */}
                                <div className="lg:col-span-3 space-y-6">
                                  <h4 className="text-[11px] font-serif italic text-white/30 uppercase tracking-[0.3em]">Dokumentation</h4>
                                  <div className="space-y-2">
                                    {node.details?.documents && node.details.documents.length > 0 ? (
                                      node.details.documents.map((doc, dIdx) => (
                                        <a 
                                          key={dIdx}
                                          href={doc.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-sm transition-all group/doc"
                                        >
                                          <DocumentTextIcon className="w-4 h-4 text-white/20 group-hover/doc:text-brand-primary" />
                                          <span className="text-[10px] font-mono text-white/60 truncate uppercase tracking-wider">{doc.name}</span>
                                        </a>
                                      ))
                                    ) : (
                                      <div className="py-8 px-4 border border-dashed border-white/10 rounded-sm flex flex-col items-center justify-center text-center space-y-2">
                                        <DocumentTextIcon className="w-6 h-6 text-white/10" />
                                        <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Keine Dokumente</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Right Column: Comments */}
                                <div className="lg:col-span-4 space-y-6">
                                  <h4 className="text-[11px] font-serif italic text-white/30 uppercase tracking-[0.3em]">Interne Notizen</h4>
                                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                                    {node.details?.documents?.some(d => d.comments?.length) ? (
                                      node.details.documents.flatMap(d => d.comments || []).map((comment, cIdx) => (
                                        <div key={comment.id || cIdx} className="p-4 bg-white/5 border border-white/5 rounded-sm space-y-3">
                                          <p className="text-[11px] font-mono text-white/70 leading-relaxed italic">"{comment.text}"</p>
                                          <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                            <div className="flex items-center gap-2">
                                              <div className="w-5 h-5 rounded-none bg-brand-primary/20 flex items-center justify-center text-[8px] font-mono text-brand-primary uppercase">
                                                {comment.author[0]}
                                              </div>
                                              <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider">{comment.author}</span>
                                            </div>
                                            <span className="text-[9px] font-mono text-white/20">{new Date(comment.timestamp).toLocaleDateString('de-DE')}</span>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="py-8 px-4 border border-dashed border-white/10 rounded-sm flex flex-col items-center justify-center text-center space-y-2">
                                        <ChatBubbleLeftIcon className="w-6 h-6 text-white/10" />
                                        <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Keine Notizen</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {/* Footer Statistics */}
        <div className="px-8 py-4 bg-black border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                {filteredNodes.length} NODES_LOADED
              </span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">
                SRC: AWS_CORE // INTERNAL_DB
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">
            <InformationCircleIcon className="w-3.5 h-3.5" />
            <span>SYNC_DATE: {new Date().toLocaleDateString('de-DE')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingNodeArchive;

