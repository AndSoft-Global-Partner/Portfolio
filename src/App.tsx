import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import AboutContact from './components/AboutContact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050816] via-[#0b1026] to-[#050816] relative overflow-hidden">
      <div
        className="fixed inset-0 z-0 opacity-60"
        style={{
          backgroundImage: 'url(/AndSoftGalaxyBackground.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="relative z-10">
        <Header />
        <HeroSection />
        <TechStack />
        <Projects />
        <AboutContact />
        <Footer />
      </div>
    </div>
  );
}

export default App;
