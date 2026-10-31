/**
 * chatbot-answers.js
 * Comprehensive Offline Chatbot Engine for Sreehari V's Portfolio
 * Includes 100+ fine-grained intents, robust symbol-aware NLP scoring,
 * name parsing, and rich text/link responses covering all possible inquiries.
 */

export function setupChatbot() {
  if (typeof window === 'undefined') return;
  window.ChatbotAnswers = (function () {

    // Link directory mapped from index.html & README
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
      grievance_git: "https://github.com/sree-hari-v/department-grievance-portal",
      music_player_git: "https://github.com/sree-hari-v/music-player",
      music_player_release: "https://github.com/sree-hari-v/music-player/releases/tag/v1.0.0"
    };

    // The comprehensive, all-inclusive FAQ dataset
    const FAQ = [
      // ==========================================
      // 1. IDENTITY, GREETINGS & SMALL TALK
      // ==========================================
      {
        keywords: ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening", "howdy", "wassup", "what is up", "hola", "namaste", "yo", "sup", "hi there", "hey there"],
        answer: `Hello! 👋 I am Sreehari V's offline AI assistant. I have complete knowledge about his projects, technical skills, textbooks, internship experience, and achievements.\n\nHow can I help you today? You can ask about his tech stack, featured projects, or ask for his resume!`
      },
      {
        keywords: ["how are you", "how do you do", "how have you been", "how is it going", "how are things", "are you fine"],
        answer: `I'm running at 100% efficiency and ready to assist! ⚡ How can I help you explore Sreehari's software engineering journey today?`
      },
      {
        keywords: ["who are you", "what are you", "about you", "introduce yourself", "tell me about yourself", "who is sreehari", "about sreehari", "profile", "summary", "background", "who is this", "tell me about sreehari"],
        answer: `I am Sreehari V, a Computer Science Undergraduate and Full-Stack Developer passionate about building scalable web applications and robust software systems.\n\nI specialize in Next.js, React.js, TypeScript, Node.js, Python, and cloud architectures. I have completed 15+ projects, published 2 technical programming textbooks (C & Java), and served as the Department Technical Team Head.`
      },
      {
        keywords: ["what do you do", "what is your role", "profession", "job title", "current role", "what are you doing", "designation", "what are you"],
        answer: `I am a Computer Science Undergraduate and Full-Stack Developer. I architect secure data platforms, build high-performance responsive frontend interfaces, design structured backend APIs, and co-author computer science textbooks.`
      },
      {
        keywords: ["goals", "future goals", "career goal", "objective", "aim", "what do you want to be", "career vision", "ambition"],
        answer: `My career goal is to become a top-tier software engineer building high-impact, distributed systems and digital platforms that solve real-world problems. I am committed to clean code, robust software architecture, continuous learning, and open-source contribution.`
      },
      {
        keywords: ["strengths", "what are your strengths", "strong points", "superpowers", "why hire you", "why should we hire you", "value proposition"],
        answer: `My key strengths include:\n1. 🚀 Full-Lifecycle Ownership: From system architecture and database design to frontend polish and CI/CD deployment.\n2. 📚 Deep Computer Science Fundamentals: Data structures, OOP, multithreading, and memory management (evidenced by co-authoring 2 textbooks).\n3. 💡 High Initiative & Leadership: Department Technical Team Head and recipient of the Innovative Excellence Award.\n4. ⚡ Fast Learner & Adaptable: Rapidly master and integrate modern stacks like Next.js 16, TypeScript, Supabase, and Tailwind v4.`
      },
      {
        keywords: ["weaknesses", "what are your weaknesses", "areas of improvement", "what can you improve"],
        answer: `I tend to be a perfectionist when it comes to clean architecture and UI micro-interactions, which can tempt me to spend extra hours refining small details. To balance this, I practice strict agile prioritization, iterative MVP releases, and time-boxing.`
      },
      {
        keywords: ["coding philosophy", "philosophy", "development approach", "how do you write code", "clean code", "work style"],
        answer: `My engineering philosophy revolves around three core tenets:\n1. Maintainability: Write code for humans first and machines second—clear naming, modular functions, and robust typing.\n2. Performance & Security: Optimize early where it matters (caching, asset budgets, secure auth) without premature over-engineering.\n3. User-Centric Design: Software must feel fast, intuitive, and delightful to interact with.`
      },
      {
        keywords: ["hobbies", "interests", "free time", "what do you do for fun", "outside coding", "personal life", "passions"],
        answer: `Outside of building web apps and coding, I enjoy:\n• Technical Writing & Authoring: Breaking down complex programming concepts into beginner-friendly books.\n• Peer Mentoring: Hosting seminars and coding bootcamps for college juniors.\n• Exploring emerging tech: Experimenting with new web frameworks, AI tools, and developer utilities.\n• Reading tech blogs and open-source architectures.`
      },
      {
        keywords: ["location", "where are you from", "where do you live", "where are you located", "city", "state", "country", "nilgiris", "tamil nadu", "india", "based in"],
        answer: `I am currently based in Tamil Nadu, India, pursuing my B.Sc. in Computer Science at Nilgiri College of Arts and Science. I am fully equipped and open for remote roles worldwide as well as on-site opportunities.`
      },
      {
        keywords: ["languages spoken", "spoken languages", "mother tongue", "what languages do you speak", "english", "tamil", "malayalam", "hindi"],
        answer: `I communicate fluently in English (both written and spoken for professional and technical communication), as well as regional Indian languages including Tamil and Malayalam.`
      },
      {
        keywords: ["thank you", "thanks", "appreciate it", "cool", "awesome", "nice", "great", "good job", "well done", "kudos"],
        answer: `You're very welcome! Feel free to ask anything else about Sreehari's projects, technical skills, or request his Resume!`
      },
      {
        keywords: ["bye", "goodbye", "see you", "cya", "exit", "take care", "good night", "later", "farewell"],
        answer: `Goodbye! Thanks for stopping by Sreehari's portfolio. Don't hesitate to reach out via Email or LinkedIn if you want to connect!`
      },
      {
        keywords: ["call me", "my name is", "i am", "i'm", "this is", "my name"],
        answer: `Pleased to meet you! Thanks for introducing yourself. I'm here to answer any questions about Sreehari's projects, experience, skills, and publications. What would you like to explore?`
      },

      // ==========================================
      // 2. CONTACT, RESUME & SOCIAL CHANNELS
      // ==========================================
      {
        keywords: ["resume", "cv", "download resume", "resume link", "get resume", "curriculum vitae", "portfolio pdf", "view resume", "resume pdf"],
        answer: [
          { type: "text", text: "You can view and download Sreehari's official resume right here: " },
          { type: "newline" },
          { type: "newline" },
          { type: "link", href: LINKS.resume, label: "📄 View Sreehari's Resume (Google Drive PDF)" }
        ]
      },
      {
        keywords: ["github", "git hub", "github profile", "source code", "repositories", "code", "repos", "open source", "git link"],
        answer: [
          { type: "text", text: "Sreehari open-sources his major projects and codebases. Check out his GitHub profile: " },
          { type: "newline" },
          { type: "newline" },
          { type: "link", href: LINKS.github, label: "💻 Sreehari's GitHub (github.com/sree-hari-v)" }
        ]
      },
      {
        keywords: ["linkedin", "linked in", "linkedin profile", "professional profile", "connect on linkedin", "linkedin url"],
        answer: [
          { type: "text", text: "Let's connect professionally on LinkedIn! Here is Sreehari's profile link: " },
          { type: "newline" },
          { type: "newline" },
          { type: "link", href: LINKS.linkedin, label: "🔗 Sreehari's LinkedIn Profile" }
        ]
      },
      {
        keywords: ["email", "mail", "contact email", "gmail", "email address", "send email", "reach out", "contact", "send mail", "contact form", "send a message", "write email", "message sreehari"],
        answer: [
          { type: "text", text: "You can reach Sreehari directly via email or connect on his socials:\n" },
          { type: "link", href: LINKS.linkedin, label: "🔗 LinkedIn" },
          { type: "text", text: " • " },
          { type: "link", href: LINKS.github, label: "💻 GitHub" },
          { type: "text", text: " • " },
          { type: "link", href: LINKS.email, label: "✉️ sreehari.vengalil@gmail.com" },
          { type: "newline" },
          { type: "newline" },
          { type: "text", text: "Or use the direct contact & social buttons and message form below:" },
          { type: "contact_form", userQuery: "" }
        ]
      },
      {
        keywords: ["phone", "call", "mobile number", "whatsapp", "telephone", "contact number"],
        answer: [
          { type: "text", text: "For privacy, Sreehari's direct phone number is provided upon request or on his resume. The quickest way to connect is via email or LinkedIn: " },
          { type: "newline" },
          { type: "link", href: LINKS.email, label: "✉️ Send an Email" },
          { type: "text", text: " | " },
          { type: "link", href: LINKS.linkedin, label: "🔗 LinkedIn" },
          { type: "text", text: " | " },
          { type: "link", href: LINKS.resume, label: "📄 Check Resume" }
        ]
      },
      {
        keywords: ["social media", "socials", "find online", "twitter", "x", "instagram", "social", "network", "profiles", "social links", "social accounts"],
        answer: [
          { type: "text", text: "Here are Sreehari's official social and professional profiles:\n" },
          { type: "link", href: LINKS.linkedin, label: "🔗 LinkedIn (in/sreehari-v-a15084321)" },
          { type: "newline" },
          { type: "link", href: LINKS.github, label: "💻 GitHub (github.com/sree-hari-v)" },
          { type: "newline" },
          { type: "link", href: LINKS.resume, label: "📄 Resume / CV" },
          { type: "newline" },
          { type: "link", href: LINKS.email, label: "✉️ Direct Email (sreehari.vengalil@gmail.com)" },
          { type: "newline" },
          { type: "newline" },
          { type: "text", text: "Or connect directly using the shortcut buttons and message form below:" },
          { type: "contact_form", userQuery: "Social Connect Inquiry" }
        ]
      },

      // ==========================================
      // 3. HIRING, FREELANCE, COLLABORATION & SERVICES
      // ==========================================
      {
        keywords: ["hire", "hiring", "job opportunity", "open to work", "recruit", "recruiting", "full time", "part time", "employment", "join our team"],
        answer: [
          { type: "text", text: "Yes! Sreehari is actively open to Software Engineering and Full-Stack Developer roles (full-time, internships, or graduate opportunities). You can reach him directly at: " },
          { type: "newline" },
          { type: "link", href: LINKS.email, label: "sreehari.vengalil@gmail.com" },
          { type: "text", text: " | " },
          { type: "link", href: LINKS.linkedin, label: "Connect on LinkedIn" },
          { type: "newline" },
          { type: "newline" },
          { type: "text", text: "Or send a direct inquiry here:" },
          { type: "contact_form", userQuery: "Hiring Inquiry" }
        ]
      },
      {
        keywords: ["freelance", "freelancer", "contract", "client work", "build my website", "services", "web development service", "can you build"],
        answer: [
          { type: "text", text: "Yes, Sreehari takes on select freelance and contract projects including custom web application development, responsive frontend engineering (Next.js/React), backend API development, and database architecture. Reach out with your requirements:" },
          { type: "newline" },
          { type: "contact_form", userQuery: "Freelance / Project Inquiry" }
        ]
      },
      {
        keywords: ["availability", "when can you start", "notice period", "immediate joiner", "start date"],
        answer: `Sreehari is currently in the final year of his B.Sc. Computer Science (graduating 2026). He is immediately available for remote internships, part-time contract roles, and is preparing for full-time graduate software engineering positions.`
      },
      {
        keywords: ["remote", "remote work", "work from home", "hybrid", "relocation", "relocate", "willing to relocate"],
        answer: `Yes! Sreehari is 100% comfortable with remote collaboration across global timezones and is also open to relocating for full-time opportunities at leading tech hubs in India and abroad.`
      },
      {
        keywords: ["pricing", "rates", "hourly rate", "how much do you charge", "cost", "quote", "project cost", "budget"],
        answer: [
          { type: "text", text: "Project pricing depends on the scope, timeline, and technical complexity (frontend-only vs. full-stack with database & auth). Send Sreehari a brief summary of what you need, and he'll provide an estimated quote:" },
          { type: "newline" },
          { type: "contact_form", userQuery: "Project Quote Inquiry" }
        ]
      },

      // ==========================================
      // 4. TECH ARSENAL & SKILLS OVERVIEW
      // ==========================================
      {
        keywords: ["skills", "technical skills", "tech stack", "technologies", "what do you know", "expertise", "what can you do", "stack", "technical toolkit", "arsenal"],
        answer: `Sreehari's 6-Tier Tech Arsenal includes 21 core technologies:
• Tier 1 (Peak): Next.js
• Tier 2 (Core Frontend): React.js, TypeScript
• Tier 3 (Web Foundation & Runtime): JavaScript, Tailwind CSS, Node.js
• Tier 4 (Backend & Systems): Python, Django, Java, Apex
• Tier 5 (Data Layer & Services): SQL, PostgreSQL, MongoDB, Redis, Firebase
• Tier 6 (DevOps & Infrastructure): AWS, Docker, Kubernetes, Linux, Git, GitHub Actions

Ask me about any specific technology for more details!`
      },
      {
        keywords: ["frontend", "front end", "ui development", "ui", "user interface", "client side", "web design"],
        answer: `Frontend Stack:
• Frameworks: Next.js 16 (App Router, SSR, SSG), React.js 19
• Languages: TypeScript, Modern JavaScript (ES6+)
• Styling: Tailwind CSS (v4), Vanilla CSS3, Glassmorphism, Responsive UI
• Animation & Interactivity: GSAP 3.12, HTML5 Canvas 2D, 3D card tilt physics`
      },
      {
        keywords: ["backend", "server side", "api development", "server", "back end", "apis", "rest api", "backend stack"],
        answer: `Backend Stack:
• Runtimes & Frameworks: Node.js, Express, Python, Django, Java
• Enterprise Systems: Salesforce Apex
• Architecture: RESTful API design, MVC/MTV patterns, authentication middleware, error handling, microservices concepts`
      },
      {
        keywords: ["database", "databases", "db", "sql", "nosql", "data storage", "schema design", "relational database"],
        answer: `Database Stack:
• Relational (SQL): PostgreSQL, MySQL/SQL (ACID compliance, complex joins, indexing, normalization)
• NoSQL: MongoDB (document store, JSON-like schemas)
• In-Memory / Caching: Redis (session management, sub-millisecond retrieval)
• BaaS / Cloud DBs: Supabase (PostgreSQL with real-time subscriptions), Firebase (Firestore, Realtime DB)`
      },
      {
        keywords: ["cloud", "devops", "infrastructure", "deployment", "ci cd", "hosting", "containerization"],
        answer: `Cloud & DevOps Stack:
• Cloud Providers: AWS (EC2, S3), Vercel (Edge deployment)
• Containers & Orchestration: Docker (Dockerfiles, multi-stage builds), Kubernetes (K8s pods, deployments)
• CI/CD & Automation: GitHub Actions (automated testing, build pipelines)
• Systems: Linux (Ubuntu, bash shell scripting, server administration), Git version control`
      },
      {
        keywords: ["tools", "development tools", "software you use", "ide", "ides", "code editor", "vscode", "postman"],
        answer: `Daily Development Tools:
• Editors & IDEs: Visual Studio Code, WebStorm, PyCharm, Android Studio
• API Testing: Postman, curl
• Version Control: Git, GitHub CLI
• Deployment Platforms: Vercel, Supabase, Firebase
• Design & Prototyping: Figma, browser DevTools`
      },

      // ==========================================
      // 5. SPECIFIC PROGRAMMING LANGUAGES & FRAMEWORKS
      // ==========================================
      {
        keywords: ["next.js", "nextjs", "next js", "app router", "ssr", "server side rendering"],
        answer: `Next.js is Sreehari's primary framework (placed at the Peak of his Tech Arsenal). He leverages Next.js App Router, Server Components, SSR/SSG, and API routes to build fast, SEO-optimized web applications. Both this portfolio and his major projects (EduNex and Grievance Portal) are built on Next.js.`
      },
      {
        keywords: ["react", "react.js", "reactjs", "react 19", "hooks", "components"],
        answer: `React.js is at the core of Sreehari's frontend development. He has deep mastery over functional components, custom hooks, context state management, lifecycle effects, and modern React 19 paradigms for building responsive, declarative user interfaces.`
      },
      {
        keywords: ["typescript", "ts", "static typing", "type safety"],
        answer: `TypeScript is an essential part of Sreehari's workflow. He uses strict typing, custom interfaces, generics, and utility types to eliminate runtime bugs and ensure maintainable, self-documenting codebases across frontend and backend.`
      },
      {
        keywords: ["javascript", "js", "modern js", "vanilla js", "es6"],
        answer: `JavaScript is the heartbeat of Sreehari's web engineering. He has mastered modern ES6+ features (async/await, promises, closures, destructuring, modules, DOM manipulation) and native browser APIs (Intersection Observer, Canvas 2D, Web Storage).`
      },
      {
        keywords: ["tailwind", "tailwindcss", "tailwind v4", "css", "styling"],
        answer: `Tailwind CSS is Sreehari's go-to styling framework. He has mastered responsive utility design, custom color themes, glassmorphism, and arbitrary values. This portfolio and his web apps use Tailwind CSS paired with custom CSS keyframe animations.`
      },
      {
        keywords: ["node.js", "nodejs", "node", "express", "npm"],
        answer: `Node.js is Sreehari's standard server-side JavaScript runtime. He uses Node.js and Express to architect RESTful APIs, manage NPM packages, handle asynchronous file I/O, and build backend microservices.`
      },
      {
        keywords: ["python", "python 3", "django", "python programming"],
        answer: `Python is one of Sreehari's primary backend and scripting languages. He uses Python for backend web services with Django, automation scripts, data manipulation, and algorithmic problem solving.`
      },
      {
        keywords: ["java", "core java", "oop in java", "java programming", "object oriented programming", "multithreading"],
        answer: `Java is a foundational strength for Sreehari. He possesses deep expertise in Object-Oriented Programming (OOP), inheritance, polymorphism, multithreading, and collections. In fact, Sreehari co-authored a published college textbook titled 'Essentials Of Java' in Jan 2025 (ISBN: 978-93-344-4677-7).`
      },
      {
        keywords: ["c++", "cpp", "c plus plus"],
        answer: `Sreehari has a solid foundation in C++, practicing Object-Oriented principles, STL data structures, standard algorithms, and efficient memory management.`
      },
      {
        keywords: ["c", "c programming", "c language", "c fundamentals", "memory management", "pointers"],
        answer: `Sreehari has mastered low-level C programming, manual memory management (malloc/free), pointers, and data structures. He co-authored a published academic textbook titled 'Computing Fundamentals and C Programming' in Jan 2025 (ISBN: 978-93-344-4926-6).`
      },
      {
        keywords: ["salesforce", "apex", "crm", "sales force", "salesforce apex"],
        answer: `Sreehari understands enterprise CRM architectures and has studied Salesforce development, including Apex object-oriented programming for custom business logic, triggers, and cloud data integrations.`
      },
      {
        keywords: ["sql", "postgresql", "postgres", "relational db", "mysql"],
        answer: `Sreehari possesses strong SQL expertise across PostgreSQL and relational databases. He designs normalized schemas, writes complex multi-table JOINs, manages foreign keys and indexes, and guarantees ACID transaction safety.`
      },
      {
        keywords: ["mongodb", "mongo", "nosql", "document db"],
        answer: `MongoDB is part of Sreehari's NoSQL database toolkit. He uses MongoDB for flexible, document-based data storage, complex aggregation pipelines, and rapid application prototyping.`
      },
      {
        keywords: ["redis", "caching", "in memory", "cache"],
        answer: `Redis is used by Sreehari for high-performance in-memory caching, session storage, and rate-limiting to significantly reduce database load and achieve sub-millisecond data delivery.`
      },
      {
        keywords: ["firebase", "firestore", "realtime database", "firebase auth"],
        answer: `Sreehari uses Firebase (Firestore, Realtime Database, Firebase Authentication) for real-time cloud data sync and secure user identity management, as implemented in his Grievance Portal project.`
      },
      {
        keywords: ["supabase", "supabase db", "supabase auth", "baas"],
        answer: `Supabase is Sreehari's preferred open-source backend-as-a-service. He utilized Supabase PostgreSQL, row-level security (RLS), and database storage to power his AI college chatbot, EduNex.`
      },
      {
        keywords: ["aws", "amazon web services", "ec2", "s3", "cloud hosting"],
        answer: `Sreehari works with Amazon Web Services (AWS), utilizing EC2 for cloud compute instances, S3 for secure cloud asset storage, and foundational cloud networking and security groups.`
      },
      {
        keywords: ["docker", "dockerfile", "containers", "containerization"],
        answer: `Sreehari uses Docker to containerize full-stack applications, writing clean Dockerfiles and docker-compose configurations to eliminate environment inconsistencies between development and production.`
      },
      {
        keywords: ["kubernetes", "k8s", "orchestration"],
        answer: `Kubernetes is part of Sreehari's DevOps toolkit for container orchestration, understanding pod lifecycles, service deployments, scaling, and cluster management.`
      },
      {
        keywords: ["linux", "ubuntu", "bash", "shell", "terminal", "unix"],
        answer: `Sreehari operates comfortably in Linux environments (Ubuntu, Debian), writing bash scripts, managing file permissions, automating tasks, and configuring web servers via the terminal.`
      },
      {
        keywords: ["git", "github actions", "version control", "ci cd automation"],
        answer: `Git is Sreehari's standard version control tool. He practices clean commit conventions, branch management, and pull requests. He configures GitHub Actions workflows for continuous integration and automated deployments.`
      },
      {
        keywords: ["dsa", "data structures", "algorithms", "problem solving", "time complexity"],
        answer: `Sreehari has a strong grounding in Data Structures and Algorithms (DSA), covering arrays, linked lists, stacks, queues, trees, graphs, sorting, searching, and Big-O computational complexity.`
      },
      {
        keywords: ["rest api", "api design", "graphql", "endpoints", "postman testing"],
        answer: `Sreehari designs clean, RESTful APIs with semantic HTTP status codes, structured JSON payloads, robust authentication headers, and comprehensive testing via Postman.`
      },

      // ==========================================
      // 6. ALL FEATURED PROJECTS (DETAILED)
      // ==========================================
      {
        keywords: ["projects", "portfolio projects", "show projects", "work", "applications built", "things you built", "featured projects", "what have you made", "creations", "showcase", "list projects"],
        answer: `Sreehari has built 15+ projects. His top featured applications are:

1. 🤖 EduNex: An interactive AI-driven college chatbot automating routine campus inquiries 24/7.
2. 🎵 Music Player: A sleek offline Android music player with synced lyrics & Spotify-grade visuals.
3. 🚀 Project Hub: A centralized developer dashboard featuring category filtering & 3D tilt physics.
4. 🛡️ Grievance Portal: A secure, transparent student complaint redressal platform with live status tracking.

Reply with any project name to get in-depth details, tech stack, and links!`
      },
      {
        keywords: ["edunex", "college chatbot", "ai chatbot", "campus chatbot", "student chatbot", "tell me about edunex"],
        answer: `EduNex is an intelligent, AI-powered college chatbot designed to automate routine campus inquiries and assist students around the clock.

• Challenge: Students faced delays getting answers to basic campus inquiries regarding classroom locations, administrative procedures, and facility schedules.
• Solution: Built an interactive conversational interface that parses natural language questions to deliver instant, accurate campus information.
• Tech Stack: Next.js, Supabase, React.js, Tailwind CSS.
• Live Demo: https://edunex-bot.vercel.app/`
      },
      {
        keywords: ["edunex tech stack", "how did you build edunex", "what powers edunex", "edunex technologies"],
        answer: `EduNex was built using:
• Next.js for server-side rendering, routing, and fast load times.
• React.js for the dynamic, component-based chat UI.
• Supabase for secure cloud PostgreSQL storage, data management, and query indexing.
• Tailwind CSS for responsive, mobile-first styling.`
      },
      {
        keywords: ["edunex link", "edunex live", "edunex github", "show me edunex", "edunex demo", "try edunex"],
        answer: [
          { type: "text", text: "Explore EduNex through these links:" },
          { type: "newline" },
          { type: "newline" },
          { type: "link", href: LINKS.edunex_live, label: "🚀 EduNex Live Application" },
          { type: "newline" },
          { type: "link", href: LINKS.edunex_git, label: "💻 EduNex GitHub Repository" }
        ]
      },
      {
        keywords: ["project hub", "cs tech hub", "project dashboard", "tell me about project hub"],
        answer: `Project Hub is a centralized dashboard built to showcase software development projects in a clean, professional interface.

• Challenge: Personal projects were scattered across different repos and lacked a unified, interactive showcase.
• Solution: Developed a responsive dashboard with real-time category filtering, responsive grid layouts, and interactive 3D card tilt physics.
• Tech Stack: HTML5, CSS3, Modern JavaScript (ES6+), Intersection Observer API.
• Live Demo: https://cs-tech-hub.vercel.app/`
      },
      {
        keywords: ["project hub tech stack", "how did you build project hub", "project hub technologies"],
        answer: `Project Hub was built natively with zero heavy framework overhead:
• HTML5 & CSS3 for modern layout and custom glassmorphism.
• Vanilla JavaScript (ES6+) for category filtering logic.
• Intersection Observer API for scroll animations and viewport-triggered transitions.`
      },
      {
        keywords: ["project hub link", "project hub live", "project hub github", "show me project hub"],
        answer: [
          { type: "text", text: "Explore Project Hub here:" },
          { type: "newline" },
          { type: "newline" },
          { type: "link", href: LINKS.hub_live, label: "🚀 Project Hub Live Demo" },
          { type: "newline" },
          { type: "link", href: LINKS.hub_git, label: "💻 Project Hub GitHub Repository" }
        ]
      },
      {
        keywords: ["grievance portal", "complaint system", "student grievance", "department grievance", "tell me about the grievance portal", "grievance"],
        answer: `The Grievance Portal is a secure, department-level platform where students can voice concerns anonymously and receive transparent, timely resolutions.

• Challenge: Manual grievance reporting was slow, paper-based, opaque, and difficult for students to track.
• Solution: Architected a transparent digital platform with anonymous reporting, a visual progress tracking timeline, and a faculty administrative dashboard.
• Impact: Slashed grievance redressal time from weeks to days.
• Tech Stack: Next.js, Tailwind CSS, Firebase, TypeScript.
• Live Demo: https://cs-dept-grievance-portal.vercel.app/`
      },
      {
        keywords: ["grievance tech stack", "grievance technologies", "how did you build grievance"],
        answer: `The Grievance Portal was architected with:
• Next.js & TypeScript for full-stack type safety and server-side performance.
• Tailwind CSS for a modern, responsive user and admin dashboard.
• Firebase (Firestore & Authentication) for real-time status updates and secure data persistence.`
      },
      {
        keywords: ["grievance link", "grievance live", "grievance github", "show me grievance portal"],
        answer: [
          { type: "text", text: "Check out the Grievance Portal:" },
          { type: "newline" },
          { type: "newline" },
          { type: "link", href: LINKS.grievance_live, label: "🚀 Grievance Portal Live Demo" },
          { type: "newline" },
          { type: "link", href: LINKS.grievance_git, label: "💻 Grievance Portal GitHub Repository" }
        ]
      },
      {
        keywords: ["music player", "android music player", "flutter music player", "offline music player", "tell me about music player", "shadow player", "shadowplayer"],
        answer: `Music Player is a sleek, modern offline music player for Android built with Flutter, inspired by Spotify's design language.

• Features: High-fidelity offline playback with just_audio, real-time synchronized & plain karaoke lyrics with LRCLIB API, in-app lyrics translation into English subtitles, Spotify-inspired Canvas visualizer with gesture controls, and modern Android Storage Access Framework (SAF) integration.
• Architecture: Clean, feature-driven architecture with Riverpod 2.x state management.
• Scoped Storage: Modern SAF integration for selecting custom folders without broad storage permissions.
• GitHub Repository: https://github.com/sree-hari-v/music-player`
      },
      {
        keywords: ["music player tech stack", "how did you build music player", "what powers music player", "music player technologies", "shadow player tech stack"],
        answer: `Music Player was built using:
• Flutter & Dart: Cross-platform framework powering a smooth dark aesthetic UI.
• Riverpod 2.x (flutter_riverpod): Robust reactive state management.
• just_audio: Low-latency, high-fidelity offline audio playback engine with background playback and native MediaSession controls.
• Android Storage Access Framework (SAF): Modern scoped storage access for custom music folder authorization.
• audio_metadata_reader: ID3 metadata extraction (sample rate, bitrate, album art, duration).
• LRCLIB API: Real-time karaoke synchronized lyrics with multi-level offline disk caching.`
      },
      {
        keywords: ["music player link", "music player github", "show me music player", "download music player", "music player apk", "shadow player link", "shadow player github", "music player live", "music player release"],
        answer: [
          { type: "text", text: "Explore Music Player and download the latest release:" },
          { type: "newline" },
          { type: "newline" },
          { type: "link", href: LINKS.music_player_release, label: "🚀 Music Player v1.0.0 APK Release" },
          { type: "newline" },
          { type: "link", href: LINKS.music_player_git, label: "💻 Music Player GitHub Repository" }
        ]
      },
      {
        keywords: ["mobile app", "android app", "flutter", "flutter project", "mobile project", "android project", "have you built mobile apps"],
        answer: [
          { type: "text", text: "Yes! Sreehari built Music Player, a high-fidelity offline music player for Android engineered with Flutter and Dart. It features Spotify-inspired Canvas visuals, synchronized karaoke lyrics (LRCLIB), and modern Android SAF scoped storage.\n\nCheck out the release or repository:" },
          { type: "newline" },
          { type: "newline" },
          { type: "link", href: LINKS.music_player_release, label: "🚀 Download Music Player APK (v1.0.0)" },
          { type: "newline" },
          { type: "link", href: LINKS.music_player_git, label: "🎵 Music Player on GitHub" }
        ]
      },
      {
        keywords: ["favorite project", "best project", "proudest project", "top project"],
        answer: `Sreehari is proudest of EduNex and the Grievance Portal because both projects solved real-world friction within the college community—delivering tangible impact, automating manual overhead, and serving active students every day.`
      },
      {
        keywords: ["how many projects", "total projects", "project count", "15+ projects"],
        answer: `Sreehari has completed 15+ projects spanning full-stack web applications, campus utilities, developer tools, algorithms, and interactive frontends.`
      },

      // ==========================================
      // 7. PROFESSIONAL EXPERIENCE & INTERNSHIPS
      // ==========================================
      {
        keywords: ["experience", "work experience", "jobs", "employment", "where have you worked", "professional experience", "career history"],
        answer: `Sreehari's professional experience encompasses:

1. 💼 Lab Technician Intern at Nilgiri College of Arts and Science (Jun 2025 - Nov 2025)
   • Managed computer lab infrastructure, troubleshot hardware/software, and supported daily technical operations.
2. ✍️ Technical Co-Author of 2 published programming textbooks (C Programming & Java OOP).
3. 👑 Department Technical Team Head (2024 - 2025), leading student developer teams and tech events.`
      },
      {
        keywords: ["internship", "intern", "lab technician", "lab tech", "what did you do as an intern", "nilgiri intern", "technician internship"],
        answer: `During his Lab Technician Internship at Nilgiri College of Arts and Science (Jun 2025 - Nov 2025), Sreehari:
• Maintained and troubleshot hardware and software configurations across multi-terminal computer labs.
• Provided direct technical support to faculty and students during laboratory practical sessions.
• Diagnosed network and OS issues to ensure zero downtime during exams and daily classes.`
      },

      // ==========================================
      // 8. ACADEMIC TEXTBOOKS & PUBLICATIONS
      // ==========================================
      {
        keywords: ["books", "publications", "published books", "author", "co-author", "written anything", "writing", "textbooks", "isbn"],
        answer: `Sreehari is the published Co-Author of two comprehensive computer science textbooks published in January 2025:

1. 📘 'Computing Fundamentals and C Programming' (ISBN: 978-93-344-4926-6)
   • Covers fundamental computing architecture, core C syntax, pointer manipulation, and memory management.
2. ☕ 'Essentials Of Java' (ISBN: 978-93-344-4677-7)
   • Explores Object-Oriented Programming (OOP) in Java, data structures, multithreading, and application architecture.`
      },
      {
        keywords: ["c programming book", "computing fundamentals", "c book", "computing fundamentals and c programming"],
        answer: `The textbook 'Computing Fundamentals and C Programming' was published in Jan 2025 with ISBN 978-93-344-4926-6. Co-authored by Sreehari, it provides an in-depth, example-driven curriculum for college students to master C programming, pointers, and memory mechanics.`
      },
      {
        keywords: ["java book", "essentials of java", "java textbook", "java publication"],
        answer: `The textbook 'Essentials Of Java' was published in Jan 2025 with ISBN 978-93-344-4677-7. Co-authored by Sreehari, it focuses on real-world Object-Oriented Programming (OOP), abstraction, polymorphism, data structures, and multithreaded application design.`
      },
      {
        keywords: ["why write books", "book motivation", "how did you publish"],
        answer: `Sreehari co-authored these textbooks to bridge the gap between abstract academic theory and practical software engineering—providing structured, beginner-friendly explanations with real code examples for college peers.`
      },

      // ==========================================
      // 9. LEADERSHIP, AWARDS & ACHIEVEMENTS
      // ==========================================
      {
        keywords: ["achievements", "achievement", "awards", "award", "honors", "recognition", "what have you achieved", "accomplishments", "key achievements"],
        answer: `Key Achievements & Recognitions:

1. 👑 Department Technical Team Head (2024 - 2025): Appointed to lead tech operations, manage student hackathons, and direct project teams.
2. 🏆 Innovative Excellence Award (2025): Conferred by the Department of Computer Science for impactful software solutions like EduNex and Grievance Portal.
3. 🎓 Academic Track Record: 7.1 CGPA in B.Sc. Computer Science while actively publishing textbooks and building production software.
4. 💡 Community Mentorship: Conducted hands-on seminars and coding bootcamps for juniors.`
      },
      {
        keywords: ["dept tech team head", "tech head", "department head", "technical head", "lead", "leadership", "tech team head", "student leader"],
        answer: `As the Department Technical Team Head (2024 - 2025), Sreehari was appointed to lead student technical initiatives, organize intra-college coding competitions and hackathons, and mentor student teams in web technologies.`
      },
      {
        keywords: ["innovative excellence", "innovative excellence award", "award from dept", "department award", "innovative award", "excellence award"],
        answer: `Sreehari was awarded the Innovative Excellence Award in 2025 by the Department of Computer Science in recognition of his technical problem-solving, innovative mindset, and deployment of impactful campus software platforms.`
      },
      {
        keywords: ["cgpa", "gpa", "marks", "grade", "grades", "academic score", "academic performance", "what is your cgpa", "7.1 cgpa"],
        answer: `Sreehari maintains a 7.1 CGPA in B.Sc. Computer Science, balancing rigorous academics with technical book publishing, internship work, and software development.`
      },
      {
        keywords: ["peer teaching", "teaching", "seminar", "seminars", "mentoring", "mentor", "peer mentor", "juniors", "workshops"],
        answer: `Sreehari is an active peer mentor, regularly organizing and leading workshops on C programming fundamentals, Java OOP, and modern full-stack web development for junior students.`
      },
      {
        keywords: ["certifications", "certificates", "certified", "licenses", "what certificates do you have"],
        answer: `Sreehari holds 4+ verified industry and technical certifications in software development, web frameworks, and programming fundamentals.`
      },
      {
        keywords: ["stats", "metrics", "numbers", "portfolio metrics"],
        answer: `Portfolio Highlights:
• 15+ Projects Completed
• 2 Technical Textbooks Published (ISBN registered)
• 1 Professional IT Internship
• 1 Department Leadership Role (Tech Team Head)
• 1 Innovation Award Conferred
• 4+ Technical Certifications
• 7.1 CGPA in B.Sc. Computer Science`
      },

      // ==========================================
      // 10. EDUCATION & JOURNEY TIMELINE
      // ==========================================
      {
        keywords: ["education", "degree", "college", "study", "university", "where do you study", "what are you studying", "bachelor", "b.sc", "bsc cs", "qualifications"],
        answer: `Sreehari is pursuing a B.Sc. in Computer Science at Nilgiri College of Arts and Science (2023 - 2026). His studies focus on Data Structures, Algorithms, Software Engineering, Database Management Systems, and Cloud Architectures.`
      },
      {
        keywords: ["high school", "school", "secondary education", "12th", "higher secondary", "where did you go to school"],
        answer: `Sreehari completed his Higher Secondary Education (12th grade) under the Tamil Nadu State Board (2021 - 2023) with a rigorous focus on Mathematics and Computer Science.`
      },
      {
        keywords: ["graduation", "when will you graduate", "year of passing", "pass out year", "graduation date", "2026"],
        answer: `Sreehari is on track to graduate with his B.Sc. in Computer Science in 2026.`
      },
      {
        keywords: ["timeline", "journey", "history", "how did you start", "career path", "milestones", "story"],
        answer: `Sreehari's Journey:
• 2021 - 2023: Higher Secondary School with a focus on Mathematics & Computer Science.
• 2023 - 2026: Began B.Sc. Computer Science at Nilgiri College of Arts and Science.
• Mid 2024: Mastered modern JS, React.js, Node.js, and Supabase.
• Late 2025: Architected and deployed EduNex and Grievance Portal.
• 2025 - Present: Completed Lab Technician internship, published 2 textbooks, and served as Tech Team Head.`
      },

      // ==========================================
      // 11. PORTFOLIO WEBSITE ARCHITECTURE
      // ==========================================
      {
        keywords: ["website stack", "how is this site built", "portfolio tech", "source of this website", "how does this website work", "web architecture"],
        answer: `This portfolio was custom built by Sreehari using:
• Next.js 16 (App Router) & React 19 for modern component architecture.
• TypeScript for static type checking across every component.
• Tailwind CSS v4 & Custom CSS3 for glassmorphism, responsive breakpoints, and keyframe animations.
• GSAP 3.12 for the cinematic stage transitions and smooth scroll choreography.
• HTML5 2D Canvas for the interactive particle constellation system.
• Client-side Offline NLP Engine (the chatbot you're talking to right now!).`
      },
      {
        keywords: ["particles", "canvas background", "particle system", "canvas-bg"],
        answer: `The particle constellation in the background is rendered directly on an HTML5 2D canvas with zero external heavy libraries. It dynamically calculates proximity lines between particles and throttles frames for optimal battery life on mobile devices.`
      },
      {
        keywords: ["dark mode", "light mode", "themes", "accent colors", "color picker"],
        answer: `The portfolio features a custom theme engine with both Dark and Light modes, plus a 5-color accent palette (Red, White/Black, Blue, Purple, Gold). It dynamically updates CSS custom properties (--primary and --glow-rgb) and preserves preference in localStorage.`
      },

      // ==========================================
      // 12. CHATBOT META, HUMOR & EASTER EGGS
      // ==========================================
      {
        keywords: ["are you human", "are you a bot", "are you ai", "who coded you", "how do you work", "what are you made of"],
        answer: `I am an offline algorithmic chatbot crafted natively in JavaScript by Sreehari! I use pattern matching, token scoring, and context memory entirely in your browser—without sending your questions to third-party AI APIs. I am fast, private, and 100% offline-capable!`
      },
      {
        keywords: ["you are smart", "good bot", "clever", "well built", "thank you bot", "nice bot"],
        answer: `Thank you! Sreehari built me with meticulous attention to detail so that visitors and recruiters can find answers instantly. Let me know what else you'd like to discover!`
      },
      {
        keywords: ["tell me a joke", "joke", "make me laugh", "programming joke", "funny"],
        answer: `Why do programmers prefer dark mode?
... Because light attracts bugs! 🐛😄

Ask me anything else about Sreehari's code, projects, or background!`
      },
      {
        keywords: ["secret", "easter egg", "tell me a secret", "hidden features", "cheat code"],
        answer: `🕵️ Psst... Here's an Easter egg! If you're on desktop, hover your mouse over the skill icons in the 'Tech Arsenal' section—they feature a custom interactive 3D physics tilt! Also, try switching accent colors using the top/stage color dots!`
      },
      {
        keywords: ["help", "what can i ask", "menu", "commands", "guide", "options", "topics", "what questions can i ask"],
        answer: `You can ask me anything about Sreehari! For example:
• 'What is your tech stack?'
• 'Tell me about EduNex or Grievance Portal'
• 'Can I get your resume link?'
• 'What books did you write?'
• 'What was your internship role?'
• 'Are you open for hire?'
• 'How do I contact Sreehari?'`
      }
    ];

    /**
     * Helper: Extract Name from common intro phrases.
     * e.g., "my name is John", "i am John", "call me John"
     */
    function parseSetName(msg) {
      const lower = msg.toLowerCase().trim();
      const match = lower.match(/(?:my name is|i am|i'm|call me|this is) ([a-z]+)/i);
      if (match && match[1]) {
        return match[1].charAt(0).toUpperCase() + match[1].slice(1);
      }
      return null;
    }

    /**
     * Helper: Create regex for keyword matching that respects symbols like +, #, .
     */
    function makeKeywordRegex(kw) {
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const prefix = /^\w/.test(kw) ? '\\b' : '(?:^|\\s)';
      const suffix = /\w$/.test(kw) ? '\\b' : '(?=$|\\s|[.,!?;:])';
      return new RegExp(prefix + escaped + suffix, 'i');
    }

    /**
     * NLP/Scoring Engine: Matches user message against FAQ dictionary.
     */
    function getBestAnswerSegments(userMsg, context = {}) {
      const lowerMsg = userMsg.toLowerCase().replace(/[^\w\s#+.-]/g, ' ').replace(/\s+/g, ' ').trim();

      if (!lowerMsg) return "Please type a question!";

      let bestMatch = null;
      let highestScore = 0;

      for (let i = 0; i < FAQ.length; i++) {
        const entry = FAQ[i];
        let score = 0;

        for (let j = 0; j < entry.keywords.length; j++) {
          const kw = entry.keywords[j].toLowerCase();
          const regex = makeKeywordRegex(kw);

          if (regex.test(lowerMsg)) {
            // Give higher weight to longer keyword phrases
            const wordCount = kw.split(/\s+/).length;
            score += (wordCount * 14) + kw.length;

            // Extra boost if user query exactly equals keyword
            if (lowerMsg === kw) {
              score += 35;
            }
          }
        }

        if (score > highestScore) {
          highestScore = score;
          bestMatch = entry;
        }
      }

      // Determine the response
      let response;
      if (bestMatch && highestScore > 0) {
        response = bestMatch.answer;
      } else {
        // Out of topic fallback response: contact Sreehari and send form for sending mail
        const prefix = context.userName ? `Sorry ${context.userName}, that question is out of my topic area!` : "That question is out of my topic area!";
        response = [
          {
            type: "text",
            text: `${prefix} I specialize in Sreehari's projects, technical skills, experience, and publications.\n\nPlease contact Sreehari directly, connect via his socials (LinkedIn, GitHub), or send a message using the card below:`
          },
          {
            type: "contact_form",
            userQuery: userMsg
          }
        ];
      }

      return response;
    }

    // Expose the API
    return {
      parseSetName,
      getBestAnswerSegments
    };

  })();
}

if (typeof window !== 'undefined') {
  setupChatbot();
}