'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';

// Character definition for "SREEHARI V" - 9 letters + 1 space
const NAME_CHARS = [
  { char: 'S', startDx: -360, startDy: -60, cursorIdx: 0 },
  { char: 'R', startDx: -260, startDy: -240, cursorIdx: 1 },
  { char: 'E', startDx: -160, startDy: -280, cursorIdx: 2 },
  { char: 'E', startDx: -80, startDy: 260, cursorIdx: 3 },
  { char: 'H', startDx: 20, startDy: 300, cursorIdx: 4 },
  { char: 'A', startDx: 120, startDy: 270, cursorIdx: 5 },
  { char: 'R', startDx: 220, startDy: -260, cursorIdx: 6 },
  { char: 'I', startDx: 310, startDy: -220, cursorIdx: 7 },
  { char: ' ', startDx: 0, startDy: 0, cursorIdx: -1 },
  { char: 'V', startDx: 420, startDy: 80, cursorIdx: 8 },
];

// Individual links matching exact page words
const LINK_ITEMS = [
  { label: 'Resume', startDx: -280, startDy: 230, cursorIdx: 9 },
  { label: 'GitHub', startDx: -100, startDy: 270, cursorIdx: 10 },
  { label: 'LinkedIn', startDx: 100, startDy: 270, cursorIdx: 11 },
  { label: 'Mail', startDx: 280, startDy: 230, cursorIdx: 12 },
];

// 15 distinct, vivid multiplayer cursors (Figma-style)
const CURSOR_COLORS = [
  '#FF2E93', // 0: drags 'S' (Hot Pink)
  '#00F0FF', // 1: drags 'R' (Electric Cyan)
  '#FFE600', // 2: drags 'E' (Electric Yellow)
  '#10B981', // 3: drags 'E' (Emerald Green)
  '#8B5CF6', // 4: drags 'H' (Purple)
  '#FF8A00', // 5: drags 'A' (Vibrant Orange)
  '#EC4899', // 6: drags 'R' (Pink/Rose)
  '#06B6D4', // 7: drags 'I' (Cyan)
  '#3B82F6', // 8: drags 'V' (Blue)
  '#F43F5E', // 9: drags 'Resume' (Rose Red)
  '#84CC16', // 10: drags 'GitHub' (Lime)
  '#0EA5E9', // 11: drags 'LinkedIn' (Sky Blue)
  '#A855F7', // 12: drags 'Mail' (Violet)
  '#F97316', // 13: drags 'CLICK HERE' (Amber)
  '#14B8A6', // 14: drags Accent Picker (Teal)
];

// Corner positions helper for entry & exit
const getCornerPos = (idx: number, w: number, h: number, extraOffset = 70) => {
  const corner = idx % 4;
  const spread = (idx * 29) % 65;

  switch (corner) {
    case 0: // Top-Left corner
      return { x: -extraOffset - spread, y: -extraOffset - (spread % 35) };
    case 1: // Top-Right corner
      return { x: w + extraOffset + spread, y: -extraOffset - (spread % 35) };
    case 2: // Bottom-Left corner
      return { x: -extraOffset - spread, y: h + extraOffset + (spread % 35) };
    case 3: // Bottom-Right corner
    default:
      return { x: w + extraOffset + spread, y: h + extraOffset + (spread % 35) };
  }
};

// Natural "here and there" offsets (45-75px away from words) and staggered random disappear
const RANDOM_DISSOLVE_CURSORS = [
  { dx: -70, dy: -35, delay: 100, duration: 190 }, // 0: 'S'
  { dx: 35, dy: -60, delay: 240, duration: 180 },  // 1: 'R'
  { dx: -45, dy: 50, delay: 80, duration: 200 },   // 2: 'E'
  { dx: 20, dy: -65, delay: 320, duration: 180 },  // 3: 'E'
  { dx: 45, dy: 55, delay: 170, duration: 190 },   // 4: 'H'
  { dx: 65, dy: -30, delay: 70, duration: 210 },   // 5: 'A'
  { dx: -25, dy: 60, delay: 290, duration: 180 },  // 6: 'R'
  { dx: -55, dy: -45, delay: 210, duration: 190 }, // 7: 'I'
  { dx: 75, dy: 25, delay: 130, duration: 200 },   // 8: 'V'
  { dx: -60, dy: 50, delay: 250, duration: 180 },  // 9: Resume
  { dx: -15, dy: 55, delay: 90, duration: 200 },   // 10: GitHub
  { dx: 25, dy: 55, delay: 350, duration: 180 },   // 11: LinkedIn
  { dx: 60, dy: 45, delay: 150, duration: 200 },   // 12: Mail
  { dx: 0, dy: 55, delay: 270, duration: 190 },    // 13: CLICK HERE
  { dx: 0, dy: -50, delay: 190, duration: 190 },   // 14: Accent Picker
];

export default function CursorPreloader() {
  const [isActive, setIsActive] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isMobile, setIsMobile] = useState(false);
  const [phase, setPhase] = useState<'corners-in' | 'circle' | 'spin' | 'disperse' | 'drag' | 'bloom' | 'move-away' | 'exit'>('corners-in');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const linkRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const releasePositionsRef = useRef<{ x: number; y: number }[] | null>(null);
  const cursorsRef = useRef<{ x: number; y: number; rot: number; opacity: number; color: string }[]>(
    CURSOR_COLORS.map(color => ({ x: -100, y: -100, rot: 0, opacity: 0, color }))
  );

  // Dynamic offsets during animation
  const [letterOffsets, setLetterOffsets] = useState<{ x: number; y: number }[]>(
    NAME_CHARS.map(c => ({ x: c.startDx, y: c.startDy }))
  );
  const [linkOffsets, setLinkOffsets] = useState<{ x: number; y: number }[]>(
    LINK_ITEMS.map(l => ({ x: l.startDx, y: l.startDy }))
  );
  const [pickerOffset, setPickerOffset] = useState({ x: 0, y: -100 });
  const [ctaOffset, setCtaOffset] = useState({ x: 0, y: 140 });

  const [cursors, setCursors] = useState<{ x: number; y: number; rot: number; opacity: number; color: string }[]>(
    CURSOR_COLORS.map(color => ({ x: -100, y: -100, rot: 0, opacity: 0, color }))
  );

  const [elementsVisible, setElementsVisible] = useState(false);
  const [bloomActive, setBloomActive] = useState(false);

  const finishPreloader = useCallback(() => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    document.body.classList.remove('preloader-active');
    document.body.classList.add('rope-powered');
    setIsDone(true);
    setIsActive(false);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;
    const isInnerSection = hash && hash !== '#' && hash !== '#top';
    const isScrolled = window.scrollY > 150;

    if (isInnerSection || isScrolled) {
      setIsDone(true);
      return;
    }

    const detectTheme = (): 'dark' | 'light' => {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      const bodyTheme = document.body.getAttribute('data-theme');
      if (bodyTheme === 'light' || bodyTheme === 'dark') return bodyTheme;
      if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
      return 'dark';
    };

    setTheme(detectTheme());

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const observer = new MutationObserver(() => {
      const current = document.body.getAttribute('data-theme');
      if (current === 'light' || current === 'dark') {
        setTheme(current);
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });

    setIsActive(true);
    document.body.classList.add('preloader-active');

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkMobile);
      document.body.classList.remove('preloader-active');
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isActive || isDone) return;

    let startTime: number | null = null;
    const NUM_CURSORS = 15;

    // Disperse target edge positions for all 15 cursors before drag begins
    const getDispersePos = (idx: number, w: number, h: number, cx: number, cy: number) => {
      switch (idx) {
        case 0: return { x: -40, y: cy - 40 }; // Left edge (S)
        case 1: return { x: w * 0.12, y: -45 }; // Top-left (R)
        case 2: return { x: w * 0.28, y: -55 }; // Top (E)
        case 3: return { x: w * 0.20, y: h + 50 }; // Bottom-left (E)
        case 4: return { x: cx, y: h + 60 }; // Bottom (H)
        case 5: return { x: w * 0.75, y: h + 50 }; // Bottom-right (A)
        case 6: return { x: w * 0.70, y: -55 }; // Top-right (R)
        case 7: return { x: w * 0.86, y: -45 }; // Top-right (I)
        case 8: return { x: w + 45, y: cy - 30 }; // Right edge (V)
        case 9: return { x: w * 0.15, y: h + 60 }; // Bottom-left (Resume)
        case 10: return { x: cx - 140, y: h + 70 }; // Bottom-mid-left (GitHub)
        case 11: return { x: cx + 140, y: h + 70 }; // Bottom-mid-right (LinkedIn)
        case 12: return { x: w * 0.85, y: h + 60 }; // Bottom-right (Mail)
        case 13: return { x: cx, y: h + 80 }; // Bottom (CLICK HERE)
        case 14: default: return (w <= 768) ? { x: cx, y: -45 } : { x: w - 30, y: -50 }; // Phone: center top, Desktop: right top (Accent Picker)
      }
    };

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeInCubic = (t: number) => t * t * t;
    const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    // Snappy deceleration curve for 3.0 second drag
    const easeOutDrag = (t: number) => 1 - Math.pow(1 - t, 2.8);

    const updateCursors = (nextList: { x: number; y: number; rot: number; opacity: number; color: string }[]) => {
      cursorsRef.current = nextList;
      setCursors(nextList);
    };

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w * 0.16, h * 0.22, 135);
      const responsiveScale = Math.min(1, Math.max(0.45, w / 1200));

      // ----------------------------------------------------------------------
      // Timeline Keyframes:
      // 0 - 1000ms: Cursors come from screen corners and form center circle (1000ms)
      // 1000 - 2200ms: Spin circle orbit (1200ms)
      // 2200 - 2750ms: Disperse from circle to drag start positions (550ms)
      // 2750 - 5750ms: Drag letters, individual links, and CTA (EXACTLY 3.0s)
      // 5750 - 6300ms: Snap into alignment & Neon Bloom Flash (550ms)
      // 6300 - 7000ms: Cursors fly back out to the corners itself (700ms)
      // 7000ms+: Preloader Complete & Handover
      // ----------------------------------------------------------------------

      if (elapsed < 1000) {
        // --- PHASE 0: Cursors fly in from the 4 corners to form circle ---
        setPhase('corners-in');
        setElementsVisible(false);

        const p = easeOutCubic(elapsed / 1000);
        const opacity = Math.min(1, elapsed / 180);

        const nextCursors = CURSOR_COLORS.map((color, i) => {
          const cornerPos = getCornerPos(i, w, h, 80);
          const circleAngle = (i / NUM_CURSORS) * 2 * Math.PI;
          const endX = cx + R * Math.cos(circleAngle);
          const endY = cy + R * Math.sin(circleAngle);

          const curX = cornerPos.x + (endX - cornerPos.x) * p;
          const curY = cornerPos.y + (endY - cornerPos.y) * p;

          // Tip points dynamically toward center as they converge
          const angleToCenter = Math.atan2(cy - curY, cx - curX) * (180 / Math.PI);
          const rot = angleToCenter + 135;

          return { x: curX, y: curY, rot, opacity, color };
        });
        updateCursors(nextCursors);
      } else if (elapsed < 2200) {
        // --- PHASE 1: Synchronized circular orbit spin ---
        setPhase('spin');
        setElementsVisible(false);

        const p = easeInOutQuad((elapsed - 1000) / 1200);
        const spinAngle = p * 2 * Math.PI;

        const nextCursors = CURSOR_COLORS.map((color, i) => {
          const baseAngle = (i / NUM_CURSORS) * 2 * Math.PI;
          const currentAngle = baseAngle + spinAngle;
          const curX = cx + R * Math.cos(currentAngle);
          const curY = cy + R * Math.sin(currentAngle);

          const angleToCenter = Math.atan2(cy - curY, cx - curX) * (180 / Math.PI);
          const rot = angleToCenter + 135;

          return { x: curX, y: curY, rot, opacity: 1, color };
        });
        updateCursors(nextCursors);
      } else if (elapsed < 2750) {
        // --- PHASE 2: Disperse outward from circle to items ---
        setPhase('disperse');
        setElementsVisible(false);

        const p = easeOutCubic((elapsed - 2200) / 550);

        const nextCursors = CURSOR_COLORS.map((color, i) => {
          const circleAngle = (i / NUM_CURSORS) * 2 * Math.PI + 2 * Math.PI;
          const startX = cx + R * Math.cos(circleAngle);
          const startY = cy + R * Math.sin(circleAngle);

          const disp = getDispersePos(i, w, h, cx, cy);
          const curX = startX + (disp.x - startX) * p;
          const curY = startY + (disp.y - startY) * p;

          const startAngle = Math.atan2(cy - startY, cx - startX) * (180 / Math.PI) + 135;
          const rot = startAngle + (-15 - startAngle) * p;

          return { x: curX, y: curY, rot, opacity: 1, color };
        });
        updateCursors(nextCursors);
      } else if (elapsed < 5750) {
        // --- PHASE 3: Drag letters, individual links, and CTA (EXACTLY 3.0s) ---
        setPhase('drag');
        setElementsVisible(true);

        const p = easeOutDrag(Math.min(1, (elapsed - 2750) / 3000));
        const rem = 1 - p;

        // 1. Letters offset
        const nextLetterOffsets = NAME_CHARS.map(c => ({
          x: c.startDx * responsiveScale * rem,
          y: c.startDy * responsiveScale * rem,
        }));
        setLetterOffsets(nextLetterOffsets);

        // 2. Individual link offsets
        const nextLinkOffsets = LINK_ITEMS.map(l => ({
          x: l.startDx * responsiveScale * rem,
          y: l.startDy * responsiveScale * rem,
        }));
        setLinkOffsets(nextLinkOffsets);

        // 3. CTA & Accent Picker offsets
        setPickerOffset({ x: 0, y: -100 * responsiveScale * rem });
        setCtaOffset({ x: 0, y: 140 * responsiveScale * rem });

        // 4. Update each cursor to track its specific draggable item
        const nextCursors = CURSOR_COLORS.map((color, i) => {
          let targetX = cx;
          let targetY = cy;

          if (i < 9) {
            // Cursors 0-8: Track letters S, R, E, E, H, A, R, I, V
            const refIdx = i >= 8 ? 9 : i;
            const span = letterRefs.current[refIdx];
            if (span) {
              const rect = span.getBoundingClientRect();
              targetX = rect.left + 2;
              targetY = rect.top + 4;
            } else {
              targetX = cx + (i - 4.5) * 45 * responsiveScale + nextLetterOffsets[refIdx].x;
              targetY = cy + nextLetterOffsets[refIdx].y;
            }
          } else if (i >= 9 && i <= 12) {
            // Cursors 9-12: Track individual links: Resume, GitHub, LinkedIn, Mail
            const lIdx = i - 9;
            const linkSpan = linkRefs.current[lIdx];
            if (linkSpan) {
              const rect = linkSpan.getBoundingClientRect();
              targetX = rect.left + rect.width * 0.45;
              targetY = rect.bottom + 4;
            } else {
              targetX = cx + (lIdx - 1.5) * 85 * responsiveScale + nextLinkOffsets[lIdx].x;
              targetY = cy + 70 + nextLinkOffsets[lIdx].y;
            }
          } else if (i === 13) {
            // Cursor 13: Track "CLICK HERE" CTA button
            if (ctaRef.current) {
              const rect = ctaRef.current.getBoundingClientRect();
              targetX = rect.left + rect.width * 0.5;
              targetY = rect.bottom + 5;
            } else {
              targetX = cx;
              targetY = h - 60 + 140 * responsiveScale * rem;
            }
          } else if (i === 14) {
            // Cursor 14: Track Accent Picker (center top on phone, right top on desktop)
            if (pickerRef.current) {
              const rect = pickerRef.current.getBoundingClientRect();
              targetX = rect.left + rect.width * 0.5;
              targetY = rect.bottom + 5;
            } else {
              targetX = (w <= 768) ? cx : w - 120;
              targetY = (w <= 768) ? 32 : 40;
            }
          }

          return { x: targetX, y: targetY, rot: -15, opacity: 1, color };
        });
        updateCursors(nextCursors);
      } else if (elapsed < 6500) {
        // --- PHASE 4: Drag complete -> cursors move a bit here and there away from words and randomly disappear ---
        setPhase('move-away');
        setBloomActive(true);

        // Elements locked into resting alignment (0, 0)
        setLetterOffsets(NAME_CHARS.map(() => ({ x: 0, y: 0 })));
        setLinkOffsets(LINK_ITEMS.map(() => ({ x: 0, y: 0 })));
        setPickerOffset({ x: 0, y: 0 });
        setCtaOffset({ x: 0, y: 0 });

        if (!releasePositionsRef.current) {
          releasePositionsRef.current = cursorsRef.current.map(c => ({ x: c.x, y: c.y }));
        }

        const timeSinceDrag = elapsed - 5750;

        const nextCursors = CURSOR_COLORS.map((color, i) => {
          const start = releasePositionsRef.current![i];
          const cfg = RANDOM_DISSOLVE_CURSORS[i] || { dx: 0, dy: -50, delay: 150, duration: 190 };

          // Movement: gentle, modest drift away from the words (45-75px over ~550ms)
          const moveProgress = easeOutCubic(Math.min(1, timeSinceDrag / 550));
          const curX = start.x + cfg.dx * moveProgress;
          const curY = start.y + cfg.dy * moveProgress;

          // Tip dynamically points slightly along the drift
          const driftAngle = Math.atan2(cfg.dy, cfg.dx) * (180 / Math.PI);
          const rot = driftAngle + 135;

          // Random disappearance: each cursor begins fading at its own randomized delay
          let opacity = 1;
          if (timeSinceDrag > cfg.delay) {
            const fadeProgress = Math.min(1, (timeSinceDrag - cfg.delay) / cfg.duration);
            opacity = Math.max(0, 1 - fadeProgress);
          }

          return { x: curX, y: curY, rot, opacity, color };
        });
        updateCursors(nextCursors);
      } else {
        // --- PHASE 5: Complete & Handover ---
        finishPreloader();
        return;
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isActive, isDone, finishPreloader]);

  if (isDone || !isActive) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`cursor-preloader-root ${theme === 'light' ? 'is-light' : 'is-dark'}`}
      data-theme={theme}
      aria-label="Loading portfolio animation"
      onClick={finishPreloader}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') finishPreloader();
      }}
      tabIndex={0}
      role="region"
    >
      <div className="preloader-overlay">
        {/* Cinematic Stage Center Container */}
        <div className="cin-center" style={{ pointerEvents: 'none' }}>
          <div className="cin-center-inner">
            {/* The Animated Name "SREEHARI V" */}
            <h1
              className={`cin-name preloader-cin-name ${bloomActive ? 'bloom-active' : ''}`}
              aria-label="SREEHARI V"
              style={{
                opacity: elementsVisible ? 1 : 0,
                visibility: elementsVisible ? 'visible' : 'hidden',
                transition: 'opacity 0.25s ease-out',
              }}
            >
              {NAME_CHARS.map((item, idx) => (
                <span
                  key={idx}
                  ref={(el) => {
                    letterRefs.current[idx] = el;
                  }}
                  className={`preloader-letter-span ${item.char === ' ' ? 'is-space' : ''}`}
                  style={{
                    transform: `translate(${letterOffsets[idx]?.x || 0}px, ${letterOffsets[idx]?.y || 0}px)`,
                    display: 'inline-block',
                    willChange: 'transform',
                  }}
                >
                  {item.char === ' ' ? '\u00A0' : item.char}
                </span>
              ))}
            </h1>

            {/* Individual Links: Resume, GitHub, LinkedIn, Mail */}
            <div className="cin-pages-wrapper">
              <div className="cin-page cin-page-1">
                <nav
                  className="cin-links preloader-cin-links"
                  aria-label="Landing links"
                  style={{
                    opacity: elementsVisible ? 1 : 0,
                    visibility: elementsVisible ? 'visible' : 'hidden',
                    transition: 'opacity 0.25s ease-out',
                  }}
                >
                  {LINK_ITEMS.map((item, lIdx) => (
                    <span
                      key={item.label}
                      ref={(el) => {
                        linkRefs.current[lIdx] = el;
                      }}
                      className="preloader-link-item"
                      style={{
                        transform: `translate(${linkOffsets[lIdx]?.x || 0}px, ${linkOffsets[lIdx]?.y || 0}px)`,
                        display: 'inline-block',
                        willChange: 'transform',
                      }}
                    >
                      {item.label}
                    </span>
                  ))}
                </nav>
              </div>
            </div>

            {/* "CLICK HERE" Button */}
            <button
              ref={ctaRef}
              className="cin-cta preloader-cin-cta"
              type="button"
              tabIndex={-1}
              style={{
                transform: `translate(calc(-50% + ${ctaOffset.x}px), ${ctaOffset.y}px)`,
                opacity: elementsVisible ? 0.95 : 0,
                visibility: elementsVisible ? 'visible' : 'hidden',
                willChange: 'transform',
              }}
            >
              CLICK HERE
            </button>
          </div>
        </div>

        {/* Accent Picker & Theme Toggle Preview */}
        <div
          ref={pickerRef}
          className="accent-picker preloader-accent-picker"
          aria-hidden="true"
          style={{
            transform: isMobile
              ? `translate(calc(-50% + ${pickerOffset.x}px), ${pickerOffset.y}px)`
              : `translate(${pickerOffset.x}px, ${pickerOffset.y}px)`,
            opacity: elementsVisible ? 1 : 0,
            visibility: elementsVisible ? 'visible' : 'hidden',
            willChange: 'transform',
          }}
        >
          <button className="stage-theme-toggle" type="button" tabIndex={-1}>
            <i className={theme === 'light' ? 'fas fa-sun' : 'fas fa-moon'}></i>
          </button>
          <button className="accent-dot active" style={{ background: '#E84545' }} tabIndex={-1}></button>
          <button
            className="accent-dot"
            style={{ background: theme === 'light' ? '#000000' : '#FFFFFF' }}
            tabIndex={-1}
          ></button>
          <button className="accent-dot" style={{ background: '#4D7CFF' }} tabIndex={-1}></button>
          <button className="accent-dot" style={{ background: '#9B6BFF' }} tabIndex={-1}></button>
          <button className="accent-dot" style={{ background: '#D6B35A' }} tabIndex={-1}></button>
        </div>

        {/* The 15 Colorful Figma-Style Multiplayer Cursors Layer */}
        <div className="preloader-cursors-layer" aria-hidden="true">
          {cursors.map((c, i) => (
            <div
              key={i}
              className="preloader-cursor-item"
              style={{
                transform: `translate3d(${c.x}px, ${c.y}px, 0) rotate(${c.rot}deg)`,
                opacity: c.opacity,
                color: c.color,
                willChange: 'transform, opacity',
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                className="preloader-cursor-svg"
              >
                <path
                  d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L5.85 2.86a.5.5 0 0 0-.35.35z"
                  fill="currentColor"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
