import { useEffect, useRef } from 'react';

interface AtmosphereCanvasProps {
  variant?: 'rain' | 'sakura';
  className?: string;
  density?: 'subtle' | 'normal';
}

interface RainDrop {
  x: number;
  y: number;
  len: number;
  speed: number;
  opacity: number;
  thickness: number;
}

interface DustMote {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
}

interface SakuraPetal {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  alpha: number;
}

export function AtmosphereCanvas({
  variant = 'rain',
  className = '',
  density = 'normal',
}: AtmosphereCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId = 0;
    let isVisible = true;
    let width = 0;
    let height = 0;

    const isMobile = window.innerWidth < 768;
    const scaleFactor = density === 'subtle' ? 0.55 : isMobile ? 0.5 : 1;

    const rainCount = Math.floor(85 * scaleFactor);
    const dustCount = Math.floor(28 * scaleFactor);
    const sakuraCount = variant === 'sakura' ? Math.floor(18 * scaleFactor) : Math.floor(6 * scaleFactor);

    let drops: RainDrop[] = [];
    let motes: DustMote[] = [];
    let petals: SakuraPetal[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      drops = Array.from({ length: rainCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        len: 12 + Math.random() * 24,
        speed: 7 + Math.random() * 6,
        opacity: 0.08 + Math.random() * 0.18,
        thickness: Math.random() > 0.75 ? 1.2 : 0.75,
      }));

      motes = Array.from({ length: dustCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.8 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.1 - Math.random() * 0.25,
        alpha: 0.12 + Math.random() * 0.24,
      }));

      petals = Array.from({ length: sakuraCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 3 + Math.random() * 3.5,
        vx: 0.35 + Math.random() * 0.45,
        vy: 0.65 + Math.random() * 0.7,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.025,
        alpha: 0.25 + Math.random() * 0.35,
      }));
    };

    resize();

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    window.addEventListener('resize', resize, { passive: true });

    const render = () => {
      if (isVisible && width > 0 && height > 0) {
        ctx.clearRect(0, 0, width, height);

        // Rain streaks (slanted subtly to match cinematic wind)
        ctx.lineCap = 'round';
        for (let i = 0; i < drops.length; i++) {
          const d = drops[i];
          ctx.beginPath();
          ctx.strokeStyle =
            i % 4 === 0
              ? `rgba(164, 119, 255, ${d.opacity * 0.75})`
              : `rgba(80, 201, 245, ${d.opacity})`;
          ctx.lineWidth = d.thickness;
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - d.len * 0.12, d.y + d.len);
          ctx.stroke();

          d.x -= d.speed * 0.12;
          d.y += d.speed;
          if (d.y > height + 24) {
            d.y = -24;
            d.x = Math.random() * (width + 60);
          }
          if (d.x < -20) {
            d.x = width + 10;
          }
        }

        // Floating ambient dust
        for (let i = 0; i < motes.length; i++) {
          const m = motes[i];
          ctx.beginPath();
          ctx.fillStyle = `rgba(244, 242, 248, ${m.alpha})`;
          ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
          ctx.fill();

          m.x += m.vx;
          m.y += m.vy;
          if (m.y < -10) {
            m.y = height + 10;
            m.x = Math.random() * width;
          }
          if (m.x < 0) m.x = width;
          if (m.x > width) m.x = 0;
        }

        // Subtle drifting sakura petals
        for (let i = 0; i < petals.length; i++) {
          const p = petals[i];
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.fillStyle = `rgba(241, 90, 119, ${p.alpha})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.52, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          p.x += p.vx + Math.sin(p.y * 0.01) * 0.25;
          p.y += p.vy;
          p.angle += p.spin;
          if (p.y > height + 15) {
            p.y = -15;
            p.x = Math.random() * width;
          }
          if (p.x > width + 15) {
            p.x = -15;
          }
        }
      }
      animationId = window.requestAnimationFrame(render);
    };

    animationId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, [variant, density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    />
  );
}
