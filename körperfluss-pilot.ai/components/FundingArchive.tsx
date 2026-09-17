
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FundingNode, Document, Comment } from '../types';
import { 
  DocumentTextIcon, 
  DocumentArrowUpIcon, 
  ChatBubbleLeftIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  XMarkIcon,
  PlusIcon,
  UserIcon,
  ClockIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from './Icons';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface FundingArchiveProps {
  nodes: FundingNode[];
  setNodes: React.Dispatch<React.SetStateAction<FundingNode[]>>;
}

interface GroupedDocument {
  nodeLabel: string;
  nodeId: string;
  documents: Document[];
}

// Validation constants
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.xlsx'];
const ALLOWED_EXTENSIONS_STRING = ALLOWED_EXTENSIONS.join(',');
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface StagedFile {
  file: File;
  isValid: boolean;
  error?: string;
}

const FundingArchive: React.FC<FundingArchiveProps> = ({ nodes, setNodes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNodeId, setFilterNodeId] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [newCommentTexts, setNewCommentTexts] = useState<Record<string, string>>({});
  const [currentUser, setCurrentUser] = useState<'Sascha' | 'Peter' | 'Lisa'>('Sascha');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const openModal = () => {
    setUploadError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isUploading) return;
    setIsModalOpen(false);
    setStagedFiles([]);
    setUploadError('');
    setUploadProgress(0);
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newStagedFiles: StagedFile[] = Array.from(files).map(file => {
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      let isValid = true;
      let error = '';

      if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
        isValid = false;
        error = `INVALID_TYPE: ${ALLOWED_EXTENSIONS.join(', ')}`;
      } else if (file.size > MAX_FILE_SIZE_BYTES) {
        isValid = false;
        error = `SIZE_EXCEEDED: MAX ${MAX_FILE_SIZE_MB}MB`;
      }

      return { file, isValid, error };
    });

    setStagedFiles(prev => [...prev, ...newStagedFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setStagedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleAddDocument = () => {
    const validFiles = stagedFiles.filter(f => f.isValid).map(f => f.file);
    if (validFiles.length === 0 || !selectedNodeId) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          const newDocuments = validFiles.map(file => ({
            name: file.name.replace(/\.[^/.]+$/, ""),
            url: URL.createObjectURL(file),
            comments: [],
            addedAt: new Date().toISOString()
          }));

          setNodes(prevNodes => {
            const newNodes = prevNodes.map(node => {
              if (node.id === selectedNodeId) {
                const updatedDocs = [...(node.details.documents || []), ...newDocuments];
                const updatedNode = { ...node, details: { ...node.details, documents: updatedDocs } };
                updateDoc(doc(db, 'nodes', node.id), { details: updatedNode.details }).catch(console.error);
                return updatedNode;
              }
              return node;
            });
            return newNodes;
          });

          setIsUploading(false);
          setIsModalOpen(false);
          setStagedFiles([]);
          setUploadError('');
          setSelectedNodeId('');
          return 100;
        }
        return prev + 15;
      });
    }, 200);
  };

  const handleAddComment = (nodeId: string, docIndex: number) => {
    const key = `${nodeId}-${docIndex}`;
    const text = newCommentTexts[key] || '';
    if (!text.trim()) return;

    setNodes(prevNodes => {
      const newNodes = prevNodes.map(node => {
        if (node.id === nodeId && node.details.documents) {
          const updatedDocs = [...node.details.documents];
          const document = updatedDocs[docIndex];
          const newComment: Comment = {
            id: Date.now().toString(),
            author: currentUser,
            text: text,
            timestamp: new Date().toISOString()
          };
          updatedDocs[docIndex] = { ...document, comments: [...(document.comments || []), newComment] };
          const updatedNode = { ...node, details: { ...node.details, documents: updatedDocs } };
          updateDoc(doc(db, 'nodes', node.id), { details: updatedNode.details }).catch(console.error);
          return updatedNode;
        }
        return node;
      });
      return newNodes;
    });
    setNewCommentTexts(prev => ({ ...prev, [key]: '' }));
  };

  const groupedAndFilteredDocuments = useMemo(() => {
    let grouped: GroupedDocument[] = nodes
      .filter(node => node.details.documents && node.details.documents.length > 0)
      .filter(node => filterNodeId === 'All' || node.id === filterNodeId)
      .map(node => ({
        nodeLabel: node.label,
        nodeId: node.id,
        documents: node.details.documents || [],
      }));

    if (searchTerm.trim()) {
      const lowercasedFilter = searchTerm.toLowerCase();
      grouped = grouped.map(group => {
          const filteredDocs = group.documents.filter(doc => doc.name.toLowerCase().includes(lowercasedFilter));
          if (group.nodeLabel.toLowerCase().includes(lowercasedFilter)) return { ...group };
          if (filteredDocs.length > 0) return { ...group, documents: filteredDocs };
          return null;
        }).filter((group): group is GroupedDocument => group !== null);
    }

    return grouped.map(group => {
        const sortedDocs = [...group.documents].sort((a, b) => {
            if (sortBy === 'name') {
                return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            } else {
                const dateA = (a as any).addedAt ? new Date((a as any).addedAt).getTime() : 0;
                const dateB = (b as any).addedAt ? new Date((b as any).addedAt).getTime() : 0;
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            }
        });
        return { ...group, documents: sortedDocs };
    });
  }, [nodes, searchTerm, filterNodeId, sortBy, sortOrder]);

  const totalDocsCount = useMemo(() => {
      return nodes.reduce((count, node) => count + (node.details.documents?.length || 0), 0);
  }, [nodes]);

  const toggleSortOrder = () => {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-6 bg-transparent">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center text-brand-primary">
            <DocumentTextIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-serif italic text-white tracking-tight">Document_Archive_Log</h2>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">Central_Repository_v1.0 // All_Funding_Docs</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/20">
              <UserIcon className="w-3.5 h-3.5" />
            </div>
            <select 
              value={currentUser} 
              onChange={(e) => setCurrentUser(e.target.value as any)}
              className="pl-9 pr-8 py-2 bg-white/5 border border-white/10 rounded-sm text-[10px] font-mono font-bold focus:ring-1 focus:ring-brand-primary/40 outline-none appearance-none cursor-pointer transition-all text-white/60 uppercase tracking-widest hover:bg-white/10"
            >
              <option value="Sascha">Operator_Sascha</option>
              <option value="Peter">Operator_Peter</option>
              <option value="Lisa">Operator_Lisa</option>
            </select>
          </div>
          
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={openModal}
            className="flex items-center gap-3 px-6 py-2 bg-brand-primary text-white font-bold rounded-sm shadow-lg shadow-brand-primary/20 transition-all text-[10px] font-mono uppercase tracking-widest"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add_Entry</span>
          </motion.button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-black/40 backdrop-blur-3xl p-4 rounded-sm border border-white/10 flex flex-col md:flex-row gap-4 items-center shadow-2xl">
        <div className="relative flex-grow w-full">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20">
            <MagnifyingGlassIcon className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Search_Archive..." 
            className="w-full pl-11 pr-4 py-2 bg-white/5 border border-white/10 rounded-sm text-[10px] font-mono focus:ring-1 focus:ring-brand-primary/40 outline-none transition-all text-white/60 placeholder:text-white/10 uppercase tracking-widest"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-56">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20">
              <FunnelIcon className="w-3.5 h-3.5" />
            </div>
            <select 
              value={filterNodeId} 
              onChange={(e) => setFilterNodeId(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-white/5 border border-white/10 rounded-sm text-[10px] font-mono focus:ring-1 focus:ring-brand-primary/40 outline-none appearance-none cursor-pointer transition-all text-white/60 uppercase tracking-widest hover:bg-white/10"
            >
              <option value="All">All_Nodes</option>
              {nodes.filter(n => n.details.documents && n.details.documents.length > 0).map(node => (
                <option key={node.id} value={node.id}>{node.label.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-white/5 border border-white/10 rounded-sm overflow-hidden">
            <div className="pl-3 text-white/20">
              <ArrowsUpDownIcon className="w-3.5 h-3.5" />
            </div>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as 'name' | 'date')}
              className="pl-3 pr-2 py-2 bg-transparent text-[10px] font-mono font-bold focus:outline-none border-none appearance-none cursor-pointer text-white/60 uppercase tracking-widest hover:bg-white/5"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
            </select>
            <button 
              onClick={toggleSortOrder}
              className="px-4 py-2 hover:bg-white/10 text-white/40 border-l border-white/10 transition-colors text-[10px] font-mono font-bold uppercase tracking-widest"
              title={sortOrder === 'asc' ? 'ASC' : 'DESC'}
            >
              {sortOrder}
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {totalDocsCount === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/10 rounded-sm bg-black/20"
            >
              <div className="w-16 h-16 bg-white/5 rounded-sm flex items-center justify-center text-white/10 mb-6 border border-white/5">
                <DocumentTextIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif italic text-white/40 tracking-tight">Archive_Empty</h3>
              <p className="text-[10px] font-mono text-white/20 max-w-xs mt-3 uppercase tracking-widest">No_Documents_Detected_In_System</p>
            </motion.div>
          ) : groupedAndFilteredDocuments.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 text-white/20 text-[10px] font-mono uppercase tracking-widest"
            >
              <p>No_Results_For_Query: "{searchTerm}"</p>
            </motion.div>
          ) : (
            <div className="space-y-10">
              {groupedAndFilteredDocuments.map((group, groupIdx) => (
                <motion.div 
                  key={group.nodeId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIdx * 0.05 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-primary px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-sm">{group.nodeLabel}</span>
                    <div className="h-px flex-grow bg-white/10"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {group.documents.map((doc, index) => (
                      <motion.div 
                        key={`${group.nodeId}-${index}`}
                        className="bg-black/40 backdrop-blur-3xl p-6 rounded-sm border border-white/10 flex flex-col h-full hover:border-brand-primary/40 transition-all shadow-xl group"
                      >
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 text-white/40 border border-white/10 rounded-sm flex items-center justify-center flex-shrink-0 group-hover:text-brand-primary group-hover:border-brand-primary/40 transition-all">
                              <DocumentTextIcon className="w-6 h-6" />
                            </div>
                            <div>
                              <a 
                                href={doc.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-sm font-serif italic text-white hover:text-brand-primary transition-colors line-clamp-1 tracking-tight"
                              >
                                {doc.name}
                              </a>
                              <div className="flex items-center gap-4 mt-2 text-[9px] font-mono text-white/30 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5">
                                  <ClockIcon className="w-3 h-3" />
                                  {new Date((doc as any).addedAt || Date.now()).toLocaleDateString('de-DE')}
                                </span>
                                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                                <span className="flex items-center gap-1.5">
                                    <ChatBubbleLeftIcon className="w-3 h-3" />
                                    {(doc.comments || []).length}_Comments
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Comments Section */}
                        <div className="mt-auto pt-6 border-t border-white/10">
                          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {(doc.comments || []).length === 0 ? (
                              <p className="text-[9px] font-mono text-white/10 italic py-2 uppercase tracking-widest">No_Comments_Logged</p>
                            ) : (
                              (doc.comments || []).map(comment => (
                                <div key={comment.id} className="bg-white/5 p-3 rounded-sm border border-white/5">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-[9px] font-mono font-bold text-brand-primary uppercase tracking-widest">{comment.author}</span>
                                    <span className="text-[8px] font-mono text-white/20">{new Date(comment.timestamp).toLocaleString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  <p className="text-[11px] text-white/60 leading-relaxed font-mono">{comment.text}</p>
                                </div>
                              ))
                            )}
                          </div>
                          
                          <div className="relative flex items-center gap-3">
                            <input 
                              type="text" 
                              value={newCommentTexts[`${group.nodeId}-${index}`] || ''}
                              onChange={(e) => setNewCommentTexts(prev => ({ ...prev, [`${group.nodeId}-${index}`]: e.target.value }))}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddComment(group.nodeId, index)}
                              placeholder="Add_Comment..." 
                              className="flex-grow pl-4 pr-10 py-2 bg-black/40 border border-white/10 rounded-sm text-[10px] font-mono focus:ring-1 focus:ring-brand-primary/40 outline-none transition-all text-white/60 placeholder:text-white/10 uppercase tracking-widest"
                            />
                            <button 
                              onClick={() => handleAddComment(group.nodeId, index)}
                              className="absolute right-2 p-1.5 text-white/20 hover:text-brand-primary rounded-sm transition-colors"
                            >
                              <ChatBubbleLeftIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-mono overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0502] rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-primary/10 border border-brand-primary/20 rounded-sm flex items-center justify-center text-brand-primary">
                        <DocumentArrowUpIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-lg font-serif italic text-white tracking-tight">New_Entry_Wizard</h4>
                        <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Secure_Data_Ingestion_Protocol // v1.0.4</p>
                    </div>
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-white/5 rounded-sm border border-white/5 transition-colors group">
                  <XMarkIcon className="w-5 h-5 text-white/40 group-hover:text-white" />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
                {/* File Dropzone */}
                <div className="space-y-4">
                  <label className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-1 bg-brand-primary rounded-full shadow-[0_0_5px_rgba(0,102,255,1)]" />
                      Upload_Data_Stream
                  </label>
                  <label 
                    className={`w-full flex flex-col items-center justify-center p-12 border border-dashed rounded-sm cursor-pointer transition-all ${
                      isDragging 
                        ? 'border-brand-primary bg-brand-primary/5' 
                        : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="w-12 h-12 text-brand-primary mb-4 opacity-60">
                      <DocumentArrowUpIcon />
                    </div>
                    <p className="text-[11px] font-mono text-white/40 text-center uppercase tracking-widest leading-relaxed">
                      <span className="font-bold text-brand-primary">Click_To_Browse</span><br/>Or_Drag_Drop_Files
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                        <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest px-2 py-1 bg-white/5 rounded-sm border border-white/5">PDF, DOCX, XLSX</span>
                        <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest px-2 py-1 bg-white/5 rounded-sm border border-white/5">Max_Size: {MAX_FILE_SIZE_MB}MB</span>
                    </div>
                    <input type="file" className="hidden" multiple onChange={(e) => handleFileChange(e.target.files)} accept={ALLOWED_EXTENSIONS_STRING} />
                  </label>
                  
                  {/* Staged Files List */}
                  {stagedFiles.length > 0 && (
                    <div className="bg-white/5 p-4 rounded-sm border border-white/10 shadow-inner">
                      <p className="text-[9px] font-mono font-bold text-white/20 uppercase tracking-widest mb-4 flex items-center justify-between">
                          <span>Staged_Files ({stagedFiles.length})</span>
                          <span className="text-brand-primary/40">Ready_For_Commit</span>
                      </p>
                      <ul className="space-y-3">
                        {stagedFiles.map((sf, i) => (
                          <li key={i} className={`text-[10px] flex items-center gap-4 font-mono p-3 border rounded-sm transition-all ${sf.isValid ? 'text-white/60 border-white/5 bg-white/5' : 'text-red-400 border-red-500/30 bg-red-500/5'}`}>
                            <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 ${sf.isValid ? 'bg-white/5 text-brand-primary/60' : 'bg-red-500/10 text-red-500'}`}>
                              <DocumentTextIcon className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col min-w-0 flex-grow">
                              <span className="truncate uppercase tracking-tight font-bold">{sf.file.name}</span>
                              {!sf.isValid && (
                                <span className="text-[8px] font-bold uppercase tracking-tighter text-red-500 mt-1 flex items-center gap-1">
                                  <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                                  {sf.error}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                              <span className="text-[9px] font-mono text-white/20">{(sf.file.size / 1024 / 1024).toFixed(2)}MB</span>
                              <button 
                                onClick={() => handleRemoveFile(i)}
                                className="p-1.5 hover:bg-red-500/20 rounded-sm text-white/20 hover:text-red-500 transition-colors"
                              >
                                <XMarkIcon className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {uploadError && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[10px] font-mono text-red-500 font-bold bg-red-500/10 p-4 border border-red-500/20 rounded-sm uppercase tracking-widest flex items-center gap-3"
                    >
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                      Error: {uploadError}
                    </motion.p>
                  )}
                </div>

                {/* Node Assignment */}
                <div className="space-y-4">
                  <label className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-1 bg-brand-primary rounded-full shadow-[0_0_5px_rgba(0,102,255,1)]" />
                      Target_Node_Assignment
                  </label>
                  <div className="relative">
                    <select 
                        value={selectedNodeId} 
                        onChange={(e) => setSelectedNodeId(e.target.value)} 
                        disabled={isUploading} 
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-[11px] font-mono font-bold focus:ring-1 focus:ring-brand-primary/40 outline-none appearance-none cursor-pointer transition-all text-white/60 uppercase tracking-widest disabled:opacity-30 hover:bg-white/10"
                    >
                        <option value="" disabled>Select_Node_ID...</option>
                        {nodes.map(node => <option key={node.id} value={node.id}>{node.label.toUpperCase()}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/20">
                        <ChevronDownIcon className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                {isUploading && (
                  <div className="space-y-3 pt-4">
                    <div className="flex justify-between text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">
                      <span className="flex items-center gap-2">
                          <ArrowPathIcon className="w-3 h-3 animate-spin" />
                          Uploading_Stream...
                      </span>
                      <span className="text-brand-primary">{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-white/5 border border-white/10 rounded-sm h-1.5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="bg-brand-primary h-full shadow-[0_0_10px_rgba(0,102,255,0.5)]"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Modal Footer */}
              <div className="p-6 bg-black/40 flex justify-end gap-3 border-t border-white/10 shrink-0">
                <button 
                  onClick={closeModal} 
                  disabled={isUploading} 
                  className="px-8 py-3 rounded-sm text-white/40 text-[10px] font-mono font-bold hover:bg-white/5 border border-white/5 transition-colors disabled:opacity-30 uppercase tracking-widest"
                >
                  Abort
                </button>
                <button 
                  onClick={handleAddDocument} 
                  disabled={stagedFiles.length === 0 || stagedFiles.some(f => !f.isValid) || !selectedNodeId || isUploading} 
                  className="px-10 py-3 bg-brand-primary text-white text-[10px] font-mono font-bold rounded-sm shadow-xl shadow-brand-primary/20 hover:bg-brand-primary/90 disabled:bg-white/5 disabled:text-white/20 disabled:border-white/5 disabled:shadow-none transition-all uppercase tracking-widest flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                      Saving_Data...
                    </>
                  ) : (
                    <>
                      {stagedFiles.some(f => !f.isValid) && <ExclamationTriangleIcon className="w-3.5 h-3.5 text-red-500" />}
                      Commit_Entry
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FundingArchive;

