import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage, ChatMessage } from '../services/geminiService';
import { SparklesIcon, PaperAirplaneIcon, PhotoIcon, XMarkIcon, MagnifyingGlassIcon, LightBulbIcon, TrashIcon } from './Icons';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<{ mimeType: string; data: string } | undefined>(undefined);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      
      const mimeType = base64String.split(';')[0].split(':')[1];
      const data = base64String.split(',')[1];
      setImageData({ mimeType, data });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageData(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !imageData) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: input,
      image: imageData
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setImagePreview(null);
    setImageData(undefined);
    setLoading(true);

    try {
      const response = await sendChatMessage(messages, input, imageData, useThinking, useSearch);
      
      const modelMessage: ChatMessage = {
        role: 'model',
        text: response.text,
        groundingUrls: response.groundingUrls
      };
      
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Ein Fehler ist aufgetreten.' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-3xl rounded-sm overflow-hidden border border-white/10 shadow-2xl relative">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5 pointer-events-none" />
      
      <header className="p-6 border-b border-white/5 bg-white/5 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="w-12 h-12 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center text-white"
          >
            <SparklesIcon className="w-6 h-6 text-brand-primary" />
          </motion.div>
          <div>
            <h3 className="text-xl font-serif italic text-white tracking-tight">Loki AI Chat</h3>
            <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em] mt-0.5">Multi-Modal Intelligence • Loki v2.5</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setUseThinking(!useThinking)}
            className={`p-2.5 rounded-sm transition-all duration-300 border ${useThinking ? 'bg-brand-primary border-brand-primary/50 text-white shadow-lg shadow-brand-primary/20' : 'bg-white/5 text-white/40 border-white/10 hover:text-white hover:bg-white/10'}`}
            title="Thinking Mode"
          >
            <LightBulbIcon className="w-5 h-5" />
          </motion.button>
          <motion.button 
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setUseSearch(!useSearch)}
            className={`p-2.5 rounded-sm transition-all duration-300 border ${useSearch ? 'bg-brand-primary border-brand-primary/50 text-white shadow-lg shadow-brand-primary/20' : 'bg-white/5 text-white/40 border-white/10 hover:text-white hover:bg-white/10'}`}
            title="Google Search"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </motion.button>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <motion.button 
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={clearChat}
            className="p-2.5 rounded-sm bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all duration-300"
            title="Chat leeren"
          >
            <TrashIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10 bg-gradient-to-b from-transparent to-black/10">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-6"
            >
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center text-white/20">
                <SparklesIcon className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-2xl font-serif italic text-white tracking-tight">Wie kann ich heute helfen?</h4>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mt-2">Loki ist bereit für Ihre strategischen Fragen</p>
              </div>
            </motion.div>
          ) : (
            messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-sm p-6 shadow-2xl border ${msg.role === 'user' ? 'bg-brand-primary/10 border-brand-primary/30 text-white shadow-brand-primary/5' : 'bg-white/5 border-white/10'}`}>
                  {msg.image && (
                    <motion.img 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={`data:${msg.image.mimeType};base64,${msg.image.data}`} 
                      alt="Uploaded" 
                      className="max-w-xs rounded-sm mb-5 shadow-2xl border border-white/10" 
                    />
                  )}
                  <div className={`prose prose-invert prose-xs max-w-none text-white/85 font-mono text-xs leading-relaxed prose-p:leading-relaxed prose-strong:text-brand-primary prose-strong:font-bold prose-headings:font-serif prose-headings:italic`}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                  {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-white/10">
                      <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] mb-3">Quellen & Recherche</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.groundingUrls.map((url, i) => (
                          <motion.a 
                            whileHover={{ y: -1 }}
                            key={i} 
                            href={url.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-sm text-[10px] font-mono text-white/60 hover:text-white hover:border-brand-primary/40 transition-all truncate max-w-[240px] shadow-sm uppercase tracking-wider"
                          >
                            {url.title || url.uri}
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
          {loading && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white/5 border border-white/10 p-4 rounded-sm flex items-center gap-4 shadow-xl">
                <div className="flex gap-1.5">
                  <motion.div 
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-1.5 h-1.5 bg-brand-primary rounded-full" 
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-1.5 h-1.5 bg-brand-primary rounded-full" 
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-1.5 h-1.5 bg-brand-primary rounded-full" 
                  />
                </div>
                <span className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em]">Loki analysiert...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <footer className="p-6 bg-white/5 backdrop-blur-2xl border-t border-white/5 relative z-10">
        <AnimatePresence>
          {imagePreview && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="mb-4 relative inline-block group"
            >
              <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-sm border border-white/10 shadow-2xl" />
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-xl hover:bg-rose-600 transition-colors border border-white/10"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="relative flex items-end gap-3">
          <div className="flex-1 relative group">
            <textarea 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              className="w-full px-6 py-4 pr-14 bg-white/5 border border-white/10 rounded-sm text-white font-mono text-sm focus:ring-1 focus:ring-brand-primary/40 focus:border-brand-primary/60 focus:outline-none resize-none custom-scrollbar transition-all min-h-[56px] max-h-[160px] shadow-2xl placeholder:text-white/20" 
              placeholder="Frage Loki..." 
              rows={1}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }} 
              disabled={loading}
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-4 bottom-4 p-1.5 text-white/30 hover:text-brand-primary transition-colors"
            >
              <PhotoIcon className="w-5 h-5" />
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
            </motion.button>
          </div>
          <motion.button 
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSend} 
            disabled={loading || (!input.trim() && !imageData)} 
            className="h-14 px-8 bg-white/10 text-white border border-white/10 rounded-sm flex items-center gap-2 hover:bg-white/20 transition-all disabled:opacity-30 disabled:hover:bg-white/10 shadow-xl shadow-white/5"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest">Senden</span>
            <PaperAirplaneIcon className="w-4 h-4 -rotate-45" />
          </motion.button>
        </div>
      </footer>
    </div>
  );
};

export default Chatbot;

