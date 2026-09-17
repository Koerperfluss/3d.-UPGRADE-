import React from 'react';
import { FundingNode } from '../types';
import { CheckBadgeIcon, ClockIcon, ExclamationTriangleIcon, LightBulbIcon } from './Icons';

interface FundingSummaryProps {
  nodes: FundingNode[];
  onNodeSelect: (node: FundingNode) => void;
}

const statusConfig = {
    approved: {
        title: 'Bewilligte Förderungen',
        icon: <CheckBadgeIcon />,
        color: 'text-status-approved',
        bgColor: 'bg-green-50 dark:bg-green-900/40',
        borderColor: 'border-green-200 dark:border-green-800',
    },
    pending: {
        title: 'In Einreichung / Prüfung',
        icon: <ClockIcon />,
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/40',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
    },
    action_required: {
        title: 'Aktion Erforderlich',
        icon: <ExclamationTriangleIcon />,
        color: 'text-status-action',
        bgColor: 'bg-red-50 dark:bg-red-900/40',
        borderColor: 'border-red-200 dark:border-red-800',
    },
    future: {
        title: 'Offene Optionen / Zukunft',
        icon: <LightBulbIcon />,
        color: 'text-gray-600 dark:text-gray-400',
        bgColor: 'bg-gray-50 dark:bg-gray-800/40',
        borderColor: 'border-gray-200 dark:border-gray-700',
    },
};

const FundingSummary: React.FC<FundingSummaryProps> = ({ nodes, onNodeSelect }) => {
  const programsAndTasks = nodes.filter(node => node.type === 'program' || node.type === 'task' || node.type === 'opportunity');

  const approvedPrograms = programsAndTasks.filter(p => p.status === 'approved' && p.details.amountValue);
  const pendingPrograms = programsAndTasks.filter(p => p.status === 'pending');
  const actionRequiredItems = programsAndTasks.filter(p => p.status === 'action_required');
  const futureItems = programsAndTasks.filter(p => p.status === 'future');

  const totalApproved = approvedPrograms.reduce((sum, p) => sum + (p.details.amountValue || 0), 0);
  
  const handleNodeClick = (node: FundingNode) => {
    onNodeSelect(node);
  };

  const SummarySection: React.FC<{ status: keyof typeof statusConfig, items: FundingNode[], total?: number }> = ({ status, items, total }) => {
    const config = statusConfig[status];
    if (items.length === 0) return null;

    return (
        <div className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
            <h4 className={`flex items-center gap-2 font-bold mb-3 ${config.color}`}>
                <div className="w-5 h-5">{config.icon}</div>
                <span>{config.title} ({items.length})</span>
            </h4>
            <ul className="space-y-2">
                {items.map(item => (
                    <li key={item.id}>
                       <button onClick={() => handleNodeClick(item)} className="w-full text-left flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-200 dark:border-gray-700 hover:border-brand-accent">
                           <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{item.label}</span>
                           {item.details.amount && <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{item.details.amount}</span>}
                       </button>
                    </li>
                ))}
            </ul>
            {total !== undefined && (
                <div className="mt-4 pt-3 border-t border-gray-300 dark:border-gray-600 flex justify-between items-center">
                    <span className="font-bold text-gray-800 dark:text-gray-200">Gesamtsumme</span>
                    <span className="font-bold text-lg text-status-approved">€{total.toLocaleString('de-DE')}</span>
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="p-6 flex flex-col h-full space-y-6">
       <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Status-Übersicht</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Aktueller Stand der Förderungen und Optionen</p>
      </div>
      <div className="space-y-4 overflow-y-auto pr-2">
        <SummarySection status="action_required" items={actionRequiredItems} />
        <SummarySection status="approved" items={approvedPrograms} total={totalApproved} />
        <SummarySection status="pending" items={pendingPrograms} />
        <SummarySection status="future" items={futureItems} />
      </div>
    </div>
  );
};

export default FundingSummary;
