import React, { useState, useRef } from 'react';
import { generateText, generateImage, generateSpeech, analyzeMedia } from '../services/geminiService';
import { SparklesIcon, ArrowPathIcon, PhotoIcon, MagnifyingGlassIcon, EyeIcon, SpeakerWaveIcon, PaperAirplaneIcon, ArrowUpTrayIcon, XMarkIcon } from './Icons';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

type AgentMode = 'research' | 'creative' | 'vision';

const LokiDashboard: React.FC = () => {
  const [mode, setMode] = useState<AgentMode>('research');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  
  const [creativeType, setCreativeType] = useState<'image' | 'speech'>('image');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [useProImage, setUseProImage] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!query && mode !== 'vision') return;
    if (mode === 'vision' && !selectedFile) return;

    setLoading(true);
    setResponse('');
    setMediaUrl('');
    setStatus('Agent initialisiert...');

    try {
      if (mode === 'research') {
        setStatus('Recherchiere und analysiere...');
        const res = await generateText(query, true, true);
        setResponse(res);
      } else if (mode === 'creative') {
        if (creativeType === 'image') {
            setStatus('Generiere Bild...');
            const url = await generateImage(query, aspectRatio, useProImage);
            setMediaUrl(url);
        } else {
            setStatus('Generiere Sprache...');
            const url = await generateSpeech(query);
            setMediaUrl(url);
        }
      } else if (mode === 'vision') {
        setStatus('Analysiere Bild...');
        if (filePreview) {
            const base64Data = filePreview.split(',')[1];
            const mimeType = selectedFile?.type || 'image/jpeg';
            const res = await analyzeMedia(query || "Beschreibe dieses Bild im Detail.", mimeType, base64Data);
            setResponse(res);
        }
      }
    } catch (e) {
      setResponse(`Fehler bei der Ausführung: ${e instanceof Error ? e.message : 'Unbekannter Fehler'}`);
    }
    setLoading(false);
    setStatus('');
  };

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-3xl rounded-sm overflow-hidden border border-white/10 shadow-2xl relative">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5 pointer-events-none" />
      
      <header className="p-6 border-b border-white/5 bg-white/5 backdrop-blur-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="w-12 h-12 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center text-white"
          >
            <SparklesIcon className="w-6 h-6 text-brand-primary" />
          </motion.div>
          <div>
            <h3 className="text-xl font-serif italic text-white tracking-tight">Command_Center</h3>
            <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em] mt-0.5">Multi-Agent Orchestration v2.1</p>
          </div>
        </div>

        <div className="flex bg-white/5 p-1 rounded-sm border border-white/10">
          {[
            { id: 'research', label: 'Research', icon: <MagnifyingGlassIcon className="w-4 h-4" /> },
            { id: 'creative', label: 'Creative', icon: <PhotoIcon className="w-4 h-4" /> },
            { id: 'vision', label: 'Vision', icon: <EyeIcon className="w-4 h-4" /> }
          ].map((m) => (
            <motion.button
              key={m.id}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode(m.id as AgentMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-[10px] font-mono uppercase tracking-widest transition-all duration-200 ${mode === m.id ? 'bg-white/10 text-white border border-white/20' : 'text-white/40 hover:text-white/60'}`}
            >
              {m.icon}
              {m.label}
            </motion.button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center space-y-6"
            >
              <div className="relative">
                <div className="w-16 h-16 border border-white/5 border-t-brand-primary rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-brand-primary animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-lg font-serif italic text-white tracking-tight">{status}</p>
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">System_Processing_Active</p>
              </div>
            </motion.div>
          ) : response || mediaUrl ? (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              {response && (
                <div className="p-8 rounded-sm border border-white/10 bg-white/5 backdrop-blur-xl">
                  <div className="prose prose-invert max-w-none prose-p:text-xs prose-p:font-mono prose-p:leading-relaxed prose-strong:text-brand-primary prose-strong:font-mono prose-headings:font-serif prose-headings:italic prose-table:rounded-sm prose-table:overflow-hidden prose-th:bg-white/10 prose-th:text-white prose-th:p-3 prose-td:p-3 prose-td:border-b prose-td:border-white/5 prose-td:text-[10px] prose-td:font-mono">
                    <ReactMarkdown>{response}</ReactMarkdown>
                  </div>
                </div>
              )}
              {mediaUrl && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center p-8 rounded-sm border border-white/10 bg-white/5 backdrop-blur-xl"
                >
                  {creativeType === 'image' ? (
                      <img src={mediaUrl} alt="Generated" className="max-w-full max-h-[600px] rounded-sm shadow-2xl border border-white/10" />
                  ) : (
                      <div className="w-full max-w-md bg-black/40 p-8 rounded-sm flex flex-col items-center gap-6 shadow-2xl border border-white/5">
                        <motion.div 
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="w-16 h-16 bg-brand-primary/10 rounded-sm flex items-center justify-center"
                        >
                          <SpeakerWaveIcon className="w-8 h-8 text-brand-primary" />
                        </motion.div>
                        <audio controls src={mediaUrl} className="w-full accent-brand-primary rounded-sm" />
                      </div>
                  )}
                </motion.div>
              )}
              <div className="flex justify-center">
                <motion.button 
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setResponse(''); setMediaUrl(''); }}
                  className="px-8 py-3 bg-white/5 border border-white/10 text-white/40 hover:text-white rounded-sm text-[10px] font-mono uppercase tracking-widest transition-all"
                >
                  Reset_Command_Node
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-6"
            >
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center text-white/20">
                {mode === 'research' && <MagnifyingGlassIcon className="w-10 h-10" />}
                {mode === 'creative' && <PhotoIcon className="w-10 h-10" />}
                {mode === 'vision' && <EyeIcon className="w-10 h-10" />}
              </div>
              <div>
                <h4 className="text-2xl font-serif italic text-white tracking-tight">
                  {mode === 'research' && "Deep_Research_Node"}
                  {mode === 'creative' && "Creative_Media_Lab"}
                  {mode === 'vision' && "Vision_Intelligence"}
                </h4>
                <p className="text-white/40 mt-3 text-sm font-mono leading-relaxed uppercase tracking-wider">
                  {mode === 'research' && "Strategic analysis via Google Search and Deep Thinking protocols."}
                  {mode === 'creative' && "Synthesis of high-fidelity visual and auditory assets."}
                  {mode === 'vision' && "Advanced neural analysis of visual and document data."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="p-8 bg-white/5 backdrop-blur-2xl border-t border-white/5 space-y-6 relative z-10">
        <div className="flex flex-wrap gap-4">
          {mode === 'creative' && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 bg-white/5 p-1 rounded-sm border border-white/10"
            >
              <div className="flex p-1 bg-white/5 rounded-sm">
                <button 
                  onClick={() => setCreativeType('image')}
                  className={`px-4 py-1.5 rounded-sm text-[9px] font-mono uppercase tracking-widest transition-all duration-200 ${creativeType === 'image' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
                >
                  Image
                </button>
                <button 
                  onClick={() => setCreativeType('speech')}
                  className={`px-4 py-1.5 rounded-sm text-[9px] font-mono uppercase tracking-widest transition-all duration-200 ${creativeType === 'speech' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
                >
                  Audio
                </button>
              </div>
              {creativeType === 'image' && (
                <div className="flex items-center gap-4 px-2">
                  <select 
                    value={aspectRatio} 
                    onChange={e => setAspectRatio(e.target.value)} 
                    className="bg-transparent text-[10px] font-mono uppercase tracking-widest text-white/60 focus:outline-none cursor-pointer"
                  >
                    <option value="1:1" className="bg-[#0a0502]">1:1 Square</option>
                    <option value="16:9" className="bg-[#0a0502]">16:9 Landscape</option>
                    <option value="9:16" className="bg-[#0a0502]">9:16 Portrait</option>
                  </select>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={useProImage} onChange={e => setUseProImage(e.target.checked)} className="hidden" />
                    <div className={`w-4 h-4 rounded-sm border transition-all flex items-center justify-center ${useProImage ? 'bg-brand-primary border-brand-primary' : 'border-white/20 group-hover:border-brand-primary'}`}>
                      {useProImage && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 group-hover:text-white/60">Pro_Mode</span>
                  </label>
                </div>
              )}
            </motion.div>
          )}

          {mode === 'vision' && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <motion.button 
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 px-6 py-3 bg-white/10 text-white rounded-sm transition-all text-[10px] font-mono uppercase tracking-widest border border-white/10"
              >
                <ArrowUpTrayIcon className="w-4 h-4" />
                Upload_Asset
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </motion.button>
              <AnimatePresence>
                {filePreview && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-3 bg-white/5 p-1.5 pr-4 rounded-sm border border-white/10"
                  >
                    <img src={filePreview} alt="Preview" className="h-10 w-10 object-cover rounded-sm border border-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-white uppercase tracking-wider truncate max-w-[120px]">{selectedFile?.name}</span>
                      <button 
                        onClick={() => { setSelectedFile(null); setFilePreview(''); }}
                        className="text-[8px] font-mono text-rose-500 uppercase tracking-widest hover:underline text-left"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-sm text-white font-mono text-sm focus:ring-1 focus:ring-brand-primary/40 focus:border-brand-primary/60 focus:outline-none transition-all placeholder:text-white/20" 
              placeholder={mode === 'vision' ? "Frage zum Bild (optional)..." : "Enter command query..."} 
              onKeyDown={e => e.key === 'Enter' && handleSend()} 
              disabled={loading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <motion.div 
                animate={loading ? { opacity: [0.3, 1, 0.3] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
                className={`w-2 h-2 rounded-full ${loading ? 'bg-brand-primary shadow-[0_0_8px_rgba(242,125,38,0.5)]' : 'bg-white/10'}`} 
              />
            </div>
          </div>
          <motion.button 
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSend} 
            disabled={loading || (!query && mode !== 'vision') || (mode === 'vision' && !selectedFile)} 
            className="h-14 px-8 bg-white/10 text-white rounded-sm flex items-center gap-3 border border-white/10 disabled:opacity-30 transition-all"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest">Execute</span>
            <PaperAirplaneIcon className="w-4 h-4 -rotate-45" />
          </motion.button>
        </div>
      </footer>
    </div>
  );
};

export default LokiDashboard;

