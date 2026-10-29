# Sreehari V — Personal Developer Portfolio

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.3.8-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3.12.5-88CE02?style=for-the-badge&logo=greensock&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-9.x-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)

<p align="center">
  Personal portfolio website of <strong>Sreehari V</strong> — Computer Science Undergraduate and Full-Stack Developer. Built with Next.js (App Router), React 19, TypeScript, Tailwind CSS v4, custom HTML5 Canvas particle systems, and an in-browser offline chatbot engine.
</p>

[**Live Site**](https://sreehari-v.vercel.app/) • [**GitHub**](https://github.com/sree-hari-v) • [**LinkedIn**](https://www.linkedin.com/in/sreehari-v-a15084321/) • [**Resume**](https://drive.google.com/file/d/1o1KKzYHzRdbiPagUZu1ik9rLi5ewDoie/view?usp=drive_link) • [**Email**](mailto:sreehari.vengalil@gmail.com)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Complete File & Directory Tree](#-complete-file--directory-tree)
- [Tech Stack & Package Dependencies](#-tech-stack--package-dependencies)
- [Codebase Architecture & File Analysis](#-codebase-architecture--file-analysis)
  - [`src/app/layout.tsx`](#srcapplayouttsx)
  - [`src/app/page.tsx`](#srcapppagetsx)
  - [`src/lib/script.js`](#srclibscriptjs)
  - [`src/lib/chatbot.js`](#srclibchatbotjs)
  - [`src/app/globals.css`](#srcappglobalscss)
  - [Configuration Files](#configuration-files)
- [Portfolio Data from Code](#-portfolio-data-from-code)
  - [1. Tech Arsenal Pyramid (21 Technologies)](#1-tech-arsenal-pyramid-21-technologies)
  - [2. Featured Projects (3 Projects)](#2-featured-projects-3-projects)
  - [3. Professional Experience & Publications (3 Entries)](#3-professional-experience--publications-3-entries)
  - [4. Key Achievements (4 Honors)](#4-key-achievements-4-honors)
  - [5. Journey Timeline (5 Milestones)](#5-journey-timeline-5-milestones)
  - [6. Dynamic Roles in Typewriter](#6-dynamic-roles-in-typewriter)
  - [7. Chatbot Side Prompts (9 Questions)](#7-chatbot-side-prompts-9-questions)
- [Forms & Web3Forms Integration](#-forms--web3forms-integration)
- [Environment Variables](#-environment-variables)
- [Running Locally & Scripts](#-running-locally--scripts)

---

## 🌟 Overview

This repository houses the personal portfolio and software showcase for **Sreehari V**. It combines Next.js App Router client rendering with a retro-futuristic CRT hero stage, interactive 3D card tilt physics, hardware-accelerated particle graphics on an HTML5 2D canvas, a client-side NLP chatbot with zero external API dependencies, and visitor telemetry reporting powered by Web3Forms.

---

## 📂 Complete File & Directory Tree

Every non-ignored file present in this repository:

```text
portfolio/
├── .env.example                  # Template for environment variables (Web3Forms access key)
├── .env.local                    # Local environment secrets (ignored by git)
├── .gitignore                    # Git ignore rules (node_modules, .next, .env*, !.env.example)
├── AGENTS.md                     # Agent workspace instructions for Next.js
├── CLAUDE.md                     # Pointer referencing AGENTS.md
├── eslint.config.mjs             # ESLint 9 flat config (core-web-vitals, ts, no-img-element: off)
├── next-env.d.ts                 # Next.js TypeScript type definitions
├── next.config.ts                # NextConfig definition object
├── package.json                  # Project metadata, scripts, and package dependencies
├── package-lock.json             # NPM lockfile
├── postcss.config.mjs            # PostCSS plugin config with @tailwindcss/postcss
├── public/                       # Static public assets
│   ├── avatar.png                # Profile avatar image
│   ├── file.svg                  # Next.js icon asset
│   ├── globe.svg                 # Next.js icon asset
│   ├── next.svg                  # Next.js logo
│   ├── vercel.svg                # Vercel logo
│   ├── window.svg                # Next.js icon asset
│   └── icons/                    # Custom tech icons
│       ├── apex.svg              # Salesforce Apex vector icon
│       └── sql.svg               # SQL database vector icon
├── README.md                     # Comprehensive project documentation
├── src/
│   ├── app/
│   │   ├── favicon.ico           # Site favicon binary
│   │   ├── globals.css           # 4,298-line design system, themes, keyframes, glassmorphism
│   │   ├── layout.tsx            # HTML root, Google Fonts, FontAwesome, GSAP scripts, metadata
│   │   └── page.tsx              # Main single-page interactive portfolio React component
│   └── lib/
│       ├── chatbot.js            # 448-line offline chatbot engine with 58 FAQ keyword groups
│       └── script.js             # 2,368-line interaction orchestrator (canvas, stage, tilt, forms)
├── tsconfig.json                 # TypeScript compiler options (target ES2017, path alias @/*)
└── tsconfig.tsbuildinfo          # TypeScript incremental build cache
```

---

## 🛠 Tech Stack & Package Dependencies

Derived directly from `package.json`, `layout.tsx`, and `postcss.config.mjs`:

### Core Dependencies (`package.json`)
- **`next`**: `16.3.8` (App Router, Turbopack)
- **`react`**: `19.2.8`
- **`react-dom`**: `19.2.8`

### Dev Dependencies (`package.json`)
- **`tailwindcss`**: `^4`
- **`@tailwindcss/postcss`**: `^4`
- **`typescript`**: `^5`
- **`@types/node`**: `^20`
- **`@types/react`**: `^19`
- **`@types/react-dom`**: `^19`
- **`eslint`**: `^9`
- **`eslint-config-next`**: `16.3.8`

### External CDN Libraries (`src/app/layout.tsx`)
- **GSAP**: `3.12.5` (`https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js`, `strategy="beforeInteractive"`)
- **GSAP ScrollToPlugin**: `3.12.5` (`https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollToPlugin.min.js`, `strategy="beforeInteractive"`)
- **FontAwesome**: `6.4.0` (`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`)
- **Google Fonts**: `Poppins` (300, 400, 600, 700), `Fira Code` (400, 600), `Bebas Neue`, `Caveat` (600, 700)
- **SkillIcons**: CDN icon images loaded in `#skills` from `https://skillicons.dev/icons?i=...`

---

## 🔍 Codebase Architecture & File Analysis

### `src/app/layout.tsx`
The root layout component wrapping the entire application:
- **Metadata**: Sets `title: "Sreehari V | Portfolio"` and `description: "Portfolio of Sreehari V"`.
- **Favicon**: Dynamically loaded from `https://ui-avatars.com/api/?name=S&background=111111&color=E84545&rounded=true&bold=true&size=256&font-size=0.7`.
- **Font Optimization**: Uses `<link rel="preconnect">` for Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`).
- **Body Attributes**: Renders `<body className="rope-powered" data-theme="dark" suppressHydrationWarning>` to prevent hydration mismatches during theme initialization.
- **External Scripts**: Injects GSAP and ScrollToPlugin with `strategy="beforeInteractive"` to guarantee animation hooks are present prior to script execution.

---

### `src/app/page.tsx`
Client Component (`'use client'`) rendering the complete single-page application and binding the interaction engines in `useEffect`:

```typescript
useEffect(() => {
  setupChatbot();
  initInteractions();
}, []);
```

#### DOM Elements & Section Layout:
1. **Custom Mouse Cursor Elements**:
   - `<div className="cursor-dot"></div>` (instant coordinates tracker).
   - `<div className="cursor-outline"></div>` (lerp-interpolated outline follower).
2. **Background Canvas**:
   - `<canvas id="canvas-bg"></canvas>` (rendered by HTML5 2D particle simulation).
3. **Scroll Indicator**:
   - `<div className="scroll-progress"></div>` (top horizontal progress bar).
4. **Cinematic Hero Stage (`#cinStage`)**:
   - CRT Visual Overlays: `#cinFlicker`, `#cinScanlines`, `#cinJitter`, `.cin-vignette`.
   - Rope Zone (`#ropeZone`): Hidden via inline style (`display: 'none'`); contains `#rope`, `#pullHint` ("PULL DOWN"), `#orHint`, and `#ropeClick`.
   - Name & Navigation (`#cinName`): "SREEHARI V".
     - Page 1 (`.cin-page-1`): External profile links (Resume, GitHub, LinkedIn, Mail).
     - Page 2 (`.cin-page-2`): Dynamic typewriter (`#cinType`) and intra-page anchor navigation (`#about`, `#skills`, `#experience`, `#projects`, `#achievements`, `#timeline`, `#contact`).
   - Call to Action: `<button id="cinCta">CLICK HERE</button>` (powers stage and scrolls to content).
   - Theme & Accent Switcher (`#accentPicker`):
     - Stage theme toggle button (`#theme-toggle-stage`, icon toggles moon/sun).
     - 5 Color dots (`#E84545` Red, `#wb-dot` White/Black adaptive, `#4D7CFF` Blue, `#9B6BFF` Purple, `#D6B35A` Gold).
5. **Fixed Navigation Bar (`.site-nav`)**:
   - Logo: `Sreehari V` linked to `#top`.
   - Mobile Toggle: `#menu-btn` (hamburger menu icon).
   - Drawer (`#nav-links`): Contains links to all 7 sections plus `#theme-toggle-nav` and `#menu-close-btn`.
   - Backdrop: `#menu-backdrop`.
6. **About Section (`#about`)**:
   - Bio: Focuses on Computer Science undergraduate background, full-stack systems, clean code, and EduNex.
   - Stat Cards: `15+ Projects`, `1 Internship`, `4+ Certificates`.
   - Profile Picture: Loaded from `https://github.com/sree-hari-v.png` (dimensions: 320x388, `loading="lazy"`).
7. **Tech Arsenal Section (`#skills`)**:
   - 6-tier structured pyramid grid with 21 skill items.
8. **Experience Section (`#experience`)**:
   - Interactive list (`#experience-list`) with 3 tilt cards: Lab Technician Intern, Computing Fundamentals textbook, Essentials of Java textbook.
   - Dynamic detail container (`#experience-details`) rendered via `window.selectExperience(index, event)`.
9. **Projects Section (`#projects`)**:
   - Interactive list (`#project-list`) with 3 cards: EduNex, Project Hub, Grievance Portal.
   - Dynamic detail container (`#project-details`) rendered via `window.selectProject(index, event)`.
10. **Achievements Section (`#achievements`)**:
    - Achievement deck (`#achievement-deck`) with 4 cards: Tech Team Head, Innovative Excellence Award, Academic Track (7.1 CGPA), Peer Teaching & Seminars.
11. **Timeline Section (`#timeline`)**:
    - Progress track: `#timelineProgress` with `.timeline-line-glow-head`.
    - 5 milestone cards alternating slide-right and slide-left.
12. **Contact Section (`#contact`)**:
    - Social cards: LinkedIn, GitHub, Resume, Send Message (triggers modal), Send Mail (`mailto:`).
13. **Contact Modal (`#contactModalBackdrop`)**:
    - Modal form (`#portfolio-form`) with hidden Web3Forms access key, honeypot (`botcheck`), fields for name, email, phone, message, and `#form-status`.
14. **Visitor Notification Toast (`#visitorToast`)**:
    - Collapsed button (`#visitorToastCollapsed`): "👋 Say Hi!".
    - Expanded form (`#visitorToastForm`): Takes visitor name and optional message; captures device telemetry.
    - Success state: `#visitorToastSuccess`.
15. **Offline Chatbot Assistant (`#chatWidget`)**:
    - Dynamic Side Prompt: `#chatFabSidePrompt` ("✨ Ask about my tech stack! ⚡").
    - FAB: `#chatFab` button at bottom right.
    - Header: `#chatBrand`, `#chatAvatar`, `#chatBotName`, `#chatBotSub`, `#chatMaximize`, `#chatClose`.
    - Body: `#chatBody`.
    - Suggestion Chips (`#chatChips`): Projects, Skills, Resume, Contact.
    - Input: Form `#chatForm` with text input `#chatText` and submit button `#chatSend`.

---

### `src/lib/script.js`
The primary interaction and graphics controller (2,368 lines). It executes strictly on the client inside `initInteractions()`:

#### Subsystems Breakdown:
1. **Device Detection**:
   - Evaluates `window.matchMedia("(pointer: coarse)")` and `window.matchMedia("(hover: none)")` to detect touch environments.
   - Sets `isDesktop = hasFinePointer && !isTouchDevice`, enabling custom cursor and 3D card tilt only on precision pointer devices.
2. **Theme Manager (`applyTheme`, `toggleTheme`, `syncThemeIcon`)**:
   - Checks `localStorage.getItem('theme')` or falls back to `window.matchMedia('(prefers-color-scheme: light)')`.
   - Modifies `body[data-theme]` between `'dark'` and `'light'`.
   - Adapts the `#wb-dot` color picker between `#FFFFFF` (White) and `#000000` (Black).
3. **Accent Picker (`setAccent`)**:
   - Default accent: `#E84545` (`232 69 69`).
   - Sets CSS custom properties `--primary` and `--glow-rgb` on both `document.documentElement` and `document.body`.
   - Toggles `.is-active` class on the active palette dot.
4. **Cinematic Hero Stage Controller**:
   - Manages state variable `powered`.
   - `powerOn()`: Removes `.hint`, adds `.rope-powered`, triggers CRT glitch timeline (`glitch()`), unlocks scroll, and scales stage with GSAP (`ease: "power3.out"`).
   - `powerOff()`: Resets visuals (`hardResetStageVisuals()`), resets accent to red, locks scroll, and scrolls to top.
   - `updateStageByScroll()`: Smoothly fades stage opacity and scales down between 35% and 68% viewport scroll height, adding `.stage-hidden` when scrolled past 95% threshold.
5. **Dynamic Role Typewriter (`tick`)**:
   - Cycles through 4 roles: `["Software Developer", "Full Stack Developer", "Web Developer", "Open Source Enthusiast"]`.
   - Typing speed: 70ms per character; deletion speed: 38ms per character; pause at full word: 1,400ms.
6. **Desktop Custom Cursor (`initDesktopCursor`)**:
   - `.cursor-dot`: Instant coordinate update on `mousemove` via `translate3d`.
   - `.cursor-outline`: Rendered in `requestAnimationFrame` lerp loop with factor `0.18` (`outlineX += dx * 0.18`).
   - Sleep optimization: Idles `hasMoved = false` when delta `< 0.1px`.
   - Hover detection: Toggles `.cursor-hover` on hover over links, buttons, and cards.
7. **Mobile Menu Drawer**:
   - Toggles `.nav-open` on `body` when clicking `#menu-btn` or `#menu-close-btn`.
   - Automatically closes menu when clicking any nav anchor link or `#menu-backdrop`.
8. **Intersection Observers & Scroll Tracking**:
   - `.reveal` elements: Triggers `.active` class with threshold `0.08` and negative bottom margin `-30px`.
   - Navigation sync: Highlights active nav anchor based on which `<section>` crosses 40% viewport height.
   - Navigation density: Toggles `.nav-compact` on `body` when scroll position `> 120px`.
9. **3D Tilt Layer**:
   - Attached to all `.tilt-card` and `.skill-item` elements on desktop.
   - Calculates relative pointer percentages (`px`, `py`) to apply dynamic CSS variables:
     - `--tilt-x`: `(px - 0.5) * 8deg`
     - `--tilt-y`: `(0.5 - py) * 8deg`
     - `--mx`: `${px * 100}%`, `--my`: `${py * 100}%`
   - Resets to `0deg`, `0deg`, `50%`, `50%` on `mouseleave`.
10. **Interactive Project Expanders (`window.selectProject`, `window.closeProjectDetails`)**:
    - Pulls data from internal `projects` array.
    - Populates `#project-details` with title, description, challenge, solution, feature list, impact, tech tags, and links.
    - Triggers shockwave animation (`.card-shockwave`) and GSAP entrance (`back.out(1.8)`).
11. **Experience Expanders (`window.selectExperience`, `window.closeExperienceDetails`)**:
    - Pulls data from internal `experiences` array.
    - Populates `#experience-details` with role, date, company, description, bullet highlights, and tag pills.
12. **Achievement Deck (`window.selectAchievement`, `window.closeAchievementDetails`)**:
    - Pulls data from internal `achievements` array.
    - Injects category badges, organization, period, descriptions, and highlights into `#achievement-details`.
13. **HTML5 Canvas Particle Constellation (`#canvas-bg`)**:
    - Responsive particle count:
      - Mobile: `Math.min(22, Math.floor((width * height) / 36000))`
      - Desktop: `Math.min(52, Math.floor((width * height) / 22000))`
    - Frame throttling: Mobile capped to 30 FPS (`const mobileFPS = 30`).
    - Distance-based connections: Evaluates distance squared against `maxDistance` (95px on mobile, 120px on desktop).
    - Performance optimization: Groups particle lines into 10 opacity buckets to batch `stroke()` calls by alpha level rather than drawing individual strokes per connection.
14. **Scroll Progress Bar**:
    - Measures `scrollTop / (scrollHeight - clientHeight) * 100` and sets width of `.scroll-progress`.
15. **Offline Chatbot Controller**:
    - Storage key: `chat_user_name_v1` in `sessionStorage`.
    - `openChat(skipInitialGreet)`: Opens `#chatWidget`, sets `aria-hidden="false"`, adds `body.chat-open` and `body.show-floating-widgets`, focuses text input.
    - `closeChat(e)`: Removes `.is-open`, `.is-fullscreen`, sets `aria-hidden="true"`, removes `body.chat-open`.
    - `toggleChat(e)`: 300ms debounced toggle between `closeChat()` and `openChat()`.
    - `toggleFullScreen(forceState)`: Toggles `.is-fullscreen` on `#chatWidget`, swapping expand/compress icons.
    - `sendUserText(text)`: Adds user message bubble, queries `window.ChatbotAnswers.getBestAnswerSegments()`, updates name if extracted, and appends bot response bubble.
    - ESC key listener: Closes fullscreen or closes chat widget.
    - Outside pointer listener: Closes widget when clicking outside on desktop/mobile.
    - Scroll isolation: Prevents page background scrolling when scrolling inside `#chatWidget` via wheel and touch event containment.
16. **Floating Widgets Visibility & Side Prompt Bubble**:
    - `canShowFloatingWidgets()`: Returns true when `powered || rope-powered || home-header || stage-hidden || chat-open || y > 20`.
    - Rotates 9 pre-defined prompt queries every 12 seconds; displays after 8 seconds of inactivity; auto-hides after 7 seconds.
17. **Contact Modal & Web3Forms Handler**:
    - Submits `#portfolio-form` data asynchronously to `https://api.web3forms.com/submit`.
    - Shows loading state ("Sending..."), success message, or error status.
18. **Visitor Notification Toast Controller**:
    - Triggers toast after 3 seconds when scrolled to `#about`.
    - Captures telemetry (`visitorName`, `message`, `formattedDate`, `formattedTime`, `currentPage`, `referrer`, `device`, `browser`, `os`, `screenRes`) and sends to Web3Forms API.

---

### `src/lib/chatbot.js`
The self-contained offline natural language matching engine (448 lines). It requires no external API keys, tokens, or network requests:

- **Global Exposure**: Sets `window.ChatbotAnswers` via `setupChatbot()` and auto-initializes if `window !== 'undefined'`.
- **`LINKS` Directory**:
  ```javascript
  const LINKS = {
    resume: "https://drive.google.com/file/d/1o1KKzYHzRdbiPagUZu1ik9rLi5ewDoie/view?usp=drive_link",
    github: "https://github.com/sree-hari-v",
    linkedin: "https://www.linkedin.com/in/sreehari-v-a15084321/",
    email: "mailto:sreehari.vengalil@gmail.com",
    edunex_live: "https://edunex-bot.vercel.app/",
    edunex_git: "https://github.com/sree-hari-v/Edunex",
    hub_live: "https://cs-tech-hub.vercel.app/",
    hub_git: "https://github.com/sree-hari-v/cs-tech-hub",
    grievance_live: "https://cs-dept-grievance-portal.vercel.app/",
    grievance_git: "https://github.com/sree-hari-v/department-grievance-portal"
  };
  ```
- **`FAQ` Dataset**: Exactly **58 keyword groups** covering:
  1. Identity & Greetings (`hi`, `hello`, `who are you`, `goals`, `thank you`, `bye`)
  2. Contact & Links (`resume`, `github`, `linkedin`, `email`)
  3. Skills & Technologies (`skills`, `frontend`, `backend`, `database`, `python`, `react`, `nextjs`, `typescript`, `sql`, `aws`, `docker`, `git`, `tailwind`, `salesforce/apex`)
  4. Projects General (`projects`, `best projects`)
  5. Project EduNex (`edunex`, `ai chatbot`, `features of edunex`)
  6. Project Project Hub (`project hub`, `cs tech hub`)
  7. Project Grievance Portal (`grievance`, `department portal`)
  8. Experience & Internships (`experience`, `internship`, `lab technician`)
  9. Publications & Books (`books`, `publications`, `c book`, `java book`, `isbn`)
  10. Achievements, Awards & Honors (`achievements`, `tech team head`, `innovative excellence`, `cgpa`)
  11. Education & Timeline (`education`, `college`, `nilgiri`, `timeline`, `journey`)
  12. Chatbot Meta & Easter Eggs (`what can you do`, `are you ai`, `secret`)
- **Name Parser (`parseSetName(msg)`)**:
  - Uses regex `/(?:my name is|i am|i'm|call me|this is) ([a-z]+)/i` to capture and capitalize user names.
- **NLP Query Scorer (`getBestAnswerSegments(userMsg, context)`)**:
  - Normalizes user string, preserving characters like `+`, `#`, `-`, `.` for languages (`c++`, `c#`, `.net`).
  - Escapes special characters and creates word boundary regex (`\b<keyword>\b`) to prevent false positive substring collisions.
  - Weights matching scores: `(kw.split(' ').length * 10) + kw.length` so exact multi-word phrases score higher.
  - Fallback: If no keyword matches, returns an out-of-topic notice and embeds an inline direct contact form (`type: "contact_form"`).

---

### `src/app/globals.css`
A 4,298-line stylesheet incorporating CSS custom properties, responsive breakpoints, and keyframe animations:

- **CSS Variables & Color Tokens**:
  - **Dark Mode (`:root`)**:
    - `--bg-color: #050505;`
    - `--card-bg: #121212;`
    - `--primary: #E84545;`
    - `--text-white: #ffffff;`
    - `--text-gray: #a1a1a1;`
    - `--nav-bg: rgba(5, 5, 5, 0.85);`
    - `--border-color: rgba(255, 255, 255, 0.08);`
    - `--shadow: 0 10px 30px rgba(0, 0, 0, 0.5);`
    - `--glow-rgb: 232 69 69;`
    - `--glass-bg: rgba(255, 255, 255, 0.03);`
    - `--glass-border: rgba(255, 255, 255, 0.10);`
    - `--glass-hover: rgba(255, 255, 255, 0.06);`
    - `--text-muted: rgba(255, 255, 255, 0.55);`
  - **Light Mode (`[data-theme="light"]`)**:
    - `--bg-color: #f5f7fa;`
    - `--card-bg: #ffffff;`
    - `--primary: #111111;`
    - `--text-white: #1a1a1a;`
    - `--text-gray: #555555;`
    - `--nav-bg: rgba(245, 247, 250, 0.9);`
    - `--border-color: rgba(0, 0, 0, 0.06);`
    - `--shadow: 0 10px 30px rgba(0, 0, 0, 0.08);`
    - `--glow-rgb: 17 17 17;`
    - `--glass-bg: rgba(0, 0, 0, 0.03);`
    - `--glass-border: rgba(0, 0, 0, 0.10);`
    - `--glass-hover: rgba(0, 0, 0, 0.06);`
    - `--text-muted: rgba(0, 0, 0, 0.55);`
- **Keyframe Animations**:
  - `cinScanlines`: Infinite scanline sweep across hero stage.
  - `cinFlicker`: Opacity flicker simulating CRT startup.
  - `cinJitter`: Subtle 1px screen twitching during glitches.
  - `cardShockwave`: Expansion shockwave ring on active expander cards.
  - `timelineProgressGlow`: Pulsing glow bead tracking scroll progress.
- **Responsive Media Queries**:
  - `@media (max-width: 1024px)`: Swaps desktop navigation to mobile drawer, adjusts stage padding.
  - `@media (max-width: 768px)`: Re-sizes chat widget (`width: calc(100vw - 28px)`), disables custom cursor, drops particle count, reformats pyramid grid.
  - `@media (max-width: 480px)`: Adjusts contact deck and modal sizing for compact screens.

---

### Configuration Files

- **`next.config.ts`**: Standard Next.js configuration object exporting `nextConfig: NextConfig`.
- **`postcss.config.mjs`**: Configures `@tailwindcss/postcss` plugin for Tailwind CSS v4.
- **`eslint.config.mjs`**: ESLint flat config combining `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`. Explicitly overrides rule `@next/next/no-img-element: "off"` to allow standard `<img>` tags.
- **`tsconfig.json`**: TypeScript compiler targets `ES2017`, `moduleResolution: "bundler"`, `paths: { "@/*": ["./src/*"] }`.

---

## 📊 Portfolio Data from Code

All items listed below are extracted strictly from the source code.

### 1. Tech Arsenal Pyramid (21 Technologies)
Found in `src/app/page.tsx` (`#skills`):

| Tier | Category | Technologies Included |
| :--- | :--- | :--- |
| **Tier 1** (Peak) | Frontend Framework | Next.js |
| **Tier 2** | Core Frontend | React.js, TypeScript |
| **Tier 3** | Web Foundation & Runtime | JavaScript, Tailwind CSS, Node.js |
| **Tier 4** | Backend & Systems | Python, Django, Java, Apex |
| **Tier 5** | Data Layer & Services | SQL, PostgreSQL, MongoDB, Redis, Firebase |
| **Tier 6** (Base) | DevOps & Infrastructure | AWS, Docker, Kubernetes, Linux, Git, GitHub Actions |

---

### 2. Featured Projects (3 Projects)
Defined in `projects` array in `src/lib/script.js` and rendered in `src/app/page.tsx`:

#### 1. EduNex
- **Description**: An interactive, AI-driven college chatbot built to automate routine campus inquiries and provide instant access to college information.
- **Challenge**: Handling repetitive campus inquiries manually is time-consuming, and students often face delays getting simple answers about college locations, facilities, and schedules.
- **Solution**: Developed an intelligent conversational interface using Next.js and Supabase that understands natural queries to instantly provide accurate, college-specific answers.
- **Features**: Natural Language Querying, Instant Location & Info Retrieval, 24/7 Automated Assistance.
- **Impact**: Significantly reduced repetitive administrative inquiries and provided a seamless, instant way for users to navigate college resources.
- **Tech Stack**: Next.js, Supabase, React.js, Tailwind CSS.
- **Live Link**: `https://edunex-bot.vercel.app/`
- **GitHub**: `https://github.com/sree-hari-v/Edunex`

#### 2. Project Hub
- **Description**: A centralized dashboard to showcase development projects.
- **Challenge**: Personal projects were difficult to navigate and lack a professional, unified showcase experience.
- **Solution**: Developed a responsive dashboard with categorized projects, smooth animations, and direct access to source code.
- **Features**: Interactive Filtering, 3D Tilt Animations, Responsive Grid Layout.
- **Impact**: Increased portfolio engagement and provided a single source of truth for all development work.
- **Tech Stack**: HTML5, CSS3, JavaScript, Intersection Observer API.
- **Live Link**: `https://cs-tech-hub.vercel.app/`
- **GitHub**: `https://github.com/sree-hari-v/cs-tech-hub`

#### 3. Grievance Portal
- **Description**: A secure platform for students to raise concerns and get timely resolutions.
- **Challenge**: Manual grievance reporting in departments is often slow, opaque, and hard to track for students.
- **Solution**: Built a transparent system for real-time reporting and status tracking, enhancing accountability and resolution speed.
- **Features**: Anonymous Reporting, Status Tracking Timeline, Admin Dashboard.
- **Impact**: Streamlined the grievance redressal process, reducing resolution time from weeks to days.
- **Tech Stack**: Next.js, Tailwind CSS, Firebase, TypeScript.
- **Live Link**: `https://cs-dept-grievance-portal.vercel.app/`
- **GitHub**: `https://github.com/sree-hari-v/department-grievance-portal`

---

### 3. Professional Experience & Publications (3 Entries)
Defined in `experiences` array in `src/lib/script.js`:

#### 1. Lab Technician Intern
- **Date**: Jun 2025 - Nov 2025
- **Company**: Nilgiri College of Arts and Science
- **Role**: Lab Technician Intern
- **Description**: Assisted in managing computer lab infrastructure, troubleshooting hardware and software issues, and providing technical support to students and faculty, ensuring smooth daily operations.
- **Highlights**:
  - Troubleshot hardware/software issues and reduced downtime.
  - Supported students and faculty with lab systems and tools.
  - Helped maintain daily operations and ensured smooth lab usage.
- **Tags**: `IT Support`, `Troubleshooting`, `Lab Operations`

#### 2. Computing Fundamentals and C Programming (Textbook)
- **Date**: Published Jan 2025
- **Company**: Publication
- **Role**: Co-Author
- **ISBN**: `978-93-344-4926-6`
- **Description**: Co-authored a comprehensive guide on C programming, covering core concepts, memory management, and practical examples aimed at helping college students build strong foundational knowledge.
- **Highlights**:
  - Structured content for college-level fundamentals.
  - Covered memory management and practical patterns.
  - Included examples and exercises for learning-by-doing.
- **Tags**: `C`, `Technical Writing`, `Publishing`

#### 3. Essentials Of Java (Textbook)
- **Date**: Published Jan 2025
- **Company**: Publication
- **Role**: Co-Author
- **ISBN**: `978-93-344-4677-7`
- **Description**: Collaborated on a detailed textbook exploring Object-Oriented Programming principles in Java, including data structures, multithreading, and real-world application design.
- **Highlights**:
  - Explained OOP concepts with clear examples.
  - Included DS + multithreading fundamentals.
  - Focused on real-world application design patterns.
- **Tags**: `Java`, `OOP`, `Technical Writing`

---

### 4. Key Achievements (4 Honors)
Defined in `achievements` array in `src/lib/script.js`:

1. **Department Tech Team Head**
   - **Category**: Leadership
   - **Organization**: Department of Computer Science (2024 - 2025)
   - **Tags**: `Leadership`, `Event Organization`, `Tech Infrastructure`, `Mentorship`
2. **Innovative Excellence Award**
   - **Category**: Award & Honor
   - **Organization**: Department of Computer Science (Conferred 2025)
   - **Tags**: `Innovation`, `Full-Stack Development`, `Problem Solving`, `Department Honor`
3. **Academic Performance — 7.1 CGPA**
   - **Category**: Academics
   - **Organization**: B.Sc. Computer Science (2023 - Present)
   - **Tags**: `7.1 CGPA`, `Data Structures`, `Algorithms`, `Academic Excellence`
4. **Peer Teaching & Seminars**
   - **Category**: Mentorship
   - **Organization**: Student Community & Juniors (Ongoing)
   - **Tags**: `Peer Teaching`, `Workshops`, `Public Speaking`, `Community Mentorship`

---

### 5. Journey Timeline (5 Milestones)
Extracted from `src/app/page.tsx` (`#timeline`):

- **2021 - 2023**: *High School Education* — Completed Higher Secondary under Tamil Nadu State Board with a focus on Mathematics and Computer Science.
- **2023 - 2026**: *College Journey Begins* — Started B.Sc. Computer Science at Nilgiri College of Arts and Science.
- **Mid 2024**: *Language & Tech Mastery* — Mastered modern JavaScript, React.js, Node.js, and Supabase.
- **Late 2025**: *Major Projects Launch* — Architected and deployed "EduNex" (AI Chatbot) and department-level applications.
- **2025 - Present**: *Internships & Publications* — Stepped into the professional world through software internships and published technical textbooks.

---

### 6. Dynamic Roles in Typewriter
Defined in `src/lib/script.js`:
```javascript
["Software Developer", "Full Stack Developer", "Web Developer", "Open Source Enthusiast"]
```

---

### 7. Chatbot Side Prompts (9 Questions)
Defined in `src/lib/script.js` (`PROMPTS`):

1. `"Ask about my tech stack! ⚡"` -> `"What is your tech stack and skills?"`
2. `"Ask about my projects! 🚀"` -> `"Tell me about your projects"`
3. `"Want to know about EduNex? 🤖"` -> `"Tell me about EduNex"`
4. `"Need my resume? Just ask! 📄"` -> `"Can I get your resume link?"`
5. `"Ask about my publications & research! 📚"` -> `"Tell me about your published books and publications"`
6. `"Ask about my experience & internships! 💼"` -> `"What is your work experience and internships?"`
7. `"Have questions about my code? Ask here! 💻"` -> `"Where can I view your GitHub and code?"`
8. `"Looking to collaborate? Let's chat! ✨"` -> `"Are you open to hire or collaborate?"`
9. `"Any doubts? Ask here! 💬"` -> `"Who are you and what do you do?"`

---

## 📬 Forms & Web3Forms Integration

The codebase implements 3 distinct form submission channels, all submitting via `POST` to `https://api.web3forms.com/submit`:

1. **Contact Modal Form (`#portfolio-form`)**:
   - Fields: `name`, `email`, `phone` (optional), `message`.
   - Hidden: `access_key` (bound to `NEXT_PUBLIC_WEB3FORMS_KEY`), `botcheck` honeypot.
2. **Visitor Notification Toast (`#visitorToastForm`)**:
   - Collects: `visitor_name`, optional `message`.
   - Automatically enriches submission with client-side telemetry:
     - `Formatted Date & Time` (e.g., 29 October 2026, 08:30 PM)
     - `Current Page`: `window.location.pathname + window.location.hash`
     - `Referrer`: parsed source (`LinkedIn`, `GitHub`, `Google`, `Twitter/X`, `Instagram`, or domain)
     - `Device Type`: Mobile, Tablet, Desktop
     - `Browser`: Chrome, Safari, Firefox, Edge, Opera, Other
     - `Operating System`: Windows, macOS, iOS, Android, Linux, Unknown
     - `Screen Resolution`: e.g., `1920x1080`
3. **Chatbot Inline Contact Card (`.chat-inline-form`)**:
   - Injected directly into the chat log when a user submits an inquiry outside the FAQ scope.
   - Allows users to enter their name, email, and message without closing the chatbot widget.

---

## 🔑 Environment Variables

The project requires a single environment variable:

```env
# .env.local
NEXT_PUBLIC_WEB3FORMS_KEY=your_web3forms_access_key_here
```

A template file [`.env.example`](file:///.env.example) is committed to the repository for reference.

---

## 💻 Running Locally & Scripts

### Prerequisites
- Node.js (v18.18.0 or higher; Node.js 20+ recommended)
- npm (or compatible package manager)

### Installation & Execution
```bash
# Install dependencies
npm install

# Start local Next.js development server
npm run dev

# Create optimized production build
npm run build

# Start production server locally
npm run start

# Run ESLint validation
npm run lint
```
