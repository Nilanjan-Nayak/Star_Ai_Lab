
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WatchDemo from './components/WatchDemo';
import AdminDashboard from './components/AdminDashboard';
import VisitorTracking from './components/VisitorTracking';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { ModalProvider } from './context/ModalContext';
import { useVisitorTracking } from './hooks/useVisitorTracking';
// import  { Ai_Demo } from './components/Ai_Demo';
import Demo_card from './components/Demo_card'


function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <ModalProvider>
          <Router>
            <AppContent />
          </Router>
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

  return (
    <>
      <div className="min-h-screen bg-premium-void">
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={
            <>
              <Navbar />
              <Hero />
              <About />
              <WatchDemo/>
              {/* <Ai_Demo /> */}
              <Demo_card/>
              <Projects/>
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
    </>
  );
}

export default App;