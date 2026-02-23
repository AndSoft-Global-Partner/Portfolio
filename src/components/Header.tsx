import { useState } from 'react';
import { Globe } from 'lucide-react';

export default function Header() {
  const [language, setLanguage] = useState('EN');

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      
      <div
        className="
          pointer-events-auto
          w-full max-w-7xl xl:max-w-[1400px]
          h-[56px] md:h-[60px] lg:h-[64px]

          flex items-center justify-between

          rounded-2xl xl:rounded-3xl
          border border-white/10
          backdrop-blur-xl
          bg-white/[0.04]

          px-6 md:px-10 xl:px-14

          relative overflow-hidden
        "
        style={{
          boxShadow: "0 8px 30px rgba(0,0,0,0.35)"
        }}
      >

        {/* Background SVG - Mobile/Tablet only */}
        <img
          src="/pacman.svg"
          alt=""
          className="
            absolute top-1/2 left-1/2
            h-full w-auto
            min-w-full
            -translate-x-1/2 -translate-y-1/2
            opacity-40
            pointer-events-none
            lg:hidden
          "
        />

        {/* Logo */}
        <img
          src="/andsoft.png"
          alt="AndSoft"
          className="
            h-9 md:h-11 xl:h-14
            object-contain
            hover:opacity-80
            transition
            relative z-10
          "
        />

        {/* Navigation Links - Desktop only */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-12">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="
                text-white/70
                hover:text-cyan-400
                transition-all duration-300
                text-base xl:text-lg
                font-medium
                relative
                group
              "
            >
              {link.name}
              <span className="
                absolute -bottom-1 left-0 w-0 h-[2px]
                bg-gradient-to-r from-cyan-400 to-purple-500
                group-hover:w-full
                transition-all duration-300
              " />
            </a>
          ))}
        </nav>

        {/* Language */}
        <button
          onClick={() => setLanguage(language === 'EN' ? 'MN' : 'EN')}
          className="
            flex items-center gap-2
            text-white/80
            hover:text-cyan-400
            transition
            relative z-10

            text-sm md:text-base xl:text-lg
          "
        >
          <Globe size={18} />
          <span className="text-sm font-medium">
            {language}
          </span>
        </button>

      </div>

    </header>
  );
}
