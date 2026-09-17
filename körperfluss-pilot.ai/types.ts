
import { SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';

export type NodeType = 'project' | 'program' | 'institution' | 'partner' | 'phase' | 'task' | 'goal' | 'synergy' | 'info' | 'technology' | 'opportunity';
export type NodeStatus = 'approved' | 'pending' | 'future' | 'action_required' | 'active' | 'info' | 'optional' | 'completed';
export type LinkType = 'primary' | 'financial' | 'prerequisite' | 'relational' | 'alternative' | 'synergy' | 'info';

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface Document {
  name: string;
  url: string;
  comments?: Comment[];
}

export interface NodeDetails {
  description: string;
  amount?: string;
  amountValue?: number;
  purpose?: string;
  timeline?: string;
  requirements?: string[];
  documents?: Document[];
  link?: string;
  probability?: number;
  probabilityReason?: string;
  isOpen?: boolean;
  isApplicable?: boolean;
  actionPlan?: string;
  deadline?: string;
  responsible?: string;
}

export interface FundingNode extends SimulationNodeDatum {
  id: string;
  label: string;
  type: NodeType;
  status: NodeStatus;
  group: string;
  details: NodeDetails;
  isArchived?: boolean;
}

export interface FundingLink extends SimulationLinkDatum<FundingNode> {
  source: string | FundingNode;
  target: string | FundingNode;
  type: LinkType;
}

export interface FundingAnalysisResult {
  fundingType: string;
  targetGroup: string;
  eligibilityCriteria: string[];
  applicationProcess: string[];
  sources: Array<{ title: string; url: string }>;
}