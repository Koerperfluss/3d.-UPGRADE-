import React, { Component, ErrorInfo, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { ClinicalProvider } from './context/ClinicalContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SidebarLayout } from './components/SidebarLayout';
import { Global3DBackground } from './components/Background3D';
import { CotDrawer } from './components/CotDrawer';



import { DemoTourOverlay } from './components/DemoTourOverlay';
import { AccessibilityOverlay } from './components/AccessibilityOverlay';
import { IntroSplashScreen } from './components/IntroSplashScreen';
import { Assistant } from './components/Assistant';
import { MessageIcon, CloseIcon } from './components/IconComponents';

// Lazy load route components
const HomePage = React.lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const AboutPage = React.lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })));
const AngebotePage = React.lazy(() => import('./pages/AngebotePage').then(module => ({ default: module.AngebotePage })));
const BlogPage = React.lazy(() => import('./pages/BlogPage').then(module => ({ default: module.BlogPage })));
const ContactPage = React.lazy(() => import('./pages/ContactPage').then(module => ({ default: module.ContactPage })));
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const AnalysisPage = React.lazy(() => import('./pages/AnalysisPage').then(module => ({ default: module.AnalysisPage })));
const LaborPage = React.lazy(() => import('./pages/LaborPage').then(module => ({ default: module.LaborPage })));
const EducationPage = React.lazy(() => import('./pages/EducationPage').then(module => ({ default: module.EducationPage })));
const CurriculumPage = React.lazy(() => import('./pages/CurriculumPage').then(module => ({ default: module.CurriculumPage })));
const LiteraturPage = React.lazy(() => import('./pages/LiteraturPage').then(module => ({ default: module.LiteraturPage })));
const DozentenLoginPage = React.lazy(() => import('./pages/DozentenLoginPage').then(module => ({ default: module.DozentenLoginPage })));
const AssessmentCenterPage = React.lazy(() => import('./pages/AssessmentCenterPage').then(module => ({ default: module.AssessmentCenterPage })));
const AnamneseTrainerPage = React.lazy(() => import('./pages/AnamneseTrainerPage').then(module => ({ default: module.AnamneseTrainerPage })));
const VisionAgentPage = React.lazy(() => import('./pages/VisionAgentPage').then(module => ({ default: module.VisionAgentPage })));
const CaseTrainingPage = React.lazy(() => import('./pages/CaseTrainingPage').then(module => ({ default: module.CaseTrainingPage })));
const ExamSimulationPage = React.lazy(() => import('./pages/ExamSimulationPage').then(module => ({ default: module.ExamSimulationPage })));
const QuizPage = React.lazy(() => import('./pages/QuizPage').then(module => ({ default: module.QuizPage })));
const EducatorWorkspacePage = React.lazy(() => import('./pages/EducatorWorkspacePage').then(module => ({ default: module.EducatorWorkspacePage })));
const DozentenDashboardPage = React.lazy(() => import('./pages/DozentenDashboardPage').then(module => ({ default: module.DozentenDashboardPage })));
const PitchDashboardPage = React.lazy(() => import('./pages/PitchDashboardPage').then(module => ({ default: module.PitchDashboardPage })));
const MoodleSimulationPage = React.lazy(() => import('./pages/MoodleSimulationPage').then(module => ({ default: module.MoodleSimulationPage })));
const VirtualClassroomPage = React.lazy(() => import('./pages/VirtualClassroomPage').then(module => ({ default: module.VirtualClassroomPage })));


// --- GLOBAL ERROR BOUNDARY ---
class GlobalErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Critical App Error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black flex items-center justify-center p-8 text-center">
          <div className="max-w-md">
            <h1 className="text-brand-primary text-2xl font-black mb-4 uppercase">System-Fehler</h1>
            <p className="text-zinc-400 mb-8 font-light">Die App ist auf ein unerwartetes Problem gestoßen. Bitte lade die Seite neu.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-brand-primary text-black px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs"
            >
              Neu Laden
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppRoutes = () => {
  const { user, lecturer, signOut } = useAuth();
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [showSplash, setShowSplash] = React.useState(true);
  
  const handleCartClick = () => {
    // Open cart
  };

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && <IntroSplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      <React.Suspense fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <Routes>
        {/* Public Routes with standard Navbar & Footer */}
        <Route path="/" element={<PublicLayout user={user} lecturer={lecturer} onLogout={signOut} onCartClick={handleCartClick}><HomePage onStartChat={() => setIsChatOpen(true)} /></PublicLayout>} />
        <Route path="/ueber-uns" element={<PublicLayout user={user} lecturer={lecturer} onLogout={signOut} onCartClick={handleCartClick}><AboutPage /></PublicLayout>} />
        <Route path="/angebote" element={<PublicLayout user={user} lecturer={lecturer} onLogout={signOut} onCartClick={handleCartClick}><AngebotePage user={user} onOpenHealthCheck={() => setIsChatOpen(true)} /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout user={user} lecturer={lecturer} onLogout={signOut} onCartClick={handleCartClick}><BlogPage /></PublicLayout>} />
        <Route path="/kontakt" element={<PublicLayout user={user} lecturer={lecturer} onLogout={signOut} onCartClick={handleCartClick}><ContactPage /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout user={user} lecturer={lecturer} onLogout={signOut} onCartClick={handleCartClick}><LoginPage onLogin={() => {}} onLecturerLogin={() => {}} /></PublicLayout>} />
        <Route path="/dozenten-login" element={<PublicLayout user={user} lecturer={lecturer} onLogout={signOut} onCartClick={handleCartClick}><DozentenLoginPage onLecturerLogin={() => {}} /></PublicLayout>} />
        
        {/* LMS / Clinical Pipeline Routes with Sidebar */}
        <Route path="/dashboard" element={<LmsLayout user={user} lecturer={lecturer} onLogout={signOut}><DashboardPage user={user} lecturer={lecturer} /></LmsLayout>} />
        <Route path="/labor" element={<LmsLayout user={user} lecturer={lecturer} onLogout={signOut}><DozentenDashboardPage lecturer={lecturer} /></LmsLayout>} />
        <Route path="/analyse" element={<LmsLayout user={user} lecturer={lecturer} onLogout={signOut}><AnalysisPage /></LmsLayout>} />
        <Route path="/creative-lab" element={<LmsLayout user={user} lecturer={lecturer} onLogout={signOut}><LaborPage /></LmsLayout>} />
        <Route path="/education" element={<LmsLayout user={user} lecturer={lecturer} onLogout={signOut}><EducationPage /></LmsLayout>} />
        <Route path="/curriculum" element={<LmsLayout user={user} lecturer={lecturer} onLogout={signOut}><CurriculumPage /></LmsLayout>} />
        <Route path="/literatur" element={<LmsLayout user={user} lecturer={lecturer} onLogout={signOut}><LiteraturPage /></LmsLayout>} />
        <Route path="/assessment" element={<LmsLayout user={user} lecturer={lecturer} onLogout={signOut}><AssessmentCenterPage /></LmsLayout>} />
        <Route path="/anamnese-trainer" element={<LmsLayout user={user} lecturer={lecturer} onLogout={signOut}><AnamneseTrainerPage /></LmsLayout>} />
        <Route path="/vision" element={<LmsLayout user={user} lecturer={lecturer} onLogout={signOut}><VisionAgentPage /></LmsLayout>} />
        <Route path="/case-training" element={<LmsLayout user={user} lecturer={lecturer} onLogout={signOut}><CaseTrainingPage /></LmsLayout>} />
        <Route path="/exam-simulation" element={<LmsLayout user={user} lecturer={lecturer} onLogout={signOut}><ExamSimulationPage /></LmsLayout>} />
        <Route path="/quiz" element={<LmsLayout user={user} lecturer={lecturer} onLogout={signOut}><QuizPage /></LmsLayout>} />
        <Route path="/educator" element={<LmsLayout user={user} lecturer={lecturer} onLogout={signOut}><EducatorWorkspacePage /></LmsLayout>} />
        <Route path="/dozenten-dashboard" element={<LmsLayout user={user} lecturer={lecturer} onLogout={signOut}><DozentenDashboardPage lecturer={lecturer} /></LmsLayout>} />
        <Route path="/pitch-deck" element={<PitchDashboardPage />} />
        <Route path="/moodle-simulation" element={<MoodleSimulationPage />} />
        <Route path="/virtual-classroom" element={<VirtualClassroomPage />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </React.Suspense>

      <AccessibilityOverlay />

      {/* Global Floating Chatbot Agent (24/7 Support) */}
      <div className="fixed bottom-6 right-6 z-[3000]">
        {!isChatOpen ? (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-16 h-16 rounded-full bg-brand-primary text-brand-secondary shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center justify-center hover:scale-110 transition-all group border-2 border-brand-secondary/20"
            aria-label="Support Chat öffnen"
          >
            <MessageIcon className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-brand-secondary animate-pulse" />
          </button>
        ) : (
          <div className="relative">
            <Assistant 
              isOpen={isChatOpen} 
              onClose={() => setIsChatOpen(false)} 
            />
          </div>
        )}
      </div>
    </>
  );
};

export default function App() {
  return (
    <GlobalErrorBoundary>
      <AuthProvider>
        <ClinicalProvider>
          <CartProvider>
            <Router>
              <Global3DBackground />
              <DemoTourOverlay />
              <AppRoutes />
            </Router>
          </CartProvider>
        </ClinicalProvider>
      </AuthProvider>
    </GlobalErrorBoundary>
  );
}

// Utility components for Layouts
const PublicLayout: React.FC<{ children: React.ReactNode, user: any, lecturer: any, onLogout: () => void, onCartClick: () => void }> = ({ children, user, lecturer, onLogout, onCartClick }) => (
  <div style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <div className="fixed inset-0 pointer-events-none z-0 bg-[#020202] bg-opacity-20" />
    <div style={{ position: 'relative', zIndex: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar user={user} lecturer={lecturer} onLogout={onLogout} onCartClick={onCartClick} />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  </div>
);

const LmsLayout: React.FC<{ children: React.ReactNode, user: any, lecturer: any, onLogout: () => void }> = ({ children, user, lecturer, onLogout }) => {
  // If not logged in at all, might want to redirect, but for demo we just show it
  return (
    <div style={{ position: 'relative', zIndex: 20 }}>
      <SidebarLayout user={user} lecturer={lecturer} onLogout={onLogout}>
        <CotDrawer />
        {children}
      </SidebarLayout>
    </div>
  );
};
