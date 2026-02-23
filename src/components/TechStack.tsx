import { motion, useInView } from "framer-motion";
import { useState, useRef } from "react";

const processes = [
  { pid: 1001, name: "react", display: "React", cpu: 89, mem: 72, color: "#61DAFB", src: "/react.png" },
  { pid: 1002, name: "tailwindcss", display: "TailwindCSS", cpu: 76, mem: 45, color: "#06B6D4", src: "/tailwindcss.png" },
  { pid: 1003, name: "node", display: "Node.js", cpu: 82, mem: 68, color: "#68A063", src: "/nodejs.png" },
  { pid: 1004, name: "python3", display: "Python", cpu: 71, mem: 54, color: "#FFD43B", src: "/python.png" },
  { pid: 1005, name: "php-fpm", display: "PHP", cpu: 65, mem: 42, color: "#8892BF", src: "/php.png" },
  { pid: 1006, name: "flutter", display: "Flutter", cpu: 78, mem: 61, color: "#02569B", src: "/flutter.png" },
  { pid: 1007, name: "kotlind", display: "Kotlin", cpu: 74, mem: 55, color: "#B125EA", src: "/kotlin.png" },
  { pid: 1008, name: "postgres", display: "PostgreSQL", cpu: 58, mem: 83, color: "#336791", src: "/postgresql.png" },
  { pid: 1009, name: "aws-cli", display: "AWS", cpu: 45, mem: 38, color: "#FF9900", src: "/aws.png" },
];

export default function TechStack() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="technologies" className="px-3 md:px-6 py-3" ref={sectionRef}>
      <div className="os-window max-w-5xl mx-auto">
        {/* Title bar */}
        <div className="os-titlebar">
          <div className="os-dots">
            <div className="os-dot close" />
            <div className="os-dot minimize" />
            <div className="os-dot maximize" />
          </div>
          <div className="os-title">
            System Monitor — Active Processes
          </div>
        </div>

        {/* Info bar */}
        <div className="px-4 md:px-6 py-2.5 border-b border-os-border flex items-center justify-between bg-os-titlebar/50">
          <div className="font-mono text-[10px] text-os-muted tracking-wider">
            <span className="text-os-green">●</span>&nbsp; {processes.length} ACTIVE PROCESSES
          </div>
          <div className="font-mono text-[10px] text-os-muted tracking-wider hidden sm:block">
            LOAD: 0.82 · TASKS: {processes.length}/128 · UPTIME: 99.9%
          </div>
        </div>

        {/* Table Headers - Desktop */}
        <div className="hidden md:grid grid-cols-[50px_50px_1fr_140px_140px_80px] gap-2 px-6 py-2 border-b border-os-border/50 text-[10px] font-mono text-os-dim tracking-wider uppercase">
          <div></div>
          <div>PID</div>
          <div>PROCESS</div>
          <div>CPU</div>
          <div>MEMORY</div>
          <div>STATUS</div>
        </div>

        {/* Process rows */}
        <div className="divide-y divide-os-border/30">
          {processes.map((proc, i) => (
            <motion.div
              key={proc.pid}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" as const }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`
                grid grid-cols-[1fr] md:grid-cols-[50px_50px_1fr_140px_140px_80px]
                items-center px-4 md:px-6 py-3 md:py-2.5 gap-2
                transition-colors duration-200
                ${hoveredIdx === i ? 'bg-white/[0.02]' : ''}
              `}
            >
              {/* Icon - Desktop */}
              <div className="hidden md:flex items-center">
                <img
                  src={proc.src}
                  alt={proc.display}
                  className="w-6 h-6 object-contain transition-all duration-300"
                  style={{ filter: hoveredIdx === i ? 'none' : 'grayscale(60%) brightness(0.8)' }}
                />
              </div>

              {/* PID - Desktop */}
              <div className="hidden md:block font-mono text-[11px] text-os-dim">
                {proc.pid}
              </div>

              {/* Name */}
              <div className="flex items-center gap-3">
                <img
                  src={proc.src}
                  alt={proc.display}
                  className="w-6 h-6 object-contain md:hidden"
                />
                <div>
                  <div className="font-mono text-xs text-os-text font-medium">{proc.display}</div>
                  <div className="font-mono text-[10px] text-os-dim md:hidden">
                    PID {proc.pid} · CPU {proc.cpu}% · MEM {proc.mem}%
                  </div>
                </div>
              </div>

              {/* CPU Bar - Desktop */}
              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="os-progress flex-1">
                    <div
                      className="os-progress-fill"
                      style={{
                        width: isInView ? `${proc.cpu}%` : '0%',
                        background: proc.color,
                        opacity: 0.7,
                      }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-os-muted w-8 text-right">{proc.cpu}%</span>
                </div>
              </div>

              {/* Memory Bar - Desktop */}
              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="os-progress flex-1">
                    <div
                      className="os-progress-fill"
                      style={{
                        width: isInView ? `${proc.mem}%` : '0%',
                        background: proc.color,
                        opacity: 0.5,
                      }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-os-muted w-8 text-right">{proc.mem}%</span>
                </div>
              </div>

              {/* Status - Desktop */}
              <div className="hidden md:flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full status-pulse"
                  style={{ background: proc.color }}
                />
                <span className="font-mono text-[10px] text-os-green">ACTIVE</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 md:px-6 py-2.5 border-t border-os-border bg-os-titlebar/30 flex items-center justify-between">
          <div className="font-mono text-[10px] text-os-dim">
            Total: {processes.length} processes · All systems operational
          </div>
          <div className="font-mono text-[10px] text-os-green">
            ● HEALTHY
          </div>
        </div>
      </div>
    </section>
  );
}
