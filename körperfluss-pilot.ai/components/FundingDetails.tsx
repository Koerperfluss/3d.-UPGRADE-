import React, { useState, useEffect } from 'react';
import { FundingNode } from '../types';
import { BanknotesIcon, ClockIcon, SparklesIcon, XMarkIcon, ArrowPathIcon, ClipboardIcon, ExclamationTriangleIcon } from './Icons';
import { generateText } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

interface FundingDetailsProps { 
  node: FundingNode | null; 
  onClose: () => void;
  onStatusChange?: (nodeId: string, newStatus: FundingNode['status']) => void;
}

const FundingDetails: React.FC<FundingDetailsProps> = ({ node, onClose, onStatusChange }) => {
  const [aiPlan, setAiPlan] = useState<string | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  useEffect(() => {
    setAiPlan(null);
  }, [node?.id]);

  const handleGeneratePlan = async () => {
    if (!node) return;
    setIsGeneratingPlan(true);
    try {
        const prompt = `Erstelle einen strategischen Aktionsplan für die Förderung "${node.label}".\n\nDETAILS:\n${JSON.stringify(node.details, null, 2)}\n\nGib kompakte, präzise Schritte an. Verwende Markdown.`;
        const result = await generateText(prompt);
        setAiPlan(result);
    } catch (error) {
        setAiPlan("Fehler bei der Generierung.");
    } finally {
        setIsGeneratingPlan(false);
    }
  };

  if (!node) return null;

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-black/90 backdrop-blur-3xl border-l border-white/10 shadow-2xl z-50 flex flex-col overflow-hidden font-mono"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${
            node.status === 'approved' ? 'bg-status-approved/20 text-status-approved border border-status-approved/30' : 
            node.status === 'action_required' ? 'bg-status-action/20 text-status-action border border-status-action/30' : 
            'bg-brand-accent/20 text-brand-accent border border-brand-accent/30'
          }`}>
            {node.type === 'program' ? <BanknotesIcon className="w-4 h-4" /> : <ClipboardIcon className="w-4 h-4" />}
          </div>
          <div>
            <h2 className="text-sm font-serif italic text-white tracking-tight leading-tight">{node.label}</h2>
            <p className="text-[8px] font-mono font-bold text-white/30 uppercase tracking-widest mt-0.5">{node.group}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded-sm transition-all text-white/30 hover:text-white border border-white/5"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/5 rounded-sm p-3 border border-white/5">
            <span className="text-[8px] font-mono font-bold text-white/20 uppercase tracking-widest block mb-1">STATUS_CODE</span>
            <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${
              node.status === 'approved' ? 'bg-status-approved/10 text-status-approved border-status-approved/20' : 
              node.status === 'action_required' ? 'bg-status-action/10 text-status-action border-status-action/20' : 
              'bg-brand-accent/10 text-brand-accent border-brand-accent/20'
            }`}>
              {node.status.toUpperCase()}
            </span>
          </div>
          <div className="bg-white/5 rounded-sm p-3 border border-white/5">
            <span className="text-[8px] font-mono font-bold text-white/20 uppercase tracking-widest block mb-1">PROBABILITY_VAL</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white">{node.details.probability || 0}%</span>
              <div className="flex-1 h-1 bg-white/10 rounded-sm overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${node.details.probability || 0}%` }}
                  className="h-full bg-brand-accent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Amount Card */}
        {node.details.amount && (
          <div className="bg-brand-accent/5 rounded-sm p-4 border border-brand-accent/20 relative overflow-hidden group">
            <span className="text-[8px] font-mono font-bold text-brand-accent uppercase tracking-widest block mb-1">FUNDING_VOLUME</span>
            <div className="text-2xl font-mono font-bold text-white tracking-tighter">{node.details.amount}</div>
            <div className="absolute top-2 right-2 opacity-10">
                <BanknotesIcon className="w-12 h-12" />
            </div>
          </div>
        )}

        {/* AI Advisor Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <SparklesIcon className="w-3 h-3 text-brand-accent" />
            <h3 className="text-[8px] font-mono font-bold text-white/40 uppercase tracking-widest">STRATEGIC_ADVISOR_M4</h3>
          </div>
          <div className="bg-white/5 rounded-sm p-4 border border-white/10 relative">
            {isGeneratingPlan ? (
              <div className="flex flex-col items-center justify-center py-6 gap-3">
                <div className="w-6 h-6 border border-brand-accent/30 border-t-brand-accent rounded-sm animate-spin" />
                <p className="text-[8px] font-mono font-bold text-white/30 uppercase tracking-widest animate-pulse">ANALYZING_CRITERIA...</p>
              </div>
            ) : (
              <div className="prose prose-invert prose-xs max-w-none font-mono text-[10px] text-white/60 leading-relaxed prose-strong:text-brand-accent prose-strong:font-bold">
                <ReactMarkdown>{aiPlan || node.details.actionPlan || 'NO_PLAN_AVAILABLE'}</ReactMarkdown>
              </div>
            )}
            <button 
              onClick={handleGeneratePlan}
              disabled={isGeneratingPlan}
              className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm text-[9px] font-mono font-bold text-white uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <ArrowPathIcon className={`w-3 h-3 ${isGeneratingPlan ? 'animate-spin' : ''}`} />
              UPDATE_STRATEGY
            </button>
          </div>
        </div>

        {/* Details List */}
        <div className="bg-white/5 rounded-sm p-4 border border-white/10 space-y-3">
          <DetailRow label="PROVIDER" value={node.group} />
          <DetailRow label="TYPE" value={node.type === 'program' ? 'PROGRAM' : 'MILESTONE'} />
          <DetailRow label="DEADLINE" value={node.details.deadline || 'N/A'} />
          <DetailRow label="RESPONSIBLE" value={node.details.responsible || 'TEAM'} />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/10 bg-white/5 grid grid-cols-2 gap-2">
        <button className="py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm text-[9px] font-mono font-bold text-white uppercase tracking-widest transition-all">
          ARCHIVE
        </button>
        <button className="py-2 bg-brand-accent text-black rounded-sm text-[9px] font-mono font-bold uppercase tracking-widest hover:bg-brand-accent/90 transition-all">
          EDIT_DETAILS
        </button>
      </div>
    </motion.div>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
    <span className="text-[8px] font-mono font-bold text-white/20 uppercase tracking-widest">{label}</span>
    <span className="text-[10px] font-mono font-bold text-white/80">{value}</span>
  </div>
);

export default FundingDetails;
