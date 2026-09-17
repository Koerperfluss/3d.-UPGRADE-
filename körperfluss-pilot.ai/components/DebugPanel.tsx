
import React, { useState } from 'react';
import { FundingNode, FundingLink } from '../types';

interface DebugPanelProps {
  nodes: FundingNode[];
  links: FundingLink[];
}

const DebugPanel: React.FC<DebugPanelProps> = ({ nodes, links }) => {
  const [activeData, setActiveData] = useState<'nodes' | 'links'>('nodes');

  const dataToDisplay = activeData === 'nodes' ? nodes : links.map(link => ({
      ...link,
      source: typeof link.source === 'object' ? link.source.id : link.source,
      target: typeof link.target === 'object' ? link.target.id : link.target
  }));

  return (
    <div className="p-4 bg-gray-800 text-white font-mono text-xs h-full flex flex-col">
      <h3 className="text-lg font-bold text-yellow-400 mb-2 flex-shrink-0">Data Debug Panel</h3>
      <div className="flex gap-2 mb-2 flex-shrink-0">
        <button
          onClick={() => setActiveData('nodes')}
          className={`px-3 py-1 rounded ${activeData === 'nodes' ? 'bg-yellow-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          Nodes ({nodes.length})
        </button>
        <button
          onClick={() => setActiveData('links')}
          className={`px-3 py-1 rounded ${activeData === 'links' ? 'bg-yellow-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          Links ({links.length})
        </button>
      </div>
      <div className="bg-black p-2 rounded-md overflow-auto flex-grow">
        <pre>{JSON.stringify(dataToDisplay, null, 2)}</pre>
      </div>
    </div>
  );
};

export default DebugPanel;
