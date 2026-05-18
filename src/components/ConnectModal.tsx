import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X, Copy, Check, QrCode, Smartphone } from 'lucide-react';
import { Button } from './Button';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const [manualUrl, setManualUrl] = React.useState('');
  const [showUrlInput, setShowUrlInput] = React.useState(false);
  
  const currentUrl = window.location.origin;
  const isDevUrl = currentUrl.includes('-dev-');
  const appUrl = manualUrl || currentUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Körperfluss | Adaptive Intelligence',
          text: 'Entdecke Körperfluss - Die KI-Plattform für medizinische Ausbildung und klinisches Reasoning.',
          url: appUrl,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Sharing failed', err);
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-zinc-900 border border-white/10 rounded-[48px] p-8 z-[201] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[100px] -z-10 rounded-full" />
            
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                  <Smartphone className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">App teilen</h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Mobile Konnektivität</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center gap-8">
              {/* QR Code Section */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-brand-primary/20 blur-2xl group-hover:bg-brand-primary/30 transition-all duration-700 opacity-50" />
                <div className="relative p-6 bg-white rounded-3xl shadow-2xl">
                  <QRCodeSVG 
                    value={appUrl} 
                    size={200} 
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                      src: "/logo-main.png",
                      x: undefined,
                      y: undefined,
                      height: 40,
                      width: 40,
                      excavate: true,
                    }}
                  />
                </div>
                {isDevUrl && !manualUrl && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl"
                  >
                    <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest text-center">
                      Achtung: Dev-Link erkannt!<br/>Nur für dich erreichbar.
                    </p>
                    <button 
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="w-full mt-2 text-[9px] text-zinc-400 hover:text-white transition-colors underline"
                    >
                      Öffentlichen Link eintragen
                    </button>
                  </motion.div>
                )}

                {showUrlInput && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-4 w-full"
                  >
                    <input 
                      type="url" 
                      placeholder="Public URL (https://...)" 
                      value={manualUrl}
                      onChange={(e) => setManualUrl(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-brand-primary outline-none transition-all"
                    />
                  </motion.div>
                )}
                
                <div className="mt-4 text-center">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-black">Einfach scannen zum Verbinden</p>
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-4">
                <Button 
                  onClick={handleNativeShare}
                  className="flex items-center justify-center gap-3 !py-5 bg-brand-primary hover:bg-brand-primary/90 text-black border-none shadow-glow text-[10px]"
                >
                  <Share2 size={16} /> JETZT TEILEN
                </Button>
                <Button 
                  onClick={handleCopy}
                  variant="outline"
                  className="flex items-center justify-center gap-3 !py-5 border-white/10 hover:bg-white/5 text-white text-[10px]"
                >
                  {copied ? <Check size={16} className="text-brand-success" /> : <Copy size={16} />}
                  {copied ? 'KOPIERT' : 'LINK KOPIEREN'}
                </Button>
              </div>

              <div className="w-full p-6 rounded-3xl bg-white/5 border border-white/5 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                   <QrCode className="w-4 h-4 text-brand-primary" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400 leading-relaxed italic">
                    "Tipp: Nutze den QR-Code vor allem in Lerngruppen, um die Plattform in Sekunden auf alle Geräte im Raum zu spiegeln."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
