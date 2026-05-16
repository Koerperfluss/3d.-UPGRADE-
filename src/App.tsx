import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ClinicalProvider } from './context/ClinicalContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SidebarLayout } from './components/SidebarLayout';
import { Global3DBackground } from './components/Background3D';
import { CotDrawer } from './components/CotDrawer';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { AngebotePage } from './pages/AngebotePage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { LaborPage } from './pages/LaborPage';
import { EducationPage } from './pages/EducationPage';
import { CurriculumPage } from './pages/CurriculumPage';
import { LiteraturPage } from './pages/LiteraturPage';
import { DozentenLoginPage } from './pages/DozentenLoginPage';

import { AssessmentCenterPage } from './pages/AssessmentCenterPage';
import { AnamneseTrainerPage } from './pages/AnamneseTrainerPage';
import { VisionAgentPage } from './pages/VisionAgentPage';
import { CaseTrainingPage } from './pages/CaseTrainingPage';
import { ExamSimulationPage } from './pages/ExamSimulationPage';
import { QuizPage } from './pages/QuizPage';
import { EducatorWorkspacePage } from './pages/EducatorWorkspacePage';
import { DozentenDashboardPage } from './pages/DozentenDashboardPage';

import { DemoTourOverlay } from './components/DemoTourOverlay';

const AppRoutes = () => {
  const { user, lecturer, signOut } = useAuth();
  
  const handleCartClick = () => {
    // Open cart
  };

  return (
    <Routes>
      {/* Public Routes with standard Navbar & Footer */}
      <Route path="/" element={<PublicLayout user={user} lecturer={lecturer} onLogout={signOut} onCartClick={handleCartClick}><HomePage onStartChat={() => {}} /></PublicLayout>} />
      <Route path="/ueber-uns" element={<PublicLayout user={user} lecturer={lecturer} onLogout={signOut} onCartClick={handleCartClick}><AboutPage /></PublicLayout>} />
      <Route path="/angebote" element={<PublicLayout user={user} lecturer={lecturer} onLogout={signOut} onCartClick={handleCartClick}><AngebotePage user={user} onOpenHealthCheck={() => {}} /></PublicLayout>} />
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
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
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
  );
}

// Utility components for Layouts
const PublicLayout: React.FC<{ children: React.ReactNode, user: any, lecturer: any, onLogout: () => void, onCartClick: () => void }> = ({ children, user, lecturer, onLogout, onCartClick }) => (
  <div style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <div className="fixed inset-0 pointer-events-none -z-10 bg-[#020202] bg-opacity-40" />
    <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar user={user} lecturer={lecturer} onLogout={onLogout} onCartClick={onCartClick} />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  </div>
);

const LmsLayout: React.FC<{ children: React.ReactNode, user: any, lecturer: any, onLogout: () => void }> = ({ children, user, lecturer, onLogout }) => {
  // If not logged in at all, might want to redirect, but for demo we just show it
  return (
    <SidebarLayout user={user} lecturer={lecturer} onLogout={onLogout}>
      <CotDrawer />
      {children}
    </SidebarLayout>
  );
};
