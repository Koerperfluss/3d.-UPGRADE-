
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { CookieBanner } from './components/CookieBanner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { User, MembershipTier, CartItem, PriceItem, PackageDeal, Lecturer, UserRole } from './types';
import { Chatbot, CollectedVariables } from './components/Chatbot';
import { CartSidebar } from './components/CartSidebar';
import { AIToolsModal } from './components/AIToolsModal';
import { ChatbotFAB } from './components/ChatbotFAB';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const AngebotePage = lazy(() => import('./pages/AngebotePage').then(m => ({ default: m.AngebotePage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage').then(m => ({ default: m.BlogPostPage })));
const ImpressumPage = lazy(() => import('./pages/ImpressumPage').then(m => ({ default: m.ImpressumPage })));
const DatenschutzPage = lazy(() => import('./pages/DatenschutzPage').then(m => ({ default: m.DatenschutzPage })));
const AnalysisPage = lazy(() => import('./pages/AnalysisPage').then(m => ({ default: m.AnalysisPage })));
const LaborPage = lazy(() => import('./pages/LaborPage').then(m => ({ default: m.LaborPage })));
const VisionAgentPage = lazy(() => import('./pages/VisionAgentPage').then(m => ({ default: m.VisionAgentPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const DozentenDashboardPage = lazy(() => import('./pages/DozentenDashboardPage').then(m => ({ default: m.DozentenDashboardPage })));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const EducationPage = lazy(() => import('./pages/EducationPage').then(m => ({ default: m.EducationPage })));
const LiteraturPage = lazy(() => import('./pages/LiteraturPage').then(m => ({ default: m.LiteraturPage })));
const CaseTrainingPage = lazy(() => import('./pages/CaseTrainingPage').then(m => ({ default: m.CaseTrainingPage })));
const ExamSimulationPage = lazy(() => import('./pages/ExamSimulationPage').then(m => ({ default: m.ExamSimulationPage })));
const QuizPage = lazy(() => import('./pages/QuizPage').then(m => ({ default: m.QuizPage })));
const CurriculumPage = lazy(() => import('./pages/CurriculumPage').then(m => ({ default: m.CurriculumPage })));
const DiagnostikBotPage = lazy(() => import('./pages/DiagnostikBotPage').then(m => ({ default: m.DiagnostikBotPage })));
const AssessmentCenterPage = lazy(() => import('./pages/AssessmentCenterPage').then(m => ({ default: m.AssessmentCenterPage })));
const EducatorWorkspacePage = lazy(() => import('./pages/EducatorWorkspacePage').then(m => ({ default: m.EducatorWorkspacePage })));
const DozentenLoginPage = lazy(() => import('./pages/DozentenLoginPage').then(m => ({ default: m.DozentenLoginPage })));
const ChatbotStartPage = lazy(() => import('./pages/ChatbotStartPage').then(m => ({ default: m.ChatbotStartPage })));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-transparent">
    <div className="relative">
      <div className="w-16 h-16 border border-brand-primary/20 rounded-full animate-spin-slow"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse shadow-glow"></div>
      </div>
    </div>
  </div>
);

const MainLayout: React.FC<{ 
  children: React.ReactNode; 
  user: User | null; 
  lecturer: Lecturer | null;
  onLogout: () => void; 
  onCartClick: () => void; 
}> = ({ children, user, lecturer, onLogout, onCartClick }) => (
  <div className="flex flex-col min-h-screen bg-transparent text-white">
    <Navbar user={user} lecturer={lecturer} onLogout={onLogout} onCartClick={onCartClick} />
    <main className="flex-grow relative z-10">
      {children}
    </main>
    <Footer />
    <CookieBanner />
  </div>
);

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  const [checkoutInfo, setCheckoutInfo] = useState<{user: User, plan: MembershipTier, chatbotData: CollectedVariables | null} | null>(null);
  const navigate = useNavigate();
  const [chatbotPhaseActive, setChatbotPhaseActive] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('koerperflussUser');
    const storedLecturer = sessionStorage.getItem('koerperflussLecturer');
    if (storedUser) setUser(JSON.parse(storedUser));
    else if (storedLecturer) setLecturer(JSON.parse(storedLecturer));
  }, []);

  const handleAddToCart = (item: PriceItem | PackageDeal | MembershipTier, options?: { isAnnual?: boolean }) => {
    // Note: handleAddToCart logic should ideally be moved to useCart hook or handled differently
    // For now, keeping it here but it might need adjustment if we want to use the context's addToCart
    // Actually, I should probably just use the context's addToCart in the components directly.
  };

  const handleLogin = (loggedInUser: User) => {
    // Ensure role exists for legacy data
    const userWithRole = { ...loggedInUser, role: loggedInUser.role || 'patient' };
    sessionStorage.setItem('koerperflussUser', JSON.stringify(userWithRole));
    setUser(userWithRole);
    navigate('/dashboard');
  };

  const handleLecturerLogin = (loggedInLecturer: Lecturer) => {
    sessionStorage.setItem('koerperflussLecturer', JSON.stringify(loggedInLecturer));
    setLecturer(loggedInLecturer);
    navigate('/dozenten-dashboard');
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
    setLecturer(null);
    navigate('/');
  };

  const handleChatbotComplete = (variables: CollectedVariables) => {
    sessionStorage.setItem('chatbotCompleted', 'true');
    sessionStorage.setItem('chatbotData', JSON.stringify(variables));
    setChatbotPhaseActive(false);
    // AREA 1 LOGIK: Nach Chatbot -> Verkaufsseite (Report im Hintergrund fertig)
    navigate('/angebote', { state: { analysisReady: true } });
  };
  
  const createMainLayout = (page: React.ReactNode) => (
    <MainLayout user={user} lecturer={lecturer} onLogout={handleLogout} onCartClick={() => setIsCartOpen(true)}>{page}</MainLayout>
  );

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AIToolsModal 
        isOpen={isToolsModalOpen} 
        onClose={() => setIsToolsModalOpen(false)} 
        user={user}
        lecturer={lecturer}
      />
      
      {/* Diagnostic Chatbot - Area 1 Startpoint */}
      <Chatbot 
        isOpen={chatbotPhaseActive} 
        onClose={() => setChatbotPhaseActive(false)} 
        onComplete={handleChatbotComplete} 
        user={user} 
      />
      
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes (Area 1) */}
          <Route path="/" element={<HomePage onStartChat={() => setChatbotPhaseActive(true)} />} />
          <Route path="/ueber-uns" element={createMainLayout(<AboutPage />)} />
          <Route path="/angebote" element={createMainLayout(<AngebotePage user={user} onOpenHealthCheck={() => setChatbotPhaseActive(true)} />)} />
          
          <Route path="/blog" element={createMainLayout(<BlogPage />)} />
          <Route path="/blog/:slug" element={createMainLayout(<BlogPostPage />)} />
          <Route path="/kontakt" element={createMainLayout(<ContactPage />)} />
          <Route path="/impressum" element={createMainLayout(<ImpressumPage />)} />
          <Route path="/datenschutz" element={createMainLayout(<DatenschutzPage />)} />
          
          {/* AREA 2: Ausbildung / Dozenten (Protected) */}
          <Route path="/dozenten-dashboard" element={
            <ProtectedRoute user={user} lecturer={lecturer} requireLecturer={true}>
              {createMainLayout(<DozentenDashboardPage lecturer={lecturer!} />)}
            </ProtectedRoute>
          } />
          <Route path="/dozenten-login" element={<DozentenLoginPage onLecturerLogin={handleLecturerLogin} />} />
          
          {/* Tools (Only accessible in Area 2 context) */}
          <Route path="/analyse" element={
            <ProtectedRoute user={user} lecturer={lecturer} allowedRoles={['student', 'dozent']} requireLecturer={false}>
              {createMainLayout(<AnalysisPage />)}
            </ProtectedRoute>
          } />
          <Route path="/labor" element={
            <ProtectedRoute user={user} lecturer={lecturer} allowedRoles={['student', 'dozent']}>
              {createMainLayout(<LaborPage />)}
            </ProtectedRoute>
          } />
          <Route path="/education" element={
            <ProtectedRoute user={user} lecturer={lecturer} allowedRoles={['student', 'dozent']}>
              {createMainLayout(<EducationPage />)}
            </ProtectedRoute>
          } />
          <Route path="/literatur" element={
            <ProtectedRoute user={user} lecturer={lecturer} allowedRoles={['student', 'dozent']}>
              {createMainLayout(<LiteraturPage />)}
            </ProtectedRoute>
          } />
          <Route path="/case-training" element={
            <ProtectedRoute user={user} lecturer={lecturer} allowedRoles={['student', 'dozent']}>
              {createMainLayout(<CaseTrainingPage />)}
            </ProtectedRoute>
          } />
          <Route path="/exam-simulation" element={
            <ProtectedRoute user={user} lecturer={lecturer} allowedRoles={['student', 'dozent']}>
              {createMainLayout(<ExamSimulationPage />)}
            </ProtectedRoute>
          } />
          <Route path="/quiz" element={
            <ProtectedRoute user={user} lecturer={lecturer} allowedRoles={['student', 'dozent']}>
              {createMainLayout(<QuizPage />)}
            </ProtectedRoute>
          } />
          <Route path="/curriculum" element={
            <ProtectedRoute user={user} lecturer={lecturer} allowedRoles={['student', 'dozent']}>
              {createMainLayout(<CurriculumPage />)}
            </ProtectedRoute>
          } />
          <Route path="/diagnostik-bot" element={
            <ProtectedRoute user={user} lecturer={lecturer} allowedRoles={['student', 'dozent']}>
              {createMainLayout(<DiagnostikBotPage />)}
            </ProtectedRoute>
          } />
          <Route path="/assessment-center" element={
            <ProtectedRoute user={user} lecturer={lecturer} allowedRoles={['student', 'dozent']}>
              {createMainLayout(<AssessmentCenterPage />)}
            </ProtectedRoute>
          } />
          <Route path="/educator-workspace" element={
            <ProtectedRoute user={user} lecturer={lecturer} allowedRoles={['dozent']}>
              {createMainLayout(<EducatorWorkspacePage />)}
            </ProtectedRoute>
          } />
          <Route path="/vision-agent" element={
            <ProtectedRoute user={user} lecturer={lecturer} allowedRoles={['student', 'dozent']}>
              {createMainLayout(<VisionAgentPage />)}
            </ProtectedRoute>
          } />
          
          {/* AREA 1: User Dashboard (Reduced view) */}
          <Route path="/dashboard" element={
            <ProtectedRoute user={user} lecturer={lecturer}>
              {createMainLayout(<DashboardPage user={user} lecturer={lecturer} />)}
            </ProtectedRoute>
          } />
          <Route path="/chatbot-start" element={createMainLayout(<ChatbotStartPage onStartChat={() => setChatbotPhaseActive(true)} />)} />
          
          {/* Auth & Utility Routes */}
          <Route path="/login" element={<LoginPage onLogin={handleLogin} onLecturerLogin={handleLecturerLogin} />} />
          <Route path="/register" element={<RegisterPage onRegister={(u, p) => {
              setCheckoutInfo({ user: u, plan: p, chatbotData: null });
              navigate('/checkout');
          }} />} />
          <Route path="/checkout" element={checkoutInfo ? <CheckoutPage user={checkoutInfo.user} plan={checkoutInfo.plan} onPaymentSuccess={() => {
               const finalUser = { ...checkoutInfo.user, plan: checkoutInfo.plan };
               handleLogin(finalUser);
               navigate('/onboarding');
          }} /> : <Navigate to="/angebote" />} />
          <Route path="/onboarding" element={user ? <OnboardingPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
      
      {/* Global FAB only for public/user area */}
      {!lecturer && !chatbotPhaseActive && <ChatbotFAB onOpen={() => setChatbotPhaseActive(true)} />}
    </ErrorBoundary>
  );
};

const App: React.FC = () => (
  <HashRouter>
    <CartProvider>
      <AppContent />
    </CartProvider>
  </HashRouter>
);

export default App;
