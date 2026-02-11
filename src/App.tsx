import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Projects from './components/Projects';
import AboutContact from './components/AboutContact';
import Footer from './components/Footer';
import { useEffect, useRef } from 'react';

function App() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const lastScrollRef = useRef(0);
  const vantaInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Vanta Globe
    if (vantaRef.current && (window as any).VANTA && !vantaInstanceRef.current) {
      vantaInstanceRef.current = (window as any).VANTA.GLOBE({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        color: 0x06b6d4,
        backgroundColor: 0x0a0e27,
      });
    }

    return () => {
      if (vantaInstanceRef.current) {
        vantaInstanceRef.current.destroy();
        vantaInstanceRef.current = null;
      }
    };
  }, []);

  // Update globe rotation based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const scrollSpeed = Math.abs(currentScroll - lastScrollRef.current);
      lastScrollRef.current = currentScroll;

      if (vantaInstanceRef.current) {
        // Rotate globe based on scroll position
        const rotation = (currentScroll / 100) % 360;
        if (vantaInstanceRef.current.renderer) {
          vantaInstanceRef.current.renderer.domElement.style.filter = `hue-rotate(${rotation * 0.5}deg)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050816] via-[#0b1026] to-[#050816] relative overflow-hidden">
      {/* Vanta Globe Background */}
      <div
        ref={vantaRef}
        className="fixed inset-0 z-0"
        style={{ minHeight: '100vh' }}
      />
      
      <div
        className="fixed inset-0 z-1 opacity-60"
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
        <Projects />
        <AboutContact />
        <Footer />
      </div>
    </div>
  );
}

export default App;
