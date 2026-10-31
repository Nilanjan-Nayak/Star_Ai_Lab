
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WatchDemo from './components/WatchDemo';
import VisitorTracking from './components/VisitorTracking';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { ModalProvider } from './context/ModalContext';
import { ContentProvider } from './context/ContentContext';
import { useVisitorTracking } from './hooks/useVisitorTracking';
import { useSecretAccess } from './hooks/useSecretAccess';
import AdminLogin from './components/admin/AdminLogin';
import AdminPanel from './components/admin/AdminPanel';
import Demo_card from './components/Demo_card';


function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <ModalProvider>
          <ContentProvider>
            <Router>
              <AppContent />
            </Router>
          </ContentProvider>
        </ModalProvider>
      </ProjectProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const {
    isPopupOpen,
    submitVisitorData,
    closePopup,
  } = useVisitorTracking({
    sessionDuration: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Hidden admin access system
  const { isAdminLoginVisible, closeAdminLogin } = useSecretAccess();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [adminUser, setAdminUser] = useState<any>(null);

  // Passive background security & visitor heartbeat (completely invisible to regular users)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/visitors/ping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: window.location.pathname,
        referrer: document.referrer || 'Direct',
        userAgent: navigator.userAgent
      })
    }).catch(() => {});
  }, []);

  // Check for existing admin session
  useState(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Verify token is still valid
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin-auth/status`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Token invalid');
        })
        .then(data => {
          setIsAdminAuthenticated(true);
          setAdminToken(token);
          setAdminUser(data.user);
        })
        .catch(() => {
          localStorage.removeItem('adminToken');
        });
    }
  });

  const handleAdminAuth = useCallback((token: string, user: any) => {
    setAdminToken(token);
    setAdminUser(user);
    setIsAdminAuthenticated(true);
    closeAdminLogin();
  }, [closeAdminLogin]);

  const handleAdminLogout = useCallback(() => {
    setIsAdminAuthenticated(false);
    setAdminToken('');
    setAdminUser(null);
    localStorage.removeItem('adminToken');
  }, []);

  // If admin is authenticated and the login overlay was triggered, show admin panel
  if (isAdminAuthenticated && adminToken) {
    return (
      <AdminPanel
        token={adminToken}
        user={adminUser}
        onLogout={handleAdminLogout}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen relative">
        {/* Enhanced Professional Fixed Background - Stays in place while content scrolls */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {/* Base Deep Space Gradient with Natural Tones */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>

          {/* Multi-layer Atmospheric Gradients for Depth */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/40 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-transparent to-indigo-950/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

          {/* Animated Mesh Gradient Effect for Movement */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-cyan-600/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000"></div>
          </div>

          {/* Subtle Radial Vignette for Focus */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>

          {/* Premium Ambient Light Orbs */}
          <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-blue-500/8 rounded-full blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-purple-500/8 rounded-full blur-[100px] animate-pulse-slow animation-delay-3000"></div>
          <div className="absolute top-2/3 left-2/3 w-72 h-72 bg-cyan-400/6 rounded-full blur-[90px] animate-pulse-slow animation-delay-6000"></div>

          {/* Refined Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.015]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          </div>

          {/* Noise Texture Overlay for Natural Feel */}
          <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>

          {/* Subtle Scan Lines for Tech Feel */}
          <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.03)_50%)] bg-[size:100%_4px]"></div>
        </div>

        {/* Scrollable Content */}
        <Routes>
          <Route path="/" element={
            <>
              <Navbar />
              <Hero />
              <About />
              <WatchDemo />
              <Demo_card />
              <Projects />
              <Contact />
              <Footer />
            </>
          } />
        </Routes>
      </div>

      {/* Visitor Tracking Popup */}
      <VisitorTracking
        isOpen={isPopupOpen}
        onClose={closePopup}
        onSubmit={submitVisitorData}
      />

      {/* Hidden Admin Login Overlay — triggered by Ctrl+Shift+K x3 */}
      <AdminLogin
        isVisible={isAdminLoginVisible}
        onClose={closeAdminLogin}
        onAuthenticated={handleAdminAuth}
      />
    </>
  );
}

export default App;