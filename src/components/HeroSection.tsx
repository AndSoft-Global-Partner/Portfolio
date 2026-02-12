import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

const partners = [
  { name: 'IBM', logo: '/1.png' },
  { name: 'Microsoft', logo: '/2.png' },
  { name: 'Oracle', logo: '/3.png' },
  { name: 'Google', logo: '/4.png' },
  { name: 'Amazon', logo: '/5.png' },
];

export default function HeroSection() {

  const controls = useAnimation();
  const lastScroll = useRef(0);

  useEffect(() => {

    // initial animation
    controls.set({ x: 120, y: 0, opacity: 0 });

    controls.start({
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    });

    const handleScroll = () => {

      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll.current) {

        // scroll down → hide up
        controls.start({
          y: -80,
          opacity: 0,
          transition: { duration: 0.35 }
        });

      } else {

        // scroll up → show from bottom
        controls.start({
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.5,
            ease: "easeOut"
          }
        });

      }

      lastScroll.current = currentScroll;

    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);

  }, []);

  return (

    <section
      id="home"
      className="relative min-h-screen flex items-start md:items-center pt-24 md:pt-20 pb-32"
    >

      <div className="container mx-auto px-6 relative z-10">

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

          <motion.div
            animate={controls}
            className="space-y-4 max-w-lg"
          >

            <h1 className="text-4xl md:text-5xl font-medium text-white">

              Innovative Technology
              <br />

              <span className="text-cyan-400">
                Solutions
              </span>

            </h1>

            <p className="text-gray-400">
              Cutting-edge tools to grow and scale your business.
            </p>

          </motion.div>

        </div>

      </div>

      {/* Partners */}
      <div className="absolute bottom-6 left-0 w-full px-6">
        <div className="container mx-auto">

          <div className="relative overflow-hidden rounded-xl p-4 md:p-6 border border-white/15">

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 place-items-center">

              {partners.map((partner, index) => (

                <div
                  key={index}
                  className="flex items-center justify-center w-40 h-24"
                >

                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-8 md:max-h-10 object-contain opacity-90"
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
