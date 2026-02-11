const partners = [
  { name: 'IBM', logo: '/1.png' },
  { name: 'Microsoft', logo: '/2.png' },
  { name: 'Oracle', logo: '/3.png' },
  { name: 'Google', logo: '/4.png' },
  { name: 'Amazon', logo: '/5.png' },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-start md:items-center pt-24 md:pt-20 pb-32"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-4 max-w-lg">
            <h1 className="text-4xl md:text-5xl font-medium text-white">
              Innovative Technology
              <br />
              <span className="text-cyan-400">Solutions</span>
            </h1>
            <p className="text-gray-400">
              Cutting-edge tools to grow and scale your business.
            </p>
          </div>
        </div>
      </div>

      {/* Partners - positioned at bottom */}
      <div className="absolute bottom-6 left-0 w-full px-6">
        <div className="container mx-auto">
          {/* Line separator */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>

          <div 
            className="relative overflow-hidden rounded-xl p-4 md:p-6 border border-white/15"
            style={{
              backdropFilter: 'blur(1.5px)',
              WebkitBackdropFilter: 'blur(1.5px)',
              background: 'rgba(255,255,255,0)',
            }}
          >
            {/* Fade edges */}
            <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-black to-transparent pointer-events-none z-10"></div>
            <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-black to-transparent pointer-events-none z-10"></div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 place-items-center">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center w-40 md:w-280 h-120 md:h-140 animate-[float_6s_ease-in-out_infinite]"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-8 md:max-h-10 max-w-full object-contain opacity-90 hover:scale-105 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
