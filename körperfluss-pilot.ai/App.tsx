import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { nodesData, linksData } from './data';
import { FundingNode, NodeStatus, LinkType } from './types';
import { db } from './firebase';
import { collection, onSnapshot, doc, getDocs, writeBatch, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  RocketLaunchIcon,
  ChartPieIcon,
  ArchiveBoxIcon,
  LightBulbIcon,
  WrenchScrewdriverIcon,
  ShareIcon,
  CalendarDaysIcon,
  SparklesIcon,
  Bars3Icon,
  ChevronUpIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon
} from './components/Icons';
import InteractiveAdvisor from './components/InteractiveAdvisor';
import FundingGraph from './components/FundingGraph';
import FundingDetails from './components/FundingDetails';
import GlobalSearch from './components/GlobalSearch';
import AIAdvisor from './components/AIAdvisor';
import Dashboard from './components/Dashboard';
import FundingArchive from './components/FundingArchive';
import FundingNodeArchive from './components/FundingNodeArchive';
import LoginManager from './components/LoginManager';
import FundingSummary from './components/FundingSummary';
import FundingScanner from './components/FundingScanner';
import FundingTimeline from './components/FundingTimeline';
import GmailIntegration from './components/GmailIntegration';
import GraphFilters, { Filters } from './components/GraphFilters';
import LokiWorkspace from './components/LokiWorkspace';

type Tab = 'cockpit' | 'loki-workspace' | 'archive' | 'scanner' | 'funding-archive' | 'gmail';
type SidePanelTab = 'details' | 'summary' | 'logins';
type ViewMode = 'graph' | 'timeline';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('cockpit');
  const [activeSidePanelTab, setActiveSidePanelTab] = useState<SidePanelTab>('details');
  const [nodes, setNodes] = useState<FundingNode[]>(nodesData);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const nodesRef = collection(db, 'nodes');
    const populateNodes = async () => {
      try {
        const snapshot = await getDocs(nodesRef);
        if (snapshot.empty) {
          const batch = writeBatch(db);
          nodesData.forEach(node => {
            const docRef = doc(nodesRef, node.id);
            batch.set(docRef, { ...node, authorUid: user.uid });
          });
          await batch.commit();
        }
      } catch (error) {
        console.error("Error populating nodes:", error);
      }
    };
    populateNodes();
    const unsubscribe = onSnapshot(nodesRef, (snapshot) => {
      const fetchedNodes: FundingNode[] = [];
      snapshot.forEach(doc => fetchedNodes.push(doc.data() as FundingNode));
      if (fetchedNodes.length > 0) setNodes(fetchedNodes);
    }, (error) => console.error("Error fetching nodes:", error));
    return () => unsubscribe();
  }, [user]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('projekt-koerperfluss');
  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId) || null, [nodes, selectedNodeId]);
  const [highlightedStatus, setHighlightedStatus] = useState<NodeStatus | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  
  const allGroups = useMemo(() => [...new Set(nodesData.map(n => n.group).filter(Boolean))].sort(), []);
  const allStatuses = useMemo(() => [...new Set(nodesData.map(n => n.status).filter(Boolean))].sort() as NodeStatus[], []);
  const allLinkTypes = useMemo(() => [...new Set(linksData.map(l => l.type).filter(Boolean))].sort() as LinkType[], []);

  const initialFilters = useMemo(() => ({
    groups: new Set(allGroups),
    statuses: new Set(allStatuses),
    linkTypes: new Set(allLinkTypes),
    isOpen: null as boolean | null,
  }), [allGroups, allStatuses, allLinkTypes]);

  const [filters, setFilters] = useState<Filters>(initialFilters);

  const { filteredNodes, filteredLinks } = useMemo(() => {
    const fn = nodes.filter(n => {
        if (n.isArchived) return false;
        return filters.groups.has(n.group) && filters.statuses.has(n.status) && (filters.isOpen === null || n.details.isOpen === filters.isOpen);
    });
    const visibleNodeIds = new Set(fn.map(n => n.id));
    const fl = linksData.filter(l => {
        const s = typeof l.source === 'object' ? (l.source as FundingNode).id : l.source as string;
        const t = typeof l.target === 'object' ? (l.target as FundingNode).id : l.target as string;
        return filters.linkTypes.has(l.type) && visibleNodeIds.has(s) && visibleNodeIds.has(t);
    });
    return { filteredNodes: fn, filteredLinks: fl };
  }, [nodes, filters]);

  const handleNodeClick = useCallback((node: FundingNode) => {
    setSelectedNodeId(node.id);
    setActiveSidePanelTab('details');
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'cockpit':
        return (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto ios-scrollable custom-scrollbar">
              <Dashboard nodes={nodes} filters={filters} onOpenTasksClick={() => setHighlightedStatus('action_required')} />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24">
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between bg-white/5 p-1 rounded-sm border border-white/10 shadow-sm">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewMode('graph')} className={`px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-sm transition-all ${viewMode === 'graph' ? 'bg-white/10 text-white border border-white/20' : 'text-white/30 hover:text-white'}`}>Visual_Graph</button>
                      <button onClick={() => setViewMode('timeline')} className={`px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-sm transition-all ${viewMode === 'timeline' ? 'bg-white/10 text-white border border-white/20' : 'text-white/30 hover:text-white'}`}>Timeline_View</button>
                    </div>
                    <GraphFilters filters={filters} onFilterChange={setFilters} allGroups={allGroups} allStatuses={allStatuses} allLinkTypes={allLinkTypes} onReset={() => setFilters(initialFilters)} />
                  </div>

                  <div className="aspect-[16/9] lg:aspect-auto lg:h-[650px] bg-black/20 rounded-sm border border-white/10 overflow-hidden relative group">
                    {viewMode === 'graph' ? (
                      <FundingGraph nodes={filteredNodes} links={filteredLinks} onNodeClick={handleNodeClick} selectedNodeId={selectedNode?.id} highlightedStatus={highlightedStatus} onStatusChange={(id, s) => updateDoc(doc(db, 'nodes', id), { status: s })} onArchive={(id) => updateDoc(doc(db, 'nodes', id), { isArchived: true })} />
                    ) : (
                      <FundingTimeline nodes={filteredNodes} onNodeClick={handleNodeClick} selectedNodeId={selectedNode?.id} />
                    )}
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white/5 rounded-sm border border-white/10 flex flex-col h-[650px] overflow-hidden">
                    <div className="flex p-2 gap-1 bg-white/5 border-b border-white/10">
                      {(['details', 'summary', 'logins'] as SidePanelTab[]).map(t => (
                        <button key={t} onClick={() => setActiveSidePanelTab(t)} className={`flex-1 py-2 text-[9px] font-mono uppercase tracking-[0.2em] rounded-sm transition-all ${activeSidePanelTab === t ? 'bg-white/10 text-white border border-white/20' : 'text-white/30 hover:text-white hover:bg-white/5'}`}>{t}</button>
                      ))}
                    </div>
                    <div className="flex-1 overflow-y-auto ios-scrollable custom-scrollbar relative">
                      {activeSidePanelTab === 'details' && <FundingDetails node={selectedNode} onClose={() => setSelectedNodeId(null)} onStatusChange={(id, s) => updateDoc(doc(db, 'nodes', id), { status: s })} />}
                      {activeSidePanelTab === 'summary' && <FundingSummary nodes={nodes} onNodeSelect={handleNodeClick} />}
                      {activeSidePanelTab === 'logins' && <LoginManager />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'loki-workspace': return <div className="workspace-container"><LokiWorkspace nodes={nodes} links={linksData} /></div>;
      case 'archive': return <div className="workspace-container"><FundingArchive nodes={nodes} setNodes={setNodes} /></div>;
      case 'funding-archive': return <div className="workspace-container"><FundingNodeArchive nodes={nodes} setNodes={setNodes} /></div>;
      case 'scanner': return <div className="workspace-container max-w-5xl"><FundingScanner /></div>;
      case 'gmail': return <div className="workspace-container"><GmailIntegration /></div>;
      default: return null;
    }
  };

  return (
    <div className="relative flex h-screen w-screen bg-[#0a0502] overflow-hidden">
      {/* Immersive Background */}
      <div className="atmosphere" />
      
      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-brand-primary rounded-sm flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
              <RocketLaunchIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif italic text-white tracking-tight text-lg">VERTEX_CONSOLE</span>
              <span className="text-[9px] font-mono text-brand-secondary uppercase tracking-[0.3em]">System_Jules_v5.0</span>
            </div>
          </div>

          <div className="flex items-center gap-8 flex-1 max-w-xl mx-12">
            <div className="relative flex-1 group">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-brand-primary transition-colors" />
              <GlobalSearch nodes={nodes} onNodeSelect={handleNodeClick} />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <AIAdvisor nodes={nodes} links={linksData} />
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] font-serif italic text-white group-hover:text-brand-primary transition-colors uppercase tracking-widest">Admin_Portal</div>
                <div className="text-[8px] font-mono text-white/40 uppercase tracking-[0.2em]">Premium_Node_v4.0</div>
              </div>
              <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 shadow-lg flex items-center justify-center text-brand-primary font-mono font-bold text-sm group-hover:scale-105 transition-transform">K</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden flex flex-col relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex-1 flex flex-col min-h-0"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Floating Dock Navigation */}
        <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] md:bottom-8 left-1/2 -translate-x-1/2 z-50">
          <nav className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-sm p-1 flex items-center gap-1 shadow-2xl">
            <DockItem id="cockpit" active={activeTab} onClick={setActiveTab} icon={<ChartPieIcon />} label="Cockpit" />
            <DockItem id="loki-workspace" active={activeTab} onClick={setActiveTab} icon={<SparklesIcon />} label="Jules Studio" />
            <div className="w-px h-4 bg-white/10 mx-1" />
            <DockItem id="scanner" active={activeTab} onClick={setActiveTab} icon={<MagnifyingGlassIcon />} label="Scanner" />
            <div className="w-px h-4 bg-white/10 mx-1" />
            <DockItem id="archive" active={activeTab} onClick={setActiveTab} icon={<ArchiveBoxIcon />} label="Docs" />
            <DockItem id="funding-archive" active={activeTab} onClick={setActiveTab} icon={<ArchiveBoxIcon />} label="Programs" />
            <div className="w-px h-4 bg-white/10 mx-1" />
            <DockItem id="gmail" active={activeTab} onClick={setActiveTab} icon={<EnvelopeIcon />} label="Workspace" />
          </nav>
        </div>
      </div>
    </div>
  );
};

const DockItem: React.FC<{ id: Tab; active: Tab; onClick: (t: Tab) => void; icon: React.ReactNode; label: string }> = ({ id, active, onClick, icon, label }) => (
  <button 
    onClick={() => onClick(id)}
    className={`relative group flex flex-col items-center justify-center w-12 h-12 rounded-sm transition-all duration-300 ${active === id ? 'bg-white/10 text-white border border-white/20 shadow-lg' : 'text-white/30 hover:bg-white/5 hover:text-white'}`}
  >
    <div className="w-5 h-5">{icon}</div>
    <span className={`absolute -top-10 px-2 py-1 bg-black border border-white/10 text-white text-[9px] font-mono uppercase tracking-widest rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap ${active === id ? 'translate-y-0' : 'translate-y-1'}`}>
      {label}
    </span>
    {active === id && (
      <motion.div layoutId="dock-active" className="absolute -bottom-1 w-1 h-1 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(0,102,255,0.8)]" />
    )}
  </button>
);

export default App;