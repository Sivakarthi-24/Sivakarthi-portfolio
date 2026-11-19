import { useEffect, useRef, useState } from 'react';

export interface CursorTransitionControlState {
  active: boolean;
  holding: boolean;
  progress: number; // 0..1
  fromLabel?: string;
  toLabel?: string;
}

interface CustomCursorProps {
  transitionControl: CursorTransitionControlState;
}

type CursorVariant = 'default' | 'pointer' | 'card' | 'text' | 'hold';

export function CustomCursor({ transitionControl }: CustomCursorProps) {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [pressed, setPressed] = useState(false);

  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);

  const posRef = useRef({
    targetX: -100,
    targetY: -100,
    ringX: -100,
    ringY: -100,
  });

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncCapability = () => {
      const canEnable = finePointer.matches && !reducedMotion.matches;
      setEnabled(canEnable);
      if (canEnable) {
        document.body.classList.add('custom-cursor-active');
      } else {
        document.body.classList.remove('custom-cursor-active');
      }
    };

    syncCapability();
    finePointer.addEventListener('change', syncCapability);
    reducedMotion.addEventListener('change', syncCapability);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      finePointer.removeEventListener('change', syncCapability);
      reducedMotion.removeEventListener('change', syncCapability);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let rafId = 0;

    const resolveTargetVariant = (el: HTMLElement | null): CursorVariant => {
      if (!el) return 'default';
      if (el.closest('input, textarea, select, [contenteditable="true"]')) {
        return 'text';
      }
      if (el.closest('[data-cursor="card"]')) {
        return 'card';
      }
      if (
        el.closest(
          'a, button, [role="button"], [role="tab"], label[for], [data-cursor="pointer"]'
        )
      ) {
        return 'pointer';
      }
      return 'default';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      posRef.current.targetX = e.clientX;
      posRef.current.targetY = e.clientY;

      if (!visible) {
        posRef.current.ringX = e.clientX;
        posRef.current.ringY = e.clientY;
        setVisible(true);
      }

      const targetEl = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const nextVariant = resolveTargetVariant(targetEl);
      setVariant((prev) => (prev === nextVariant ? prev : nextVariant));
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      setPressed(true);
    };

    const onPointerUp = () => {
      setPressed(false);
    };

    const onMouseLeave = () => {
      setVisible(false);
    };

    const animate = () => {
      const p = posRef.current;
      p.ringX += (p.targetX - p.ringX) * 0.22;
      p.ringY += (p.targetY - p.ringY) * 0.22;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${p.targetX}px, ${p.targetY}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${p.ringX}px, ${p.ringY}px, 0) translate(-50%, -50%)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${p.ringX}px, ${p.ringY + 42}px, 0) translate(-50%, 0)`;
      }

      rafId = window.requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [enabled, visible]);

  if (!enabled) return null;

  const isHolding = transitionControl.holding;
  const activeVariant: CursorVariant = isHolding ? 'hold' : variant;
  const progressPct = Math.round(transitionControl.progress * 100);
  const ringCircumference = 2 * Math.PI * 28;
  const ringOffset = ringCircumference * (1 - Math.min(1, Math.max(0, transitionControl.progress)));

  // Ring size & theme styling mapped cleanly to portfolio tokens (#A477FF, #50C9F5, #F15A77)
  let ringSizeClass = 'w-8 h-8 border-[#A477FF]/75 bg-transparent shadow-[0_0_18px_rgba(164,119,255,0.28)]';
  if (activeVariant === 'pointer') {
    ringSizeClass =
      'w-12 h-12 border-[#50C9F5]/85 bg-[#A477FF]/[0.08] shadow-[0_0_24px_rgba(164,119,255,0.45)]';
  } else if (activeVariant === 'card') {
    ringSizeClass =
      'w-16 h-16 border-[#A477FF]/90 bg-[#A477FF]/[0.14] shadow-[0_0_30px_rgba(80,201,245,0.35)] backdrop-blur-[1px]';
  } else if (activeVariant === 'text') {
    ringSizeClass = 'w-5 h-5 border-[#A477FF]/35 bg-transparent opacity-55';
  } else if (activeVariant === 'hold') {
    ringSizeClass =
      'w-16 h-16 border-[#A477FF]/30 bg-[#08090D]/55 shadow-[0_0_32px_rgba(164,119,255,0.5)] backdrop-blur-[2px]';
  }

  return (
    <div
      aria-hidden="true"
      className={`no-print fixed inset-0 z-[70] pointer-events-none transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Trailing Outer Theme Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 will-change-transform flex items-center justify-center"
      >
        <div
          className={`relative rounded-full border transition-[width,height,border-color,background-color,box-shadow,transform,opacity] duration-200 ease-out flex items-center justify-center ${ringSizeClass} ${
            pressed && !isHolding ? 'scale-90' : 'scale-100'
          }`}
        >
          {activeVariant === 'card' && (
            <span className="font-mono-tabular text-[9px] font-semibold tracking-[0.18em] text-[#F4F2F8] uppercase">
              View
            </span>
          )}

          {activeVariant === 'hold' && (
            <>
              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 64 64"
              >
                <defs>
                  <linearGradient id="cursorHoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A477FF" />
                    <stop offset="60%" stopColor="#50C9F5" />
                    <stop offset="100%" stopColor="#F15A77" />
                  </linearGradient>
                </defs>
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="url(#cursorHoldGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                />
              </svg>
              <span className="font-mono-tabular text-[10px] font-semibold text-[#F4F2F8]">
                {progressPct}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* Crisp Leading Precision Core Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 will-change-transform flex items-center justify-center"
      >
        <span
          className={`block transition-all duration-150 ${
            activeVariant === 'text'
              ? 'w-[2px] h-4 rounded-full bg-[#A477FF] shadow-[0_0_10px_rgba(164,119,255,0.7)]'
              : activeVariant === 'card' || activeVariant === 'hold'
                ? 'w-1.5 h-1.5 rounded-full bg-[#50C9F5] scale-0 opacity-0'
                : activeVariant === 'pointer'
                  ? 'w-2 h-2 rounded-full bg-[#A477FF] shadow-[0_0_12px_rgba(164,119,255,0.85)]'
                  : 'w-1.5 h-1.5 rounded-full bg-[#F4F2F8] shadow-[0_0_10px_rgba(164,119,255,0.75)]'
          } ${pressed && !isHolding ? 'scale-75' : ''}`}
        />
      </div>

      {/* Minimal Transition Hold Readout below Cursor when Holding Between Pages */}
      <div
        ref={labelRef}
        className={`fixed top-0 left-0 will-change-transform transition-opacity duration-150 ${
          isHolding ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="px-2.5 py-1 bg-[#08090D]/90 border border-[#A477FF]/40 rounded text-[10px] font-mono-tabular tracking-[0.14em] uppercase text-[#F4F2F8] whitespace-nowrap">
          Hold · Move to Scrub
        </div>
      </div>
    </div>
  );
}
