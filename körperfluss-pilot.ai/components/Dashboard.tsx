import React, { useState, useMemo } from 'react';
import { BanknotesIcon, CheckBadgeIcon, ExclamationTriangleIcon, ClockIcon, SparklesIcon, ChevronDownIcon, ChartPieIcon } from './Icons';
import { motion, AnimatePresence } from 'motion/react';
import { FundingNode } from '../types';
import { generateText } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Filters } from './GraphFilters';

interface DashboardProps {
    nodes: FundingNode[];
    filters: Filters;
    onOpenTasksClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ nodes, filters, onOpenTasksClick }) => {
    const [selectedAgency, setSelectedAgency] = useState<string>('All');
    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

    const agencies = useMemo(() => {
        const programs = nodes.filter(n => n.type === 'program');
        const uniqueAgencies = Array.from(new Set(programs.map(p => p.group))).filter(Boolean);
        return ['All', ...uniqueAgencies];
    }, [nodes]);

    const { activeFunding, approvedFunding, openTasksCount, nextStep } = useMemo(() => {
        const programsAndTasks = nodes.filter(n => n.type === 'program' || n.type === 'task');
        const filteredNodes = programsAndTasks.filter(n => {
            if (n.isArchived) return false;
            const groupMatch = (selectedAgency === 'All' || n.group === selectedAgency) && filters.groups.has(n.group);
            const statusMatch = filters.statuses.has(n.status);
            const isOpenMatch = filters.isOpen === null || n.details.isOpen === filters.isOpen;
            return groupMatch && statusMatch && isOpenMatch;
        });

        const active = filteredNodes.filter(n => n.status === 'pending' || n.status === 'active');
        const approved = filteredNodes.filter(n => n.status === 'approved');
        const open = filteredNodes.filter(n => n.status === 'action_required');
        const nextAction = open.length > 0 ? open[0] : filteredNodes.find(p => p.status === 'pending');

        return {
          activeFunding: active.reduce((sum, n) => sum + (n.details.amountValue || 0), 0),
          approvedFunding: approved.reduce((sum, n) => sum + (n.details.amountValue || 0), 0),
          openTasksCount: open.length,
          nextStep: nextAction?.label || 'Planung Phase 2',
        };
    }, [nodes, selectedAgency, filters]);

    const handleGenerateSummary = async () => {
        setIsGeneratingSummary(true);
        setAiSummary(null);
        
        const filteredNodes = nodes.filter(n => {
            if (n.isArchived) return false;
            const groupMatch = (selectedAgency === 'All' || n.group === selectedAgency) && filters.groups.has(n.group);
            const statusMatch = filters.statuses.has(n.status);
            const isOpenMatch = filters.isOpen === null || n.details.isOpen === filters.isOpen;
            return groupMatch && statusMatch && isOpenMatch;
        });

        const activeNodes = filteredNodes.filter(n => n.status === 'pending' || n.status === 'active');
        const actionNodes = filteredNodes.filter(n => n.status === 'action_required');
        const activeList = activeNodes.map(n => `- ${n.label} (€${(n.details.amountValue || 0).toLocaleString('de-DE')})`).join('\n');
        const actionList = actionNodes.map(n => `- ${n.label}`).join('\n');
        const filterContext = `Filter: Fördergeber=${selectedAgency}, Status=[${Array.from(filters.statuses).join(', ')}], NurOffen=${filters.isOpen}`;

        const prompt = `Erstelle eine strategische Zusammenfassung der aktuellen Finanzierungsübersicht für ein Startup basierend auf den gewählten Filtern.\n\nKONTEXT:\n${filterContext}\n\nAKTIVE PROGRAMME (${activeNodes.length}):\n${activeList}\n\nDRINGLICH - AKTION ERFORDERLICH (${actionNodes.length}):\n${actionList}\n\nFördervolumen aktiv: €${activeFunding.toLocaleString('de-DE')}\n\nGib eine kurze, prägnante Zusammenfassung (max. 3-4 Sätze) und empfehle die nächsten strategischen Schritte. Verwende Markdown.`;
        
        try {
            const summary = await generateText(prompt);
            setAiSummary(summary);
        } catch (error) {
            setAiSummary("Fehler bei der Generierung der Zusammenfassung.");
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 mb-1"
                  >
                    <div className="w-1 h-4 bg-brand-primary" />
                    <h2 className="text-2xl font-serif italic text-white tracking-tight">System_Cockpit</h2>
                  </motion.div>
                  <p className="text-white/20 font-mono uppercase tracking-[0.3em] text-[8px] ml-4">Strategic Intelligence Node v4.0</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <select 
                            value={selectedAgency}
                            onChange={(e) => setSelectedAgency(e.target.value)}
                            className="appearance-none pl-4 pr-8 py-1.5 bg-white/5 border border-white/10 rounded-sm text-[10px] font-mono text-white/80 focus:ring-1 focus:ring-brand-primary/40 focus:border-brand-primary transition-all cursor-pointer"
                        >
                            {agencies.map(agency => (
                                <option key={agency} value={agency} className="bg-[#0a0502] text-white">{agency === 'All' ? 'Alle Fördergeber' : agency}</option>
                            ))}
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-hover:text-brand-primary transition-colors">
                            <ChevronDownIcon className="w-3 h-3" />
                        </div>
                    </div>
                    <motion.button 
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGenerateSummary}
                        disabled={isGeneratingSummary}
                        className="flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/10 text-white rounded-sm hover:bg-white/20 transition-all disabled:opacity-50 text-[10px] font-mono uppercase tracking-widest"
                    >
                        {isGeneratingSummary ? (
                            <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <SparklesIcon className="w-3 h-3 text-brand-primary" />
                        )}
                        Insights_Gen
                    </motion.button>
                </div>
            </div>

            <AnimatePresence>
                {aiSummary && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="border border-brand-primary/20 bg-brand-primary/5 rounded-sm p-6 relative overflow-hidden group"
                    >
                        <div className="flex items-start gap-6 relative z-10">
                            <div className="w-10 h-10 border border-brand-primary/30 bg-brand-primary/10 rounded-sm flex items-center justify-center text-brand-primary flex-shrink-0">
                                <SparklesIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-xs font-serif italic text-white/60 uppercase tracking-[0.2em]">Strategische_Analyse</h3>
                                  <button 
                                    onClick={() => setAiSummary(null)} 
                                    className="p-1 hover:bg-white/5 rounded-sm transition-all"
                                  >
                                      <ExclamationTriangleIcon className="w-3 h-3 rotate-45 text-white/20" />
                                  </button>
                                </div>
                                <div className="prose prose-invert max-w-none prose-p:text-white/60 prose-p:text-xs prose-p:font-mono prose-p:leading-relaxed prose-strong:text-brand-primary prose-strong:font-mono">
                                    <ReactMarkdown>{aiSummary}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Aktives Volumen" value={`€${activeFunding.toLocaleString('de-DE')}`} icon={BanknotesIcon} color="brand" trend="+12.5% DELTA" description="TOTAL_ACTIVE_CAPITAL" />
                <StatCard label="Bewilligt" value={`€${approvedFunding.toLocaleString('de-DE')}`} icon={CheckBadgeIcon} color="green" trend="TARGET_REACHED" description="CONFIRMED_FUNDS" />
                <StatCard label="Offene Tasks" value={openTasksCount.toString()} icon={ExclamationTriangleIcon} color="orange" onClick={onOpenTasksClick} isAction={openTasksCount > 0} trend="ACTION_REQUIRED" description="CRITICAL_PATH_BLOCKERS" />
                <StatCard label="Meilenstein" value={nextStep} icon={ClockIcon} color="blue" trend="UPCOMING" description="NEXT_STRATEGIC_NODE" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-8 border border-white/10 bg-white/5 rounded-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-sm font-serif italic text-white/60 uppercase tracking-widest">Antragsfortschritt</h3>
                          <p className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em] mt-1">Priority_Pipeline_Status</p>
                        </div>
                        <div className="w-8 h-8 border border-white/10 rounded-sm flex items-center justify-center text-white/20">
                          <ChartPieIcon className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <ProgressBar label="FFG Kleinprojekt" amount="€65.000" progress={75} status="In Prüfung" color="brand" />
                        <ProgressBar label="WAW Innovation" amount="€80.000" progress={90} status="Hearing" color="green" />
                        <ProgressBar label="AWS Seedfinancing" amount="€200.000" progress={40} status="Vorbereitung" color="blue" />
                    </div>
                </div>

                <div className="lg:col-span-4 border border-white/10 bg-white/5 rounded-sm p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-serif italic text-white/60 uppercase tracking-widest">Success_Rate</h3>
                        <div className="w-6 h-6 border border-brand-primary/20 rounded-sm flex items-center justify-center text-brand-primary/40">
                            <SparklesIcon className="w-3 h-3" />
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center space-y-4">
                        {(() => {
                            const relevantNodes = nodes.filter(n => (n.type === 'program' || n.type === 'opportunity') && n.details.probability !== undefined);
                            const groupedByStatus = relevantNodes.reduce((acc, node) => {
                                if (!acc[node.status]) acc[node.status] = { sum: 0, count: 0 };
                                acc[node.status].sum += node.details.probability!;
                                acc[node.status].count += 1;
                                return acc;
                            }, {} as Record<string, { sum: number, count: number }>);

                            const statusLabels: Record<string, string> = {
                                'approved': 'Bewilligt',
                                'pending': 'Eingereicht',
                                'future': 'Pipeline',
                                'action_required': 'Kritisch',
                                'active': 'Aktiv'
                            };

                            return Object.entries(groupedByStatus).map(([status, data]) => {
                                const avg = Math.round(data.sum / data.count);
                                return (
                                    <div key={status} className="group cursor-default">
                                        <div className="flex justify-between text-[8px] font-mono mb-1">
                                            <span className="text-white/30 uppercase tracking-[0.15em] group-hover:text-white/50 transition-colors">{statusLabels[status] || status}</span>
                                            <span className="text-white/60">{avg}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${avg}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className={`h-full ${status === 'approved' ? 'bg-emerald-500' : status === 'action_required' ? 'bg-rose-500' : 'bg-brand-primary'}`}
                                            />
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ 
  label: string; 
  value: string | number; 
  icon: React.ElementType; 
  color: string;
  description?: string;
  trend?: string;
  onClick?: () => void;
  isAction?: boolean;
}> = ({ label, value, icon: Icon, color, description, trend, onClick, isAction }) => (
  <motion.div 
    whileHover={{ y: -2 }}
    onClick={onClick}
    className={`border border-white/10 bg-white/5 p-4 rounded-sm flex flex-col justify-between group transition-colors hover:bg-white/10 ${onClick ? 'cursor-pointer' : ''} ${isAction ? 'border-status-action/30 bg-status-action/5' : ''}`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1">
        <p className="font-serif italic text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</p>
        <h3 className={`text-2xl font-mono font-medium tracking-tighter ${isAction ? 'text-status-action' : 'text-white'}`}>{value}</h3>
      </div>
      <div className={`p-2 border border-white/10 rounded-sm ${isAction ? 'bg-status-action/20 text-status-action animate-pulse' : `${color === 'brand' ? 'bg-brand-primary/10 text-brand-primary' : color === 'green' ? 'bg-emerald-500/10 text-emerald-500' : color === 'orange' ? 'bg-rose-500/10 text-rose-500' : 'bg-sky-500/10 text-sky-500'}`}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    
    {trend && (
      <div className="flex items-center gap-2 mt-auto">
        <span className="text-[10px] font-mono text-white/40">{trend}</span>
        <div className="h-px flex-1 bg-white/5" />
      </div>
    )}
    
    {description && (
      <p className="text-[10px] text-white/30 mt-2 font-mono leading-tight uppercase tracking-wider">{description}</p>
    )}
  </motion.div>
);

const ProgressBar: React.FC<{ label: string; amount: string; progress: number; status: string; color: string }> = ({ label, amount, progress, status, color }) => (
    <div className="group border-b border-white/5 pb-4 last:border-0">
        <div className="flex justify-between items-end mb-2">
            <div>
                <div className="text-sm font-mono text-white/80 group-hover:text-brand-primary transition-colors">{label}</div>
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.1em] mt-0.5">{amount}</div>
            </div>
            <div className="text-right">
                <div className={`text-[10px] font-mono uppercase tracking-[0.15em] ${color === 'brand' ? 'text-brand-primary' : color === 'green' ? 'text-emerald-600' : 'text-sky-600'}`}>{status}</div>
                <div className="text-[9px] font-mono text-white/20 mt-0.5">{progress}%</div>
            </div>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full ${color === 'brand' ? 'bg-brand-primary' : color === 'green' ? 'bg-emerald-500' : 'bg-sky-500'}`}
            />
        </div>
    </div>
);

export default Dashboard;
