import React, { useState } from 'react';
import { FundingNode, NodeStatus } from '../types';
import { evaluateFunding } from '../services/geminiService';

interface NodeModalProps {
  node: FundingNode;
  onClose: () => void;
  onStatusChange?: (nodeId: string, newStatus: NodeStatus) => void;
  onArchive?: (nodeId: string) => void;
}

const NodeModal: React.FC<NodeModalProps> = ({ node, onClose, onStatusChange, onArchive }) => {
  const [evaluation, setEvaluation] = useState<{ relevance: number, sense: number, chance: number, explanation: string } | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    const projectInfo = "Ein innovatives Technologieprojekt im Bereich KI und Nachhaltigkeit, aktuell in der Prototypenphase.";
    const result = await evaluateFunding(projectInfo, node);
    setEvaluation(result);
    setIsEvaluating(false);
  };

  const statusBadgeClasses: Record<string, string> = {
    action_required: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    active: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    future: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    optional: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    info: 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-mono">
      <div className="bg-black/90 rounded-sm shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10 flex justify-between items-start sticky top-0 bg-black/95 z-10">
          <div>
            <h2 className="text-lg font-serif italic text-white leading-tight">{node.label}</h2>
            <div className="flex gap-2 mt-2 items-center">
              <span className="px-1.5 py-0.5 text-[8px] font-mono font-bold rounded-sm bg-white/5 text-white/40 border border-white/10 uppercase tracking-widest">
                {node.type}
              </span>
              <span className={`px-1.5 py-0.5 text-[8px] font-mono font-bold rounded-sm uppercase border ${
                node.status === 'approved' ? 'bg-status-approved/10 text-status-approved border-status-approved/20' : 
                node.status === 'action_required' ? 'bg-status-action/10 text-status-action border-status-action/20' : 
                'bg-brand-accent/10 text-brand-accent border-brand-accent/20'
              }`}>
                {node.status.toUpperCase()}
              </span>
              {onStatusChange && (
                  <select
                      value={node.status}
                      onChange={(e) => {
                          onStatusChange(node.id, e.target.value as FundingNode['status']);
                          onClose();
                      }}
                      className="text-[8px] font-mono font-bold bg-black/40 border border-white/10 rounded-sm px-2 py-0.5 focus:ring-brand-accent focus:border-brand-accent text-white/40 cursor-pointer hover:bg-white/5 transition-colors uppercase tracking-widest"
                  >
                      <option value="action_required">ACTION_REQUIRED</option>
                      <option value="active">ACTIVE_PROCESSING</option>
                      <option value="pending">SUBMITTED_PENDING</option>
                      <option value="completed">COMPLETED_ARCHIVED</option>
                      <option value="approved">APPROVED_FUNDED</option>
                      <option value="future">FUTURE_PLANNING</option>
                      <option value="optional">OPTIONAL_PATH</option>
                      <option value="info">INFORMATION_ONLY</option>
                  </select>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/30 hover:text-white rounded-sm hover:bg-white/5 border border-white/5 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          {node.details.description && (
            <div>
              <h3 className="text-[8px] font-mono font-bold text-white/20 uppercase tracking-widest mb-2">DESCRIPTION_LOG</h3>
              <p className="text-[11px] text-white/60 leading-relaxed font-mono">{node.details.description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            {node.details.amount && (
              <div className="bg-white/5 p-3 border border-white/10 rounded-sm">
                <h3 className="text-[8px] font-mono font-bold text-white/20 uppercase tracking-widest mb-1">FUNDING_AMOUNT</h3>
                <p className="text-sm font-mono font-bold text-white">{node.details.amount}</p>
              </div>
            )}
            {node.details.timeline && (
              <div className="bg-white/5 p-3 border border-white/10 rounded-sm">
                <h3 className="text-[8px] font-mono font-bold text-white/20 uppercase tracking-widest mb-1">TIMELINE_EST</h3>
                <p className="text-sm font-mono font-bold text-white">{node.details.timeline}</p>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="mb-6 flex flex-col sm:flex-row gap-2">
                {onStatusChange && node.status !== 'completed' && (
                  <>
                    {node.status !== 'pending' && (
                        <button 
                            onClick={() => { onStatusChange(node.id, 'pending'); onClose(); }}
                            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-status-pending/10 hover:bg-status-pending/20 text-status-pending border border-status-pending/20 rounded-sm font-mono font-bold text-[9px] uppercase tracking-widest transition-all"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            MARK_SUBMITTED
                        </button>
                    )}
                    <button 
                        onClick={() => { onStatusChange(node.id, 'completed'); onClose(); }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-status-approved/10 hover:bg-status-approved/20 text-status-approved border border-status-approved/20 rounded-sm font-mono font-bold text-[9px] uppercase tracking-widest transition-all"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        MARK_COMPLETED
                    </button>
                  </>
                )}
                {onArchive && !node.isArchived && (
                    <button 
                        onClick={() => { onArchive(node.id); onClose(); }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white/5 hover:bg-white/10 text-white/40 border border-white/10 rounded-sm font-mono font-bold text-[9px] uppercase tracking-widest transition-all"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                        ARCHIVE_NODE
                    </button>
                )}
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-mono font-bold text-white/40 flex items-center gap-2 uppercase tracking-widest">
                <svg className="w-3.5 h-3.5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                AI_EVALUATION_ENGINE
              </h3>
              <button 
                onClick={handleEvaluate} 
                disabled={isEvaluating}
                className="px-3 py-1.5 bg-brand-accent text-black text-[9px] font-mono font-bold rounded-sm hover:bg-brand-accent/90 transition-all disabled:opacity-50 flex items-center gap-2 uppercase tracking-widest"
              >
                {isEvaluating ? (
                  <>
                    <svg className="animate-spin h-3 w-3 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ANALYZING...
                  </>
                ) : 'RUN_EVALUATION'}
              </button>
            </div>

            {evaluation && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-brand-accent/5 p-3 rounded-sm text-center border border-brand-accent/10">
                    <div className="text-[8px] font-mono font-bold text-brand-accent/40 uppercase tracking-widest mb-1">RELEVANCE</div>
                    <div className="text-lg font-mono font-bold text-brand-accent">{evaluation.relevance}%</div>
                  </div>
                  <div className="bg-status-approved/5 p-3 rounded-sm text-center border border-status-approved/10">
                    <div className="text-[8px] font-mono font-bold text-status-approved/40 uppercase tracking-widest mb-1">SENSE</div>
                    <div className="text-lg font-mono font-bold text-status-approved">{evaluation.sense}%</div>
                  </div>
                  <div className="bg-status-pending/5 p-3 rounded-sm text-center border border-status-pending/10">
                    <div className="text-[8px] font-mono font-bold text-status-pending/40 uppercase tracking-widest mb-1">CHANCE</div>
                    <div className="text-lg font-mono font-bold text-status-pending">{evaluation.chance}%</div>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-sm border border-white/10">
                  <h4 className="text-[9px] font-mono font-bold text-white/40 mb-2 uppercase tracking-widest">DETAILED_ANALYSIS_LOG</h4>
                  <p className="text-[10px] font-mono text-white/60 leading-relaxed whitespace-pre-wrap">{evaluation.explanation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeModal;
