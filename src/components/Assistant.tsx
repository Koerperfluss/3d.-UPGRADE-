
import React, { useState, useEffect, useRef } from 'react';
import { generateClinicalContentStream } from '../services/aiService';
import { Card } from './Card';
import { Button } from './Button';
import { CloseIcon, SendIcon, BrainCircuitIcon, SearchIcon, MapPinIcon } from './IconComponents';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  grounding?: { title: string; uri: string }[];
  mapsGrounding?: any[];
}

interface AssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Assistant: React.FC<AssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ id: 'init', text: 'Hallo! Ich bin LUMI. Wie kann ich dir heute helfen? Ich kann tiefgründig analysieren (Deep Reasoning) oder schnell Standorte und Infos recherchieren.', sender: 'bot' }]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), text: userInput, sender: 'user' };
    const currentInput = userInput;
    const history = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    setMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsLoading(true);

    try {
      const modelName = useThinking ? 'gemini-3.1-pro-preview' : 'gemini-2.5-flash';
      
      const responseStream = await generateClinicalContentStream(
        [...history, { role: 'user', parts: [{ text: currentInput }] }],
        modelName,
        {
          thinkingConfig: useThinking ? { thinkingBudget: 16000 } : undefined,
        },
        [],
        useThinking ? [{ googleSearch: {} }] : [{ googleSearch: {} }, { googleMaps: {} }]
      );

      let fullText = '';
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: botMsgId, text: '', sender: 'bot' }]);

      for await (const chunk of responseStream) {
        const textPart = chunk.text;
        if (textPart) {
          fullText += textPart;
        }
        
        const grounding = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const searchLinks = grounding?.filter((c: any) => c.web).map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
        const mapsLinks = grounding?.filter((c: any) => c.maps);

        setMessages(prev => prev.map(msg => msg.id === botMsgId ? { 
          ...msg, 
          text: fullText,
          grounding: searchLinks?.length ? searchLinks : msg.grounding,
          mapsGrounding: mapsLinks?.length ? mapsLinks : msg.mapsGrounding
        } : msg));
      }
    } catch (e) {
      console.error("AI Assistant Error:", e);
      setMessages(prev => [...prev, { id: 'err', text: 'Entschuldigung, LUMI hat gerade eine technische Störung (Internal Error). Bitte versuche es in Kürze erneut.', sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-lg z-[1000] animate-fadeInUp shadow-glow">
      <Card className="flex flex-col h-[75vh] max-h-[700px] bg-brand-background !p-0 rounded-3xl border-2 border-brand-primary/30 overflow-hidden">
        <header className="bg-brand-secondary p-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-full ${useThinking ? 'bg-brand-primary text-brand-secondary animate-pulse' : 'bg-white/10'}`}>
                <BrainCircuitIcon className="w-6 h-6" />
             </div>
             <div>
                <h3 className="font-bold font-serif text-lg leading-none">LUMI Assistant</h3>
                <p className="text-[10px] uppercase tracking-widest text-brand-primary mt-1">
                    {useThinking ? 'Deep Reasoning Active' : 'Search & Maps Mode'}
                </p>
             </div>
          </div>
          <div className="flex gap-2">
             <button 
                onClick={() => setUseThinking(!useThinking)}
                className={`p-2 rounded-xl transition-all ${useThinking ? 'bg-brand-primary text-brand-secondary' : 'bg-white/10 text-white/40'}`}
                title="Deep Thinking umschalten"
             >
                <BrainCircuitIcon className="w-5 h-5" />
             </button>
             <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <CloseIcon className="w-6 h-6" />
             </button>
          </div>
        </header>

        <div className="flex-grow p-5 overflow-y-auto space-y-6 bg-brand-surface-alt/30">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-brand-primary text-brand-secondary rounded-tr-none' : 'bg-white border border-brand-border rounded-tl-none'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                
                {msg.grounding && msg.grounding.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-brand-border/50 flex flex-wrap gap-2">
                    {msg.grounding.map((g, i) => (
                      <a key={i} href={g.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-brand-primary/10 px-2 py-1 rounded-md flex items-center gap-1 font-bold text-brand-primary-dark">
                        <SearchIcon className="w-3 h-3" /> {g.title}
                      </a>
                    ))}
                  </div>
                )}

                {msg.mapsGrounding && msg.mapsGrounding.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-brand-border/50 space-y-2">
                    <p className="text-[10px] font-black uppercase text-brand-secondary flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3 text-brand-primary" /> Gefundene Standorte:
                    </p>
                    {msg.mapsGrounding.map((m, i) => (
                      <a key={i} href={m.maps?.uri} target="_blank" rel="noopener noreferrer" className="block p-2 bg-brand-background rounded-lg border border-brand-border hover:border-brand-primary transition-colors">
                         <p className="text-xs font-bold text-brand-secondary">{m.maps?.title || 'Standort'}</p>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white border border-brand-border p-4 rounded-2xl flex items-center gap-3">
                  <div className="animate-spin h-4 w-4 border-2 border-brand-primary border-t-transparent rounded-full"></div>
                  <span className="text-xs italic text-brand-text-on-light-secondary">LUMI denkt nach...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-brand-border">
          <div className="flex items-center gap-3 bg-brand-background p-2 rounded-2xl border border-brand-border focus-within:border-brand-primary transition-all">
            <input 
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Frage LUMI..."
              className="flex-grow bg-transparent border-none outline-none text-sm px-2"
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()} variant="primary" className="!p-3 !rounded-xl">
               <SendIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
