'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

interface PortfolioWindow extends Window {
  toggleTheme?: () => void;
}

// Multiplayer-style fake cursors matching the video swarm reference
interface FakeCursor {
  id: string;
  name: string;
  color: string;
  textColor: string;
  shape: 'arrow' | 'pointer';
}

const FAKE_CURSORS: FakeCursor[] = [
  { id: 'cyd', name: 'Cyd', color: '#E84545', textColor: '#FFFFFF', shape: 'arrow' },   // Crimson Red
  { id: 'ada', name: 'Ada', color: '#00F0FF', textColor: '#000000', shape: 'pointer' }, // Neon Cyan
  { id: 'dex', name: 'Dex', color: '#3B82F6', textColor: '#FFFFFF', shape: 'arrow' },   // Royal Blue
  { id: 'ivy', name: 'Ivy', color: '#A855F7', textColor: '#FFFFFF', shape: 'pointer' }, // Violet Purple
  { id: 'maya', name: 'Maya', color: '#F59E0B', textColor: '#000000', shape: 'arrow' }, // Amber Gold
  { id: 'kai', name: 'Kai', color: '#10B981', textColor: '#000000', shape: 'pointer' }, // Emerald Green
  { id: 'bo', name: 'Bo', color: '#EC4899', textColor: '#FFFFFF', shape: 'arrow' },     // Hot Pink
];

// Title letters for letter-by-letter assembly
const TITLE_LETTERS = [
  { char: 'S', key: 's1' },
  { char: 'R', key: 'r1' },
  { char: 'E', key: 'e1' },
  { char: 'E', key: 'e2' },
  { char: 'H', key: 'h' },
  { char: 'A', key: 'a' },
  { char: 'R', key: 'r2' },
  { char: 'I', key: 'i' },
  { char: '\u00A0', key: 'sp' }, // Non-breaking space
  { char: 'V', key: 'v' },
];

const NAV_LINKS = [
  { label: 'RESUME', href: 'https://drive.google.com/file/d/1o1KKzYHzRdbiPagUZu1ik9rLi5ewDoie/view?usp=drive_link', target: '_blank' },
  { label: 'GITHUB', href: 'https://github.com/sree-hari-v', target: '_blank' },
  { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/sreehari-v-a15084321/', target: '_blank' },
  { label: 'MAIL', href: 'mailto:sreehari.vengalil@gmail.com', target: undefined },
];

// 5 Color Dots matching the screenshot: Red, White, Blue, Purple, Gold
const COLOR_DOTS = [
  { hex: '#E84545', rgb: '232 69 69', label: 'Red', active: true },
  { hex: '#FFFFFF', rgb: '255 255 255', label: 'White', id: 'wb-dot' },
  { hex: '#4D7CFF', rgb: '77 124 255', label: 'Blue' },
  { hex: '#9B6BFF', rgb: '155 107 255', label: 'Purple' },
  { hex: '#D6B35A', rgb: '214 179 90', label: 'Gold' },
];

export default function Hero() {
  const [isAssembled, setIsAssembled] = useState(false);
  const [showIssueBadge, setShowIssueBadge] = useState(true);

  // Root container ref
  const stageRef = useRef<HTMLElement>(null);

  // Background elements
  const gridRef = useRef<HTMLDivElement>(null);
  const glowAtmosphereRef = useRef<HTMLDivElement>(null);

  // UI Element Refs
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const themeControlsRef = useRef<HTMLDivElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const badgeContainerRef = useRef<HTMLDivElement>(null);

  // Cursors overlay refs
  const cursorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cursorRingsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const cursorContainerRef = useRef<HTMLDivElement>(null);

  // Master timeline ref
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const hasAnimatedRef = useRef(false);

  // Fast forward / skip intro on click or keypress
  const handleSkip = useCallback(() => {
    if (tlRef.current && tlRef.current.progress() < 1) {
      tlRef.current.progress(1);
    }
  }, []);

  useEffect(() => {
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Viewport dimensions
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // If reduced motion, complete immediately
    if (prefersReducedMotion) {
      setTimeout(() => {
        setIsAssembled(true);
      }, 0);
      if (cursorContainerRef.current) {
        cursorContainerRef.current.style.display = 'none';
      }
      document.body.classList.remove('scroll-locked');
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Initial State: Screen completely black, background grid and glow hidden
      if (gridRef.current) {
        gsap.set(gridRef.current, { opacity: 0 });
      }
      if (glowAtmosphereRef.current) {
        gsap.set(glowAtmosphereRef.current, { opacity: 0, scale: 0.8 });
      }

      // Title letters initially scattered off-screen top
      const letterInitialPositions = [
        { y: -260, x: -70, rot: -16 },
        { y: -310, x: -40, rot: 14 },
        { y: -240, x: -15, rot: -9 },
        { y: -330, x: 15, rot: 12 },
        { y: -280, x: 0, rot: -14 },
        { y: -340, x: 35, rot: 11 },
        { y: -260, x: 55, rot: -12 },
        { y: -300, x: 75, rot: 9 },
        { y: 0, x: 0, rot: 0 }, // Space
        { y: -320, x: 110, rot: 15 }, // V
      ];

      letterRefs.current.forEach((el, idx) => {
        if (!el || idx === 8) return;
        const init = letterInitialPositions[idx] || { y: -280, x: 0, rot: 0 };
        gsap.set(el, {
          y: init.y,
          x: init.x,
          rotation: init.rot,
          opacity: 0,
          scale: 0.6,
          textShadow: 'none',
        });
      });

      // Navigation off-screen right
      if (navContainerRef.current) {
        gsap.set(navContainerRef.current, {
          x: vw * 0.5,
          y: 20,
          opacity: 0,
        });
      }

      // Theme switcher off-screen top right
      if (themeControlsRef.current) {
        gsap.set(themeControlsRef.current, {
          x: 200,
          y: -120,
          opacity: 0,
          scale: 0.7,
        });
      }

      // CTA button off-screen bottom
      if (ctaContainerRef.current) {
        gsap.set(ctaContainerRef.current, {
          y: 160,
          opacity: 0,
          scale: 0.8,
        });
      }

      // Issue badge off-screen bottom left
      if (badgeContainerRef.current) {
        gsap.set(badgeContainerRef.current, {
          x: -240,
          y: 40,
          opacity: 0,
        });
      }

      // Initial positions for fake cursors (off-screen outside the viewport)
      const spawnPoints = [
        { x: -120, y: -80 },          // Cyd (top-left)
        { x: vw + 120, y: -80 },       // Ada (top-right)
        { x: vw + 140, y: vh * 0.5 },  // Dex (mid-right)
        { x: vw + 150, y: vh * 0.62 }, // Ivy (lower-right)
        { x: vw + 120, y: 30 },        // Maya (top-right)
        { x: -140, y: vh - 40 },       // Kai (bottom-left)
        { x: vw * 0.5, y: vh + 140 },  // Bo (bottom-center)
      ];

      cursorRefs.current.forEach((cEl, i) => {
        if (!cEl) return;
        const sp = spawnPoints[i % spawnPoints.length];
        gsap.set(cEl, { x: sp.x, y: sp.y, opacity: 0 });
      });

      // Micro ripple pulse helper on cursor click / element snap
      const triggerPulse = (index: number) => {
        const ring = cursorRingsRef.current[index];
        if (ring) {
          gsap.fromTo(
            ring,
            { scale: 0.3, opacity: 1 },
            { scale: 2.2, opacity: 0, duration: 0.4, ease: 'power2.out' }
          );
        }
      };

      // ========================================================
      // MASTER GSAP TIMELINE (~5.4s total)
      // ========================================================
      const tl = gsap.timeline({
        onComplete: () => {
          setIsAssembled(true);
          if (cursorContainerRef.current) {
            cursorContainerRef.current.style.display = 'none';
          }
          document.body.classList.remove('scroll-locked');
        },
      });

      tlRef.current = tl;

      // --------------------------------------------------------
      // PHASE 1: Cursors fly in, Grid & Atmospheric Lighting reveal
      // --------------------------------------------------------
      tl.addLabel('curEnter', 0.1);

      const cCyd = cursorRefs.current[0];  // Red
      const cAda = cursorRefs.current[1];  // Cyan
      const cDex = cursorRefs.current[2];  // Blue
      const cIvy = cursorRefs.current[3];  // Purple
      const cMaya = cursorRefs.current[4]; // Gold
      const cKai = cursorRefs.current[5];  // Green
      const cBo = cursorRefs.current[6];   // Pink

      // Cyd and Ada sweep into typography area
      if (cCyd) {
        tl.to(
          cCyd,
          {
            x: vw * 0.38,
            y: vh * 0.34,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
          },
          'curEnter'
        );
      }

      if (cAda) {
        tl.to(
          cAda,
          {
            x: vw * 0.62,
            y: vh * 0.34,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
          },
          'curEnter+=0.06'
        );
      }

      // Background grid & soft atmospheric light power on
      if (gridRef.current) {
        tl.to(
          gridRef.current,
          {
            opacity: 0.45,
            duration: 1.2,
            ease: 'power2.out',
          },
          'curEnter+=0.3'
        );
      }

      if (glowAtmosphereRef.current) {
        tl.to(
          glowAtmosphereRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 1.4,
            ease: 'power2.out',
          },
          'curEnter+=0.3'
        );
      }

      // --------------------------------------------------------
      // PHASE 2: Cursors collaboratively assemble "SREEHARI V" letter-by-letter
      // --------------------------------------------------------
      tl.addLabel('letterAssembly', 0.85);

      // Cyd moves across the left letters S-R-E-E-H
      if (cCyd) {
        tl.to(
          cCyd,
          {
            x: vw * 0.48,
            y: vh * 0.44,
            duration: 1.1,
            ease: 'power2.inOut',
          },
          'letterAssembly'
        );
      }

      // Ada moves across the right letters A-R-I-V
      if (cAda) {
        tl.to(
          cAda,
          {
            x: vw * 0.58,
            y: vh * 0.44,
            duration: 1.1,
            ease: 'power2.inOut',
          },
          'letterAssembly+=0.1'
        );
      }

      // Letters snap into place in quick rhythmic succession
      letterRefs.current.forEach((el, idx) => {
        if (!el || idx === 8) return; // skip space
        const stepTime = idx * 0.085;
        tl.to(
          el,
          {
            y: 0,
            x: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            duration: 0.45,
            ease: 'back.out(2.2)',
          },
          `letterAssembly+=${stepTime}`
        );

        // Click pulses during placement
        if (idx === 0 || idx === 4) {
          tl.call(() => triggerPulse(0), [], `letterAssembly+=${stepTime}`);
        } else if (idx === 7 || idx === 9) {
          tl.call(() => triggerPulse(1), [], `letterAssembly+=${stepTime}`);
        }
      });

      // --------------------------------------------------------
      // PHASE 3: Red Neon Glow ignites across "SREEHARI V"
      // --------------------------------------------------------
      const glowIgniteTime = 1.85;
      tl.addLabel('glowIgnite', glowIgniteTime);

      letterRefs.current.forEach((el, idx) => {
        if (!el) return;
        tl.to(
          el,
          {
            textShadow:
              '0 0 16px rgba(232, 69, 69, 0.95), 0 0 35px rgba(232, 69, 69, 0.7), 0 0 75px rgba(232, 69, 69, 0.45), 0 0 120px rgba(232, 69, 69, 0.25)',
            duration: 0.65,
            ease: 'power2.out',
          },
          `glowIgnite+=${idx * 0.03}`
        );
      });

      // --------------------------------------------------------
      // PHASE 4: Dex & Ivy drag in NAVIGATION LINKS
      // --------------------------------------------------------
      const navStartTime = 2.1;
      tl.addLabel('navDrag', navStartTime);

      if (cDex) {
        tl.to(
          cDex,
          {
            x: vw * 0.58,
            y: vh * 0.56,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
          },
          'navDrag'
        );
      }

      if (cIvy) {
        tl.to(
          cIvy,
          {
            x: vw * 0.44,
            y: vh * 0.56,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
          },
          'navDrag+=0.06'
        );
      }

      if (navContainerRef.current) {
        tl.to(
          navContainerRef.current,
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'back.out(1.9)',
          },
          'navDrag+=0.2'
        );
      }

      tl.call(
        () => {
          triggerPulse(2);
          triggerPulse(3);
        },
        [],
        'navDrag+=0.95'
      );

      // --------------------------------------------------------
      // PHASE 5: Maya drags THEME SWITCHER & 5 COLOR DOTS (Top Right)
      // --------------------------------------------------------
      const themeStartTime = 2.75;
      tl.addLabel('themeDrag', themeStartTime);

      if (cMaya) {
        tl.to(
          cMaya,
          {
            x: vw - 140,
            y: 35,
            opacity: 1,
            duration: 0.65,
            ease: 'power3.out',
          },
          'themeDrag'
        );
      }

      if (themeControlsRef.current) {
        tl.to(
          themeControlsRef.current,
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.75,
            ease: 'back.out(2.2)',
          },
          'themeDrag+=0.15'
        );
      }

      tl.call(() => triggerPulse(4), [], 'themeDrag+=0.85');

      // --------------------------------------------------------
      // PHASE 6: Bo drags "CLICK HERE" BUTTON (Bottom Center)
      // --------------------------------------------------------
      const ctaStartTime = 3.25;
      tl.addLabel('ctaDrag', ctaStartTime);

      if (cBo) {
        tl.to(
          cBo,
          {
            x: vw * 0.5,
            y: vh - 48,
            opacity: 1,
            duration: 0.65,
            ease: 'power3.out',
          },
          'ctaDrag'
        );
      }

      if (ctaContainerRef.current) {
        tl.to(
          ctaContainerRef.current,
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'elastic.out(1, 0.55)',
          },
          'ctaDrag+=0.15'
        );
      }

      tl.call(() => triggerPulse(6), [], 'ctaDrag+=0.85');

      // --------------------------------------------------------
      // PHASE 7: Kai drags NOTIFICATION BADGE "N | 1 Issue x" (Bottom Left)
      // --------------------------------------------------------
      const badgeStartTime = 3.65;
      tl.addLabel('badgeDrag', badgeStartTime);

      if (cKai) {
        tl.to(
          cKai,
          {
            x: 65,
            y: vh - 35,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
          },
          'badgeDrag'
        );
      }

      if (badgeContainerRef.current) {
        tl.to(
          badgeContainerRef.current,
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'back.out(2)',
          },
          'badgeDrag+=0.12'
        );
      }

      tl.call(() => triggerPulse(5), [], 'badgeDrag+=0.75');

      // --------------------------------------------------------
      // PHASE 8: ALL CURSORS FLY AWAY OFF-SCREEN
      // --------------------------------------------------------
      const flyAwayTime = 4.45;
      tl.addLabel('flyAway', flyAwayTime);

      const exitTrajectories = [
        { x: -180, y: -160 },          // Cyd flies top-left
        { x: vw + 180, y: -160 },       // Ada flies top-right
        { x: vw + 220, y: vh * 0.4 },   // Dex flies right
        { x: vw + 180, y: vh + 160 },   // Ivy flies bottom-right
        { x: vw + 180, y: -80 },        // Maya flies top-right
        { x: -180, y: vh + 160 },       // Kai flies bottom-left
        { x: vw * 0.5, y: vh + 180 },   // Bo flies bottom
      ];

      cursorRefs.current.forEach((cEl, i) => {
        if (!cEl) return;
        const traj = exitTrajectories[i % exitTrajectories.length];
        tl.to(
          cEl,
          {
            x: traj.x,
            y: traj.y,
            opacity: 0,
            duration: 0.65 + (i % 3) * 0.08,
            ease: 'power2.in',
          },
          `flyAway+=${i * 0.03}`
        );
      });
    }, stageRef);

    // Support keyboard escape, space or enter to skip intro immediately
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      ctx.revert();
    };
  }, [handleSkip]);

  return (
    <section
      ref={stageRef}
      className={`cin-stage fixed inset-0 bg-black text-white overflow-hidden select-none z-[99999] ${
        isAssembled ? 'cin-stage-assembled cursor-auto' : 'cursor-pointer'
      }`}
      id="cinStage"
      aria-label="Cinematic Stage"
      onClick={!isAssembled ? handleSkip : undefined}
    >
      {/* 1. Subtle Dark Red Background Grid */}
      <div
        ref={gridRef}
        className="absolute inset-0 pointer-events-none z-0 will-change-[opacity]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(232, 69, 69, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(232, 69, 69, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* 2. Atmospheric Dark Red Radial Center Lighting */}
      <div
        ref={glowAtmosphereRef}
        className="absolute inset-0 pointer-events-none z-[1] will-change-[opacity,transform]"
        style={{
          background: `
            radial-gradient(ellipse 980px 620px at 50% 48%, rgba(232, 69, 69, 0.18) 0%, rgba(232, 69, 69, 0.05) 55%, transparent 75%)
          `,
        }}
      />

      {/* Subtle Top-Left Accent Ring (as in reference screenshot) */}
      <div
        className="fixed top-0 left-[clamp(75px,6vw,120px)] -translate-x-1/2 pointer-events-none z-10"
        aria-hidden="true"
      >
        <div className="w-[18px] h-[18px] rounded-full border border-[rgba(232,69,69,0.35)] flex items-center justify-center -mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#E84545] opacity-75 shadow-[0_0_8px_rgba(232,69,69,0.8)]" />
        </div>
      </div>

      {/* 3. Top-Right Theme Switcher Component */}
      <div
        ref={themeControlsRef}
        className="fixed top-6 right-6 sm:top-8 sm:right-8 flex items-center gap-3.5 z-30 will-change-transform accent-picker"
        id="accentPicker"
        aria-label="Accent color picker"
      >
        {/* Moon Icon Toggle Button */}
        <button
          className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/80 hover:text-white transition-all shadow-[0_0_12px_rgba(232,69,69,0.12)] stage-theme-toggle"
          id="theme-toggle-stage"
          type="button"
          aria-label="Toggle Light Mode"
          onClick={(e) => {
            e.stopPropagation();
            if (typeof window !== 'undefined') {
              (window as unknown as PortfolioWindow).toggleTheme?.();
            }
          }}
        >
          <i className="fas fa-moon text-xs"></i>
        </button>

        {/* Row of five colored dots matching screenshot: Red, White, Blue, Purple, Gold */}
        <div className="flex items-center gap-2">
          {COLOR_DOTS.map((dot) => (
            <button
              key={dot.hex}
              id={dot.id}
              className={`w-4 h-4 rounded-full border border-white/20 transition-all cursor-pointer accent-dot ${
                dot.active ? 'is-active ring-2 ring-white/60 scale-110' : 'hover:scale-105'
              }`}
              data-accent={dot.hex}
              data-rgb={dot.rgb}
              title={dot.label}
              aria-label={dot.label}
              style={{ backgroundColor: dot.hex }}
              onClick={(e) => e.stopPropagation()}
            />
          ))}
        </div>
      </div>

      {/* 4. Dead Center: Main Title "SREEHARI V" & Navigation Links */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 px-4">
        <div className="text-center pointer-events-auto max-w-full">
          {/* Main Title Container */}
          <div ref={titleContainerRef} className="inline-block">
            <h1
              className="cin-name font-['Bebas_Neue',system-ui,sans-serif] text-7xl sm:text-8xl md:text-9xl lg:text-[150px] leading-none tracking-wider text-[#FF4D4D] will-change-transform"
              id="cinName"
              aria-label="SREEHARI V"
              style={{
                letterSpacing: '0.08em',
              }}
            >
              {TITLE_LETTERS.map((item, idx) => (
                <span
                  key={item.key}
                  ref={(el) => {
                    letterRefs.current[idx] = el;
                  }}
                  className="inline-block will-change-transform"
                  style={{
                    color: '#FF4D4D',
                    WebkitTextFillColor: '#FF4D4D',
                    textShadow: isAssembled
                      ? '0 0 16px rgba(232, 69, 69, 0.95), 0 0 35px rgba(232, 69, 69, 0.7), 0 0 75px rgba(232, 69, 69, 0.45), 0 0 120px rgba(232, 69, 69, 0.25)'
                      : 'none',
                  }}
                >
                  {item.char}
                </span>
              ))}
            </h1>
          </div>

          {/* Dual Page Transition Wrapper (for smooth scroll handoff) */}
          <div className="cin-pages-wrapper mt-4 sm:mt-6">
            {/* Landing Navigation: "RESUME", "GITHUB", "LINKEDIN", "MAIL" */}
            <div className="cin-page cin-page-1">
              <div ref={navContainerRef} className="will-change-transform">
                <nav
                  className="cin-links flex items-center justify-center gap-6 sm:gap-10 flex-wrap"
                  id="cinLinks"
                  aria-label="Landing links"
                >
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.target}
                      rel={link.target ? 'noreferrer' : undefined}
                      className="text-xs sm:text-sm font-sans font-medium tracking-[0.28em] text-[#888888] hover:text-white uppercase transition-colors py-1.5 px-2 relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Second Page (Revealed upon scroll down) */}
            <div className="cin-page cin-page-2">
              <div className="cin-summary" id="cinSummary" aria-label="Summary">
                I am a&nbsp;<span className="cin-type" id="cinType"></span>
                <span className="cin-type-cursor" aria-hidden="true">
                  &nbsp;
                </span>
              </div>

              <nav className="cin-nav" id="cinNav" aria-label="Second page navigation">
                <a href="#about">About</a>
                <a href="#skills">Tech</a>
                <a href="#experience">Experience</a>
                <a href="#projects">Projects</a>
                <a href="#achievements">Achievements</a>
                <a href="#timeline">Timeline</a>
                <a href="#contact">Contact</a>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Center: Pill-shaped "CLICK HERE" Button */}
      <div
        ref={ctaContainerRef}
        className="fixed bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 will-change-transform"
      >
        <button
          className="cin-cta px-7 py-2.5 rounded-full border border-white/10 bg-[#0d0d0d]/80 backdrop-blur-md text-[#888888] hover:text-white text-[11px] font-semibold tracking-[0.22em] uppercase transition-all shadow-[0_0_24px_rgba(232,69,69,0.15)] hover:shadow-[0_0_32px_rgba(232,69,69,0.3)] hover:border-white/20"
          id="cinCta"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            window.scrollTo({
              top: Math.max(120, window.innerHeight * 0.22),
              behavior: 'smooth',
            });
          }}
        >
          CLICK HERE
        </button>
      </div>

      {/* 6. Bottom Left: Small Red Notification Badge "N | 1 Issue x" */}
      {showIssueBadge && (
        <div
          ref={badgeContainerRef}
          className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-30 will-change-transform flex items-center gap-2 px-3 py-1 rounded-full bg-[#E84545] text-white text-[11px] font-mono font-medium shadow-[0_2px_12px_rgba(232,69,69,0.4)]"
        >
          <span className="font-bold tracking-tight">N</span>
          <span className="opacity-50">|</span>
          <span className="tracking-tight">1 Issue</span>
          <button
            type="button"
            className="ml-1 text-white/70 hover:text-white cursor-pointer transition-colors"
            aria-label="Dismiss issue badge"
            onClick={(e) => {
              e.stopPropagation();
              setShowIssueBadge(false);
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 7. Multiplayer-Style Fake Cursors Overlay */}
      <div
        ref={cursorContainerRef}
        className="fixed inset-0 pointer-events-none z-[10000] overflow-hidden"
        aria-hidden="true"
      >
        {FAKE_CURSORS.map((cursor, idx) => (
          <div
            key={cursor.id}
            ref={(el) => {
              cursorRefs.current[idx] = el;
            }}
            className="absolute top-0 left-0 will-change-transform flex items-start gap-1 select-none pointer-events-none"
            style={{
              transform: 'translate(-200px, -200px)',
            }}
          >
            {/* Custom SVG Desktop Cursor Pointer */}
            <div className="relative -ml-[2px] -mt-[1px]">
              {cursor.shape === 'arrow' ? (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
                >
                  <path
                    d="M2.5 1.5L9.5 21.5L13.8 13.8L21.5 9.5L2.5 1.5Z"
                    fill={cursor.color}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
                >
                  <path
                    d="M0 0L8.5 20.5L12 12.5L20 9L0 0Z"
                    fill={cursor.color}
                    stroke="#000000"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              )}

              {/* Click ripple shockwave ring */}
              <span
                ref={(el) => {
                  cursorRingsRef.current[idx] = el;
                }}
                className="absolute top-0 left-0 w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 pointer-events-none opacity-0"
                style={{ borderColor: cursor.color }}
              />
            </div>

            {/* Pill Label Tag */}
            <div
              className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold leading-none tracking-tight shadow-md select-none pointer-events-none whitespace-nowrap mt-1.5"
              style={{
                backgroundColor: cursor.color,
                color: cursor.textColor,
                boxShadow: `0 2px 10px ${cursor.color}45`,
              }}
            >
              {cursor.name}
            </div>
          </div>
        ))}
      </div>

      {/* CRT / Scanlines / Glitch elements preserved */}
      <div className="cin-flicker" id="cinFlicker"></div>
      <div className="cin-scanlines" id="cinScanlines"></div>
      <div className="cin-jitter" id="cinJitter"></div>
    </section>
  );
}
