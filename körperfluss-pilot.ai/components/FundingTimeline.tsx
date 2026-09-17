
import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { FundingNode, NodeStatus } from '../types';
import { InformationCircleIcon } from './Icons';

interface FundingTimelineProps {
  nodes: FundingNode[];
  onNodeClick: (node: FundingNode) => void;
  selectedNodeId?: string | null;
}

interface TimelineItem {
  node: FundingNode;
  range: {
    start: Date;
    end: Date;
  };
}

// Konstanten für das Layout
const MIN_ITEM_WIDTH = 140; // Minimale Breite in Pixeln, damit Text lesbar bleibt
const ITEM_GAP = 10; // Abstand zwischen Items in Pixeln

const statusConfig: Record<NodeStatus, { bg: string; border: string; text: string; }> = {
  approved: { bg: 'bg-status-approved/20', border: 'border-status-approved', text: 'text-status-approved' },
  pending: { bg: 'bg-status-pending/20', border: 'border-status-pending', text: 'text-status-pending' },
  future: { bg: 'bg-status-future/20', border: 'border-status-future', text: 'text-status-future' },
  action_required: { bg: 'bg-status-action/20', border: 'border-status-action', text: 'text-status-action' },
  active: { bg: 'bg-brand-secondary/20', border: 'border-brand-secondary', text: 'text-brand-secondary' },
  info: { bg: 'bg-indigo-500/10', border: 'border-indigo-500', text: 'text-indigo-500' },
  optional: { bg: 'bg-purple-500/10', border: 'border-purple-500', text: 'text-purple-500' },
  completed: { bg: 'bg-gray-500/10', border: 'border-gray-500', text: 'text-gray-500' },
};

const dateParser = (str: string, referenceYear?: number): Date | null => {
    str = str.toLowerCase();
    const yearMatch = str.match(/(\d{4})/);
    const year = yearMatch ? parseInt(yearMatch[1]) : referenceYear;
    if (!year) return null;

    let month = 0;
    const monthMap: { [key: string]: number } = { 'jan':0, 'jän':0, 'januar':0, 'feb':1, 'februar':1, 'mär':2, 'märz':2, 'apr':3, 'april':3, 'mai':4, 'jun':5, 'juni':5, 'jul':6, 'juli':6, 'aug':7, 'august':7, 'sep':8, 'september':8, 'okt':9, 'oktober':9, 'nov':10, 'november':10, 'dez':11, 'dezember':11 };

    if (str.includes('frühling') || str.includes('frühjahr')) month = 2; // March
    else if (str.includes('sommer')) month = 5; // June
    else if (str.includes('herbst')) month = 8; // September
    else if (str.includes('winter')) month = 11; // December
    else if (str.includes('q1')) month = 0;
    else if (str.includes('q2')) month = 3;
    else if (str.includes('q3')) month = 6;
    else if (str.includes('q4')) month = 9;
    else {
        for (const monthName in monthMap) {
            if (str.includes(monthName)) {
                month = monthMap[monthName];
                break;
            }
        }
    }
    
    const dayMatch = str.match(/(\d{1,2})\./);
    const day = dayMatch ? parseInt(dayMatch[1]) : 1;
    
    return new Date(year, month, day);
};

const timelineParser = (timelineStr: string | undefined): { start: Date; end: Date } | null => {
    if (!timelineStr || !timelineStr.trim() || timelineStr.toLowerCase() === 'erledigt') return null;

    const parts = timelineStr.split(/–|-/).map(p => p.trim());
    const startStr = parts[0];
    const endStr = parts.length > 1 ? parts[1] : startStr;

    let start = dateParser(startStr);
    if (!start) return null;

    let end = dateParser(endStr, start.getFullYear());
    if (!end) return null;

    if (start.getTime() === end.getTime()) {
      const isQuarterOrSeason = /q\d|frühling|frühjahr|sommer|herbst|winter/.test(startStr.toLowerCase());
      end = new Date(start);
      end.setMonth(start.getMonth() + (isQuarterOrSeason ? 3 : 1));
    } else if (end < start) {
        end.setFullYear(start.getFullYear() + (endStr.match(/\d{4}/) ? 0 : 1));
    }

    return { start, end };
};


const FundingTimeline: React.FC<FundingTimelineProps> = ({ nodes, onNodeClick, selectedNodeId }) => {
    const timelineItems = useMemo(() => {
        return nodes
            .map(node => ({ node, range: timelineParser(node.details.timeline) }))
            .filter((item): item is TimelineItem => item.range !== null);
    }, [nodes]);

    const { timeDomain, groupedItems } = useMemo(() => {
        if (timelineItems.length === 0) {
          const now = new Date();
          return { timeDomain: [new Date(now.getFullYear(), 0, 1), new Date(now.getFullYear(), 11, 31)], groupedItems: new Map() };
        }

        const allDates = timelineItems.flatMap(item => [item.range.start, item.range.end]);
        const domain: [Date, Date] = [d3.min(allDates)!, d3.max(allDates)!];
        
        domain[0] = d3.timeMonth.floor(domain[0]);
        domain[0].setMonth(domain[0].getMonth() - 1);
        domain[1] = d3.timeMonth.ceil(domain[1]);
        domain[1].setMonth(domain[1].getMonth() + 1);

        const groups = new Map<string, TimelineItem[]>();
        for (const item of timelineItems) {
            const groupName = item.node.group;
            if (!groups.has(groupName)) groups.set(groupName, []);
            groups.get(groupName)!.push(item);
        }
        return { timeDomain: domain, groupedItems: groups };
    }, [timelineItems]);
    
    const [zoomLevel, setZoomLevel] = React.useState(1);

    // Dynamically calculate width based on the number of months in the domain (e.g., 150px per month)
    const width = useMemo(() => {
        const months = d3.timeMonth.count(timeDomain[0], timeDomain[1]);
        return Math.max(1200, months * 150) * zoomLevel;
    }, [timeDomain, zoomLevel]);
    
    const timeScale = useMemo(() => d3.scaleTime().domain(timeDomain).range([0, width]), [timeDomain, width]);
    const monthTicks = useMemo(() => timeScale.ticks(d3.timeMonth.every(1)), [timeScale]);
    const yearTicks = useMemo(() => timeScale.ticks(d3.timeYear.every(1)), [timeScale]);

    // Layout-Berechnung: Muss NACH timeScale erfolgen, da wir Pixel-Breiten für Kollisionen brauchen
    const laidOutGroups = useMemo(() => {
        return Array.from(groupedItems.entries()).map(([groupName, items]) => {
            // 1. Pixel-Koordinaten berechnen
            const itemsWithPos = items.map(item => {
                const startPx = timeScale(item.range.start);
                const endPxRaw = timeScale(item.range.end);
                const widthRaw = endPxRaw - startPx;
                
                // Hier wird die Mindestbreite erzwungen
                const widthPx = Math.max(widthRaw, MIN_ITEM_WIDTH);
                const endPx = startPx + widthPx;

                return {
                    ...item,
                    startPx,
                    endPx,
                    widthPx
                };
            }).sort((a, b) => a.startPx - b.startPx);

            // 2. Kollisionsprüfung auf Pixel-Ebene
            const levels: typeof itemsWithPos[][] = [];
            
            itemsWithPos.forEach(item => {
                let placed = false;
                for (let i = 0; i < levels.length; i++) {
                    const lastItemInLevel = levels[i][levels[i].length - 1];
                    // Prüfen, ob das neue Item nach dem letzten Item + Gap passt
                    if (lastItemInLevel.endPx + ITEM_GAP < item.startPx) {
                        levels[i].push(item);
                        placed = true;
                        break;
                    }
                }
                if (!placed) levels.push([item]);
            });

            return { groupName, levels };
        });
    }, [groupedItems, timeScale]);

    const today = new Date();
    const todayPosition = timeScale(today);

    const [hoveredItem, setHoveredItem] = React.useState<{item: TimelineItem, x: number, y: number} | null>(null);

    if (timelineItems.length === 0) {
      return (
        <div className="h-full p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 text-gray-300 dark:text-gray-600"><InformationCircleIcon /></div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-4">Keine Zeitdaten</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Für die aktuellen Filter gibt es keine Elemente mit Zeitplan.</p>
        </div>
      );
    }

    return (
        <div className="w-full h-full overflow-auto bg-black/20 p-4 relative font-mono flex flex-col border border-white/5">
            <div className="absolute top-4 right-4 z-30 flex gap-1 bg-black/60 backdrop-blur-md p-1 rounded-sm border border-white/10 shadow-xl">
                <button 
                    onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.2))}
                    className="p-1 text-white/40 hover:text-brand-accent transition-colors"
                    title="Herauszoomen"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
                </button>
                <div className="w-px bg-white/10"></div>
                <button 
                    onClick={() => setZoomLevel(1)}
                    className="px-2 text-[9px] font-mono text-white/40 hover:text-brand-accent transition-colors"
                    title="Zoom zurücksetzen"
                >
                    {Math.round(zoomLevel * 100)}%
                </button>
                <div className="w-px bg-white/10"></div>
                <button 
                    onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.2))}
                    className="p-1 text-white/40 hover:text-brand-accent transition-colors"
                    title="Hineinzoomen"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                </button>
            </div>
            <div className="relative flex-1" style={{ width: `${width}px`, minHeight: '100%' }}>
                <div className="sticky top-0 bg-[#0a0502]/80 backdrop-blur-sm z-20 h-10 border-b border-white/10">
                    {yearTicks.map((year, i) => (
                        <div key={i} className="absolute h-full text-[10px] font-mono font-bold text-white/40" style={{ left: `${timeScale(year)}px` }}>
                            {year.getFullYear()}
                        </div>
                    ))}
                    {monthTicks.map((month, i) => (
                        <div key={i} className="absolute h-full top-5 text-[9px] font-mono text-white/20 border-l border-white/5 pl-1" style={{ left: `${timeScale(month)}px`, height: 'calc(100vh - 40px)' }}>
                           {month.toLocaleString('de-DE', { month: 'short' }).toUpperCase()}
                        </div>
                    ))}
                </div>

                <div className="mt-4 relative">
                    {laidOutGroups.map(({ groupName, levels }) => (
                        <div key={groupName} className="flex items-start mb-2 relative" style={{ minHeight: `${levels.length * 36 + 10}px` }}>
                            <div className="sticky left-0 w-32 pr-4 text-right font-serif italic text-[10px] text-white/40 bg-[#0a0502]/90 z-10 py-1 border-r border-white/10 uppercase tracking-widest">
                                {groupName}
                            </div>
                            <div className="flex-1 h-full relative ml-4">
                                {levels.map((level, levelIndex) =>
                                    level.map((item) => {
                                        const config = statusConfig[item.node.status] || statusConfig.info;
                                        const isSelected = selectedNodeId === item.node.id;
                                        const itemClasses = `
                                            absolute h-8 px-3 flex items-center justify-between rounded-sm border text-left transition-all duration-200 overflow-hidden z-0 hover:z-10
                                            ${config.bg} ${isSelected ? `ring-1 ring-brand-accent ${config.border}`: config.border}
                                            ${item.node.status === 'action_required' ? 'animate-pulse' : ''}
                                        `;
                                        
                                        return (
                                            <button
                                                key={item.node.id}
                                                onClick={() => onNodeClick(item.node)}
                                                onMouseEnter={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    setHoveredItem({ item, x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
                                                }}
                                                onMouseLeave={() => setHoveredItem(null)}
                                                className={itemClasses}
                                                style={{ left: `${item.startPx}px`, width: `${item.widthPx}px`, top: `${levelIndex * 36}px` }}
                                            >
                                                <span className="text-[10px] font-mono whitespace-nowrap overflow-hidden text-ellipsis text-white/80 mr-2">{item.node.label}</span>
                                                {item.node.details.amount && <span className="text-[8px] font-mono font-bold whitespace-nowrap text-white/40 bg-white/5 px-1">{item.node.details.amount}</span>}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {todayPosition > 0 && todayPosition < width && (
                    <div className="absolute top-0 bottom-0 z-30 pointer-events-none" style={{ left: `${todayPosition}px` }}>
                        <div className="h-full w-px bg-status-action/40 shadow-[0_0_8px_rgba(239,68,68,0.3)]"></div>
                        <div className="absolute -top-1 -ml-4 px-1.5 py-0.5 text-[8px] font-mono text-white bg-status-action rounded-sm uppercase tracking-tighter">Heute</div>
                    </div>
                )}
            </div>
            
            {hoveredItem && (
                <div 
                    className="fixed z-50 bg-black/90 backdrop-blur-xl p-3 rounded-sm border border-white/10 max-w-xs pointer-events-none shadow-2xl"
                    style={{ left: Math.min(hoveredItem.x, window.innerWidth - 320), top: hoveredItem.y + 10 }}
                >
                    <div className="text-[8px] font-mono font-bold text-white/30 uppercase mb-1 tracking-widest">{hoveredItem.item.node.status.replace(/_/g, ' ')}</div>
                    <div className="font-serif italic text-sm text-white mb-1">{hoveredItem.item.node.label}</div>
                    <div className="text-[10px] font-mono text-white/50 mb-2 leading-tight">{hoveredItem.item.node.details.description}</div>
                    {hoveredItem.item.node.details.amount && (
                        <div className="text-[9px] font-mono font-semibold text-brand-secondary">BETRAG: {hoveredItem.item.node.details.amount}</div>
                    )}
                    <div className="text-[8px] font-mono text-white/30 mt-1 uppercase">
                        PERIOD: {hoveredItem.item.range.start.toLocaleDateString()} - {hoveredItem.item.range.end.toLocaleDateString()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FundingTimeline;
