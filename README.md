# Sreehari V — Personal Developer Portfolio

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.3.8-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3.12.5-88CE02?style=for-the-badge&logo=greensock&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

<p align="center">
  <strong>A high-performance, cinematic personal portfolio and interactive showcase built with Next.js App Router, React 19, TypeScript, and custom graphics engines.</strong>
</p>

[**Explore Live Demo**](https://sreehari-v.vercel.app/) • [**View GitHub Profile**](https://github.com/sree-hari-v) • [**Connect on LinkedIn**](https://www.linkedin.com/in/sreehari-v-a15084321/) • [**Download Resume**](https://drive.google.com/file/d/1o1KKzYHzRdbiPagUZu1ik9rLi5ewDoie/view?usp=drive_link)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [1. Cinematic Hero Stage & Rope-Pull Power Engine](#1-cinematic-hero-stage--rope-pull-power-engine)
  - [2. Dynamic Theme & Accent Color Matrix](#2-dynamic-theme--accent-color-matrix)
  - [3. Interactive Tech Arsenal Pyramid](#3-interactive-tech-arsenal-pyramid)
  - [4. Project & Experience Expanders (GSAP Powered)](#4-project--experience-expanders-gsap-powered)
  - [5. Interactive Journey Timeline](#5-interactive-journey-timeline)
  - [6. Offline Intelligent Chatbot Engine](#6-offline-intelligent-chatbot-engine)
  - [7. Visitor Telemetry & Notification Toast](#7-visitor-telemetry--notification-toast)
  - [8. Hardware-Accelerated Canvas Particle Constellation](#8-hardware-accelerated-canvas-particle-constellation)
- [Codebase Architecture & File Map](#-codebase-architecture--file-map)
- [In-Depth Code Breakdown](#-in-depth-code-breakdown)
  - [`src/app/page.tsx`](#srcapppagetsx)
  - [`src/lib/script.js`](#srclibscriptjs)
  - [`src/lib/chatbot.js`](#srclibchatbotjs)
  - [`src/app/globals.css`](#srcappglobalscss)
  - [`src/app/layout.tsx`](#srcapplayouttsx)
- [Technology Stack](#-technology-stack)
- [Environment Variables](#-environment-variables)
- [Getting Started & Local Development](#-getting-started--local-development)
- [Customization & Configuration Guide](#-customization--configuration-guide)
- [Deployment](#-deployment)
- [Author & Acknowledgements](#-author--acknowledgements)
- [License](#-license)

---

## 🌟 Overview

This project is the complete, production-ready developer portfolio for **Sreehari V** (Full-Stack Developer and Computer Science undergraduate). Migrated to **Next.js (App Router)** with **React 19**, **Tailwind CSS v4**, and **TypeScript**, it merges modern software architecture with rich retro-futuristic aesthetics, smooth physics-driven micro-interactions, an offline intelligent AI chatbot, and direct email dispatch capabilities.

### Visual & Interactive Identity
- **Cinematic Atmosphere**: CRT television scanlines, screen jitter, and neon glow effects.
- **Micro-Interactions**: Custom magnetic cursor, 3D card tilt physics, and smooth spring interpolation.
- **Zero-Latency Offline Chatbot**: Custom in-browser query matching engine with zero external NLP API dependencies.
- **Dynamic Visual System**: Adaptive dark/light themes paired with 5 switchable ambient accent colors.

---

## 🚀 Key Features

### 1. Cinematic Hero Stage & Rope-Pull Power Engine
- **Interactive Pull-Down Rope**: Features simulated physics with mouse/touch drag thresholds (`135px`), haptic feedback, and a fallback click button for accessibility.
- **Stage Power Sequencing**: Triggers CRT flicker, audio-visual glitches, and unlocks the full portfolio page.
- **Dual-Phase Hero Navigation**:
  - *Page 1*: Minimalist landing screen with prominent name and key social links.
  - *Page 2*: Dynamic role typewriter (`Full-Stack Developer`, `Software Architect`, `CS Undergrad`, etc.) and anchor navigation.

### 2. Dynamic Theme & Accent Color Matrix
- **Dark & Light Mode**: Automatic synchronization with OS preference (`prefers-color-scheme`) plus manual toggle with `localStorage` persistence.
- **5-Color Live Accent Picker**: Dynamically re-binds CSS variables (`--primary` and `--glow-rgb`) across all components and canvas shaders:
  - 🔴 **Crimson Red** (`#E84545`)
  - ⚪ / ⚫ **Adaptive White/Black** (`#FFFFFF` in Dark Mode / `#000000` in Light Mode)
  - 🔵 **Cobalt Blue** (`#4D7CFF`)
  - 🟣 **Electric Purple** (`#9B6BFF`)
  - 🟡 **Golden Amber** (`#D6B35A`)

### 3. Interactive Tech Arsenal Pyramid
A hierarchical 6-tier visual pyramid structuring technologies from cutting-edge front-end frameworks at the summit down to cloud infrastructure at the foundation:
- **Tier 1 (Peak)**: Next.js
- **Tier 2 (Core Frontend)**: React.js, TypeScript
- **Tier 3 (Web Foundations)**: JavaScript (ES6+), Tailwind CSS, Node.js
- **Tier 4 (Backend & Logic)**: Python, Django, Java, Salesforce Apex
- **Tier 5 (Data Layer & Services)**: SQL, PostgreSQL, MongoDB, Redis, Firebase
- **Tier 6 (DevOps & Infrastructure)**: AWS, Docker, Kubernetes, Linux, Git, GitHub Actions

### 4. Project & Experience Expanders (GSAP Powered)
- **Featured Projects**:
  - **EduNex**: AI-powered campus assistant bot built with Next.js and Supabase.
  - **Project Hub**: Centralized technical project showcase and resource directory.
  - **Grievance Portal**: Secure, auditable ticket submission and tracking platform.
- **Experience & Publications**:
  - **Lab Technician Intern**: Nilgiri College of Arts and Science (systems support, networking, lab maintenance).
  - **Co-Author**: *"Computing Fundamentals and C Programming"* (ISBN: 978-93-344-4926-6).
  - **Co-Author**: *"Essentials of Java"* (ISBN: 978-93-344-4677-7).
- **GSAP Detail Drawer**: Clicking any card smoothly expands a detail view showing problems, architectural solutions, feature highlights, impact metrics, and repository/live links without full page reloads.

### 5. Interactive Journey Timeline
- Dynamic vertical milestone path tracing education, mastery, deployments, internships, and textbook publications.
- Scroll-synchronized SVG progress line with a glowing head element calculated via viewport offsets.

### 6. Offline Intelligent Chatbot Engine
- Embedded self-contained AI assistant accessible via a floating action button (FAB) or side prompt bubbles.
- **80+ Pre-Mapped Intents**: Answers inquiries regarding projects, publications, education, resume links, tech stack details, and direct contact options.
- **Keyword Scoring & Boundary Matching**: Regex-based token boundaries prevent false positives (e.g., distinguishing `C` from `React`).
- **Rich Interactive UI**: Supports formatted text, live URL links, clickable topic chips, full-screen toggle, mobile swipe-to-dismiss, and embedded contact forms.

### 7. Visitor Telemetry & Notification Toast
- An expandable "Say Hi!" floating toast that prompts visitors to leave a message.
- Automatically captures non-intrusive client telemetry:
  - Device type (Mobile, Tablet, Desktop)
  - Browser name & operating system
  - Referrer origin & current page path
  - Screen resolution & local timestamp
- Directly transmitted to the portfolio owner using **Web3Forms**.

### 8. Hardware-Accelerated Canvas Particle Constellation
- High-performance HTML5 `<canvas>` background animation.
- Particles react in real-time to cursor coordinates with distance-based node connections.
- Optimized using **spatial grid bucketing** to maintain stable 60 FPS across both desktop and mobile screens.
- Color dynamically adapts to the selected accent palette and light/dark theme.

---

## 📂 Codebase Architecture & File Map

```text
portfolio/
├── .env.local                    # Environment configuration (Web3Forms API key)
├── .gitignore                    # Git ignore specifications
├── AGENTS.md                     # Agent & tooling rules
├── CLAUDE.md                     # Claude developer guidelines
├── eslint.config.mjs             # ESLint flat configuration (Next.js & core rules)
├── next.config.ts                # Next.js build & runtime configuration
├── package.json                  # Dependencies, scripts, and package metadata
├── postcss.config.mjs            # PostCSS configuration for Tailwind CSS v4
├── tsconfig.json                 # TypeScript compiler options & path aliases
├── public/                       # Static public assets
│   ├── avatar.png                # Developer profile avatar
│   ├── favicon.ico               # Site favicon
│   └── icons/                    # Custom tech SVG icons
│       ├── apex.svg              # Salesforce Apex icon
│       └── sql.svg               # SQL database icon
└── src/
    ├── app/
    │   ├── globals.css           # 99KB stylesheet: design tokens, themes, animations
    │   ├── layout.tsx            # Root HTML document, meta tags, Google Fonts, GSAP CDN
    │   └── page.tsx              # Main single-page interactive portfolio component
    ├── components/               # Modular components directory (ready for expansion)
    └── lib/
        ├── chatbot.js            # 80+ intent NLP query matcher & knowledge base
        └── script.js             # 2,300+ lines: physics, stage, canvas, GSAP, tilt, forms
```

---

## 🔍 In-Depth Code Breakdown

### `src/app/page.tsx`
The primary React Client Component (`'use client'`). It renders the semantic HTML5 layout and initializes vanilla interaction modules upon mount:
- **`useEffect` Lifecycle**: Invokes `setupChatbot()` from `@/lib/chatbot` and `initInteractions()` from `@/lib/script`.
- **Accessibility & Structure**:
  - `#cinStage`: Cinematic CRT overlay, scanlines, accent picker, and rope zone.
  - `.site-nav`: Fixed responsive navigation bar with mobile drawer toggle and theme switcher.
  - `#about`, `#skills`, `#experience`, `#projects`, `#achievements`, `#timeline`, `#contact`: Semantic portfolio sections.
  - `#contactModalBackdrop`: Modal form for direct email submission via Web3Forms.
  - `#visitorToast`: Interactive client toast for quick visitor greetings.
  - `#chatWidget`: Complete UI markup for the offline chatbot assistant.

### `src/lib/script.js`
The central interaction and animation engine (2,350+ lines) containing discrete subsystems:
1. **Device Detection**: Identifies fine pointer vs. touch environments (`pointer: coarse`, `hover: none`) to selectively enable mouse lag and 3D tilt.
2. **Theme Manager (`applyTheme`, `toggleTheme`)**: Reads `localStorage` or matches `prefers-color-scheme`. Toggles attributes on `document.body` and swaps icons.
3. **Accent Switcher (`setAccent`)**: Dynamically sets CSS custom properties (`--primary`, `--glow-rgb`) on `:root` and updates active UI color dots.
4. **Cinematic Hero Engine (`powerOn`, `powerOff`, `applyPull`, `settleRope`)**: Tracks rope drag distance (`pointermove`), toggles `.powered` states, CRT jitter, and manages scroll unlocking.
5. **Dynamic Typewriter (`tick`)**: Types and deletes roles sequentially in landing page 2.
6. **Desktop Lag Cursor (`initDesktopCursor`)**: Smoothly tracks mouse coordinates via `requestAnimationFrame` with interpolated dot and outline movements.
7. **Interactive Expanders (`selectProject`, `selectExperience`, `selectAchievement`)**: Injects rich contextual data into detail containers and runs GSAP opening animations.
8. **Particle Constellation Canvas (`animateParticles`)**: Spawns node particles, calculates proximity distances with spatial hashing, and connects nodes with dynamic alpha lines.
9. **Timeline Tracker (`updateTimeline`)**: Measures milestone offsets relative to the viewport and updates the height of `.timeline-line-progress`.
10. **Form Submissions**: Asynchronous `fetch` calls to `https://api.web3forms.com/submit` for both the main contact modal and the visitor toast, complete with client telemetry extraction.

### `src/lib/chatbot.js`
The client-side offline knowledge base and NLP matching module:
- **`LINKS` Dictionary**: Centralized map of all external references (Resume, GitHub, LinkedIn, Live Demos).
- **`FAQ` Dataset**: 80+ intent objects categorizing queries into:
  - Identity & Greetings
  - Contact & Social Profiles
  - Technical Stack & Pyramid tiers
  - Projects (EduNex, Project Hub, Grievance Portal)
  - Work Experience & Published Textbooks
  - Academic Background & Leadership
  - Fun & Personal Trivia
- **`getBestAnswerSegments(userMsg, context)`**:
  - Normalizes queries (strips extraneous punctuation while preserving technical tokens like `c++`, `c#`, `.net`).
  - Executes regex boundary matching (`\b<keyword>\b`) to prevent substring collisions.
  - Scores matches with keyword length and token counts.
  - Returns formatted structured message segments (plain text, link components, or embedded contact forms).

### `src/app/globals.css`
A comprehensive 99KB styling sheet built on standard CSS and Tailwind utilities:
- **Design System Variables**: Centralized design tokens for dark and light modes:
  ```css
  :root {
    --bg-color: #050505;
    --card-bg: #121212;
    --primary: #E84545;
    --text-white: #ffffff;
    --text-gray: #a1a1a1;
    --nav-bg: rgba(5, 5, 5, 0.85);
    --border-color: rgba(255, 255, 255, 0.08);
    --shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    --glow-rgb: 232 69 69;
  }
  ```
- **Custom Keyframe Animations**: CRT scanline sweeps, cursor pulses, rope wobbles, glitch shakes, timeline line glows, and modal fade-ins.
- **Glassmorphism Utilities**: Translucent background blurs (`backdrop-filter: blur(...)`) on navbar, modals, cards, and floating widgets.

### `src/app/layout.tsx`
Defines the root HTML structure and external assets:
- **Metadata**: Title (`Sreehari V | Portfolio`) and open-graph descriptions.
- **Google Fonts**: Asynchronously loads `Poppins`, `Fira Code`, `Bebas Neue`, and `Caveat`.
- **Icons**: FontAwesome 6.4.0 stylesheet.
- **Scripts**: External GSAP core and `ScrollToPlugin` via `next/script` with `strategy="beforeInteractive"`.

---

## 🛠 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) (v16.3.8, App Router) |
| **Library** | [React](https://react.dev/) (v19.2.8) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (v5.x), JavaScript (ES2022+) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) (v4.x), Vanilla CSS Custom Properties |
| **Motion & Physics** | [GSAP](https://gsap.com/) (v3.12.5), HTML5 Canvas 2D API |
| **Typography** | Google Fonts (*Poppins, Fira Code, Bebas Neue, Caveat*) |
| **Iconography** | FontAwesome 6, SkillIcons, Custom SVGs |
| **Email & Backend** | [Web3Forms](https://web3forms.com/) API |
| **Hosting & CI/CD** | [Vercel](https://vercel.com/) |

---

## 🔑 Environment Variables

The project uses [Web3Forms](https://web3forms.com/) for zero-backend form handling. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_WEB3FORMS_KEY=your_web3forms_access_key_here
```

> **Note:** The key is prefixed with `NEXT_PUBLIC_` so it is safely accessible on the client side when dispatching contact form messages and visitor telemetry.

---

## 💻 Getting Started & Local Development

### Prerequisites
- **Node.js**: v18.18.0 or newer (Node.js 20+ recommended)
- **Package Manager**: `npm`, `pnpm`, `yarn`, or `bun`

### 1. Clone the Repository
```bash
git clone https://github.com/sree-hari-v/portfolio.git
cd portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create `.env.local` and add your Web3Forms access key:
```bash
cp .env.example .env.local   # or create .env.local manually
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The page auto-updates as you make changes.

### 5. Other Available Scripts
- `npm run build`: Compiles and produces the optimized production build.
- `npm run start`: Runs the built production server locally.
- `npm run lint`: Runs ESLint to check for code quality and syntax issues.

---

## ⚙️ Customization & Configuration Guide

### Adding or Updating Projects
1. Open `src/lib/script.js` and locate the `projects` array (around line 710).
2. Add or edit an entry:
   ```javascript
   {
     title: "Your Project Name",
     description: "Short summary of the project.",
     challenge: "What problem were you solving?",
     solution: "How did you solve it architecturally?",
     features: ["Feature 1", "Feature 2", "Feature 3"],
     impact: "Measurable outcome or learning achieved.",
     techUsed: ["Next.js", "TypeScript", "Tailwind CSS"],
     liveLink: "https://your-demo.vercel.app/",
     githubLink: "https://github.com/your-username/repo"
   }
   ```
3. Update the matching card markup in `src/app/page.tsx` within `#projects` so it triggers `selectProject(index, event)`.

### Adding New Chatbot Q&A
1. Open `src/lib/chatbot.js`.
2. Locate the `FAQ` array and add an entry:
   ```javascript
   {
     keywords: ["docker", "container", "containerization"],
     answer: "I use Docker to containerize full-stack services for reproducible development and deployment."
   }
   ```

### Updating Work Experience & Publications
1. Locate the `experiences` array in `src/lib/script.js` (around line 830).
2. Modify or add entries with your role, company/publication name, ISBN, description, highlights, and tags.
3. Update the corresponding card triggers in `src/app/page.tsx` within `#experience`.

---

## 🚀 Deployment

The fastest way to deploy this Next.js project is via the [Vercel Platform](https://vercel.com/):

1. Push your repository to GitHub.
2. Import the repository into your Vercel Dashboard.
3. In the project settings, add the environment variable:
   - `NEXT_PUBLIC_WEB3FORMS_KEY` = `your_access_key`
4. Click **Deploy**. Vercel will automatically build and serve the application globally with edge caching.

---

## 👨‍💻 Author & Acknowledgements

**Sreehari V**
- **GitHub**: [@sree-hari-v](https://github.com/sree-hari-v)
- **LinkedIn**: [Sreehari V](https://www.linkedin.com/in/sreehari-v-a15084321/)
- **Email**: [sreehari.vengalil@gmail.com](mailto:sreehari.vengalil@gmail.com)
- **Portfolio**: [sreehari-v.vercel.app](https://sreehari-v.vercel.app/)

Special thanks to the open-source community for Next.js, React, GSAP, and Tailwind CSS.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to explore, learn from, and adapt it for your own personal projects!
