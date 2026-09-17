import React from 'react';

const groupColors: Record<string, string> = {
    Project: '#0D47A1', 
    Partners: '#00796B', 
    Technology: '#8E24AA', 
    FFG: '#F57C00', 
    AWS: '#D32F2F', 
    Regional: '#FBC02D', 
    Strategy: '#303F9F',
    Guide: '#0097A7',
    EU: '#1A237E',
};

const GraphLegend: React.FC = () => (
    <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md p-4 rounded-sm shadow-2xl border border-white/10 pointer-events-auto flex gap-6 text-[10px] font-mono">
        <div>
            <h4 className="font-serif italic text-xs mb-3 text-white/40 border-b pb-1 border-white/10 uppercase tracking-widest">CATEGORIES_FILL</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {Object.entries(groupColors).map(([group, color]) => (
                    <div key={group} className="flex items-center">
                        <div className="w-2 h-2 rounded-sm mr-2" style={{ backgroundColor: color }}></div>
                        <span className="font-bold text-white/60 uppercase tracking-tighter">{group}</span>
                    </div>
                ))}
            </div>
        </div>
        <div className="border-l border-white/10 pl-6">
            <h4 className="font-serif italic text-xs mb-3 text-white/40 border-b pb-1 border-white/10 uppercase tracking-widest">STATUS_BORDER</h4>
            <div className="flex flex-col gap-y-1.5">
                <div className="flex items-center">
                    <div className="w-2 h-2 rounded-sm mr-2 border border-status-approved" style={{ backgroundColor: 'transparent' }}></div>
                    <span className="font-bold text-white/60 uppercase tracking-tighter">APPROVED</span>
                </div>
                <div className="flex items-center">
                    <div className="w-2 h-2 rounded-sm mr-2 border border-status-pending" style={{ backgroundColor: 'transparent' }}></div>
                    <span className="font-bold text-white/60 uppercase tracking-tighter">SUBMITTED</span>
                </div>
                <div className="flex items-center">
                    <div className="w-2 h-2 rounded-sm mr-2 border border-brand-accent" style={{ backgroundColor: 'transparent' }}></div>
                    <span className="font-bold text-white/60 uppercase tracking-tighter">ACTIVE</span>
                </div>
                <div className="flex items-center">
                    <div className="w-2 h-2 rounded-sm mr-2 border border-status-action" style={{ backgroundColor: 'transparent' }}></div>
                    <span className="font-bold text-white/60 uppercase tracking-tighter">ACTION_REQ</span>
                </div>
                <div className="flex items-center">
                    <div className="w-2 h-2 rounded-sm mr-2 border border-white/20" style={{ backgroundColor: 'transparent' }}></div>
                    <span className="font-bold text-white/60 uppercase tracking-tighter">DONE_FUTURE</span>
                </div>
            </div>
        </div>
        <div className="border-l border-white/10 pl-6">
            <h4 className="font-serif italic text-xs mb-3 text-white/40 border-b pb-1 border-white/10 uppercase tracking-widest">CONNECTIONS</h4>
            <div className="flex flex-col gap-y-1.5">
                <div className="flex items-center">
                    <div className="w-6 h-0.5 mr-2 bg-brand-accent"></div>
                    <span className="font-bold text-white/60 uppercase tracking-tighter">PRIMARY</span>
                </div>
                <div className="flex items-center">
                    <div className="w-6 h-0.5 mr-2 bg-status-approved"></div>
                    <span className="font-bold text-white/60 uppercase tracking-tighter">FINANCIAL</span>
                </div>
                <div className="flex items-center">
                    <div className="w-6 h-0.5 mr-2 border-t border-dashed border-status-action"></div>
                    <span className="font-bold text-white/60 uppercase tracking-tighter">PREREQUISITE</span>
                </div>
                <div className="flex items-center">
                    <div className="w-6 h-0.5 mr-2 border-t border-dotted border-indigo-400"></div>
                    <span className="font-bold text-white/60 uppercase tracking-tighter">SYNERGY</span>
                </div>
            </div>
        </div>
    </div>
);

export default GraphLegend;
