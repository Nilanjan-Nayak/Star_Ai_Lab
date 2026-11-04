import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
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
// Admin code is loaded only when it is needed – it is not part of the public bundle.
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'));
const AdminPanel = lazy(() => import('./components/admin/AdminPanel'));
import AdminSessionGuard from './components/admin/AdminSessionGuard.tsx';
import { useAdminSession } from './hooks/useAdminSession.ts';
import Demo_card from './components/Demo_card';
import StarAiTeamModal from './components/StarAiTeamModal.tsx';
import cornerLogoImg from './img/_Pngtree_n_circle_letter_initial_logo_4835121-removebg-preview.png';


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
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const {
    isPopupOpen,
    submitVisitorData,
    closePopup,
  } = useVisitorTracking({
    sessionDuration: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Hidden admin access system
  const { isAdminLoginVisible, closeAdminLogin } = useSecretAccess();
  const { session, checking, secondsLeft, warning, endedReason, clearEndedReason, login, logout, extend } = useAdminSession();

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
    }).catch(() => { });
  }, []);

  const handleAdminAuth = useCallback((token: string, user: any) => {
    login(token, user);
    closeAdminLogin();
  }, [login, closeAdminLogin]);

  // Verifying a saved tab session – show a neutral loader instead of flashing the public site
  if (checking && sessionStorage.getItem('starAdminSession')) {
    return <div className="fixed inset-0 bg-slate-950" aria-busy="true" />;
  }

  // Signed-in admin → panel, wrapped by the session guard (timer + auto sign-out)
  if (session) {
    return (
      <AdminSessionGuard secondsLeft={secondsLeft} warning={warning} onExtend={extend} onLogout={() => logout('manual')}>
        <Suspense fallback={<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950 text-sm text-white/40">Loading admin panel…</div>}>
          <AdminPanel token={session.token} user={session.user} onLogout={() => logout('manual')} />
        </Suspense>
      </AdminSessionGuard>
    );
  }

  return (
    <>
      <div className="min-h-screen relative">
        {/* Page backdrop (stars, galaxy, nebula) is drawn once by useCosmos() from SectionKit */}

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
      {isAdminLoginVisible && (
        <Suspense fallback={null}>
          <AdminLogin isVisible={isAdminLoginVisible} onClose={closeAdminLogin} onAuthenticated={handleAdminAuth} />
        </Suspense>
      )}

      {/* Why the admin session ended (shown once, to the admin only) */}
      {endedReason && endedReason !== 'manual' && (
        <div role="status" className="fixed left-1/2 top-4 z-[9998] flex -translate-x-1/2 items-center gap-3 rounded-xl border border-amber-400/30 bg-slate-900/95 px-4 py-3 text-sm text-amber-100 shadow-2xl backdrop-blur-xl">
          <span>
            {endedReason === 'idle' && 'You were signed out because of inactivity.'}
            {endedReason === 'expired' && 'Your admin session expired. Please verify again.'}
            {endedReason === 'unauthorized' && 'Your admin session is no longer valid. Please verify again.'}
          </span>
          <button onClick={clearEndedReason} className="rounded-md px-2 py-0.5 text-amber-300 hover:bg-white/10" aria-label="Dismiss">✕</button>
        </div>
      )}

      {/* Floating Corner Logo — Made by Star AI Lab */}
      <button
        onClick={() => setIsTeamModalOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-black/95 backdrop-blur-xl rounded-full px-5 py-2 pl-2 border-2 border-blue-500/30 shadow-2xl shadow-blue-500/20 transition-all duration-300 cursor-pointer hover:shadow-cyan-400/30 hover:border-cyan-400/60 hover:-translate-y-0.5 active:translate-y-0 group"
        title="Meet the Star AI Lab team"
        aria-label="Meet the Star AI Lab team"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <img
          src={cornerLogoImg}
          alt="Star AI Lab Logo"
          className="relative w-10 h-10 rounded-full border-2 border-blue-500/40 object-cover bg-white/10 group-hover:border-cyan-400/70 transition-colors duration-300"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className="relative text-cyan-300 text-sm font-semibold transition-colors duration-300 group-hover:text-cyan-200">
          Made by Star AI Lab
        </span>
      </button>

      {/* Interactive Star AI Lab Team & Hackathon Squad Modal */}
      <StarAiTeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />
    </>
  );
}

export default App;