import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import AboutContact from './components/AboutContact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen desktop-bg relative scanlines">
      {/* OS Top Panel */}
      <Header />

      {/* Desktop Window Area */}
      <main className="relative z-10">
        <HeroSection />
        <TechStack />
        <Projects />
        <AboutContact />
        <Footer />
      </main>
    </div>
  );
}

export default App;
