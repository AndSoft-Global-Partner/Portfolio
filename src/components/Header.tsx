import { useState } from 'react';
import { Globe } from 'lucide-react';

export default function Header() {
  const [language, setLanguage] = useState('EN');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-cyan-500/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white">
              <span className="text-cyan-400">And</span>Soft
            </div>
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
      <div className="h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
    </header>
  );
}
