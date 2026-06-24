import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Library, 
  Stethoscope, 
  ActivitySquare, 
  GraduationCap, 
  Users,
  LogOut,
  Sparkles,
  Share2,
  Menu,
  X
} from 'lucide-react';
import { Logo } from './Logo';
import { ConnectModal } from './ConnectModal';
import { useClinicalContext } from '../context/ClinicalContext';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarLayoutProps {
  children: React.ReactNode;
  user: any;
  lecturer: any;
  onLogout: () => void;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children, user, lecturer, onLogout }) => {
  const location = useLocation();
  const { isCotMode, setCotMode } = useClinicalContext();
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard (Cockpit)', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Kurs-Theorie', path: '/education', icon: Library },
    { name: 'Skills Lab', path: '/vision', icon: ActivitySquare },
    { name: 'Clinical Hub', path: '/anamnese-trainer', icon: Stethoscope },
    { name: 'Studien-DB', path: '/literatur', icon: Library },
    { name: 'Assessment', path: '/assessment', icon: GraduationCap },
    { name: 'Educator Space', path: '/educator', icon: Users, requireLecturer: true },
    { name: 'Pitch Dashboard', path: '/pitch-deck', icon: Sparkles, requireLecturer: true },
  ];

  const filteredNav = navigation.filter(item => !item.requireLecturer || lecturer);

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-white/10 shrink-0 flex items-center justify-between lg:justify-center">
        <Logo className="w-16 h-16" />
        <button className="lg:hidden p-2 text-white/50 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
          <X size={24} />
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {filteredNav.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                isActive 
                  ? 'bg-brand-primary text-black shadow-lg shadow-brand-primary/20' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 shrink-0">
        {/* AI/CoT Toggle */}
        <button 
          onClick={() => setCotMode(!isCotMode)}
          className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl mb-4 transition-all group border ${
            isCotMode 
              ? 'bg-brand-primary/20 border-brand-primary/50 text-brand-primary' 
              : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Sparkles className={`w-4 h-4 ${isCotMode ? 'text-brand-primary' : 'text-zinc-500'}`} />
            <span className="text-[10px] uppercase font-bold tracking-widest">CoT Engine</span>
          </div>
          <div className={`w-8 h-4 rounded-full relative transition-colors ${isCotMode ? 'bg-brand-primary' : 'bg-white/10'}`}>
            <motion.div 
              animate={{ x: isCotMode ? 16 : 0 }}
              className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"
            />
          </div>
        </button>

        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl mb-2 border border-white/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-primary to-yellow-600 flex items-center justify-center font-bold text-black text-sm shrink-0">
            {user?.name?.substring(0, 2).toUpperCase() || lecturer?.name?.substring(0, 2).toUpperCase() || 'KF'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">{user?.name || lecturer?.name || 'Gast'}</p>
            <p className="text-[10px] text-brand-primary uppercase tracking-widest truncate">
              {lecturer ? 'Dozent' : user ? 'Student' : 'Demo-Mode'}
            </p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
        
        <button 
          onClick={() => setIsShareModalOpen(true)}
          className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-brand-primary hover:bg-brand-primary/20 transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <Share2 size={14} /> Mobile Connect
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-[100dvh] bg-transparent text-white overflow-hidden w-full">
      <div className="flex flex-col lg:flex-row w-full h-full">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-black/80 backdrop-blur-xl pt-[env(safe-area-inset-top)] z-50">
           <Logo className="w-10 h-10" />
           <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-white">
             <Menu size={24} />
           </button>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-shrink-0 bg-black/40 border-r border-white/10 flex-col backdrop-blur-xl pt-[env(safe-area-inset-top)] z-40">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar (Drawer) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-black border-r border-white/10 flex flex-col z-[101] lg:hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] shadow-2xl"
              >
                <SidebarContent />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <ConnectModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 relative overflow-y-auto bg-transparent custom-scrollbar flex flex-col h-full">
          {/* We place a glassmorphism base background here to comply with STUFE 1 */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-primary/10 via-black/40 to-black/40 pointer-events-none -z-10" />
          <div className="p-4 sm:p-8 pb-32 pb-[env(safe-area-inset-bottom)] flex-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
