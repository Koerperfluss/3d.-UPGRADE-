import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
  isAction?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color, onClick, isAction = false }) => {
  const cardClasses = `
    bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex items-center transition-all duration-300
    ${onClick ? 'cursor-pointer hover:shadow-xl hover:border-brand-accent dark:hover:border-brand-accent transform hover:-translate-y-1' : ''}
    ${isAction ? 'pulse-animation border-2 border-status-action dark:border-status-action' : ''}
  `;

  const content = (
    <>
      <div className={`w-8 h-8 rounded-lg mr-4 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
        <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{value}</p>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={cardClasses} style={{textAlign: 'left'}}>
        {content}
      </button>
    );
  }

  return (
    <div className={cardClasses}>
      {content}
    </div>
  );
};

export default DashboardCard;