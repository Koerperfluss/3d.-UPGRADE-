import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { FundingNode, FundingLink, LinkType, NodeStatus } from '../types';
import GraphLegend from './GraphLegend';
import NodeModal from './NodeModal';
import { MagnifyingGlassIcon } from './Icons';

interface FundingGraphProps {
  nodes: FundingNode[];
  links: FundingLink[];
  onNodeClick: (node: FundingNode) => void;
  selectedNodeId?: string | null;
  highlightedStatus?: NodeStatus | null;
  onStatusChange?: (nodeId: string, newStatus: NodeStatus) => void;
  onArchive?: (nodeId: string) => void;
}

const groupColorsTailwind: Record<string, string> = {
    Project: 'fill-brand-primary', 
    Partners: 'fill-teal-600', 
    Technology: 'fill-purple-600', 
    FFG: 'fill-orange-600', 
    AWS: 'fill-red-600', 
    Regional: 'fill-yellow-500', 
    Strategy: 'fill-indigo-600',
    Guide: 'fill-cyan-600',
    EU: 'fill-blue-900',
};

const linkColors: Record<LinkType, string> = {
    primary: 'stroke-brand-accent', 
    financial: 'stroke-status-approved', 
    prerequisite: 'stroke-status-action', 
    relational: 'stroke-gray-300 dark:stroke-gray-600', 
    alternative: 'stroke-gray-400 dark:stroke-gray-500', 
    synergy: 'stroke-indigo-400',
    info: 'stroke-blue-300 dark:stroke-blue-400',
};

const statusColors: Record<string, string> = {
    approved: '#10B981',
    pending: '#F59E0B',
    action_required: '#EF4444',
    future: '#6B7280',
    rejected: '#111827',
    completed: '#9CA3AF',
    active: '#3B82F6',
};

const CSS_ANIMATIONS = `
  @keyframes pulse-stroke {
    0% { stroke-width: 4px; stroke-opacity: 1; }
    50% { stroke-width: 8px; stroke-opacity: 0.5; }
    100% { stroke-width: 4px; stroke-opacity: 1; }
  }
  .animate-pulse-stroke {
    animation: pulse-stroke 1.5s infinite ease-in-out;
  }
  @keyframes pulse-prerequisite {
    0% { stroke-width: 1.5px; stroke: #f59e0b; stroke-opacity: 1; }
    50% { stroke-width: 4px; stroke: #f59e0b; stroke-opacity: 0.5; }
    100% { stroke-width: 1.5px; stroke: #f59e0b; stroke-opacity: 1; }
  }
  .animate-pulse-prerequisite {
    animation: pulse-prerequisite 1.5s infinite ease-in-out;
  }
`;

const EdgeView = React.memo(({ link, isSelected, isPrerequisite, isConnected, highlightConnected, isDimmed }: { link: FundingLink, isSelected: boolean, isPrerequisite: boolean, isConnected: boolean, highlightConnected: boolean, isDimmed: boolean }) => {
    const source = link.source as FundingNode;
    const target = link.target as FundingNode;
    
    let strokeWidth = 1.5;
    if (isPrerequisite) strokeWidth = 4;
    else if (isConnected) strokeWidth = 3;
    else {
        switch(link.type) {
            case 'primary': strokeWidth = 3; break;
            case 'financial': strokeWidth = 2; break;
            case 'prerequisite': strokeWidth = 2; break;
            case 'synergy': strokeWidth = 1; break;
            default: strokeWidth = 1; break;
        }
    }

    let opacity = isDimmed ? 0.05 : 0.4;
    if (isPrerequisite || isConnected) opacity = 1.0;

    let strokeDasharray = "none";
    switch(link.type) {
        case 'prerequisite': strokeDasharray = "6 3"; break;
        case 'relational': strokeDasharray = "3 3"; break;
        case 'alternative': strokeDasharray = "1 3"; break;
        case 'synergy': strokeDasharray = "3 1"; break;
        case 'info': strokeDasharray = "2 2"; break;
    }

    const strokeColor = isConnected ? '#0066FF' : undefined;
    const className = strokeColor ? '' : `${linkColors[link.type] || 'stroke-gray-600'}`;

    const cx = (source.x! + target.x!) / 2;
    const cy = (source.y! + target.y!) / 2;
    const angle = Math.atan2(target.y! - source.y!, target.x! - source.x!) * 180 / Math.PI;
    const transform = `rotate(${angle > 90 || angle < -90 ? angle + 180 : angle}, ${cx}, ${cy})`;

    return (
        <g className="transition-opacity duration-500" style={{ opacity }}>
            <line
                x1={source.x} y1={source.y} x2={target.x} y2={target.y}
                className={className}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                markerEnd={opacity > 0.2 ? "url(#arrowhead)" : "none"}
                style={{ transition: 'stroke-width 300ms, stroke-opacity 300ms' }}
            />
            {(isConnected || isPrerequisite) && (
                <text
                    x={cx} y={cy}
                    transform={transform}
                    className={`text-[8px] font-mono font-bold pointer-events-none fill-white/40`}
                    textAnchor="middle"
                    dy={-5}
                >
                    {link.type.toUpperCase()}
                </text>
            )}
        </g>
    );
});

const NodeView = React.memo(({ node, isSelected, isPrerequisite, isConnected, highlightConnected, onClick, onMouseOver, onMouseOut, onMouseMove, opacity, isHovered }: { node: FundingNode, isSelected: boolean, isPrerequisite: boolean, isConnected: boolean, highlightConnected: boolean, onClick: (e: React.MouseEvent, n: FundingNode) => void, onMouseOver: (e: React.MouseEvent, n: FundingNode) => void, onMouseOut: (e: React.MouseEvent, n: FundingNode) => void, onMouseMove: (e: React.MouseEvent, n: FundingNode) => void, opacity: number, isHovered: boolean }) => {
    
    let classes = `${groupColorsTailwind[node.group] || 'fill-gray-700'} transition-all duration-300 ease-in-out`;
    if (node.status === 'action_required' && !isSelected) {
        classes += ' animate-pulse-stroke';
    }

    let strokeColor = statusColors[node.status] || 'rgba(255,255,255,0.1)';
    if (isSelected || isHovered) strokeColor = '#0066FF';
    else if (isPrerequisite) strokeColor = '#EF4444';
    else if (isConnected) strokeColor = '#00C2FF';

    let strokeWidth = 2;
    if (isSelected || isHovered) strokeWidth = 4;
    else if (isPrerequisite) strokeWidth = 3;
    else if (isConnected) strokeWidth = 2;

    const radius = isSelected || isHovered ? (node.type === 'project' ? 35 : 25) : (node.type === 'project' ? 30 : 20);

    return (
        <g 
            transform={`translate(${node.x || 0}, ${node.y || 0})`}
            className="cursor-pointer"
            style={{ opacity, transition: 'opacity 500ms, transform 300ms' }}
            onClick={(e) => onClick(e, node)}
            onMouseEnter={(e) => onMouseOver(e, node)}
            onMouseLeave={(e) => onMouseOut(e, node)}
            onMouseMove={(e) => onMouseMove(e, node)}
        >
            {/* Glow Effect */}
            {(isSelected || isHovered) && (
                <circle
                    r={radius + 10}
                    className="fill-brand-primary/20 blur-xl animate-pulse"
                />
            )}
            
            <circle
                r={radius}
                className={classes}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={isPrerequisite ? '4 2' : 'none'}
                style={{ transition: 'r 300ms, stroke 300ms, stroke-width 300ms' }}
            />
            
            {/* Label with background for readability */}
            <g transform={`translate(0, ${radius + 15})`}>
                <rect 
                    x={-node.label.length * 3 - 4} 
                    y={-6} 
                    width={node.label.length * 6 + 8} 
                    height={12} 
                    className="fill-black/60 backdrop-blur-md"
                    rx={2}
                />
                <text
                    textAnchor="middle"
                    className={`text-[9px] font-mono font-bold pointer-events-none tracking-tighter ${isSelected || isHovered ? 'fill-brand-primary' : 'fill-white/80'}`}
                >
                    {node.label.toUpperCase()}
                </text>
            </g>
            
            {node.status === 'action_required' && (
                <g transform={`translate(${radius * 0.7}, ${-radius * 0.7})`}>
                    <circle r={8} className="fill-red-500 stroke-black animate-pulse" strokeWidth={2} />
                    <text textAnchor="middle" dominantBaseline="central" fontSize="10px" className="pointer-events-none fill-white font-mono font-bold">!</text>
                </g>
            )}
        </g>
    );
});

const FundingGraph: React.FC<FundingGraphProps> = ({ nodes: initialNodes, links: initialLinks, onNodeClick, selectedNodeId, highlightedStatus, onStatusChange, onArchive }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<SVGGElement>(null);
  const [highlightConnected, setHighlightConnected] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tooltip, setTooltip] = useState<{ x: number, y: number, node: FundingNode } | null>(null);
  const [modalNode, setModalNode] = useState<FundingNode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  
  const nodePositions = useRef<Record<string, {x?: number, y?: number, fx?: number | null, fy?: number | null}>>((() => {
      const savedLayout = localStorage.getItem('fundingGraphLayout');
      if (savedLayout) {
          try { return JSON.parse(savedLayout); } catch (e) {}
      }
      return {};
  })());

  const simNodes = useRef<FundingNode[]>([]);
  const simLinks = useRef<FundingLink[]>([]);
  const simulationRef = useRef<d3.Simulation<FundingNode, FundingLink> | null>(null);

  const activeFocusId = hoveredNodeId || selectedNodeId;

  const connectedNodeIds = useMemo(() => {
      const set = new Set<string>();
      if (activeFocusId) {
          set.add(activeFocusId);
          initialLinks.forEach(link => {
              const sourceId = typeof link.source === 'object' ? (link.source as FundingNode).id : link.source as string;
              const targetId = typeof link.target === 'object' ? (link.target as FundingNode).id : link.target as string;
              if (sourceId === activeFocusId) set.add(targetId);
              else if (targetId === activeFocusId) set.add(sourceId);
          });
      }
      return set;
  }, [activeFocusId, initialLinks]);

  const prerequisiteNodeIds = useMemo(() => {
      const set = new Set<string>();
      if (activeFocusId) {
          initialLinks.forEach(link => {
              const sourceId = typeof link.source === 'object' ? (link.source as FundingNode).id : link.source as string;
              const targetId = typeof link.target === 'object' ? (link.target as FundingNode).id : link.target as string;
              if (targetId === activeFocusId && link.type === 'prerequisite') {
                  set.add(sourceId);
              }
          });
      }
      return set;
  }, [activeFocusId, initialLinks]);

  useEffect(() => {
      simNodes.current = initialNodes.map(d => ({
          ...d,
          x: nodePositions.current[d.id]?.x,
          y: nodePositions.current[d.id]?.y,
          fx: nodePositions.current[d.id]?.fx,
          fy: nodePositions.current[d.id]?.fy,
      }));
      simLinks.current = initialLinks.map(d => ({...d}));

      const simulation = d3.forceSimulation(simNodes.current)
          .force("link", d3.forceLink<FundingNode, FundingLink>(simLinks.current).id(d => d.id).distance(d => d.type === 'primary' ? 180 : 250).strength(0.7))
          .force("charge", d3.forceManyBody().strength(-3500).distanceMax(1000))
          .force("collide", d3.forceCollide().radius(120).strength(1))
          .force("center", d3.forceCenter(0, 0))
          .force("x", d3.forceX().strength(0.05))
          .force("y", d3.forceY().strength(0.05))
          .on("tick", () => {
              simNodes.current.forEach(d => {
                  nodePositions.current[d.id] = { x: d.x, y: d.y, fx: d.fx, fy: d.fy };
              });
              setTick(t => t + 1);
          });

      simulationRef.current = simulation;

      return () => {
          simulation.stop();
      };
  }, [initialNodes, initialLinks]);

  useEffect(() => {
      if (!svgRef.current || !containerRef.current) return;
      const svg = d3.select(svgRef.current);
      const container = d3.select(containerRef.current);
      
      const zoom = d3.zoom<SVGSVGElement, unknown>()
          .scaleExtent([0.2, 4])
          .on("zoom", (event) => {
              container.attr("transform", event.transform);
          });

      svg.call(zoom);
      
      const drag = d3.drag<SVGGElement, FundingNode>()
          .on("start", (event, d) => {
              if (!d) return;
              if (!event.active && simulationRef.current) simulationRef.current.alphaTarget(0.3).restart();
              d.fx = d.x ?? 0;
              d.fy = d.y ?? 0;
              setTooltip(null);
          })
          .on("drag", (event, d) => {
              if (!d) return;
              d.fx = event.x ?? d.fx ?? 0;
              d.fy = event.y ?? d.fy ?? 0;
          })
          .on("end", (event, d) => {
              if (!d) return;
              if (!event.active && simulationRef.current) simulationRef.current.alphaTarget(0);
              // Keep fixed after drag
              // d.fx = null; d.fy = null; 
          });
          
      container.selectAll<SVGGElement, FundingNode>('g.cursor-pointer').call(drag as any);
      
  }, [tick]);

  const handleResetLayout = useCallback(() => {
      nodePositions.current = {};
      localStorage.removeItem('fundingGraphLayout');
      setTick(t => t + 1);
  }, []);

  const handleSaveLayout = useCallback(() => {
      localStorage.setItem('fundingGraphLayout', JSON.stringify(nodePositions.current));
      alert('LAYOUT_SYNC_COMPLETE');
  }, []);

  const handleNodeClickInternal = useCallback((e: React.MouseEvent, node: FundingNode) => {
      onNodeClick(node);
      setModalNode(node);
  }, [onNodeClick]);

  const handleMouseOver = useCallback((e: React.MouseEvent, node: FundingNode) => {
      setHoveredNodeId(node.id);
      setTooltip({ x: e.clientX, y: e.clientY, node });
  }, []);

  const handleMouseOut = useCallback(() => {
      setHoveredNodeId(null);
      setTooltip(null);
  }, []);

  const getNodeOpacity = useCallback((node: FundingNode) => {
      if (activeFocusId) {
          return connectedNodeIds.has(node.id) ? 1.0 : 0.1;
      }
      if (highlightedStatus || searchQuery) {
          const statusMatch = highlightedStatus ? node.status === highlightedStatus : true;
          const searchMatch = searchQuery ? node.label.toLowerCase().includes(searchQuery.toLowerCase()) : true;
          return (statusMatch && searchMatch) ? 1.0 : 0.1;
      }
      return 1.0;
  }, [activeFocusId, connectedNodeIds, highlightedStatus, searchQuery]);

  return (
    <div className="w-full h-full bg-black/40 relative font-mono overflow-hidden">
        <style>{CSS_ANIMATIONS}</style>
        
        {/* Graph Controls */}
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-4">
            <div className="bg-black/60 backdrop-blur-xl p-1 rounded-sm border border-white/10 shadow-2xl flex items-center gap-2">
                <div className="pl-3 text-white/20"><MagnifyingGlassIcon className="w-3 h-3" /></div>
                <input 
                    type="text" 
                    placeholder="SEARCH_NODE..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-2 py-2 text-[10px] font-mono border-none bg-transparent text-white focus:outline-none w-48 uppercase tracking-widest placeholder:text-white/10"
                />
            </div>
        </div>

        <div className="absolute top-6 right-6 z-10 flex items-center gap-4 bg-black/60 backdrop-blur-xl p-2 rounded-sm border border-white/10 shadow-2xl">
            <label className="flex items-center cursor-pointer group px-2">
                <div className="relative">
                    <input type="checkbox" className="sr-only" checked={highlightConnected} onChange={() => setHighlightConnected(!highlightConnected)} />
                    <div className={`block w-8 h-4 rounded-full transition-colors ${highlightConnected ? 'bg-brand-primary' : 'bg-white/10'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-2 h-2 rounded-full transition-transform ${highlightConnected ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <div className="ml-3 text-[9px] font-mono font-bold text-white/40 group-hover:text-white transition-colors uppercase tracking-widest">
                    Focus_Mode
                </div>
            </label>
            <div className="w-px h-4 bg-white/10"></div>
            <button onClick={handleSaveLayout} className="text-[9px] font-mono font-bold text-white/40 hover:text-brand-primary transition-colors uppercase tracking-widest px-2">SAVE</button>
            <button onClick={handleResetLayout} className="text-[9px] font-mono font-bold text-white/40 hover:text-brand-primary transition-colors uppercase tracking-widest px-2">RESET</button>
        </div>

        <svg ref={svgRef} className="w-full h-full" viewBox="-500 -400 1000 800">
            <defs>
                <marker id="arrowhead" viewBox="-0 -5 10 10" refX={35} refY={0} orient="auto" markerWidth={5} markerHeight={5}>
                    <path d="M0,-5L10,0L0,5" fill="rgba(255,255,255,0.2)" />
                </marker>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g ref={containerRef}>
                {/* Edges */}
                <g>
                    {simLinks.current.map((link, i) => {
                        const sourceId = typeof link.source === 'object' ? (link.source as FundingNode).id : link.source as string;
                        const targetId = typeof link.target === 'object' ? (link.target as FundingNode).id : link.target as string;
                        
                        const isFocused = activeFocusId === sourceId || activeFocusId === targetId;
                        const isDimmed = !!activeFocusId && !isFocused;
                        const isConnected = isFocused && highlightConnected;
                        const isPrerequisite = isFocused && link.type === 'prerequisite';
                        
                        return (
                            <EdgeView 
                                key={i} 
                                link={link} 
                                isSelected={targetId === selectedNodeId} 
                                isPrerequisite={isPrerequisite} 
                                isConnected={isConnected} 
                                highlightConnected={highlightConnected} 
                                isDimmed={isDimmed}
                            />
                        );
                    })}
                </g>
                {/* Nodes */}
                <g>
                    {simNodes.current.map(node => {
                        const isSelected = node.id === selectedNodeId;
                        const isHovered = node.id === hoveredNodeId;
                        const isPrerequisite = prerequisiteNodeIds.has(node.id);
                        const isConnected = connectedNodeIds.has(node.id);
                        const opacity = getNodeOpacity(node);
                        
                        return (
                            <NodeView 
                                key={node.id} 
                                node={node} 
                                isSelected={isSelected} 
                                isHovered={isHovered}
                                isPrerequisite={isPrerequisite} 
                                isConnected={isConnected} 
                                highlightConnected={highlightConnected}
                                onClick={handleNodeClickInternal}
                                onMouseOver={handleMouseOver}
                                onMouseOut={handleMouseOut}
                                onMouseMove={handleMouseOver}
                                opacity={opacity}
                            />
                        );
                    })}
                </g>
            </g>
        </svg>

        <GraphLegend />

        {/* Enhanced Tooltip */}
        <AnimatePresence>
            {tooltip && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="fixed z-50 bg-black/90 backdrop-blur-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-sm p-4 pointer-events-none max-w-xs"
                    style={{ left: tooltip.x + 20, top: tooltip.y + 20 }}
                >
                    <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                        <span className="text-[8px] font-mono font-bold text-brand-primary uppercase tracking-widest">{tooltip.node.group}</span>
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-sm border ${statusColors[tooltip.node.status] ? 'text-white' : 'text-white/40'}`} style={{ backgroundColor: statusColors[tooltip.node.status] + '40', borderColor: statusColors[tooltip.node.status] + '60' }}>
                            {tooltip.node.status.toUpperCase()}
                        </span>
                    </div>
                    <h4 className="font-serif italic text-base text-white mb-2 tracking-tight">{tooltip.node.label}</h4>
                    <div className="space-y-2">
                        {tooltip.node.details.amount && (
                            <div className="flex justify-between items-center bg-white/5 p-2 rounded-sm">
                                <span className="text-[8px] font-mono text-white/30 uppercase">Volume</span>
                                <span className="text-[10px] font-mono text-brand-secondary font-bold">{tooltip.node.details.amount}</span>
                            </div>
                        )}
                        {tooltip.node.details.description && (
                            <p className="text-[10px] font-mono text-white/50 leading-relaxed line-clamp-3 italic">
                                "{tooltip.node.details.description}"
                            </p>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {modalNode && (
            <NodeModal 
                node={modalNode} 
                onClose={() => setModalNode(null)} 
                onStatusChange={(nodeId, newStatus) => {
                    if (onStatusChange) {
                        onStatusChange(nodeId, newStatus);
                        setModalNode(prev => prev ? { ...prev, status: newStatus } : null);
                    }
                }} 
                onArchive={(nodeId) => {
                    if (onArchive) {
                        onArchive(nodeId);
                        setModalNode(null);
                    }
                }}
            />
        )}
    </div>
  );
};

export default React.memo(FundingGraph);