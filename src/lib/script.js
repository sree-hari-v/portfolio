export default function initInteractions() {
  if (typeof window !== 'undefined') {
    if (window.__cursorRaf) cancelAnimationFrame(window.__cursorRaf);
    if (window.__particlesRaf) cancelAnimationFrame(window.__particlesRaf);
    if (window.__typingTimeout) clearTimeout(window.__typingTimeout);
  }
  // ============================
  // DEVICE DETECTION
  // ============================
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches && window.matchMedia("(hover: none)").matches;
  const isMobile = window.innerWidth <= 768 || isTouchDevice;
  const hasFinePointer = window.matchMedia("(any-pointer: fine)").matches || window.matchMedia("(pointer: fine)").matches || window.innerWidth > 768;
  const isDesktop = hasFinePointer && !isTouchDevice; // Enables custom mouse cursor & tilt animations on any desktop/laptop window
  const body = document.body;
  const DEFAULT_ACCENT = { hex: '#E84545', rgb: '232 69 69' };
  let currentAccent = { ...DEFAULT_ACCENT };
  let particlesReady = false;
  let powered = false;

  // ============================
  // THEME TOGGLE (system default + stage/nav controls)
  // ============================
  const systemThemeQuery = window.matchMedia('(prefers-color-scheme: light)');

  function getSavedTheme() {
    const saved = localStorage.getItem('theme');
    return saved === 'light' || saved === 'dark' ? saved : null;
  }

  function getSystemTheme() {
    return systemThemeQuery.matches ? 'light' : 'dark';
  }

  function syncThemeIcon() {
    const isLight = body.getAttribute('data-theme') === 'light';
    document.querySelectorAll('#theme-toggle-nav, #theme-toggle-stage').forEach(btn => {
      const i = btn.querySelector('i');
      if (i) i.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
      btn.setAttribute('aria-label', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
      btn.setAttribute('title', isLight ? 'Dark mode' : 'Light mode');
    });
  }

  function updateAccentDotTheme(isLight) {
    const wbDot = document.getElementById('wb-dot');
    if (!wbDot) return;
    if (isLight) {
      wbDot.setAttribute('data-accent', '#000000');
      wbDot.setAttribute('data-rgb', '0 0 0');
      wbDot.setAttribute('title', 'Black');
      wbDot.setAttribute('aria-label', 'Black');
      wbDot.style.background = '#000000';
      // Switch active accent to black if it was white
      if (currentAccent.hex.toLowerCase() === '#ffffff') {
        setAccent('#000000', '0 0 0');
      }
    } else {
      wbDot.setAttribute('data-accent', '#FFFFFF');
      wbDot.setAttribute('data-rgb', '255 255 255');
      wbDot.setAttribute('title', 'White');
      wbDot.setAttribute('aria-label', 'White');
      wbDot.style.background = '#FFFFFF';
      // Switch active accent to white if it was black
      if (currentAccent.hex === '#000000') {
        setAccent('#FFFFFF', '255 255 255');
      }
    }
  }

  function applyTheme(theme, persist = false) {
    body.setAttribute('data-theme', theme);
    if (persist) localStorage.setItem('theme', theme);
    const isLight = theme === 'light';

    updateAccentDotTheme(isLight);
    setAccent(currentAccent.hex, currentAccent.rgb);
    syncThemeIcon();
  }

  function applyThemeFromPreference() {
    applyTheme(getSavedTheme() || getSystemTheme(), false);
  }

  window.toggleTheme = function toggleTheme() {
    const isLight = body.getAttribute('data-theme') === 'light';
    applyTheme(isLight ? 'dark' : 'light', true);
  };

  if (systemThemeQuery.addEventListener) {
    systemThemeQuery.addEventListener('change', () => {
      if (!getSavedTheme()) applyThemeFromPreference();
    });
  } else {
    systemThemeQuery.addListener(() => {
      if (!getSavedTheme()) applyThemeFromPreference();
    });
  }

  applyThemeFromPreference();

  // ============================
  // Accent picker (UI + stage glow only)
  // ============================
  function setAccent(hex = DEFAULT_ACCENT.hex, rgb = DEFAULT_ACCENT.rgb) {
    currentAccent = { hex, rgb };

    const accentMode = (hex.toLowerCase() === '#ffffff') ? 'white' : ((hex === '#000000') ? 'black' : 'color');
    const isLight = body.getAttribute('data-theme') === 'light';
    const visualHex = accentMode === 'black' && isLight ? '#171a20' : hex;
    const visualRgb = accentMode === 'black' && isLight ? '23 26 32' : rgb;

    document.documentElement.style.setProperty('--primary', visualHex);
    document.documentElement.style.setProperty('--glow-rgb', visualRgb);
    body.style.setProperty('--primary', visualHex);
    body.style.setProperty('--glow-rgb', visualRgb);
    document.documentElement.dataset.accentMode = accentMode;
    body.dataset.accentMode = accentMode;

    document.querySelectorAll('.accent-dot').forEach(btn => {
      const isActive = btn.getAttribute('data-accent')?.toLowerCase() === hex.toLowerCase();
      btn.classList.toggle('is-active', isActive);
    });

    if (particlesReady && typeof initParticles === 'function') initParticles();
  }
  (() => {
    const picker = document.getElementById('accentPicker');
    if (!picker) return;

    picker.querySelectorAll('.accent-dot').forEach(btn => {
      btn.style.background = btn.getAttribute('data-accent');
    });

    picker.addEventListener('click', (e) => {
      const btn = e.target.closest('.accent-dot');
      if (!btn) return;

      setAccent(btn.getAttribute('data-accent'), btn.getAttribute('data-rgb'));
      if (window.gsap) {
        gsap.fromTo(btn, { scale: 0.78 }, { scale: 1.12, duration: 0.45, ease: "elastic.out(1, 0.45)" });
      }
    });
  })();

  // ============================
  // Stage (rope -> power on -> click here -> scroll thresholds)
  // ============================
  (() => {
    const ropeZone = document.getElementById('ropeZone');
    const rope = document.getElementById('rope');
    const cinName = document.getElementById('cinName');
    const hint = document.getElementById('cinBottomHint');
    const cta = document.getElementById('cinCta');
    const ropeClick = document.getElementById('ropeClick');
    const stage = document.getElementById('cinStage');

    const flicker = document.getElementById('cinFlicker');
    const scanlines = document.getElementById('cinScanlines');
    const jitter = document.getElementById('cinJitter');

    powered = false;
    let pulling = false;
    let startY = 0;
    let pullPx = 0;

    const baseLen = 'min(62vh, 560px)';
    const maxPullPx = 240;
    const triggerPx = 120;

    function lockScroll() { body.classList.add('scroll-locked'); }
    function unlockScroll() { body.classList.remove('scroll-locked'); }

    function glitch() {
      if (!window.gsap) {
        if (cinName) {
          cinName.style.opacity = "1";
          cinName.style.filter = "blur(0px)";
        }
        return;
      }
      const tl = gsap.timeline();
      tl.set([flicker, scanlines, jitter], { opacity: 0 })
        .set(cinName, { opacity: 0, filter: "blur(12px)" })
        .to(flicker, { opacity: 0.16, duration: 0.05 })
        .to(flicker, { opacity: 0.00, duration: 0.12 })
        .to(scanlines, { opacity: 0.22, duration: 0.06 }, "<")
        .to(jitter, { opacity: 0.12, duration: 0.06 }, "<")
        .to(cinName, { opacity: 1, duration: 0.10 }, "<")
        .to(cinName, { filter: "blur(0px)", duration: 0.55, ease: "power3.out" }, "<")
        .to(scanlines, { opacity: 0.00, duration: 0.18 }, "<")
        .to(jitter, { opacity: 0.00, duration: 0.22 }, "<");
      return tl;
    }

    function powerOn() {
      powered = true;
      body.classList.add('rope-powered');
      body.classList.remove('hint');
      if (stage) {
        stage.style.opacity = '1';
        stage.style.transform = '';
      }
      unlockScroll();
      if (hint) hint.textContent = "SCROLL DOWN";
      glitch();

      // subtle stage "breath" intro for smoother feel
      if (window.gsap && stage) {
        gsap.fromTo(stage, { scale: 1.01 }, { scale: 1, duration: 0.9, ease: "power3.out" });
      }
    }

    function hardResetStageVisuals() {
      // reset any leftover GSAP inline styles so nothing "sticks"
      if (window.gsap) {
        gsap.set(cinName, { opacity: 0, filter: "blur(12px)" });
        gsap.set([flicker, scanlines, jitter], { opacity: 0 });
        gsap.set(rope, { height: baseLen });
        if (stage) gsap.set(stage, { scale: 1, opacity: 1, clearProps: "transform" });
      } else {
        if (cinName) { cinName.style.opacity = "0"; cinName.style.filter = "blur(12px)"; }
        if (flicker) flicker.style.opacity = "0";
        if (scanlines) scanlines.style.opacity = "0";
        if (jitter) jitter.style.opacity = "0";
        if (rope) rope.style.height = baseLen;
        if (stage) { stage.style.opacity = "1"; stage.style.transform = "none"; }
      }
    }

    function powerOff() {
      powered = false;

      body.classList.remove('rope-powered', 'home-header', 'stage-hidden');
      body.classList.add('hint');
      lockScroll();

      // requested: when OFF, name should not stay (reset visuals)
      hardResetStageVisuals();

      // requested: also reset accent back to default red when OFF
      setAccent(DEFAULT_ACCENT.hex, DEFAULT_ACCENT.rgb);

      if (hint) hint.textContent = "PULL TO TURN ON";
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    function togglePower() { powered ? powerOff() : powerOn(); }

    function applyPull(px) {
      const stretch = Math.min(px, maxPullPx);
      if (window.gsap) gsap.set(rope, { height: `calc(${baseLen} + ${stretch}px)` });
      else rope.style.height = `calc(${baseLen} + ${stretch}px)`;
    }

    function settleRope() {
      if (window.gsap) gsap.to(rope, { height: baseLen, duration: 0.85, ease: "power3.out" });
      else rope.style.height = baseLen;
    }

    function isLeftZone(x) { return x <= window.innerWidth * 0.45; }

    ropeZone?.addEventListener('pointerdown', (e) => {
      // still keep your left-zone logic
      if (!isLeftZone(e.clientX)) return;
      pulling = true;
      startY = e.clientY;
      pullPx = 0;
      ropeZone.setPointerCapture?.(e.pointerId);
    });

    ropeZone?.addEventListener('pointermove', (e) => {
      if (!pulling) return;
      pullPx = Math.max(0, e.clientY - startY);
      pullPx = Math.min(maxPullPx, pullPx);
      applyPull(pullPx);
    });

    function endPull() {
      if (!pulling) return;
      pulling = false;
      if (pullPx >= triggerPx) togglePower();
      settleRope();
      pullPx = 0;
    }

    ropeZone?.addEventListener('pointerup', endPull);
    ropeZone?.addEventListener('pointercancel', endPull);

    ropeClick?.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
    });

    ropeClick?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!powered) powerOn();
    });

    cta?.addEventListener('click', (e) => {
      e.preventDefault();
      if (!powered) {
        powerOn();
        setTimeout(() => {
          window.scrollTo({ top: Math.max(120, window.innerHeight * 0.22), behavior: "smooth" });
        }, 80);
        return;
      }
      window.scrollTo({ top: Math.max(120, window.innerHeight * 0.22), behavior: "smooth" });
    });

    function updateStageByScroll() {
      const y = window.scrollY || document.documentElement.scrollTop;

      if (!powered) {
        body.classList.remove('home-header', 'stage-hidden');
        return;
      }

      const viewport = window.innerHeight;
      const homeHeaderThreshold = Math.max(60, viewport * 0.10);
      body.classList.toggle('home-header', y > homeHeaderThreshold);

      const fadeStart = Math.max(160, viewport * 0.35);
      const fadeEnd = Math.max(fadeStart + 120, viewport * 0.68);
      const fadeProgress = Math.min(1, Math.max(0, (y - fadeStart) / (fadeEnd - fadeStart)));
      const shouldHide = fadeProgress >= 0.95;
      body.classList.toggle('stage-hidden', shouldHide);

      // Smooth handoff from the cinematic stage into About instead of a sudden blank gap.
      if (stage) {
        stage.style.opacity = shouldHide ? '0' : `${1 - fadeProgress}`;
        stage.style.pointerEvents = shouldHide ? 'none' : 'auto';
        stage.style.transform = `translateY(${-14 * fadeProgress}px) scale(${1 - (0.018 * fadeProgress)})`;
      }
    }

    window.addEventListener('scroll', updateStageByScroll, { passive: true });

    document.querySelectorAll('.cin-nav a[href^="#"], .site-nav a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        const href = link.getAttribute('href');
        if (href && href !== '#top') {
          body.classList.add('stage-hidden');
          if (stage) {
            stage.style.opacity = '0';
            stage.style.pointerEvents = 'none';
          }
        }
      });
    });

    // initial
    powerOff();
    updateStageByScroll();
  })();

  // ============================
  // Stage typing effect (only in home-header)
  // ============================
  (() => {
    const el = document.getElementById('cinType');
    if (!el) return;

    const roles = ["Software Developer", "Full Stack Developer", "Web Developer", "Open Source Enthusiast"];
    let roleIndex = 0, charIndex = 0, isDeleting = false;

    function tick() {
      if (!body.classList.contains('home-header')) {
        setTimeout(tick, 200);
        return;
      }

      const current = roles[roleIndex];
      if (isDeleting) { el.textContent = current.substring(0, charIndex - 1); charIndex--; }
      else { el.textContent = current.substring(0, charIndex + 1); charIndex++; }

      let speed = isDeleting ? 50 : 90;
      if (!isDeleting && charIndex === current.length) { isDeleting = true; speed = 1100; }
      else if (isDeleting && charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; speed = 350; }

      window.__typingTimeout = setTimeout(tick, speed);
    }

    tick();
  })();

  // ============================
  // Custom cursor
  // ============================
  function initDesktopCursor() {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;
    let hasMoved = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      hasMoved = true;
      const cursorDot = document.querySelector('.cursor-dot');
      if (cursorDot) {
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        cursorDot.style.display = 'block';
      }
    }, { passive: true });

    document.addEventListener('mouseover', (e) => {
      body.classList.toggle('cursor-hover', Boolean(e.target.closest('a, button, .tilt-card, .skill-item, .social-pill, .achievement-card')));
    });

    function renderCursor() {
      if (hasMoved) {
        const dx = mouseX - outlineX;
        const dy = mouseY - outlineY;

        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
          outlineX = mouseX;
          outlineY = mouseY;
          hasMoved = false; // Sleep until mouse moves again
        } else {
          outlineX += dx * 0.18;
          outlineY += dy * 0.18;
        }

        const cursorOutline = document.querySelector('.cursor-outline');
        if (cursorOutline) {
          cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
          cursorOutline.style.display = 'block';
        }
      }
      window.__cursorRaf = requestAnimationFrame(renderCursor);
    }
    window.__cursorRaf = requestAnimationFrame(renderCursor);
  }
  initDesktopCursor();

  // ============================
  // Mobile menu
  // ============================
  (() => {
    const navLinks = document.getElementById('nav-links');
    const menuBtn = document.getElementById('menu-btn');
    const menuBackdrop = document.getElementById('menu-backdrop');
    const menuCloseBtn = document.getElementById('menu-close-btn');

    function openMenu() {
      navLinks?.classList.add('active');
      menuBackdrop?.classList.add('active');
      menuBtn?.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
      navLinks?.classList.remove('active');
      menuBackdrop?.classList.remove('active');
      menuBtn?.setAttribute('aria-expanded', 'false');
    }
    function toggleMenu() {
      if (!navLinks) return;
      navLinks.classList.contains('active') ? closeMenu() : openMenu();
    }

    menuBtn?.addEventListener('click', toggleMenu);
    menuBackdrop?.addEventListener('click', closeMenu);
    menuCloseBtn?.addEventListener('click', closeMenu);

    document.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        if (window.innerWidth <= 1024) closeMenu();
      });
    });
  })();

  // ============================
  // Reveal + timeline line
  // ============================
  (() => {
    document
      .querySelectorAll('.skills-grid .skill-item, .experience-list .exp-card, .project-list .project-card, .achievement-list .achievement-card, .contact-socials-big .social-pill')
      .forEach((el, index) => {
        el.style.setProperty('--stagger', `${Math.min(index % 10, 9) * 45}ms`);
      });

    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    revealElements.forEach(el => revealObserver.observe(el));

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('section-in-view', entry.isIntersecting);
      });
    }, { threshold: 0.18, rootMargin: "-12% 0px -48% 0px" });

    document.querySelectorAll('section').forEach(section => sectionObserver.observe(section));

    const timeline = document.getElementById('timeline-container');
    const timelineProgress = document.getElementById('timelineProgress');
    const timelineSection = document.getElementById('timeline');
    if (timeline && timelineProgress && timelineSection) {
      const items = timeline.querySelectorAll('.timeline-item');
      const dots = timeline.querySelectorAll('.timeline-dot');
      let isNavigatingToTimeline = false;
      let navAnimTimer = null;

      function getMilestoneY(index) {
        const item = items[index];
        if (!item) return 0;
        const dot = dots[index];
        const dotCenter = dot && dot.offsetHeight ? (dot.offsetTop + dot.offsetHeight / 2) : 27;
        return item.offsetTop + dotCenter;
      }

      function updateTimeline(forceFirstItem = false) {
        if (isNavigatingToTimeline && !forceFirstItem) return;

        const secRect = timelineSection.getBoundingClientRect();
        const containerRect = timeline.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const navOffset = window.innerWidth <= 768 ? 95 : 85;
        const totalHeight = timeline.offsetHeight - 30;

        const firstMilestone = items.length ? getMilestoneY(0) : 45;
        const lastMilestone = items.length ? getMilestoneY(items.length - 1) : totalHeight;

        // Force reset/start at first milestone (e.g. when clicked from nav bar)
        if (forceFirstItem) {
          timelineProgress.classList.add('is-drawing');
          timelineProgress.style.height = `${firstMilestone}px`;
          items.forEach((item, index) => {
            const dot = dots[index];
            if (index === 0) {
              if (dot) dot.classList.add('dot-active');
              item.classList.add('item-active');
            } else {
              if (dot) dot.classList.remove('dot-active');
              item.classList.remove('item-active');
            }
          });
          return;
        }

        // When timeline section is far below viewport (not yet visible)
        if (secRect.top > vh * 0.85) {
          timelineProgress.style.height = '0px';
          timelineProgress.classList.remove('is-drawing');
          items.forEach((item) => item.classList.remove('item-active'));
          dots.forEach((dot) => dot.classList.remove('dot-active'));
          return;
        }

        // Focal line in the viewport: items and the progress beam only advance as each item reaches focus
        // Anything below this line remains completely hidden (opacity: 0)
        const focusY = window.innerWidth <= 768 ? (vh * 0.50) : (vh * 0.44);
        const lineTopInViewport = containerRect.top + 18;
        const rawHeight = focusY - lineTopInViewport;

        let targetHeight = 0;

        if (rawHeight <= 0) {
          targetHeight = 0;
          timelineProgress.classList.remove('is-drawing');
          timelineProgress.style.height = '0px';
        } else {
          timelineProgress.classList.add('is-drawing');
          // If user is at or above the landing header, cap at first milestone so items below stay hidden
          if (secRect.top >= navOffset - 10) {
            targetHeight = Math.min(rawHeight, firstMilestone);
          } else {
            targetHeight = Math.min(rawHeight, lastMilestone);
          }
          timelineProgress.style.height = `${targetHeight}px`;
        }

        // Reveal timeline items one by one as the progress beam reaches each milestone
        // Items below the beam REMAIN COMPLETELY HIDDEN (opacity: 0)
        items.forEach((item, index) => {
          const dot = dots[index];
          const milestoneY = getMilestoneY(index);
          const activateThreshold = milestoneY - 14;
          const deactivateThreshold = milestoneY - 50;

          if (targetHeight >= activateThreshold) {
            if (dot) dot.classList.add('dot-active');
            item.classList.add('item-active');
          } else if (targetHeight < deactivateThreshold) {
            if (dot) dot.classList.remove('dot-active');
            item.classList.remove('item-active');
          }
        });
      }

      window.addEventListener('scroll', () => updateTimeline(), { passive: true });
      window.addEventListener('resize', () => updateTimeline(), { passive: true });
      setTimeout(() => updateTimeline(), 250);

      // Listen to Timeline nav clicks so it always starts from the first item with comfortable clearance
      document.querySelectorAll('a[href="#timeline"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          if (window.innerWidth <= 1024) {
            const navLinks = document.getElementById('nav-links');
            const menuBtn = document.getElementById('menu-btn');
            const menuBackdrop = document.getElementById('menu-backdrop');
            navLinks?.classList.remove('active');
            menuBtn?.classList.remove('active');
            menuBtn?.setAttribute('aria-expanded', 'false');
            menuBackdrop?.classList.remove('active');
            document.body.classList.remove('menu-open');
          }

          const targetSec = document.getElementById('timeline');
          if (!targetSec) return;

          isNavigatingToTimeline = true;
          clearTimeout(navAnimTimer);

          // Reset to 0 initially
          timelineProgress.style.transition = 'none';
          timelineProgress.style.height = '0px';
          timelineProgress.classList.remove('is-drawing');
          items.forEach((item) => item.classList.remove('item-active'));
          dots.forEach((dot) => dot.classList.remove('dot-active'));

          // Calculate exact landing scroll position with generous navbar clearance
          const navOffset = window.innerWidth <= 768 ? 95 : 85;
          const targetY = targetSec.getBoundingClientRect().top + window.scrollY - navOffset;

          window.scrollTo({
            top: Math.max(0, targetY),
            behavior: 'smooth'
          });

          // Once scroll reaches section, smoothly draw to first milestone
          navAnimTimer = setTimeout(() => {
            timelineProgress.style.transition = 'height 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
            updateTimeline(true);

            setTimeout(() => {
              timelineProgress.style.transition = 'height 0.12s linear';
              isNavigatingToTimeline = false;
            }, 700);
          }, 350);
        });
      });
    }
  })();

  // ============================
  // Premium interaction layer
  // ============================
  (() => {
    const tiltTargets = document.querySelectorAll('.tilt-card, .skill-item');

    if (isDesktop) {
      tiltTargets.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const px = x / rect.width;
          const py = y / rect.height;
          const tiltX = (px - 0.5) * 8;
          const tiltY = (0.5 - py) * 8;

          el.style.setProperty('--tilt-x', `${tiltX}deg`);
          el.style.setProperty('--tilt-y', `${tiltY}deg`);
          el.style.setProperty('--mx', `${px * 100}%`);
          el.style.setProperty('--my', `${py * 100}%`);
        });

        el.addEventListener('mouseleave', () => {
          el.style.setProperty('--tilt-x', '0deg');
          el.style.setProperty('--tilt-y', '0deg');
          el.style.setProperty('--mx', '50%');
          el.style.setProperty('--my', '50%');
        });
      });
    }

    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    const sectionMap = Array.from(navAnchors)
      .map(link => ({ link, section: document.querySelector(link.getAttribute('href')) }))
      .filter(item => item.section);

    window.addEventListener('scroll', () => {
      let currentSection = sectionMap[0]?.link;
      sectionMap.forEach(item => {
        const rect = item.section.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.4) {
          currentSection = item.link;
        }
      });
      navAnchors.forEach(link => link.classList.toggle('is-active', link === currentSection));
    }, { passive: true });

    function updateNavDensity() {
      body.classList.toggle('nav-compact', (window.scrollY || document.documentElement.scrollTop) > 120);
    }
    window.addEventListener('scroll', updateNavDensity, { passive: true });
    updateNavDensity();
  })();

  // ============================
  // Projects + Experience expand
  // ============================
  const projects = [
    {
      title: "EduNex",
      description: "An interactive, AI-driven college chatbot built to automate routine campus inquiries and provide instant access to college information.",
      challenge: "Handling repetitive campus inquiries manually is time-consuming, and students often face delays getting simple answers about college locations, facilities, and schedules.",
      solution: "Developed an intelligent conversational interface using Next.js and Supabase that understands natural queries to instantly provide accurate, college-specific answers.",
      features: ["Natural Language Querying", "Instant Location & Info Retrieval", "24/7 Automated Assistance"],
      impact: "Significantly reduced repetitive administrative inquiries and provided a seamless, instant way for users to navigate college resources.",
      techUsed: ["Next.js", "Supabase", "React.js", "Tailwind CSS"],
      liveLink: "https://edunex-bot.vercel.app/",
      githubLink: "https://github.com/sree-hari-v/Edunex"
    },
    {
      title: "Project Hub",
      description: "A centralized dashboard to showcase development projects.",
      challenge: "Personal projects were difficult to navigate and lack a professional, unified showcase experience.",
      solution: "Developed a responsive dashboard with categorized projects, smooth animations, and direct access to source code.",
      features: ["Interactive Filtering", "3D Tilt Animations", "Responsive Grid Layout"],
      impact: "Increased portfolio engagement and provided a single source of truth for all development work.",
      techUsed: ["HTML5", "CSS3", "JavaScript", "Intersection Observer API"],
      liveLink: "https://cs-tech-hub.vercel.app/",
      githubLink: "https://github.com/sree-hari-v/cs-tech-hub"
    },
    {
      title: "Grievance Portal",
      description: "A secure platform for students to raise concerns and get timely resolutions.",
      challenge: "Manual grievance reporting in departments is often slow, opaque, and hard to track for students.",
      solution: "Built a transparent system for real-time reporting and status tracking, enhancing accountability and resolution speed.",
      features: ["Anonymous Reporting", "Status Tracking Timeline", "Admin Dashboard"],
      impact: "Streamlined the grievance redressal process, reducing resolution time from weeks to days.",
      techUsed: ["Next.js", "Tailwind CSS", "Firebase", "TypeScript"],
      liveLink: "https://cs-dept-grievance-portal.vercel.app/",
      githubLink: "https://github.com/sree-hari-v/department-grievance-portal"
    },
    {
      title: "Music Player",
      description: "A sleek, modern offline music player for Android built with Flutter. Inspired by Spotify's design language, featuring synchronized karaoke lyrics, lyrics translation, full-screen interactive Canvas visuals, and modern Android Storage Access Framework (SAF) integration.",
      challenge: "Modern Android scoped storage restricts broad file access, while high-performance offline playback requires responsive low-latency audio decoding, real-time synchronized lyrics rendering, and dynamic ID3 metadata extraction without UI jitter.",
      solution: "Engineered a clean, feature-driven architecture using Flutter and Riverpod 2.x, integrating just_audio for background playback and lock-screen controls, saf for scoped folder permissions, and LRCLIB API with multi-level offline caching.",
      features: [
        "High-Fidelity Offline Playback (just_audio)",
        "Synchronized & Translated Karaoke Lyrics (LRCLIB)",
        "Spotify-Inspired Fullscreen Canvas Visuals",
        "Modern Android Scoped Storage (SAF)",
        "Dynamic Queue & Track Metadata Inspector"
      ],
      impact: "Delivered a Spotify-grade offline music listening experience with zero invasive storage permissions and robust offline caching.",
      techUsed: ["Flutter", "Dart", "Android", "Riverpod", "just_audio", "LRCLIB API"],
      liveLink: "https://github.com/sree-hari-v/music-player/releases/tag/v1.0.0",
      liveLabel: "Live / APK Release",
      liveIcon: "fas fa-external-link-alt",
      githubLink: "https://github.com/sree-hari-v/music-player"
    }
  ];

  window.selectProject = function selectProject(index, event) {
    event?.stopPropagation();
    const container = document.getElementById('projects-container');
    const detailsContainer = document.getElementById('project-details');
    const cards = document.querySelectorAll('.project-card');
    const project = projects[index];
    if (!container || !detailsContainer) return;

    detailsContainer.innerHTML = `
    <div class="close-details" onclick="closeProjectDetails(event)"><i class="fas fa-times"></i></div>
    <h2 style="margin-bottom: 15px;">${project.title}</h2>
    <p style="color: var(--text-gray); margin-bottom: 20px; line-height: 1.8;">${project.description}</p>
    <div style="margin-bottom: 25px; color: var(--text-gray); text-align: left;">
      <h4 style="margin-bottom: 5px;"><i class="fas fa-exclamation-circle" style="color: var(--primary);"></i> The Challenge</h4>
      <p style="margin-bottom: 15px; line-height: 1.7;">${project.challenge}</p>
      <h4 style="margin-bottom: 5px;"><i class="fas fa-check-circle" style="color: var(--primary);"></i> The Solution</h4>
      <p style="margin-bottom: 15px; line-height: 1.7;">${project.solution}</p>
      <h4 style="margin-bottom: 5px;"><i class="fas fa-star" style="color: var(--primary);"></i> Key Features</h4>
      <ul style="margin-bottom: 15px; padding-left: 20px; list-style-type: disc; line-height: 1.7;">
        ${project.features.map(feat => `<li>${feat}</li>`).join('')}
      </ul>
      <h4 style="margin-bottom: 5px;"><i class="fas fa-chart-line" style="color: var(--primary);"></i> Impact / Results</h4>
      <p style="line-height: 1.7;">${project.impact}</p>
    </div>
    <div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom: 22px;">
      ${project.techUsed.map(t => `<span style="background:rgba(var(--glow-rgb) / 0.08); border:1px solid rgba(var(--glow-rgb) / 0.18); color:var(--primary); padding:6px 12px; border-radius:10px; font-weight:800;">${t}</span>`).join('')}
    </div>
    <div style="display:flex; gap:12px; flex-wrap:wrap;">
      <a href="${project.githubLink}" target="_blank" style="padding:12px 18px; border:1px solid var(--glass-border); border-radius:10px; font-weight:800;"><i class="fab fa-github"></i> GitHub</a>
      <a href="${project.liveLink}" target="_blank" style="padding:12px 18px; background:rgba(var(--glow-rgb) / 0.10); color:var(--primary); border-radius:10px; font-weight:900;"><i class="${project.liveIcon || 'fas fa-external-link-alt'}"></i> ${project.liveLabel || 'Live Demo'}</a>
    </div>
  `;

    const selectedCard = cards[index];
    if (selectedCard) {
      selectedCard.classList.remove('card-shockwave');
      void selectedCard.offsetWidth;
      selectedCard.classList.add('card-shockwave');
    }

    cards.forEach((c, i) => c.classList.toggle('active', i === index));
    container.classList.add('active-view');

    if (window.gsap) {
      if (selectedCard) {
        gsap.fromTo(selectedCard,
          { scale: 0.93, y: 18, rotateX: 6 },
          { scale: 1, y: 0, rotateX: 0, duration: 0.5, ease: "back.out(1.8)" }
        );
      }
      if (detailsContainer) {
        gsap.fromTo(detailsContainer,
          { opacity: 0, x: 28, scale: 0.96 },
          { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "power3.out" }
        );
      }
    }
  };

  window.closeProjectDetails = function closeProjectDetails(event) {
    event?.stopPropagation();
    const container = document.getElementById('projects-container');
    if (!container) return;
    container.classList.remove('active-view');
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(c => c.classList.remove('active', 'card-shockwave'));

    if (window.gsap) {
      gsap.fromTo(cards,
        { opacity: 0, y: 16, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.07, ease: "back.out(1.4)" }
      );
    }
  };

  document.addEventListener('click', (e) => {
    const container = document.getElementById('projects-container');
    if (container && container.classList.contains('active-view')) {
      const clickedCard = e.target.closest('.project-card');
      const clickedDetails = e.target.closest('.project-detail-view');
      if (!clickedCard && !clickedDetails) window.closeProjectDetails();
    }
  });

  const experiences = [
    {
      title: "Lab Technician Intern",
      date: "Jun 2025 - Nov 2025",
      company: "Nilgiri College of Arts and Science",
      roleLabel: "Role",
      roleValue: "Lab Technician Intern",
      description:
        "Assisted in managing computer lab infrastructure, troubleshooting hardware and software issues, and providing technical support to students and faculty, ensuring smooth daily operations.",
      highlights: [
        "Troubleshot hardware/software issues and reduced downtime",
        "Supported students and faculty with lab systems and tools",
        "Helped maintain daily operations and ensured smooth lab usage"
      ],
      tags: ["IT Support", "Troubleshooting", "Lab Operations"]
    },
    {
      title: "Computing Fundamentals and C Programming",
      date: "Published Jan 2025",
      company: "Publication",
      roleLabel: "Role",
      roleValue: "Co-Author",
      metaLabel: "ISBN",
      metaValue: "978-93-344-4926-6",
      description:
        "Co-authored a comprehensive guide on C programming, covering core concepts, memory management, and practical examples aimed at helping college students build strong foundational knowledge.",
      highlights: [
        "Structured content for college-level fundamentals",
        "Covered memory management and practical patterns",
        "Included examples and exercises for learning-by-doing"
      ],
      tags: ["C", "Technical Writing", "Publishing"]
    },
    {
      title: "Essentials Of Java",
      date: "Published Jan 2025",
      company: "Publication",
      roleLabel: "Role",
      roleValue: "Co-Author",
      metaLabel: "ISBN",
      metaValue: "978-93-344-4677-7",
      description:
        "Collaborated on a detailed textbook exploring Object-Oriented Programming principles in Java, including data structures, multithreading, and real-world application design.",
      highlights: [
        "Explained OOP concepts with clear examples",
        "Included DS + multithreading fundamentals",
        "Focused on real-world application design patterns"
      ],
      tags: ["Java", "OOP", "Technical Writing"]
    }
  ];

  window.selectExperience = function selectExperience(index, event) {
    event?.stopPropagation();

    const container = document.getElementById('experience-container');
    const detailsContainer = document.getElementById('experience-details');
    const expCards = document.querySelectorAll('#experience-list .exp-card');
    const exp = experiences[index];

    if (!container || !detailsContainer) return;

    detailsContainer.innerHTML = `
    <div class="close-details" onclick="closeExperienceDetails(event)"><i class="fas fa-times"></i></div>
    <h2 style="margin-bottom:10px;">${exp.title}</h2>
    <div style="color: var(--text-gray); margin-bottom: 18px; font-family: 'Fira Code', monospace; font-size: 0.9rem;">
      <span style="color: var(--primary); font-weight: 800;">${exp.date}</span>
      <span style="margin: 0 10px; opacity: 0.5;">•</span>
      <span>${exp.company}</span>
    </div>
    <p style="color: var(--text-gray); margin-bottom: 20px; line-height: 1.8;">${exp.description}</p>

    <div style="margin-bottom: 22px; color: var(--text-gray); text-align: left;">
      <h4 style="margin-bottom: 8px;"><i class="fas fa-star" style="color: var(--primary);"></i> Highlights</h4>
      <ul style="padding-left: 20px; list-style-type: disc; line-height: 1.7;">
        ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
      <div style="margin-top: 18px; display: grid; gap: 8px;">
        <div>
          <span style="color: var(--text-muted);">${exp.roleLabel}:</span>
          <span style="margin-left: 8px; font-weight: 800;">${exp.roleValue}</span>
        </div>
        ${exp.metaLabel ? `
          <div>
            <span style="color: var(--text-muted);">${exp.metaLabel}:</span>
            <span style="margin-left: 8px; font-weight: 800;">${exp.metaValue}</span>
          </div>
        ` : ''}
      </div>
    </div>

    <div style="display:flex; flex-wrap:wrap; gap:10px;">
      ${exp.tags.map(t => `<span style="background:rgba(var(--glow-rgb) / 0.08); border:1px solid rgba(var(--glow-rgb) / 0.18); color:var(--primary); padding:6px 12px; border-radius:10px; font-weight:800;">${t}</span>`).join('')}
    </div>
  `;

    const selectedExpCard = expCards[index];
    if (selectedExpCard) {
      selectedExpCard.classList.remove('card-shockwave');
      void selectedExpCard.offsetWidth;
      selectedExpCard.classList.add('card-shockwave');
    }

    expCards.forEach((card, i) => card.classList.toggle('active', i === index));
    container.classList.add('active-view');

    if (window.gsap) {
      if (selectedExpCard) {
        gsap.fromTo(selectedExpCard,
          { scale: 0.93, y: 18, rotateX: 6 },
          { scale: 1, y: 0, rotateX: 0, duration: 0.5, ease: "back.out(1.8)" }
        );
      }
      if (detailsContainer) {
        gsap.fromTo(detailsContainer,
          { opacity: 0, x: 28, scale: 0.96 },
          { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "power3.out" }
        );
      }
    }
  };

  window.closeExperienceDetails = function closeExperienceDetails(event) {
    event?.stopPropagation();
    const container = document.getElementById('experience-container');
    if (!container) return;
    container.classList.remove('active-view');
    const cards = document.querySelectorAll('#experience-list .exp-card');
    cards.forEach(card => card.classList.remove('active', 'card-shockwave'));

    if (window.gsap) {
      gsap.fromTo(cards,
        { opacity: 0, y: 16, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.07, ease: "back.out(1.4)" }
      );
    }
  };

  document.addEventListener('click', (e) => {
    const container = document.getElementById('experience-container');
    if (container && container.classList.contains('active-view')) {
      const clickedCard = e.target.closest('#experience-list .exp-card');
      const clickedDetails = e.target.closest('.experience-detail-view');
      if (!clickedCard && !clickedDetails) window.closeExperienceDetails();
    }
  });

  const achievements = [
    {
      title: "Department Tech Team Head",
      category: "Leadership",
      organization: "Department of Computer Science",
      period: "2024 - 2025",
      icon: "fas fa-crown",
      description:
        "Appointed as the Head of the Department Technical Team, taking charge of technical initiatives, lab projects, hackathons, and guiding student developer groups.",
      highlights: [
        "Led the student technical committee organizing departmental coding fests, tech symposiums, and workshops.",
        "Managed technical infrastructure and coordinated collaborative project development across student batches.",
        "Mentored junior developers in git practices, architectural patterns, and full-stack software development."
      ],
      tags: ["Leadership", "Event Organization", "Tech Infrastructure", "Mentorship"]
    },
    {
      title: "Innovative Excellence Award",
      category: "Award & Honor",
      organization: "Department of Computer Science",
      period: "Conferred 2025",
      icon: "fas fa-award",
      description:
        "Received the prestigious Innovative Excellence Award from the Department in recognition of outstanding technical innovation, problem-solving, and impactful software platform development.",
      highlights: [
        "Conferred for architecting high-impact campus solutions including the EduNex AI chatbot and the Grievance Portal.",
        "Recognized by department faculty and leadership for creative problem-solving and technical execution.",
        "Acknowledged as a top technical contributor within the Computer Science department."
      ],
      tags: ["Innovation", "Full-Stack Development", "Problem Solving", "Department Honor"]
    },
    {
      title: "Academic Performance — 7.1 CGPA",
      category: "Academics",
      organization: "B.Sc. Computer Science",
      period: "2023 - Present",
      icon: "fas fa-graduation-cap",
      description:
        "Maintained a solid 7.1 CGPA throughout the Computer Science undergraduate program while actively publishing technical textbooks, leading teams, and building production applications.",
      highlights: [
        "Consistent academic excellence in core subjects: Data Structures, OOP, Database Systems, and Algorithms.",
        "Successfully balanced demanding degree coursework with co-authoring 2 textbooks in C and Java.",
        "Hands-on application of academic computer science theory into modern, real-world software engineering."
      ],
      tags: ["7.1 CGPA", "Data Structures", "Algorithms", "Academic Excellence"]
    },
    {
      title: "Peer Teaching & Seminars",
      category: "Mentorship",
      organization: "Student Community & Juniors",
      period: "Ongoing",
      icon: "fas fa-chalkboard-teacher",
      description:
        "Actively conducted peer-to-peer teaching sessions, seminars, and technical workshops for junior students and fellow peers on foundational programming and modern technologies.",
      highlights: [
        "Conducted structured seminars on programming fundamentals, C memory management, and Java OOP.",
        "Organized interactive coding bootcamps and hands-on guidance for juniors preparing for projects.",
        "Cultivated a vibrant, collaborative peer-learning environment across the department."
      ],
      tags: ["Peer Teaching", "Workshops", "Public Speaking", "Community Mentorship"]
    }
  ];

  window.selectAchievement = function selectAchievement(index, event) {
    event?.stopPropagation();

    const container = document.getElementById('achievements-container');
    const detailsContainer = document.getElementById('achievement-details');
    const achCards = document.querySelectorAll('#achievement-list .achievement-card');
    const ach = achievements[index];

    if (!container || !detailsContainer || !ach) return;

    detailsContainer.innerHTML = `
    <div class="close-details" onclick="closeAchievementDetails(event)"><i class="fas fa-times"></i></div>
    <div class="achievement-category-badge" style="margin-bottom: 14px;">${ach.category}</div>
    <h2 style="margin-bottom:10px;">${ach.title}</h2>
    <div style="color: var(--text-gray); margin-bottom: 18px; font-family: 'Fira Code', monospace; font-size: 0.9rem;">
      <span style="color: var(--primary); font-weight: 800;">${ach.period}</span>
      <span style="margin: 0 10px; opacity: 0.5;">•</span>
      <span>${ach.organization}</span>
    </div>
    <p style="color: var(--text-gray); margin-bottom: 20px; line-height: 1.8;">${ach.description}</p>

    <div style="margin-bottom: 22px; color: var(--text-gray); text-align: left;">
      <h4 style="margin-bottom: 8px;"><i class="fas fa-star" style="color: var(--primary);"></i> Key Highlights</h4>
      <ul style="padding-left: 20px; list-style-type: disc; line-height: 1.7;">
        ${ach.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
    </div>

    <div style="display:flex; flex-wrap:wrap; gap:10px;">
      ${ach.tags.map(t => `<span style="background:rgba(var(--glow-rgb) / 0.08); border:1px solid rgba(var(--glow-rgb) / 0.18); color:var(--primary); padding:6px 12px; border-radius:10px; font-weight:800;">${t}</span>`).join('')}
    </div>
  `;

    const selectedAchCard = achCards[index];
    if (selectedAchCard) {
      selectedAchCard.classList.remove('card-shockwave');
      void selectedAchCard.offsetWidth;
      selectedAchCard.classList.add('card-shockwave');
    }

    achCards.forEach((card, i) => card.classList.toggle('active', i === index));
    container.classList.add('active-view');

    if (window.gsap) {
      if (selectedAchCard) {
        gsap.fromTo(selectedAchCard,
          { scale: 0.93, y: 18, rotateX: 6 },
          { scale: 1, y: 0, rotateX: 0, duration: 0.5, ease: "back.out(1.8)" }
        );
      }
      if (detailsContainer) {
        gsap.fromTo(detailsContainer,
          { opacity: 0, x: 28, scale: 0.96 },
          { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "power3.out" }
        );
      }
    }
  };

  window.closeAchievementDetails = function closeAchievementDetails(event) {
    event?.stopPropagation();
    const container = document.getElementById('achievements-container');
    if (!container) return;
    container.classList.remove('active-view');
    const cards = document.querySelectorAll('#achievement-list .achievement-card');
    cards.forEach(card => card.classList.remove('active', 'card-shockwave'));

    if (window.gsap) {
      gsap.fromTo(cards,
        { opacity: 0, y: 16, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.07, ease: "back.out(1.4)" }
      );
    }
  };

  document.addEventListener('click', (e) => {
    const container = document.getElementById('achievements-container');
    if (container && container.classList.contains('active-view')) {
      const clickedCard = e.target.closest('#achievement-list .achievement-card');
      const clickedDetails = e.target.closest('.achievement-detail-view');
      if (!clickedCard && !clickedDetails) window.closeAchievementDetails();
    }
  });

  // ============================
  // Achievement Deck Card Click Handler
  // ============================
  const achDeckCards = document.querySelectorAll('.achievement-deck .achievement-card');
  achDeckCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = card.classList.contains('is-active');
      achDeckCards.forEach(c => c.classList.remove('is-active'));
      if (!isActive) {
        card.classList.add('is-active');
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.achievement-deck')) {
      achDeckCards.forEach(c => c.classList.remove('is-active'));
    }
  });

  // ============================
  // Particles (red only)
  // ============================
  const canvas = document.getElementById('canvas-bg');
  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  let lastFrameTime = 0;
  const mobileFPS = 30;
  const mobileInterval = 1000 / mobileFPS;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

  function getGlowRgbParts() {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--glow-rgb')
      .trim()
      .split(/\s+/)
      .map(Number);
  }

  function accentRgba(alpha) {
    const [r = 232, g = 69, b = 69] = getGlowRgbParts();
    return `rgba(${r},${g},${b},${alpha})`;
  }

  class Particle {
    constructor(x, y, vx, vy, size, color) {
      this.x = x; this.y = y;
      this.vx = vx; this.vy = vy;
      this.size = size; this.color = color;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    step() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x + this.size > canvas.width || this.x - this.size < 0) this.vx *= -1;
      if (this.y + this.size > canvas.height || this.y - this.size < 0) this.vy *= -1;
    }
  }

  function initParticles() {
    particlesArray = [];
    const color = accentRgba(isMobile ? 0.62 : 0.88);

    const count = isMobile
      ? Math.max(18, Math.min(28, Math.floor(canvas.width / 18)))
      : Math.floor((canvas.width * canvas.height) / 15000);

    for (let i = 0; i < count; i++) {
      const size = isMobile ? (Math.random() * 1.4) + 0.9 : (Math.random() * 1.5) + 0.5;
      const x = Math.random() * (canvas.width - size * 2) + size;
      const y = Math.random() * (canvas.height - size * 2) + size;
      const vx = isMobile ? (Math.random() * 0.70) - 0.35 : (Math.random() * 0.4) - 0.2;
      const vy = isMobile ? (Math.random() * 0.70) - 0.35 : (Math.random() * 0.4) - 0.2;
      particlesArray.push(new Particle(x, y, vx, vy, size, color));
    }
  }

  function connectParticles() {
    const isLightMode = body.getAttribute('data-theme') === 'light';
    const maxDistance = isMobile ? 95 : 120;
    const lineWidth = isMobile ? 0.7 : 0.85;
    const opacityMul = isMobile ? (isLightMode ? 0.08 : 0.22) : (isLightMode ? 0.10 : 0.40);

    ctx.lineWidth = lineWidth;
    const maxDist2 = maxDistance * maxDistance;
    const buckets = [[], [], [], [], [], [], [], [], [], []];

    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a + 1; b < particlesArray.length; b++) {
        const dx = particlesArray[a].x - particlesArray[b].x;
        const dy = particlesArray[a].y - particlesArray[b].y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < maxDist2) {
          const opacity = 1 - dist2 / maxDist2;
          const idx = Math.min(9, Math.floor(opacity * 10));
          buckets[idx].push(particlesArray[a], particlesArray[b]);
        }
      }
    }

    for (let i = 0; i < 10; i++) {
      if (buckets[i].length === 0) continue;
      ctx.strokeStyle = accentRgba(((i + 1) / 10) * opacityMul);
      ctx.beginPath();
      for (let j = 0; j < buckets[i].length; j += 2) {
        ctx.moveTo(buckets[i][j].x, buckets[i][j].y);
        ctx.lineTo(buckets[i][j + 1].x, buckets[i][j + 1].y);
      }
      ctx.stroke();
    }
  }

  let lastCleared = false;
  function animateParticles(ts = 0) {
    window.__particlesRaf = requestAnimationFrame(animateParticles);

    // only animate when stage is hidden
    if (!body.classList.contains('stage-hidden')) {
      if (!lastCleared) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lastCleared = true;
      }
      return;
    }
    lastCleared = false;

    if (isMobile) {
      const delta = ts - lastFrameTime;
      if (delta < mobileInterval) return;
      lastFrameTime = ts;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particlesArray) { p.step(); p.draw(); }
    connectParticles();
  }

  particlesReady = true;
  initParticles();
  animateParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  // ============================
  // Scroll progress bar
  // ============================
  (() => {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;

    function update() {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = `${pct}%`;
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  })();

  /* ============================
     OFFLINE CHATBOT (controller)
     - user sets their name once
     - bot replies with clickable links
     ============================ */
  (() => {
    const fab = document.getElementById('chatFab');
    const widget = document.getElementById('chatWidget');
    const closeBtn = document.getElementById('chatClose');
    const maxBtn = document.getElementById('chatMaximize');
    const maxIcon = document.getElementById('chatMaximizeIcon');
    const brandBtn = document.getElementById('chatBrand');
    const bodyEl = document.getElementById('chatBody');
    const form = document.getElementById('chatForm');
    const input = document.getElementById('chatText');
    const chips = document.getElementById('chatChips');

    const botNameEl = document.getElementById('chatBotName');
    const botSubEl = document.getElementById('chatBotSub');
    const avatarEl = document.getElementById('chatAvatar');

    if (!fab || !widget || !closeBtn || !bodyEl || !form || !input) return;

    const STORAGE_KEY = "chat_user_name_v1";

    function getUserName() {
      try {
        const v = sessionStorage.getItem(STORAGE_KEY);
        return v ? String(v) : null;
      } catch {
        return null;
      }
    }

    function setUserName(name) {
      try {
        sessionStorage.setItem(STORAGE_KEY, String(name));
      } catch { }
    }

    function nowTime() {
      try {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch {
        return '';
      }
    }

    function setHeaderName(name) {
      const label = name ? `${name}'s Bot` : "Offline Bot";
      if (botNameEl) botNameEl.textContent = label;
      if (botSubEl) botSubEl.textContent = name ? "Ask about projects • skills • contact" : "Tell me your name to start";

      const letter = name ? String(name).trim().charAt(0).toUpperCase() : "B";
      if (avatarEl) avatarEl.textContent = letter || "B";
    }

    // render segments to DOM (safe)
    function renderSegments(container, segments) {
      for (const seg of (segments || [])) {
        if (!seg || !seg.type) continue;

        if (seg.type === "text") {
          container.appendChild(document.createTextNode(seg.text || ""));
        } else if (seg.type === "newline") {
          container.appendChild(document.createElement('br'));
        } else if (seg.type === "link") {
          const a = document.createElement('a');
          a.href = seg.href || "#";
          a.textContent = seg.label || seg.href || "Open link";
          a.target = seg.href && seg.href.startsWith('http') ? "_blank" : "_self";
          a.rel = "noopener noreferrer";
          container.appendChild(a);
        } else if (seg.type === "contact_form") {
          const card = document.createElement('div');
          card.className = 'chat-inline-contact-card';

          const cardHeader = document.createElement('div');
          cardHeader.className = 'chat-inline-contact-header';
          cardHeader.innerHTML = `
            <span class="chat-inline-badge">✉️ Contact & Connect</span>
            <span class="chat-inline-hint">Direct & Socials</span>
          `;
          card.appendChild(cardHeader);

          const socials = document.createElement('div');
          socials.className = 'chat-inline-socials';
          socials.innerHTML = `
            <a href="https://www.linkedin.com/in/sreehari-v-a15084321/" target="_blank" rel="noopener noreferrer" class="chat-inline-social-btn" title="LinkedIn Profile">
              <i class="fab fa-linkedin-in"></i>
              <span>LinkedIn</span>
            </a>
            <a href="https://github.com/sree-hari-v" target="_blank" rel="noopener noreferrer" class="chat-inline-social-btn" title="GitHub Profile">
              <i class="fab fa-github"></i>
              <span>GitHub</span>
            </a>
            <a href="https://drive.google.com/file/d/1o1KKzYHzRdbiPagUZu1ik9rLi5ewDoie/view?usp=drive_link" target="_blank" rel="noopener noreferrer" class="chat-inline-social-btn" title="Resume">
              <i class="far fa-file-alt"></i>
              <span>Resume</span>
            </a>
            <a href="mailto:sreehari.vengalil@gmail.com" class="chat-inline-social-btn" title="Direct Email">
              <i class="far fa-envelope"></i>
              <span>Email</span>
            </a>
          `;
          card.appendChild(socials);

          const divider = document.createElement('div');
          divider.className = 'chat-inline-divider';
          divider.innerHTML = `<span>or send a direct message</span>`;
          card.appendChild(divider);

          const form = document.createElement('form');
          form.className = 'chat-inline-form';
          form.autoComplete = 'off';

          const prefilledName = getUserName() || '';
          const prefilledMsg = seg.userQuery || '';

          form.innerHTML = `
            <div class="chat-inline-field">
              <i class="fas fa-user chat-inline-icon"></i>
              <input type="text" name="visitor_name" class="chat-inline-input" placeholder="Your Name" value="${prefilledName.replace(/"/g, '&quot;')}" required />
            </div>
            <div class="chat-inline-field">
              <i class="fas fa-envelope chat-inline-icon"></i>
              <input type="email" name="visitor_email" class="chat-inline-input" placeholder="Your Email address" required />
            </div>
            <div class="chat-inline-field">
              <i class="fas fa-comment-alt chat-inline-icon" style="top: 12px; transform: none;"></i>
              <textarea name="visitor_message" class="chat-inline-textarea" rows="2" placeholder="Your message..." required>${prefilledMsg.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
            </div>
            <div class="chat-inline-actions">
              <button type="submit" class="chat-inline-submit">
                <span>Send Email</span> <i class="fas fa-paper-plane"></i>
              </button>
              <button type="button" class="chat-inline-modal-link">
                <span>Or open full contact form</span> <i class="fas fa-arrow-up-right-from-square"></i>
              </button>
            </div>
            <div class="chat-inline-status" style="display: none;"></div>
          `;

          const modalBtn = form.querySelector('.chat-inline-modal-link');
          modalBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.openContactModal) window.openContactModal();
          });

          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('.chat-inline-submit');
            const statusEl = form.querySelector('.chat-inline-status');
            const nameInput = form.querySelector('input[name="visitor_name"]');
            const emailInput = form.querySelector('input[name="visitor_email"]');
            const msgInput = form.querySelector('textarea[name="visitor_message"]');

            const nameVal = nameInput?.value.trim() || '';
            const emailVal = emailInput?.value.trim() || '';
            const msgVal = msgInput?.value.trim() || '';

            if (!nameVal || !emailVal || !msgVal) return;

            // Remember user name
            setUserName(nameVal);
            setHeaderName(nameVal);

            if (submitBtn) {
              submitBtn.disabled = true;
              submitBtn.innerHTML = `<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>`;
            }

            const accessKey = document.querySelector('input[name="access_key"]')?.value || process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '';

            const formData = new FormData();
            formData.append('access_key', accessKey);
            formData.append('subject', `💬 Chatbot Inquiry from ${nameVal}`);
            formData.append('from_name', `${nameVal} (via Portfolio Chatbot)`);
            formData.append('name', nameVal);
            formData.append('email', emailVal);
            formData.append('message', `Portfolio Chatbot Visitor Inquiry:\n\nName: ${nameVal}\nEmail: ${emailVal}\n\nQuestion / Message:\n${msgVal}\n\nSent from Portfolio Chatbot Screen`);

            try {
              const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
              });
              const json = await res.json();
              if (res.status === 200 || json.success) {
                card.innerHTML = `
                  <div class="chat-inline-success">
                    <i class="fas fa-check-circle chat-inline-success-icon"></i>
                    <div class="chat-inline-success-text">
                      <strong>Email Sent to Sreehari!</strong>
                      <p>Thanks ${nameVal}, Sreehari has received your message and will respond to <strong>${emailVal}</strong>.</p>
                    </div>
                  </div>
                `;
              } else {
                throw new Error(json.message || 'Error sending');
              }
            } catch (err) {
              if (statusEl) {
                statusEl.style.display = 'block';
                statusEl.className = 'chat-inline-status error';
                statusEl.innerHTML = `Could not send automatically. You can email Sreehari directly at <a href="mailto:sreehari.vengalil@gmail.com" style="color:inherit;text-decoration:underline;">sreehari.vengalil@gmail.com</a>.`;
              }
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span>Retry Sending</span> <i class="fas fa-paper-plane"></i>`;
              }
            }

            // Keep scroll at bottom
            setTimeout(() => {
              if (bodyEl) bodyEl.scrollTop = bodyEl.scrollHeight;
            }, 60);
          });

          card.appendChild(form);
          container.appendChild(card);
        }
      }
    }

    function addMessage(segmentsOrText, who = 'bot') {
      const row = document.createElement('div');
      row.className = `chat-msg ${who}`;

      const bubbleWrap = document.createElement('div');

      const bubble = document.createElement('div');
      bubble.className = 'chat-bubble';

      if (Array.isArray(segmentsOrText)) {
        renderSegments(bubble, segmentsOrText);
      } else {
        bubble.textContent = String(segmentsOrText || '');
      }

      const meta = document.createElement('div');
      meta.className = 'chat-meta';
      meta.textContent = who === 'user' ? `You • ${nowTime()}` : `${(getUserName() ? `${getUserName()}'s Bot` : "Offline Bot")} • ${nowTime()}`;

      bubbleWrap.appendChild(bubble);
      bubbleWrap.appendChild(meta);
      row.appendChild(bubbleWrap);

      bodyEl.appendChild(row);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    function openChat(skipInitialGreet = false) {
      const widgetEl = document.getElementById('chatWidget') || widget;
      if (!widgetEl) return;
      widgetEl.classList.add('is-open');
      widgetEl.setAttribute('aria-hidden', 'false');
      body.classList.add('chat-open', 'show-floating-widgets');

      const userName = getUserName();
      setHeaderName(userName);

      if (!widgetEl.dataset.greeted) {
        widgetEl.dataset.greeted = '1';

        if (!skipInitialGreet) {
          if (!userName) {
            addMessage("Hey! Feel free to ask about Sreehari's projects, skills, experience, or contact links.\nOr tell me your name (“call me ...”)!", "bot");
          } else {
            addMessage(`Welcome back, ${userName}. Ask me about projects, skills, experience, or contact links.`, "bot");
          }
        }
      }

      // Only auto-focus on desktop / non-touch screens to avoid abrupt mobile keyboard popups
      if (!isMobile && !isTouchDevice && window.innerWidth > 768) {
        setTimeout(() => {
          const inp = document.getElementById('chatText') || input;
          inp?.focus();
        }, 80);
      }

      const sidePrompt = document.getElementById('chatFabSidePrompt');
      if (sidePrompt) {
        sidePrompt.classList.remove('is-visible');
      }
    }

    function toggleFullScreen(forceState) {
      const widgetEl = document.getElementById('chatWidget') || widget;
      if (!widgetEl) return false;

      const now = Date.now();
      if (typeof forceState !== 'boolean' && window.__lastChatFullscreenToggle && (now - window.__lastChatFullscreenToggle < 300)) {
        return widgetEl.classList.contains('is-fullscreen');
      }
      window.__lastChatFullscreenToggle = now;

      const isFull = typeof forceState === 'boolean'
        ? widgetEl.classList.toggle('is-fullscreen', forceState)
        : widgetEl.classList.toggle('is-fullscreen');

      const targetIcon = document.getElementById('chatMaximizeIcon') || maxIcon;
      const targetBtn = document.getElementById('chatMaximize') || maxBtn;

      if (targetIcon) {
        targetIcon.className = isFull ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
      }
      if (targetBtn) {
        targetBtn.setAttribute('title', isFull ? 'Restore view' : 'Full screen');
        targetBtn.setAttribute('aria-label', isFull ? 'Restore view' : 'Full screen');
      }
      const chatBody = document.getElementById('chatBody') || bodyEl;
      setTimeout(() => {
        if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
      }, 50);
      return isFull;
    }

    function closeChat(e) {
      if (e) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
      }
      const widgetEl = document.getElementById('chatWidget') || widget;
      if (widgetEl) {
        widgetEl.classList.remove('is-open', 'is-fullscreen');
        widgetEl.setAttribute('aria-hidden', 'true');
      }
      body.classList.remove('chat-open');
      const targetIcon = document.getElementById('chatMaximizeIcon') || maxIcon;
      const targetBtn = document.getElementById('chatMaximize') || maxBtn;
      if (targetIcon) targetIcon.className = 'fa-solid fa-expand';
      if (targetBtn) {
        targetBtn.setAttribute('title', 'Full screen');
        targetBtn.setAttribute('aria-label', 'Full screen');
      }
    }

    let lastChatToggle = 0;
    function toggleChat(e) {
      if (e) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
      }
      const now = Date.now();
      if (now - lastChatToggle < 250) return;
      lastChatToggle = now;

      const widgetEl = document.getElementById('chatWidget') || widget;
      if (!widgetEl) return;
      widgetEl.classList.contains('is-open') ? closeChat(e) : openChat();
    }

    window.toggleChat = toggleChat;
    window.openChat = openChat;
    window.closeChat = closeChat;
    window.toggleFullScreenChat = toggleFullScreen;
    window.sendChatQuery = function (query) {
      openChat(true);
      setTimeout(() => {
        sendUserText(query);
      }, 100);
    };

    function sendUserText(text) {
      const msg = String(text || '').trim();
      if (!msg) return;

      addMessage(msg, 'user');

      const engine = window.ChatbotAnswers;
      if (!engine || typeof engine.getBestAnswerSegments !== 'function') {
        addMessage("Offline bot engine not loaded. Make sure chatbot-answers.js is included before script.js.", "bot");
        return;
      }

      // If user typed a name command, persist it here (controller owns storage)
      const maybeName = engine.parseSetName ? engine.parseSetName(msg) : null;
      if (maybeName) {
        setUserName(maybeName);
        setHeaderName(maybeName);
      }

      const replySegments = engine.getBestAnswerSegments(msg, { userName: getUserName() });
      addMessage(replySegments, 'bot');
    }

    // Touch and click handling on fab for instant, responsive mobile tap
    let fabTouchStart = 0;
    let fabTouchX = 0;
    let fabTouchY = 0;

    fab.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        fabTouchStart = Date.now();
        fabTouchX = e.touches[0].clientX;
        fabTouchY = e.touches[0].clientY;
      }
    }, { passive: true });

    fab.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const dx = Math.abs(e.changedTouches[0].clientX - fabTouchX);
        const dy = Math.abs(e.changedTouches[0].clientY - fabTouchY);
        const dur = Date.now() - fabTouchStart;
        if (dx < 15 && dy < 15 && dur < 500) {
          if (e.cancelable) e.preventDefault();
          e.stopPropagation();
          toggleChat(e);
        }
      }
    }, { passive: false });

    fab.onclick = (e) => toggleChat(e);

    closeBtn.addEventListener('touchend', (e) => {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      closeChat(e);
    }, { passive: false });
    closeBtn.onclick = (e) => closeChat(e);

    // clicking on chatbot title/avatar area toggles
    brandBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleChat();
    });

    // Chips click => auto send (and open chat if closed)
    chips?.addEventListener('click', (e) => {
      const btn = e.target.closest('.chat-chip');
      if (!btn) return;

      const msg = btn.getAttribute('data-msg') || '';
      if (!widget.classList.contains('is-open')) openChat();
      sendUserText(msg);
    });

    // ESC closes or exits fullscreen
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && widget.classList.contains('is-open')) {
        if (widget.classList.contains('is-fullscreen')) {
          toggleFullScreen();
        } else {
          closeChat();
        }
      }
    });

    // Click outside close (only when not in fullscreen and NOT on mobile viewports)
    document.addEventListener('pointerdown', (e) => {
      if (!widget.classList.contains('is-open') || widget.classList.contains('is-fullscreen')) return;
      if (window.innerWidth <= 768) return; // On mobile, widget is full-screen, closed via close button
      const inside = e.target.closest('#chatWidget') || e.target.closest('#chatFab') || e.target.closest('#chatFabSidePrompt');
      if (!inside) closeChat();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = input.value.trim();
      if (!msg) return;

      input.value = '';
      sendUserText(msg);
    });

    // Isolate scrolling inside the chatbot so background page NEVER scrolls
    widget.addEventListener('wheel', (e) => {
      e.stopPropagation();

      const isChatBody = e.target.closest('#chatBody');
      if (isChatBody && bodyEl) {
        const { scrollTop, scrollHeight, clientHeight } = bodyEl;
        const delta = e.deltaY;
        const atTop = delta < 0 && scrollTop <= 1;
        const atBottom = delta > 0 && (scrollTop + clientHeight >= scrollHeight - 2);

        if (atTop || atBottom) {
          e.preventDefault();
        }
      } else {
        // If cursor is over header, chips, or input inside the widget, prevent background scroll
        // and redirect vertical wheel scroll to chatBody
        e.preventDefault();
        if (bodyEl && e.deltaY) {
          bodyEl.scrollTop += e.deltaY;
        }
      }
    }, { passive: false });

    // Touch event containment for mobile / touch devices
    let chatTouchStartY = 0;
    widget.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        chatTouchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    widget.addEventListener('touchmove', (e) => {
      if (!bodyEl || e.touches.length !== 1) return;
      const currentY = e.touches[0].clientY;
      const deltaY = chatTouchStartY - currentY;
      chatTouchStartY = currentY;

      const isChatBody = e.target.closest('#chatBody');
      if (isChatBody) {
        const { scrollTop, scrollHeight, clientHeight } = bodyEl;
        const atTop = deltaY < 0 && scrollTop <= 1;
        const atBottom = deltaY > 0 && (scrollTop + clientHeight >= scrollHeight - 2);
        if (atTop || atBottom) {
          e.preventDefault();
        }
      } else {
        e.preventDefault();
        bodyEl.scrollTop += deltaY;
      }
    }, { passive: false });

    // set header immediately (even before open)
    setHeaderName(getUserName());
  })();

  // ============================
  // FLOATING WIDGETS VISIBILITY (Page 2 & portfolio sections)
  // Gating #chatFab, #chatFabSidePrompt, #visitorToast
  // Strictly hidden on the first page (cinematic stage page 1)
  // ============================
  function isPastFirstPage() {
    const y = window.scrollY || document.documentElement.scrollTop;
    const viewport = window.innerHeight || 800;
    const homeHeaderThreshold = Math.max(60, viewport * 0.10);
    return body.classList.contains('home-header') || body.classList.contains('stage-hidden') || y > homeHeaderThreshold;
  }

  function canShowFloatingWidgets() {
    if (body.classList.contains('chat-open')) return true;
    return isPastFirstPage();
  }
  const isAboutOrBelow = isPastFirstPage;

  function updateFloatingWidgetsVisibility() {
    const show = canShowFloatingWidgets();
    body.classList.toggle('show-floating-widgets', show);
    if (!show && !body.classList.contains('chat-open')) {
      const sidePrompt = document.getElementById('chatFabSidePrompt');
      if (sidePrompt) sidePrompt.classList.remove('is-visible');
      const toast = document.getElementById('visitorToast');
      if (toast) toast.classList.remove('is-visible', 'is-expanded');
    }
  }

  window.addEventListener('scroll', updateFloatingWidgetsVisibility, { passive: true });
  window.addEventListener('resize', updateFloatingWidgetsVisibility, { passive: true });

  const bodyStageObserver = new MutationObserver(() => {
    updateFloatingWidgetsVisibility();
  });
  bodyStageObserver.observe(body, { attributes: true, attributeFilter: ['class'] });

  updateFloatingWidgetsVisibility();

  // ============================
  // CHAT FAB SIDE PROMPT CONTROLLER
  // Cycles random prompts at intervals and upon user idle/inactivity
  // ============================
  (() => {
    const sidePrompt = document.getElementById('chatFabSidePrompt');
    const promptTextEl = document.getElementById('chatFabSidePromptText');
    const widget = document.getElementById('chatWidget');
    if (!sidePrompt || !promptTextEl) return;

    const PROMPTS = [
      {
        display: "Ask about my tech stack! ⚡",
        query: "What is your tech stack and skills?"
      },
      {
        display: "Ask about my projects! 🚀",
        query: "Tell me about your projects"
      },
      {
        display: "Want to know about EduNex? 🤖",
        query: "Tell me about EduNex"
      },
      {
        display: "Need my resume? Just ask! 📄",
        query: "Can I get your resume link?"
      },
      {
        display: "Ask about my publications & research! 📚",
        query: "Tell me about your published books and publications"
      },
      {
        display: "Ask about my experience & internships! 💼",
        query: "What is your work experience and internships?"
      },
      {
        display: "Have questions about my code? Ask here! 💻",
        query: "Where can I view your GitHub and code?"
      },
      {
        display: "Looking to collaborate? Let's chat! ✨",
        query: "Are you open to hire or collaborate?"
      },
      {
        display: "Any doubts? Ask here! 💬",
        query: "Who are you and what do you do?"
      }
    ];

    let currentPromptIdx = 0;
    let rotationInterval = null;
    let idleTimer = null;
    let hideTimer = null;

    function showPrompt(itemOrText) {
      if (!isAboutOrBelow()) return;
      if (widget && widget.classList.contains('is-open')) return;

      const displayText = typeof itemOrText === 'string'
        ? itemOrText
        : (itemOrText?.display || "Ask about my tech stack! ⚡");

      if (promptTextEl) {
        promptTextEl.textContent = displayText;
      }
      sidePrompt.classList.add('is-visible');

      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (!widget || !widget.classList.contains('is-open')) {
          sidePrompt.classList.remove('is-visible');
        }
      }, 7500);
    }

    function nextPrompt() {
      if (!isAboutOrBelow()) return;
      if (widget && widget.classList.contains('is-open')) return;
      sidePrompt.classList.remove('is-visible');
      setTimeout(() => {
        currentPromptIdx = (currentPromptIdx + 1) % PROMPTS.length;
        showPrompt(PROMPTS[currentPromptIdx]);
      }, 400);
    }

    // Interval: rotate prompts every 11 seconds
    function startInterval() {
      if (rotationInterval) clearInterval(rotationInterval);
      rotationInterval = setInterval(nextPrompt, 11000);
    }

    // Idle detection: when user stops clicking/touching/scrolling for 6s, show prompt
    function resetIdleTimer() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (!isAboutOrBelow()) return;
        if (!widget || !widget.classList.contains('is-open')) {
          const randomIdx = Math.floor(Math.random() * PROMPTS.length);
          currentPromptIdx = randomIdx;
          showPrompt(PROMPTS[randomIdx]);
        }
      }, 6000);
    }

    ['mousedown', 'touchstart', 'scroll', 'keydown', 'pointerdown'].forEach((evt) => {
      window.addEventListener(evt, resetIdleTimer, { passive: true });
    });

    let lastPromptClick = 0;
    function handlePromptClick(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const now = Date.now();
      if (now - lastPromptClick < 500) return;
      lastPromptClick = now;

      const item = PROMPTS[currentPromptIdx] || PROMPTS[0];
      const query = item.query || item.display || "What is your tech stack and skills?";

      if (window.sendChatQuery) {
        window.sendChatQuery(query);
      } else if (window.openChat) {
        window.openChat();
      }
    }

    sidePrompt.addEventListener('click', handlePromptClick);
    window.askChatbotSidePrompt = handlePromptClick;

    // Start prompt cycle once About is reached
    function initPromptCycle() {
      if (isAboutOrBelow()) {
        showPrompt(PROMPTS[0]);
        startInterval();
        resetIdleTimer();
      } else {
        const onReachAbout = () => {
          if (isAboutOrBelow()) {
            window.removeEventListener('scroll', onReachAbout);
            setTimeout(() => {
              showPrompt(PROMPTS[0]);
              startInterval();
              resetIdleTimer();
            }, 800);
          }
        };
        window.addEventListener('scroll', onReachAbout, { passive: true });
      }
    }
    initPromptCycle();
  })();

  // ============================
  // CONTACT MODAL POPUP & WEB3FORMS HANDLER
  // ============================
  (() => {
    const openBtn = document.getElementById('open-contact-modal-btn');
    const closeBtn = document.getElementById('closeContactModalBtn');
    const backdrop = document.getElementById('contactModalBackdrop');
    const form = document.getElementById('portfolio-form');
    const statusText = document.getElementById('form-status');

    function openContactModal() {
      if (!backdrop) return;
      backdrop.classList.add('is-open');
      backdrop.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-scroll-locked');
      setTimeout(() => {
        const firstInput = form?.querySelector('input[type="text"]');
        firstInput?.focus();
      }, 150);
    }
    window.openContactModal = openContactModal;

    function closeContactModal() {
      if (!backdrop) return;
      backdrop.classList.remove('is-open');
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-scroll-locked');
      if (statusText) {
        statusText.innerHTML = '';
        statusText.className = 'form-status';
      }
    }

    openBtn?.addEventListener('click', openContactModal);
    closeBtn?.addEventListener('click', closeContactModal);

    backdrop?.addEventListener('pointerdown', (e) => {
      if (e.target === backdrop) closeContactModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop?.classList.contains('is-open')) {
        closeContactModal();
      }
    });

    if (!form || !statusText) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameVal = form.querySelector('#form-name')?.value.trim();
      const emailVal = form.querySelector('#form-email')?.value.trim();
      const messageVal = form.querySelector('#form-message')?.value.trim();

      if (!nameVal || !emailVal || !messageVal) {
        statusText.className = 'form-status error';
        statusText.innerHTML = 'Please fill out all mandatory fields (Name, Email, Message).';
        return;
      }

      statusText.className = 'form-status sending';
      statusText.innerHTML = 'Sending message...';

      const formData = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
        .then(async (response) => {
          if (response.status === 200) {
            statusText.className = 'form-status success';
            statusText.innerHTML = 'Message sent successfully!';
            form.reset();
            setTimeout(() => {
              closeContactModal();
            }, 2400);
          } else {
            statusText.className = 'form-status error';
            statusText.innerHTML = 'Something went wrong. Please try again.';
          }
        })
        .catch((error) => {
          statusText.className = 'form-status error';
          statusText.innerHTML = 'Error sending message. Please try again.';
        });
    });
  })();

  // ============================
  // VISITOR NOTIFICATION TOAST CONTROLLER
  // ============================
  (() => {
    const toast = document.getElementById('visitorToast');
    const closeBtn = document.getElementById('visitorToastClose');
    const form = document.getElementById('visitorToastForm');
    const nameInput = document.getElementById('visitorToastName');
    const messageInput = document.getElementById('visitorToastMessage');
    const submitBtn = document.getElementById('visitorToastSubmit');
    const contentArea = document.getElementById('visitorToastContent');
    const successArea = document.getElementById('visitorToastSuccess');
    const successMsg = document.getElementById('visitorToastSuccessMsg');
    const collapsedBtn = document.getElementById('visitorToastCollapsed');

    if (!toast || !form || !submitBtn || !messageInput) return;

    const CHAT_NAME_KEY = 'chat_user_name_v1';

    // Clear legacy suppression keys so the user/visitors always have access to Say Hi
    try {
      localStorage.removeItem('portfolio_visitor_waved');
      localStorage.removeItem('portfolio_visitor_dismissed_until');
    } catch { }

    function getKnownName() {
      try {
        return sessionStorage.getItem(CHAT_NAME_KEY) || '';
      } catch {
        return '';
      }
    }

    function showToast() {
      const known = getKnownName();
      if (known && nameInput && !nameInput.value) {
        nameInput.value = known;
      }

      toast.classList.add('is-visible');
      toast.setAttribute('aria-hidden', 'false');
    }

    function hideToast() {
      toast.classList.remove('is-expanded');
    }

    collapsedBtn?.addEventListener('click', () => {
      toast.classList.add('is-expanded');
      setTimeout(() => {
        if (nameInput && !nameInput.value) {
          nameInput.focus();
        } else if (messageInput) {
          messageInput.focus();
        }
      }, 150);
    });

    closeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      hideToast();
    });

    // Prevent background page scrolling when cursor is over the toast form
    toast.addEventListener('wheel', (e) => {
      e.stopPropagation();
      e.preventDefault();
    }, { passive: false });

    // Detect Referrer neatly
    function parseReferrer() {
      const ref = document.referrer;
      if (!ref) return 'Direct Visit / Bookmark';
      try {
        const url = new URL(ref);
        const host = url.hostname.toLowerCase();
        if (host.includes('linkedin.')) return 'LinkedIn';
        if (host.includes('google.')) return 'Google Search';
        if (host.includes('github.')) return 'GitHub';
        if (host.includes('twitter.') || host.includes('x.com') || host.includes('t.co')) return 'Twitter / X';
        if (host.includes('instagram.')) return 'Instagram';
        if (host.includes('youtube.')) return 'YouTube';
        return `${url.hostname}${url.pathname}`;
      } catch {
        return ref;
      }
    }

    // Detect Device
    function getDeviceType() {
      const ua = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'Tablet';
      }
      if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
        return 'Mobile';
      }
      return 'Desktop';
    }

    // Detect Browser
    function getBrowserName() {
      const ua = navigator.userAgent;
      if (ua.includes('Firefox/')) return 'Firefox';
      if (ua.includes('Edg/')) return 'Microsoft Edge';
      if (ua.includes('Chrome/')) return 'Chrome';
      if (ua.includes('Safari/')) return 'Safari';
      if (ua.includes('OPR/') || ua.includes('Opera/')) return 'Opera';
      return 'Unknown Browser';
    }

    // Detect OS
    function getOSName() {
      const ua = navigator.userAgent;
      if (ua.includes('Win')) return 'Windows';
      if (ua.includes('Mac')) return 'macOS';
      if (ua.includes('Linux')) return 'Linux';
      if (ua.includes('Android')) return 'Android';
      if (ua.includes('like Mac')) return 'iOS';
      return 'Unknown OS';
    }

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const visitorName = nameInput.value.trim();
      if (!visitorName) return; // Name is required
      const message = messageInput.value.trim() || 'No message provided.';

      // Sync name to offline chatbot storage
      try {
        if (nameInput?.value.trim()) {
          sessionStorage.setItem(CHAT_NAME_KEY, visitorName);
          const botNameEl = document.getElementById('chatBotName');
          const avatarEl = document.getElementById('chatAvatar');
          if (botNameEl) botNameEl.textContent = `${visitorName}'s Bot`;
          if (avatarEl) avatarEl.textContent = visitorName.charAt(0).toUpperCase();
        }
      } catch { }

      // Set sending state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>`;

      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const currentPage = window.location.pathname + (window.location.hash || '');
      const referrer = parseReferrer();
      const device = getDeviceType();
      const browser = getBrowserName();
      const os = getOSName();
      const screenRes = `${window.screen.width}x${window.screen.height}`;

      const emailBody = `Portfolio Visitor Wave!

Name: ${visitorName}
Message: ${message}

-- Details --
Date: ${formattedDate}
Time: ${formattedTime}
Page: ${currentPage || '/'}
Referrer: ${referrer}
Device: ${device} (${screenRes})
Browser: ${browser}
Operating System: ${os}

---------------------------------------
Sent via Sreehari V's Portfolio Visitor Notification`;

      const formData = new FormData();
      formData.append('access_key', process.env.NEXT_PUBLIC_WEB3FORMS_KEY);
      formData.append('subject', `👋 Portfolio Wave from ${visitorName}`);
      formData.append('from_name', 'Portfolio Visitor Wave');
      formData.append('name', visitorName);
      formData.append('email', 'visitor@portfolio.sreehari');
      formData.append('message', emailBody);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        if (response.status === 200) {
          // Show success state
          if (contentArea) contentArea.style.display = 'none';
          if (successArea) successArea.style.display = 'flex';
          if (successMsg) successMsg.textContent = `Thanks, ${visitorName}! Sreehari has been notified of your visit.`;

          // Automatically reset and collapse back to "Say Hi!" button after 3.5 seconds
          setTimeout(() => {
            toast.classList.remove('is-expanded');
            if (contentArea) contentArea.style.display = 'block';
            if (successArea) successArea.style.display = 'none';
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>Send</span> <i class="fas fa-paper-plane"></i>`;
          }, 3500);
        } else {
          throw new Error('Failed to notify');
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Send</span> <i class="fas fa-paper-plane"></i>`;
        alert('Could not send notification. Please try again or reach out directly!');
      }
    });

    // Display Say Hi notification after 1.5s once Page 2 / site is active
    const POPUP_DELAY_MS = 1500;
    let popupTimer = null;

    function scheduleToast() {
      function checkAndTriggerToast() {
        if (!isPastFirstPage()) return;
        if (popupTimer || toast.classList.contains('is-visible')) return;
        popupTimer = setTimeout(() => {
          if (isPastFirstPage()) {
            showToast();
          }
        }, POPUP_DELAY_MS);
      }

      window.addEventListener('scroll', () => {
        if (isPastFirstPage()) {
          if (!toast.classList.contains('is-visible') && !popupTimer) {
            popupTimer = setTimeout(() => {
              if (isPastFirstPage()) {
                showToast();
              }
            }, POPUP_DELAY_MS);
          }
        } else {
          // Hide toast if user scrolls back up to the first page
          toast.classList.remove('is-visible', 'is-expanded');
          if (popupTimer) {
            clearTimeout(popupTimer);
            popupTimer = null;
          }
        }
      }, { passive: true });

      checkAndTriggerToast();
    }

    scheduleToast();

    // Hide toast when chatbot opens to avoid overlap, restore when closed
    const chatWidget = document.getElementById('chatWidget');
    if (chatWidget) {
      const chatObserver = new MutationObserver(() => {
        const isOpen = chatWidget.classList.contains('is-open');
        if (isOpen) {
          toast.style.opacity = '0';
          toast.style.pointerEvents = 'none';
        } else if (toast.classList.contains('is-visible')) {
          toast.style.opacity = '';
          toast.style.pointerEvents = '';
        }
      });
      chatObserver.observe(chatWidget, { attributes: true, attributeFilter: ['class'] });
    }

    // Achievement Deck Cards: Click / Keyboard activation to inspect card
    const achDeckCards = document.querySelectorAll('.achievement-deck .achievement-card');
    achDeckCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.closest('button')) return;
        const isActive = card.classList.contains('active');
        achDeckCards.forEach((c) => c.classList.remove('active'));
        if (!isActive) {
          card.classList.add('active');
          card.classList.add('card-shockwave');
          setTimeout(() => card.classList.remove('card-shockwave'), 450);
        }
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.closest('a') || e.target.closest('button')) return;
          e.preventDefault();
          card.click();
        }
      });
    });

    // Contact Deck Cards: Clicking card directly navigates or opens modal!
    const contactCards = document.querySelectorAll('.contact-deck .contact-card');
    contactCards.forEach((card) => {
      function executeContactAction(e) {
        if (e.target.closest('a') || e.target.closest('button')) return;

        card.classList.add('card-shockwave');
        setTimeout(() => card.classList.remove('card-shockwave'), 450);

        const action = card.getAttribute('data-action');
        const url = card.getAttribute('data-url');
        const target = card.getAttribute('data-target');

        if (action === 'open-modal') {
          const btn = document.getElementById('open-contact-modal-btn');
          if (btn) btn.click();
        } else if (url) {
          if (target === '_blank') {
            window.open(url, '_blank', 'noopener,noreferrer');
          } else {
            window.location.href = url;
          }
        }
      }

      card.addEventListener('click', executeContactAction);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.closest('a') || e.target.closest('button')) return;
          e.preventDefault();
          executeContactAction(e);
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#achievement-deck')) {
        achDeckCards.forEach((c) => c.classList.remove('active'));
      }
    });

    // Bypass rope animation
    setTimeout(() => {
      const ropeClick = document.getElementById('ropeClick');
      if (ropeClick) {
        ropeClick.click();
      } else {
        // Just manually trigger power on if ropeClick was removed
        document.body.classList.add('rope-powered');
        document.body.classList.remove('hint');
        document.body.classList.remove('scroll-locked');
      }
    }, 100);
  })();
}