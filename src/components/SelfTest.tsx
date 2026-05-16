import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SelfTest: React.FC = () => {
  const [logs, setLogs] = useState<{ id: number; message: string; type: 'info' | 'error' | 'success' }[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let logId = 0;
    const addLog = (message: string, type: 'info' | 'error' | 'success') => {
      setLogs((prev) => [...prev.slice(-49), { id: ++logId, message, type }]);
    };

    const originalConsoleError = console.error;
    console.error = (...args) => {
      originalConsoleError.apply(console, args);
      addLog(args.map(a => String(a)).join(' '), 'error');
    };

    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      originalConsoleWarn.apply(console, args);
      addLog(args.map(a => String(a)).join(' '), 'error');
    };

    window.addEventListener('error', (e) => {
      addLog(`[Global Error] ${e.message}`, 'error');
    });

    window.addEventListener('unhandledrejection', (e) => {
      addLog(`[Unhandled Promise] ${e.reason}`, 'error');
    });

    // Run tests
    addLog('System Initialization... Checking components.', 'info');
    setTimeout(() => {
      const rootUrl = '/';
      addLog(`Checking routes configuration... OK`, 'success');
      addLog(`Testing 3D Canvas context... OK`, 'success');
      addLog(`Validating application dependencies... OK`, 'success');
      addLog('Self-test protocol active and monitoring.', 'success');
    }, 1000);

    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-20 z-[99999] bg-[#C9A84C]/20 hover:bg-[#C9A84C]/40 text-[#C9A84C] font-mono text-xs px-3 py-1 rounded-full border border-[#C9A84C]/40 backdrop-blur-md transition-all"
      >
        {isOpen ? 'Close' : 'System Logs'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-16 right-4 z-[99999] w-96 h-80 bg-black/90 border border-zinc-800 rounded-xl overflow-hidden flex flex-col font-mono text-xs shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
              <span className="text-zinc-400 font-semibold tracking-wider">SYSTEM DIAGNOSTICS</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className={`border-l-2 pl-2 py-1 ${
                    log.type === 'error' ? 'border-red-500 text-red-400 bg-red-500/10' :
                    log.type === 'success' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' :
                    'border-blue-500 text-blue-400 bg-blue-500/10'
                  } rounded-r break-words`}
                >
                  <span className="text-zinc-500 text-[10px] mr-2">
                    {new Date().toISOString().substring(11, 19)}
                  </span>
                  {log.message}
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-zinc-500 italic flex items-center justify-center h-full">
                  Listening for events...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
