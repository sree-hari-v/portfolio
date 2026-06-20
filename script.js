// Single, clean controller. No duplicates.

// ============================
// DEVICE DETECTION
// ============================
const isMobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 768;
const isDesktop = !isMobile;
const body = document.body;
const DEFAULT_ACCENT = { hex: '#E84545', rgb: '232 69 69' };
let currentAccent = { ...DEFAULT_ACCENT };
let particlesReady = false;

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

function toggleTheme() {
  const isLight = body.getAttribute('data-theme') === 'light';
  applyTheme(isLight ? 'dark' : 'light', true);
}

document.getElementById('theme-toggle-nav')?.addEventListener('click', toggleTheme);
document.getElementById('theme-toggle-stage')?.addEventListener('click', toggleTheme);

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

  let powered = false;
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
    if (!powered) return;
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

    const fadeStart = Math.max(260, viewport * 0.58);
    const fadeEnd = Math.max(fadeStart + 180, viewport * 0.90);
    const fadeProgress = Math.min(1, Math.max(0, (y - fadeStart) / (fadeEnd - fadeStart)));
    const shouldHide = fadeProgress >= 0.98;
    body.classList.toggle('stage-hidden', shouldHide);

    // Smooth handoff from the cinematic stage into About instead of a sudden blank gap.
    if (stage) {
      stage.style.opacity = shouldHide ? '0' : `${1 - fadeProgress}`;
      stage.style.transform = `translateY(${-14 * fadeProgress}px) scale(${1 - (0.018 * fadeProgress)})`;
    }
  }

  window.addEventListener('scroll', updateStageByScroll, { passive: true });

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

    setTimeout(tick, speed);
  }

  tick();
})();

// ============================
// Custom cursor (desktop only)
// ============================
function initDesktopCursor() {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  if (!cursorDot || !cursorOutline) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  document.addEventListener('mouseover', (e) => {
    body.classList.toggle('cursor-hover', Boolean(e.target.closest('a, button, .tilt-card, .skill-item, .social-pill')));
  });

  function renderCursor() {
    outlineX += (mouseX - outlineX) * 0.18;
    outlineY += (mouseY - outlineY) * 0.18;
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();
}
if (isDesktop) initDesktopCursor();

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
    .querySelectorAll('.skills-grid .skill-item, .experience-list .exp-card, .project-list .project-card, .contact-socials-big .social-pill')
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
  if (timeline) {
    const obs = new IntersectionObserver((entries, ob) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          timeline.classList.add('line-active');
          ob.unobserve(ent.target);
        }
      });
    }, { threshold: 0.25 });
    obs.observe(timeline);
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
      <a href="${project.liveLink}" target="_blank" style="padding:12px 18px; background:rgba(var(--glow-rgb) / 0.10); color:var(--primary); border-radius:10px; font-weight:900;"><i class="fas fa-external-link-alt"></i> Live Demo</a>
    </div>
  `;

  cards.forEach((c, i) => c.classList.toggle('active', i === index));
  container.classList.add('active-view');

  // small smooth "pop" for details
  if (window.gsap && detailsContainer) {
    gsap.fromTo(detailsContainer, { y: 12, opacity: 0.7 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
  }
};

window.closeProjectDetails = function closeProjectDetails(event) {
  event?.stopPropagation();
  const container = document.getElementById('projects-container');
  if (!container) return;
  container.classList.remove('active-view');
  document.querySelectorAll('.project-card').forEach(c => c.classList.remove('active'));
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

  expCards.forEach((card, i) => card.classList.toggle('active', i === index));
  container.classList.add('active-view');

  if (window.gsap && detailsContainer) {
    gsap.fromTo(detailsContainer, { y: 12, opacity: 0.7 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
  }
};

window.closeExperienceDetails = function closeExperienceDetails(event) {
  event?.stopPropagation();
  const container = document.getElementById('experience-container');
  if (!container) return;
  container.classList.remove('active-view');
  document.querySelectorAll('#experience-list .exp-card').forEach(card => card.classList.remove('active'));
};

document.addEventListener('click', (e) => {
  const container = document.getElementById('experience-container');
  if (container && container.classList.contains('active-view')) {
    const clickedCard = e.target.closest('#experience-list .exp-card');
    const clickedDetails = e.target.closest('.experience-detail-view');
    if (!clickedCard && !clickedDetails) window.closeExperienceDetails();
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

  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a + 1; b < particlesArray.length; b++) {
      const dx = particlesArray[a].x - particlesArray[b].x;
      const dy = particlesArray[a].y - particlesArray[b].y;
      const dist2 = dx * dx + dy * dy;
      if (dist2 < maxDistance * maxDistance) {
        const opacity = 1 - dist2 / (maxDistance * maxDistance);
        ctx.strokeStyle = accentRgba(opacity * opacityMul);
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles(ts = 0) {
  requestAnimationFrame(animateParticles);

  // only animate when stage is hidden
  if (!body.classList.contains('stage-hidden')) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

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

  function openChat() {
    widget.classList.add('is-open');
    widget.setAttribute('aria-hidden', 'false');

    const userName = getUserName();
    setHeaderName(userName);

    if (!widget.dataset.greeted) {
      widget.dataset.greeted = '1';

      if (!userName) {
        addMessage("Hey! Before we start — what’s your name?\nType: “my name is …” or “call me …”", "bot");
      } else {
        addMessage(`Welcome back, ${userName}. Ask me about projects, skills, experience, or contact links.`, "bot");
      }
    }

    setTimeout(() => input.focus(), 0);
  }

  function closeChat() {
    widget.classList.remove('is-open');
    widget.setAttribute('aria-hidden', 'true');
  }

  function toggleChat() {
    widget.classList.contains('is-open') ? closeChat() : openChat();
  }

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

  fab.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', closeChat);

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

  // ESC closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && widget.classList.contains('is-open')) {
      closeChat();
    }
  });

  // Click outside close
  document.addEventListener('pointerdown', (e) => {
    if (!widget.classList.contains('is-open')) return;
    const inside = e.target.closest('#chatWidget') || e.target.closest('#chatFab');
    if (!inside) closeChat();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = input.value.trim();
    if (!msg) return;

    input.value = '';
    sendUserText(msg);
  });

  // set header immediately (even before open)
  setHeaderName(getUserName());
})();