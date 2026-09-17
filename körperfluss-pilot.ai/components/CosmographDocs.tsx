import React from 'react';
import { ChartBarIcon, ArrowTopRightOnSquareIcon, DocumentTextIcon, BuildingOfficeIcon } from './Icons';
import { motion } from 'motion/react';

const CosmographDocs: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary shadow-[0_0_20px_rgba(0,255,204,0.15)]">
                    <ChartBarIcon className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-display font-bold text-white tracking-tight">Cosmograph 2.0</h1>
                    <p className="text-sm font-mono text-text-muted mt-1">High-Performance Graph Visualizations</p>
                </div>
            </div>

            <div className="glass-panel p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl rounded-full"></div>
                <h2 className="text-xl font-display font-bold text-white mb-4">Introduction</h2>
                <p className="text-sm text-white/70 leading-relaxed mb-6 font-mono">
                    Welcome to the world of Cosmograph! This documentation will guide you through getting started with our tools for building high-performance graph visualizations.
                </p>
                <div className="p-4 bg-brand-primary/5 border-l-2 border-brand-primary/40 rounded-r-lg text-sm text-brand-primary/90 leading-relaxed">
                    Cosmograph shines when you need to see structure at scale: from knowledge graphs (entities, relationships, and ontologies) and semantic maps built from AI embeddings, to financial transactions and cybersecurity logs.
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 border-t-2 border-t-white/20">
                    <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-2xl">🪐</span> What's new in 2.0?
                    </h3>
                    <p className="text-xs text-white/60 mb-4 leading-relaxed font-mono">
                        Cosmograph 2.0 is a major update making it faster, more powerful, and more flexible. It addresses issues like strict data file size limitations, slow filtering, and limited analytical capabilities.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                            <span className="text-brand-primary mt-0.5">•</span>
                            <span className="text-sm text-white/80">Work with larger datasets and use SQL (via WebAssembly and DuckDB)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-brand-primary mt-0.5">•</span>
                            <span className="text-sm text-white/80">Much better performance for filtering and visual property changes</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-brand-primary mt-0.5">•</span>
                            <span className="text-sm text-white/80">Open Parquet files natively</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-brand-primary mt-0.5">•</span>
                            <span className="text-sm text-white/80">New clustering force and point-dragging functionality</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-brand-primary mt-0.5">•</span>
                            <span className="text-sm text-white/80">Save graphs to the cloud and share them</span>
                        </li>
                    </ul>
                </div>

                <div className="glass-panel p-6 border-t-2 border-t-status-success/40">
                    <h3 className="text-lg font-display font-bold text-white mb-4">Core Technology Stack</h3>
                    <div className="space-y-4 font-mono text-xs text-white/70">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <strong className="text-white block mb-1">DuckDB</strong>
                            The best in-memory analytics database.
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <strong className="text-white block mb-1">Mosaic</strong>
                            The fastest cross-filtering and visual analytics framework for the web.
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <strong className="text-white block mb-1">SQLRooms</strong>
                            Open-source React toolkit for human and agent collaborative analytics apps.
                        </div>
                        <div className="p-3 bg-bg-surface rounded-lg border border-border-strong border-l-2 border-l-brand-primary">
                            <strong className="text-white block mb-1">cosmos.gl</strong>
                            Core force simulation and rendering engine (recently joined OpenJS).
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <a href="#" className="glass-panel p-6 hover:border-brand-primary/40 group transition-all relative overflow-hidden">
                    <div className="absolute right-4 top-4 text-white/20 group-hover:text-brand-primary/40 transition-colors">
                        <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                    </div>
                    <div className="text-2xl mb-3">💻</div>
                    <h4 className="font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">Web Application</h4>
                    <p className="text-xs text-white/50 leading-relaxed">Analyze massive graph datasets and machine learning embeddings directly on your local GPU.</p>
               </a>

               <a href="#" className="glass-panel p-6 hover:border-brand-primary/40 group transition-all relative overflow-hidden">
                    <div className="absolute right-4 top-4 text-white/20 group-hover:text-brand-primary/40 transition-colors">
                        <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                    </div>
                    <div className="text-2xl mb-3">🐍</div>
                    <h4 className="font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">Python Widget</h4>
                    <p className="text-xs text-white/50 leading-relaxed">Interactive widget for Jupyter notebooks. Perfect for data scientists visualizing network graphs.</p>
               </a>

               <a href="#" className="glass-panel p-6 hover:border-brand-primary/40 group transition-all relative overflow-hidden">
                    <div className="absolute right-4 top-4 text-white/20 group-hover:text-brand-primary/40 transition-colors">
                        <DocumentTextIcon className="w-5 h-5" />
                    </div>
                    <div className="text-2xl mb-3">📚</div>
                    <h4 className="font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">React Library</h4>
                    <p className="text-xs text-white/50 leading-relaxed">The fastest web-based library for large network graph visualization built on top of WebGL.</p>
               </a>
            </div>

            <div className="flex items-center justify-between mt-12 py-4 border-t border-white/10 text-[10px] font-mono text-white/30 uppercase">
                <span>© Cosmograph, 2026</span>
                <span className="flex gap-4">
                    <a href="#" className="hover:text-white/60">Privacy Policy</a>
                    <a href="#" className="hover:text-white/60">Terms of Service</a>
                </span>
            </div>
        </div>
    );
};

export default CosmographDocs;
