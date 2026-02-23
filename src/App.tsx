import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import AboutContact from './components/AboutContact';
import Footer from './components/Footer';
import { I18nProvider } from './i18n';
import { ThemeProvider } from './theme';

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
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
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
