
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WatchDemo from './components/WatchDemo';
import AdminDashboard from './components/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Router>
          <div className="min-h-screen bg-premium-void">
            <Routes>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/" element={
                <>
                  <Navbar />
                  <Hero />
                  <About />
                  <WatchDemo />
                  <Projects />
                  <Contact />
                  <Footer />
                </>
              } />
            </Routes>
          </div>
        </Router>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;