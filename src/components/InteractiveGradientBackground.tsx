import React, { useEffect, useRef } from 'react';

export const InteractiveGradientBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Target and current interpolated coordinates (-0.5 to 0.5)
  const targetCoord = useRef({ x: 0, y: 0 });
  const currentCoord = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // 1. Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // 2. Interpolation / Easing loop (lerp)
    const animate = () => {
      // Gentle easing factor for liquid, calm responsiveness
      currentCoord.current.x += (targetCoord.current.x - currentCoord.current.x) * 0.045;
      currentCoord.current.y += (targetCoord.current.y - currentCoord.current.y) * 0.045;

      if (containerRef.current) {
        // Subtle offset shifts (30–45px maximum based on cursor position)
        const shift1X = (currentCoord.current.x * 44).toFixed(2);
        const shift1Y = (currentCoord.current.y * 38).toFixed(2);
        const shift2X = (currentCoord.current.x * -40).toFixed(2);
        const shift2Y = (currentCoord.current.y * -36).toFixed(2);
        const shift3X = (currentCoord.current.x * 32).toFixed(2);
        const shift3Y = (currentCoord.current.y * -34).toFixed(2);
        const shift4X = (currentCoord.current.x * -30).toFixed(2);
        const shift4Y = (currentCoord.current.y * 32).toFixed(2);

        containerRef.current.style.setProperty('--shift-x-1', `${shift1X}px`);
        containerRef.current.style.setProperty('--shift-y-1', `${shift1Y}px`);
        containerRef.current.style.setProperty('--shift-x-2', `${shift2X}px`);
        containerRef.current.style.setProperty('--shift-y-2', `${shift2Y}px`);
        containerRef.current.style.setProperty('--shift-x-3', `${shift3X}px`);
        containerRef.current.style.setProperty('--shift-y-3', `${shift3Y}px`);
        containerRef.current.style.setProperty('--shift-x-4', `${shift4X}px`);
        containerRef.current.style.setProperty('--shift-y-4', `${shift4Y}px`);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    // 3. Pointer move listener
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;

      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;

      targetCoord.current.x = e.clientX / width - 0.5;
      targetCoord.current.y = e.clientY / height - 0.5;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#faf8f5]"
    >
      {/* 1. Soft Champagne / Warm Gold Glow (Top-Right / Upper Half) */}
      <div
        className="absolute -top-[15%] right-[-8%] sm:right-[2%] w-[800px] h-[800px] sm:w-[1100px] sm:h-[1100px] pointer-events-none"
        style={{
          transform: 'translate3d(var(--shift-x-1, 0px), var(--shift-y-1, 0px), 0px)',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div
          className="mesh-blob-1 w-full h-full rounded-full blur-[95px] sm:blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(219, 195, 142, 0.28) 0%, rgba(219, 195, 142, 0.14) 45%, rgba(219, 195, 142, 0.03) 68%, transparent 80%)'
          }}
        />
      </div>

      {/* 2. Muted Plum / Wine Glow (Bottom-Left / Lower Quadrant) */}
      <div
        className="absolute -bottom-[15%] -left-[8%] sm:left-[-2%] w-[750px] h-[750px] sm:w-[1050px] sm:h-[1050px] pointer-events-none"
        style={{
          transform: 'translate3d(var(--shift-x-2, 0px), var(--shift-y-2, 0px), 0px)',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div
          className="mesh-blob-2 w-full h-full rounded-full blur-[105px] sm:blur-[130px]"
          style={{
            background: 'radial-gradient(circle, rgba(118, 46, 80, 0.16) 0%, rgba(118, 46, 80, 0.08) 42%, rgba(118, 46, 80, 0.02) 65%, transparent 80%)'
          }}
        />
      </div>

      {/* 3. Peach / Champagne Wash (Center & Subtle Right) */}
      <div
        className="absolute top-[22%] left-[18%] sm:left-[26%] w-[700px] h-[700px] sm:w-[980px] sm:h-[980px] pointer-events-none"
        style={{
          transform: 'translate3d(var(--shift-x-3, 0px), var(--shift-y-3, 0px), 0px)',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div
          className="mesh-blob-3 w-full h-full rounded-full blur-[90px] sm:blur-[115px]"
          style={{
            background: 'radial-gradient(circle, rgba(240, 205, 180, 0.26) 0%, rgba(235, 195, 168, 0.12) 48%, rgba(245, 220, 200, 0.03) 70%, transparent 82%)'
          }}
        />
      </div>

      {/* 4. Subtle Warm Gold Area (Top-Left) */}
      <div
        className="absolute -top-[12%] -left-[10%] sm:left-[-3%] w-[600px] h-[600px] sm:w-[850px] sm:h-[850px] pointer-events-none"
        style={{
          transform: 'translate3d(var(--shift-x-4, 0px), var(--shift-y-4, 0px), 0px)',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div
          className="mesh-blob-4 w-full h-full rounded-full blur-[85px] sm:blur-[110px]"
          style={{
            background: 'radial-gradient(circle, rgba(225, 200, 145, 0.22) 0%, rgba(225, 200, 145, 0.10) 45%, rgba(225, 200, 145, 0.02) 65%, transparent 78%)'
          }}
        />
      </div>

      {/* Delicate editorial surface wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[#faf8f5]/20 pointer-events-none" />
    </div>
  );
};
