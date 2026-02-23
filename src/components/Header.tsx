import { useState, useCallback } from 'react';
import { Globe, Menu, X } from 'lucide-react';

// Reusable NavLink component
interface NavLinkProps {
  name: string;
  href: string;
  onClick?: () => void;
}

function NavLink({ name, href, onClick }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
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
      {name}
      <span className="
        absolute -bottom-1 left-0 w-0 h-[2px]
        bg-gradient-to-r from-cyan-400 to-purple-500
        group-hover:w-full
        transition-all duration-300
      " />
    </a>
  );
}

export default function Header() {
  const [language, setLanguage] = useState('EN');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  // Performance: useCallback for toggle functions
  const toggleLanguage = useCallback(() => {
    setLanguage(prev => (prev === 'EN' ? 'MN' : 'EN'));
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none py-6">
      
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

        {/* Logo - Clickable link */}
        <a href="/" aria-label="Go to homepage" className="relative z-10">
          <img
            src="/andsoft.png"
            alt="AndSoft"
            className="
              h-9 md:h-11 xl:h-14
              object-contain
              hover:opacity-80
              transition
            "
          />
        </a>

        {/* Navigation Links - Desktop only */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-12" aria-label="Main navigation">
          {navLinks.map((link) => (
            <NavLink key={link.name} {...link} />
          ))}
        </nav>

        {/* Right side: Language + Mobile Menu */}
        <div className="flex items-center gap-4 relative z-10">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            aria-label="Toggle language"
            aria-pressed={language === 'MN'}
            className="
              flex items-center gap-2
              text-white/80
              hover:text-cyan-400
              transition

              text-sm md:text-base xl:text-lg
            "
          >
            <Globe size={18} />
            <span className="text-sm font-medium">
              {language}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="
              lg:hidden
              text-white/80
              hover:text-cyan-400
              transition
              p-1
            "
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`
          lg:hidden
          pointer-events-auto
          absolute top-full left-4 right-4 mt-2
          rounded-2xl
          border border-white/10
          backdrop-blur-2xl
          bg-black/80
          overflow-hidden
          transition-all duration-300 ease-out
          ${mobileMenuOpen 
            ? 'opacity-100 translate-y-0 visible' 
            : 'opacity-0 -translate-y-4 invisible'
          }
        `}
        style={{
          boxShadow: "0 8px 30px rgba(0,0,0,0.5)"
        }}
      >
        <nav className="flex flex-col p-4 gap-1" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={closeMobileMenu}
              className="
                text-white/80
                hover:text-cyan-400
                hover:bg-white/5
                transition-all duration-200
                text-lg
                font-medium
                py-3 px-4
                rounded-xl
              "
            >
              {link.name}
            </a>
          ))}
        </nav>
      </div>

    </header>
  );
}
