import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  { image: '/1.png', title: 'Innovation First', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { image: '/2.png', title: 'Creative Design', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { image: '/3.png', title: 'Digital Solutions', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { image: '/4.png', title: 'Future Forward', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { image: '/5.png', title: 'Excellence', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
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
    <section id="home" className="min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
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

          <div className="relative h-[500px] flex items-center justify-center">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
              className="absolute left-0 z-20 p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all"
            >
              <ChevronLeft className="text-white" />
            </button>

            {slides.map((slide, index) => {
              const position = getSlidePosition(index);
              return (
                <div
                  key={index}
                  className={`absolute transition-all duration-500 ${
                    position === 'center'
                      ? 'z-10 scale-100 opacity-100 translate-x-0'
                      : position === 'left'
                      ? 'z-5 scale-75 opacity-50 -translate-x-64 blur-sm'
                      : position === 'right'
                      ? 'z-5 scale-75 opacity-50 translate-x-64 blur-sm'
                      : 'opacity-0 scale-50'
                  }`}
                >
                  <div className="relative w-80 h-96">
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

            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
              className="absolute right-0 z-20 p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all"
            >
              <ChevronRight className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
