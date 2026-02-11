import { useState } from 'react';
import { Globe } from 'lucide-react';

export default function Header() {
  const [language, setLanguage] = useState('EN');

  return (
    <header 
      className="mt-6 mx-auto w-[95%] md:w-[90%] max-w-7xl rounded-2xl border border-white/20 z-50"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
      }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/andsoft.png"
              alt="AndSoft"
              className="h-10 md:h-12 object-contain transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
            />
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-white hover:text-cyan-400 transition-colors">Home</a>
            <a href="#projects" className="text-white hover:text-cyan-400 transition-colors">Projects</a>
            <a href="#technologies" className="text-white hover:text-cyan-400 transition-colors">Technologies</a>
            <a href="#about" className="text-white hover:text-cyan-400 transition-colors">About Us</a>
            <a href="#contact" className="text-white hover:text-cyan-400 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLanguage(language === 'EN' ? 'MN' : 'EN')}
              className="flex items-center space-x-2 text-white hover:text-cyan-400 transition-colors"
            >
              <Globe size={18} />
              <span>{language}</span>
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
              Let's Talk
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
