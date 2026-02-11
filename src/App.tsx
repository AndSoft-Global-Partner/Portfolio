import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Projects from './components/Projects';
import AboutContact from './components/AboutContact';
import Footer from './components/Footer';
import { useEffect, useRef } from 'react';

function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));

  return (f(0) << 16) + (f(8) << 8) + f(4);
}

function App() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaInstanceRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
        color2: 0x8b5cf6,
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

  // Pause video after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  // Update globe colors based on scroll (smooth 3-stage interpolation)
  useEffect(() => {
    let ticking = false;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = scrollY / docHeight;

      if (!ticking) {
        requestAnimationFrame(() => {
          if (vantaInstanceRef.current) {
            let hue;

            if (progress < 0.5) {
              // Cyan → Pink
              const t = progress / 0.5;
              hue = lerp(190, 320, t);
            } else {
              // Pink → Red
              const t = (progress - 0.5) / 0.5;
              hue = lerp(320, 360, t); // 360 ≈ 0 red
            }

            const color1 = hslToHex(hue, 85, 55);
            const color2 = hslToHex(hue + 15, 85, 45);

            vantaInstanceRef.current.setOptions({
              color: color1,
              color2: color2,
            });
          }

          ticking = false;
        });

        ticking = true;
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
      
      <video
        ref={videoRef}
        className="fixed inset-0 z-1 opacity-40 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      >
        <source src="/galaxy.mp4" type="video/mp4" />
      </video>

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
