import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Library, 
  Stethoscope, 
  ActivitySquare, 
  GraduationCap, 
  Users,
  LogOut
} from 'lucide-react';
import { Logo } from './Logo';

interface SidebarLayoutProps {
  children: React.ReactNode;
  user: any;
  lecturer: any;
  onLogout: () => void;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children, user, lecturer, onLogout }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard (Cockpit)', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Kurs-Theorie', path: '/education', icon: Library },
    { name: 'Skills Lab', path: '/vision', icon: ActivitySquare },
    { name: 'Clinical Hub', path: '/anamnese-trainer', icon: Stethoscope },
    { name: 'Assessment', path: '/assessment', icon: GraduationCap },
    { name: 'Educator Space', path: '/educator', icon: Users, requireLecturer: true },
  ];

  const filteredNav = navigation.filter(item => !item.requireLecturer || lecturer);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white/5 border-r border-white/10 flex flex-col backdrop-blur-xl">
        <div className="p-6 border-b border-white/10 shrink-0 flex items-center justify-center">
          <Logo className="w-16 h-16" />
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {filteredNav.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
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
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto bg-black custom-scrollbar">
        {/* We place a glassmorphism base background here to comply with STUFE 1 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-primary/10 via-black to-black pointer-events-none -z-10" />
        <div className="p-8 pb-32">
          {children}
        </div>
      </main>
    </div>
  );
};
