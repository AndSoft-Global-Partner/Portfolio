import { useEffect, useRef } from 'react';
import { useTheme } from '../useTheme';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseOpacity: number;
  opacity: number;
  color: string;
  pulseSpeed: number;
  pulsePhase: number;
}

const COLORS_DARK = [
  'rgba(0,255,136,',   // green
  'rgba(0,200,230,',   // cyan
  'rgba(167,139,250,', // violet
  'rgba(251,113,133,', // rose
  'rgba(56,189,248,',  // sky
];

const COLORS_LIGHT = [
  'rgba(5,150,105,',   // emerald
  'rgba(14,116,144,',  // teal
  'rgba(124,58,237,',  // violet
  'rgba(225,29,72,',   // rose
  'rgba(37,99,235,',   // blue
];

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDark } = useTheme();
  const mouseRef = useRef({ x: -999, y: -999 });
  const animRef = useRef<number>(0);
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const COLORS = isDark ? COLORS_DARK : COLORS_LIGHT;
    const COUNT = Math.min(100, Math.floor((w * h) / 14000));
    const CONNECT_DIST = 170;
    const MOUSE_DIST = 250;

    const particles: Particle[] = [];
    for (let i = 0; i < COUNT; i++) {
      const isLarge = Math.random() < 0.12; // 12% chance of a larger "star" particle
      const baseOpacity = isDark
        ? Math.random() * 0.5 + 0.2
        : Math.random() * 0.55 + 0.3;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * (isLarge ? 0.15 : 0.4),
        vy: (Math.random() - 0.5) * (isLarge ? 0.15 : 0.4),
        size: isLarge ? Math.random() * 2.5 + 2 : Math.random() * 1.8 + 0.6,
        baseOpacity,
        opacity: baseOpacity,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        pulseSpeed: isLarge ? Math.random() * 0.015 + 0.003 : Math.random() * 0.025 + 0.006,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleLeave = () => {
      mouseRef.current = { x: -999, y: -999 };
    };
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('mouseleave', handleLeave);

    let tick = 0;

    const draw = () => {
      const dark = isDarkRef.current;
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      tick++;

      // Update & draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Mouse attraction (gentle pull)
        const dmx = mx - p.x;
        const dmy = my - p.y;
        const dm = Math.sqrt(dmx * dmx + dmy * dmy);
        if (dm < MOUSE_DIST && dm > 25) {
          const force = (MOUSE_DIST - dm) / MOUSE_DIST * 0.012;
          p.vx += (dmx / dm) * force;
          p.vy += (dmy / dm) * force;
        }

        // Speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.2) {
          p.vx = (p.vx / speed) * 1.2;
          p.vy = (p.vy / speed) * 1.2;
        }

        // Damping
        p.vx *= 0.997;
        p.vy *= 0.997;

        // Opacity pulse
        p.opacity = p.baseOpacity + Math.sin(tick * p.pulseSpeed + p.pulsePhase) * 0.2;

        // Draw particle with glow
        const glowSize = dark ? 8 : 5;
        ctx.shadowBlur = glowSize;
        ctx.shadowColor = `${p.color}${dark ? 0.4 : 0.3})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, p.opacity)})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw connections between particles — colored gradient lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * (dark ? 0.12 : 0.15);
            const grad = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            grad.addColorStop(0, `${particles[i].color}${alpha})`);
            grad.addColorStop(1, `${particles[j].color}${alpha})`);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Mouse connections — colored lines from nearby particles
      if (mx > 0 && my > 0) {
        for (const p of particles) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_DIST) {
            const alpha = (1 - dist / MOUSE_DIST) * (dark ? 0.25 : 0.22);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mx, my);
            ctx.strokeStyle = `${p.color}${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }

        // Mouse glow — multi-ring
        const glowA = dark ? 0.1 : 0.08;
        const grad1 = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
        grad1.addColorStop(0, dark ? `rgba(0,255,136,${glowA})` : `rgba(124,58,237,${glowA})`);
        grad1.addColorStop(0.5, dark ? `rgba(0,180,230,${glowA * 0.4})` : `rgba(37,99,235,${glowA * 0.4})`);
        grad1.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(mx, my, 80, 0, Math.PI * 2);
        ctx.fillStyle = grad1;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('mouseleave', handleLeave);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
