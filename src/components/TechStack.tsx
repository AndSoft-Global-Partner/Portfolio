export default function TechStack() {
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

  return (
    <section id="technologies" className="py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          Technologies <span className="text-cyan-400">We Use</span>
        </h2>

        <div className="bg-transparent backdrop-blur-sm rounded-2xl p-6 border border-white/25 shadow-lg">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-6 place-items-center">
            {techs.map((tech) => (
              <div
                key={tech.name}
                className="group transition duration-300"
              >
                <img
                  src={tech.src}
                  alt={tech.name}
                  className="
                    w-12 h-12 object-contain
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
    </section>
  );
}
