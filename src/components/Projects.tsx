import { useState, useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";

export default function Projects() {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A comprehensive online shopping experience.",
      color: "from-blue-500/20 to-cyan-500/20",
      image: "/1.png",
      type: "Website"
    },
    {
      title: "HealthTrack App",
      description: "Fitness and nutrition tracking mobile app.",
      color: "from-purple-500/20 to-pink-500/20",
      image: "/2.png",
      type: "App"
    },
    {
      title: "Corporate Portal",
      description: "Internal communication and document system.",
      color: "from-emerald-500/20 to-teal-500/20",
      image: "/5.png",
      type: "Website"
    },
    {
      title: "Financial Dashboard",
      description: "Real-time financial analytics platform.",
      color: "from-orange-500/20 to-red-500/20",
      image: "/4.png",
      type: "Website"
    }
  ];

  // Looped projects for infinite scroll
  const loopProjects = [...projects, ...projects];

  // Rotation angle (continuous)
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const mobileRef = useRef<HTMLDivElement | null>(null);

  // Auto rotate every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const angleStep = 360 / projects.length;

    const timer = setInterval(() => {
      setRotation((prev) => prev - angleStep);
    }, 3000);

    return () => clearInterval(timer);
  }, [projects.length, isPaused]);

  // Mobile auto-scroll
  useEffect(() => {
    const el = mobileRef.current;
    if (!el) return;

    let scrollAmount = 0;
    const cardWidth = 260 + 16; // card width + gap
    const singleSetScroll = cardWidth * projects.length; // First 4 cards scroll distance

    const interval = setInterval(() => {
      if (isPaused) return;

      scrollAmount += 270;

      // Reset when reaching end of first set (seamless loop)
      if (scrollAmount >= singleSetScroll) {
        scrollAmount = 0;
        el.scrollLeft = 0; // Jump back without animation
      } else {
        el.scrollTo({
          left: scrollAmount,
          behavior: "smooth"
        });
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isPaused, projects.length]);

  const getCardStyle = (index: number) => {
    const total = projects.length;
    const angle = 360 / total;
    const rotate = angle * index + rotation;

    const baseRadius = 420;

    // normalize angle
    let normalized = rotate % 360;
    if (normalized < 0) normalized += 360;

    // distance from front
    const distance = Math.min(
      Math.abs(normalized),
      Math.abs(360 - normalized)
    );

    // visual adjustments
    let scale = 1;
    let opacity = 1;
    let radius = baseRadius;

    if (distance > 80) {
      scale = 0.9;
      opacity = 0.5;
      radius = baseRadius - 40;
    } else if (distance > 40) {
      scale = 0.96;
      opacity = 0.75;
      radius = baseRadius - 20;
    }

    return {
      transform: `rotateY(${rotate}deg) translateZ(${radius}px) scale(${scale})`,
      opacity,
      transition: "transform 1.1s cubic-bezier(0.22, 1, 0.36, 1), opacity 1s",
      position: "absolute" as const,
      width: "100%",
      maxWidth: "380px",
      height: "288px"
    };
  };

  // Check if card is visible (not on the back)
  const isCardVisible = (index: number) => {
    const total = projects.length;
    const angle = 360 / total;
    const rotate = (angle * index + rotation) % 360;
    const normalizedRotate = rotate < 0 ? rotate + 360 : rotate;
    
    // Card is visible if it's not in the back (around 180 degrees)
    // Back range: 120 to 240 degrees (adjusted for smooth transition)
    return !(normalizedRotate > 120 && normalizedRotate < 240);
  };

  return (
    <section 
      className="py-24 overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">
            Our <span className="text-cyan-400">Featured Work</span>
          </h2>
        </div>

        <div className="hidden md:block relative h-[460px] perspective">
          <div className="carousel">
            {projects.map((project, index) => (
              <div key={index} style={getCardStyle(index)}>
                <div className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-xl relative h-72 group">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    {isCardVisible(index) ? (
                      <>
                        <h3 className="text-lg font-bold text-white mb-2">
                          {project.title}
                        </h3>

                        <p className="text-white/80 mb-3 text-xs leading-relaxed line-clamp-2">
                          {project.description}
                        </p>

                        <div className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors">
                          <span className="text-xs font-semibold mr-2">
                            View Case Study
                          </span>
                          <ExternalLink size={14} />
                        </div>
                      </>
                    ) : (
                      <div className="h-0" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:flex justify-center mt-10 gap-2">
          {projects.map((_, i) => {
            const angle = (360 / projects.length) * i + rotation;
            const normalized = ((angle % 360) + 360) % 360;
            const isActive = normalized < 30 || normalized > 330;

            return (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  isActive ? "w-8 bg-cyan-400" : "w-2 bg-white/20"
                }`}
              />
            );
          })}
        </div>

        {/* Mobile slider */}
        <div className="relative md:hidden">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent z-10" />

          <div
            ref={mobileRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory px-6 no-scrollbar"
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {loopProjects.map((project, index) => (
              <div
                key={index}
                className="min-w-[260px] snap-center rounded-3xl overflow-hidden border border-white/10 shadow-xl relative h-64"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {project.title}
                  </h3>

                  <p className="text-white/80 mb-3 text-xs leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center text-cyan-400">
                    <span className="text-xs font-semibold mr-2">
                      View Case Study
                    </span>
                    <ExternalLink size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective {
          perspective: 1400px;
        }

        .carousel {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
