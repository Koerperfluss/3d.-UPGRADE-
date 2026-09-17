import React from 'react';
import { FundingNode, FundingLink } from '../types';
import JulesConsole from './JulesConsole';

interface LokiWorkspaceProps {
  nodes: FundingNode[];
  links: FundingLink[];
}

const LokiWorkspace: React.FC<LokiWorkspaceProps> = ({ nodes, links }) => {
  return (
    <div className="w-full h-full min-h-0 flex flex-col">
      <JulesConsole nodes={nodes} links={links} />
    </div>
  );
};

export default LokiWorkspace;
