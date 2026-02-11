import { useState, useEffect } from 'react';

const slides = [
  { image: '/1.png', title: 'Innovation First', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { image: '/2.png', title: 'Creative Design', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { image: '/3.png', title: 'Digital Solutions', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { image: '/4.png', title: 'Future Forward', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { image: '/5.png', title: 'Excellence', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
];

const techs = [
  { name: "React", src: "/react.png" },
  { name: "TailwindCSS", src: "/tailwindcss.png" },
  { name: "Node.js", src: "/nodejs.png" },
  { name: "Python", src: "/python.png" },
  { name: "PHP", src: "/php.png" },
  { name: "Flutter", src: "/flutter.png" },
  { name: "Kotlin", src: "/kotlin.png" },
  { name: "PostgreSQL", src: "/postgresql.png" },
  { name: "AWS", src: "/aws.png" },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getSlidePosition = (index: number) => {
    const diff = index - currentIndex;
    if (diff === 0) return 'center';
    if (diff === 1 || diff === -(slides.length - 1)) return 'right';
    if (diff === -1 || diff === slides.length - 1) return 'left';
    if (diff === 2 || diff === -(slides.length - 2)) return 'far-right';
    return 'far-left';
  };

  return (
    <section id="home" className="min-h-screen flex items-start md:items-center pt-24 md:pt-20 pb-10 relative">
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

          <div className="relative">
            {/* DESKTOP 3D CAROUSEL */}
            <div className="hidden md:flex relative h-[500px] items-center justify-center">
              {slides.map((slide, index) => {
                const position = getSlidePosition(index);
                return (
                  <div
                    key={index}
                    className={`absolute transition-all duration-500 ${
                      position === 'center'
                        ? 'z-10 scale-100 opacity-100 translate-x-0'
                        : 'hidden md:block opacity-50 scale-75 blur-sm'
                    } ${
                      position === 'left' ? '-translate-x-32 md:-translate-x-64' : ''
                    } ${
                      position === 'right' ? 'translate-x-32 md:translate-x-64' : ''
                    }`}
                  >
                    <div className="relative w-52 h-72 md:w-64 md:h-80">
                      <img
                        src={slide.image}
                        alt="Gallery"
                        className="w-full h-full object-cover rounded-3xl shadow-2xl hover:shadow-cyan-500/30 transition-shadow border border-cyan-500/30"
                      />
                      <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 to-transparent rounded-3xl">
                        <h3 className="text-2xl font-bold text-white mb-2">{slide.title}</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{slide.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* MOBILE INFINITE SLIDER */}
            <div className="md:hidden overflow-hidden relative h-[260px] mt-6">
              <div className="flex animate-scroll gap-6 w-max">
                {[...slides, ...slides].map((slide, index) => (
                  <div key={index} className="w-48 h-64 flex-shrink-0">
                    <img
                      src={slide.image}
                      alt="slide"
                      className="w-full h-full object-cover rounded-2xl border border-cyan-500/30"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Technologies We Use Section */}
        <div className="mt-8">
          <div className="bg-transparent backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4 place-items-center">
              {techs.map((tech) => (
                <div
                  key={tech.name}
                  className="group transition duration-300"
                >
                  <img
                    src={tech.src}
                    alt={tech.name}
                    className="
                      w-10 h-10 object-contain
                      opacity-100
                      md:grayscale md:opacity-70
                      md:group-hover:grayscale-0
                      md:group-hover:opacity-100
                      md:group-hover:scale-110
                      transition duration-300
                    "
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
