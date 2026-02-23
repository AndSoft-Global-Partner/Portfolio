import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import AboutContact from './components/AboutContact';
import Footer from './components/Footer';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import { I18nProvider } from './i18n';
import { ThemeProvider } from './theme';
import { WindowManagerProvider } from './windowManager';

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <WindowManagerProvider>
          <div className="min-h-screen desktop-bg relative scanlines">
            {/* OS Top Panel */}
            <Header />

            {/* Desktop Window Area — scroll content */}
            <main className="relative z-10">
              <HeroSection />
              <TechStack />
              <Projects />
              <AboutContact />
              <Footer />
            </main>

            {/* Floating windows overlay (desktop only) */}
            <Desktop />

            {/* Dock / Taskbar (desktop only) */}
            <Taskbar />
          </div>
        </WindowManagerProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
