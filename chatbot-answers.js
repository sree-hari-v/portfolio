/**
 * chatbot-answers.js
 * Comprehensive Offline Chatbot Engine for Sreehari V's Portfolio
 * Includes 80+ mapped intents, smart scoring, name parsing, and rich text/link responses.
 */

window.ChatbotAnswers = (function () {
  
  // Link directory mapped from index.html
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

  // The comprehensive FAQ dataset
  const FAQ = [
    // ==========================================
    // 1. IDENTITY & GREETINGS
    // ==========================================
    {
      keywords: ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening", "howdy", "wassup", "what is up", "hola"],
      answer: `Hello! I'm the offline AI assistant for Sreehari V. I can tell you about his projects, skills, experience, or provide contact links. How can I help?`
    },
    {
      keywords: ["how are you", "how do you do", "how have you been"],
      answer: `I'm just a few lines of JavaScript, but I'm doing great! Ready to tell you all about Sreehari's software engineering journey. What would you like to know?`
    },
    {
      keywords: ["who are you", "what are you", "about you", "introduce yourself", "tell me about yourself", "who is sreehari", "about sreehari", "profile", "summary", "background", "who is this"],
      answer: `I am Sreehari V, a Computer Science Undergraduate and Full-Stack Developer passionate about building scalable web applications and robust software systems. I enjoy transforming complex problems into clean, efficient, and performance-driven solutions.`
    },
    {
      keywords: ["what do you do", "what is your role", "profession", "job title", "current role", "what are you doing"],
      answer: `I am a Computer Science Undergraduate and Full Stack Developer. I architect secure data platforms, develop responsive front-end interfaces, and build structured back-end services. I take ownership of the entire development lifecycle.`
    },
    {
      keywords: ["goals", "future goals", "career goal", "objective", "aim", "what do you want to be"],
      answer: `My goal is to become a highly skilled software engineer focused on building scalable, reliable, and impactful digital products, while continuously refining my skills in modern web technologies and secure architectures.`
    },
    {
      keywords: ["thank you", "thanks", "appreciate it", "cool", "awesome", "nice", "great"],
      answer: `You're very welcome! If you want to check out Sreehari's source code, ask for his GitHub, or ask for his Resume to see his full profile.`
    },
    {
      keywords: ["bye", "goodbye", "see you", "cya", "exit"],
      answer: `Goodbye! Feel free to reach out to Sreehari via email or LinkedIn if you want to connect!`
    },
    {
      keywords: ["call me", "my name is", "i am", "i'm", "this is", "my name"],
      answer: `Nice to meet you! Thanks for introducing yourself. I'm here to help you learn more about Sreehari's projects, skills, experience, and more. What would you like to know?`
    },

    // ==========================================
    // 2. CONTACT & LINKS
    // ==========================================
    {
      keywords: ["resume", "cv", "download resume", "resume link", "get resume", "curriculum vitae", "portfolio pdf"],
      answer: [
        { type: "text", text: "You can view and download my latest resume here: " },
        { type: "newline" },
        { type: "link", href: LINKS.resume, label: "📄 Sreehari's Resume (PDF)" }
      ]
    },
    {
      keywords: ["github", "git hub", "github profile", "source code", "repositories", "code", "repos"],
      answer: [
        { type: "text", text: "I open-source most of my projects. Check out my repositories: " },
        { type: "newline" },
        { type: "link", href: LINKS.github, label: "💻 Sreehari's GitHub" }
      ]
    },
    {
      keywords: ["linkedin", "linked in", "linkedin profile", "professional profile", "connect on linkedin"],
      answer: [
        { type: "text", text: "Let's connect professionally! Here is my LinkedIn profile: " },
        { type: "newline" },
        { type: "link", href: LINKS.linkedin, label: "🔗 Sreehari's LinkedIn" }
      ]
    },
    {
      keywords: ["email", "mail", "contact email", "gmail", "email address", "send email", "reach out", "contact"],
      answer: [
        { type: "text", text: "I am always open to new opportunities and collaborations. You can email me at: " },
        { type: "link", href: LINKS.email, label: "sreehari.vengalil@gmail.com" }
      ]
    },
    {
      keywords: ["hire", "hiring", "job opportunity", "freelance", "work together", "open to work", "recruit"],
      answer: [
        { type: "text", text: "I am currently open to new opportunities and collaborations! Whether you have a question about my stack or a project idea, please reach out via email or LinkedIn: " },
        { type: "newline" },
        { type: "link", href: LINKS.email, label: "Email Me" },
        { type: "text", text: " | " },
        { type: "link", href: LINKS.linkedin, label: "LinkedIn" }
      ]
    },

    // ==========================================
    // 3. SKILLS & TECHNOLOGIES
    // ==========================================
    {
      keywords: ["skills", "technical skills", "tech stack", "technologies", "what do you know", "expertise", "what can you do", "stack", "languages"],
      answer: `My tech arsenal is quite broad! I work with languages like Java, Python, C++, and JavaScript. For web development, I use React.js, Next.js, Tailwind CSS, and Node.js. For databases, I use MongoDB, Firebase, and Supabase. I'm also proficient with Git, Linux, Postman, and Salesforce.`
    },
    {
      keywords: ["frontend", "front end", "ui development", "ui", "user interface", "client side"],
      answer: `My frontend stack focuses on modern, responsive design. It includes HTML5, CSS3, modern JavaScript, React.js, Next.js, and Tailwind CSS. I also enjoy creating interactive animations using GSAP and canvas elements.`
    },
    {
      keywords: ["backend", "server side", "api development", "server", "back end", "apis"],
      answer: `On the backend, my experience includes building robust services with Node.js, and working extensively with BaaS platforms like Firebase and Supabase for authentication systems, serverless functions, and database integration.`
    },
    {
      keywords: ["database", "databases", "db", "sql", "nosql", "data storage"],
      answer: `For databases, I have hands-on experience designing schemas and managing data with MongoDB, Firebase Firestore, and PostgreSQL (via Supabase).`
    },
    {
      keywords: ["tools", "development tools", "software you use", "ide", "ides"],
      answer: `My daily development tools include Git & GitHub for version control, VS Code, PyCharm, WebStorm, and Android Studio for coding, Postman for API testing, and Linux environments for deployment.`
    },
    {
      keywords: ["java", "do you know java", "java programming", "oop"],
      answer: `Yes, Java is one of my core languages! I've deeply studied Object-Oriented Programming (OOP) in Java, covering data structures, multithreading, and application design. I even co-authored a textbook called 'Essentials Of Java' in Jan 2025.`
    },
    {
      keywords: ["python", "do you know python", "python programming"],
      answer: `Yes, Python is part of my primary skill set. I use it for general scripting, algorithms, and backend logic.`
    },
    {
      keywords: ["javascript", "js", "do you know js", "typescript", "ts"],
      answer: `Absolutely! JavaScript is at the heart of my web development stack. I have mastered modern JS, and I use it extensively across frameworks like React and Next.js. I also have experience with TypeScript, as used in my Grievance Portal project.`
    },
    {
      keywords: ["c++", "cpp", "c plus plus", "c programming", "c language"],
      answer: `Yes, I have a strong foundation in C and C++. I've worked on memory management, fundamental algorithms, and I co-authored a book titled 'Computing Fundamentals and C Programming'.`
    },
    {
      keywords: ["react", "react.js", "reactjs", "do you know react"],
      answer: `Yes! React.js is my primary frontend library. I use it to build dynamic, component-driven user interfaces. Both my EduNex Chatbot and other portfolio projects rely heavily on React ecosystems.`
    },
    {
      keywords: ["next.js", "nextjs", "next js"],
      answer: `Yes, I am highly proficient in Next.js. I use it for server-side rendering, routing, and building full-stack React applications. My projects 'EduNex' and the 'Grievance Portal' were built entirely on Next.js.`
    },
    {
      keywords: ["tailwind", "tailwindcss", "css"],
      answer: `Tailwind CSS is my go-to utility framework for styling. It allows me to build responsive, custom designs rapidly without leaving my markup. I used it heavily in EduNex and the Grievance Portal.`
    },
    {
      keywords: ["salesforce", "sales force"],
      answer: `Yes, I have familiarized myself with the Salesforce ecosystem as part of my broad technical toolkit, understanding its role in CRM and enterprise data architecture.`
    },

    // ==========================================
    // 4. PROJECTS (GENERAL)
    // ==========================================
    {
      keywords: ["projects", "portfolio projects", "show projects", "work", "applications built", "things you built", "featured projects", "what have you made", "creations"],
      answer: `I have architected and deployed several major projects. My top three featured projects are:\n1. EduNex (An AI-powered college chatbot)\n2. Project Hub (A centralized dev dashboard)\n3. Grievance Portal (A secure student reporting system).\n\nReply with the name of any project to learn more or get the links!`
    },

    // ==========================================
    // 5. PROJECT: EDUNEX
    // ==========================================
    {
      keywords: ["edunex", "college chatbot", "ai chatbot", "campus chatbot", "student chatbot", "tell me about edunex"],
      answer: `EduNex is a secure, AI-driven college chatbot I built to automate routine campus inquiries and assist students 24/7. It handles natural language queries to instantly provide accurate, college-specific answers regarding locations, facilities, and schedules.`
    },
    {
      keywords: ["edunex challenge", "why did you build edunex", "edunex problem"],
      answer: `The challenge behind EduNex was that handling repetitive campus inquiries manually is time-consuming, and students often faced delays getting simple answers about college resources. EduNex solves this by fully automating the process.`
    },
    {
      keywords: ["edunex tech stack", "how did you build edunex", "what powers edunex", "edunex technologies"],
      answer: `I built EduNex using Next.js for the core framework, React.js for the UI, Tailwind CSS for styling, and Supabase for the secure backend and data management.`
    },
    {
      keywords: ["edunex link", "edunex live", "edunex github", "show me edunex", "edunex demo"],
      answer: [
        { type: "text", text: "You can check out EduNex here: " },
        { type: "newline" },
        { type: "link", href: LINKS.edunex_live, label: "🚀 Live Demo" },
        { type: "text", text: " | " },
        { type: "link", href: LINKS.edunex_git, label: "💻 Source Code" }
      ]
    },

    // ==========================================
    // 6. PROJECT: PROJECT HUB
    // ==========================================
    {
      keywords: ["project hub", "cs tech hub", "project dashboard", "tell me about project hub"],
      answer: `Project Hub is a centralized dashboard I designed to showcase development projects in an organized, professional manner. It features interactive filtering, responsive grid layouts, and smooth 3D tilt animations.`
    },
    {
      keywords: ["project hub challenge", "why build project hub"],
      answer: `The challenge was that my personal projects were difficult to navigate and lacked a unified showcase experience. Project Hub solved this by acting as a single, beautiful source of truth for all my development work.`
    },
    {
      keywords: ["project hub tech stack", "how did you build project hub", "project hub technologies"],
      answer: `Project Hub was built natively using HTML5, CSS3, modern JavaScript, and the Intersection Observer API for smooth scrolling and animations.`
    },
    {
      keywords: ["project hub link", "project hub live", "project hub github", "show me project hub"],
      answer: [
        { type: "text", text: "You can view the Project Hub here: " },
        { type: "newline" },
        { type: "link", href: LINKS.hub_live, label: "🚀 Live Demo" },
        { type: "text", text: " | " },
        { type: "link", href: LINKS.hub_git, label: "💻 Source Code" }
      ]
    },

    // ==========================================
    // 7. PROJECT: GRIEVANCE PORTAL
    // ==========================================
    {
      keywords: ["grievance portal", "complaint system", "student grievance", "department grievance", "tell me about the grievance portal", "grievance"],
      answer: `The Grievance Portal is a secure platform where students can raise concerns anonymously and receive timely resolutions. It includes features like a status tracking timeline and an admin dashboard for faculty.`
    },
    {
      keywords: ["grievance portal challenge", "why build grievance portal"],
      answer: `Manual grievance reporting in departments is often slow, opaque, and hard to track. I built the Grievance Portal to create a transparent system for real-time reporting, which significantly reduced resolution time from weeks to days.`
    },
    {
      keywords: ["grievance tech stack", "grievance technologies", "how did you build grievance"],
      answer: `The Grievance Portal was architected using Next.js, Tailwind CSS, TypeScript, and Firebase for real-time secure data storage and authentication.`
    },
    {
      keywords: ["grievance link", "grievance live", "grievance github", "show me grievance portal"],
      answer: [
        { type: "text", text: "Check out the Grievance Portal here: " },
        { type: "newline" },
        { type: "link", href: LINKS.grievance_live, label: "🚀 Live Demo" },
        { type: "text", text: " | " },
        { type: "link", href: LINKS.grievance_git, label: "💻 Source Code" }
      ]
    },

    // ==========================================
    // 8. EXPERIENCE & INTERNSHIPS
    // ==========================================
    {
      keywords: ["experience", "work experience", "jobs", "employment", "where have you worked", "professional experience"],
      answer: `Professionally, I worked as a Lab Technician Intern at Nilgiri College of Arts and Science (Jun 2025 - Nov 2025), and I am a published technical Co-Author of two programming books. Ask me about my internship or my books for more details!`
    },
    {
      keywords: ["internship", "intern", "lab technician", "lab tech", "what did you do as an intern", "nilgiri intern"],
      answer: `During my internship as a Lab Technician at Nilgiri College of Arts and Science (Jun–Nov 2025), I assisted in managing computer lab infrastructure, troubleshooting hardware and software issues, and providing direct technical support to students and faculty to ensure smooth daily operations.`
    },

    // ==========================================
    // 9. PUBLICATIONS & BOOKS
    // ==========================================
    {
      keywords: ["books", "publications", "published books", "author", "co-author", "written anything", "writing"],
      answer: `I am the Co-Author of two technical books published in January 2025:\n1. Computing Fundamentals and C Programming\n2. Essentials Of Java\nBoth were written to help college students build strong foundational knowledge.`
    },
    {
      keywords: ["c programming book", "computing fundamentals", "c book"],
      answer: `The book 'Computing Fundamentals and C Programming' was published in Jan 2025 (ISBN: 978-93-344-4926-6). It is a comprehensive guide covering core C concepts, memory management, and practical examples tailored for college students.`
    },
    {
      keywords: ["java book", "essentials of java", "java textbook"],
      answer: `The book 'Essentials Of Java' was published in Jan 2025 (ISBN: 978-93-344-4677-7). It explores Object-Oriented Programming principles in Java, including data structures, multithreading, and real-world application design.`
    },

    // ==========================================
    // 10. EDUCATION
    // ==========================================
    {
      keywords: ["education", "degree", "college", "study", "university", "where do you study", "what are you studying", "bachelor"],
      answer: `I am currently pursuing a B.Sc in Computer Science at Nilgiri College of Arts and Science, starting in 2023 and expected to graduate in 2026. Here, I've deeply explored data structures, algorithms, and software engineering principles.`
    },
    {
      keywords: ["high school", "school", "secondary education", "12th", "where did you go to school"],
      answer: `I completed my Higher Secondary Education under the Tamil Nadu State Board from 2021 to 2023, with a strong focus on Mathematics and Computer Science.`
    },
    {
      keywords: ["graduation", "when will you graduate", "year of passing", "pass out year"],
      answer: `I am on track to graduate with my B.Sc in Computer Science in 2026.`
    },

    // ==========================================
    // 11. TIMELINE & JOURNEY
    // ==========================================
    {
      keywords: ["timeline", "journey", "history", "how did you start", "career path"],
      answer: `My journey:\n• 2021-2023: High School (Math & CS focus)\n• 2023: Began B.Sc CS at Nilgiri College\n• Mid 2024: Mastered modern JS, React, and Backend architectures\n• Late 2025: Architected & launched major projects like EduNex\n• 2025-Present: Lab Technician Internship and published technical books.`
    },

    // ==========================================
    // 12. CHATBOT META / EASTER EGGS
    // ==========================================
    {
      keywords: ["are you human", "are you a bot", "are you ai", "who coded you", "how do you work"],
      answer: `I am an offline algorithmic chatbot custom-built by Sreehari to answer questions about his portfolio. I use keyword matching and weighted scoring algorithms directly running in your browser—no external API calls required!`
    },
    {
      keywords: ["you are smart", "good bot", "clever", "well built"],
      answer: `Thank you! Sreehari built me using native JavaScript to ensure I am fast, offline-capable, and helpful. Let me know if you want to see the code behind this website!`
    },
    {
      keywords: ["website stack", "how is this site built", "portfolio tech", "source of this website"],
      answer: `This portfolio features a highly custom, zero-dependency frontend. It utilizes native HTML5, CSS3 with complex glassmorphism and keyframe animations, JavaScript (for the Intersection Observers and this offline bot), and GSAP for the cinematic stage entry.`
    }
  ];


  /**
   * Helper: Extract Name from common intro phrases.
   * e.g., "my name is John", "i am John", "call me John"
   */
  function parseSetName(msg) {
    const lower = msg.toLowerCase().trim();
    // Regex matches common intro patterns and captures the name group
    const match = lower.match(/(?:my name is|i am|i'm|call me|this is) ([a-z]+)/i);
    if (match && match[1]) {
      // Capitalize first letter
      return match[1].charAt(0).toUpperCase() + match[1].slice(1);
    }
    
    // If user just types a single word when asked for a name, we might catch it,
    // but usually handled safely. We'll return null if no strict pattern matches.
    return null;
  }

  /**
   * NLP/Scoring Engine: Matches user message against FAQ dictionary.
   */
  function getBestAnswerSegments(userMsg, context = {}) {
    let lowerMsg = userMsg.toLowerCase().replace(/[^\w\s#+.-]/g, ''); // keep basic punctuation needed for tech (c++, c#, .net)
    
    // If the message is completely empty
    if (!lowerMsg.trim()) return "Please type a question!";

    let bestMatch = null;
    let highestScore = 0;

    for (let i = 0; i < FAQ.length; i++) {
      const entry = FAQ[i];
      let score = 0;

      for (let j = 0; j < entry.keywords.length; j++) {
        let kw = entry.keywords[j].toLowerCase();
        
        // Exact boundary match (so "c" doesn't match inside "react")
        // Escaping special chars for regex like '+' in 'c++'
        let escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
        let regex = new RegExp('\\b' + escapedKw + '\\b', 'i');

        if (regex.test(lowerMsg)) {
          // Weight the score by the length of the matched keyword.
          // Multi-word exact matches yield higher scores.
          score += (kw.split(' ').length * 10) + kw.length;
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
      // Fallback response
      response = `I'm not exactly sure about that. Try asking about Sreehari's "projects", "skills", "experience", "education", or ask for his "resume" and "contact" links!`;
    }

    // Formatting: Check if response is a string. If so, return it.
    // If it's an array (rich segments), return as is for UI to render.
    if (typeof response === 'string') {
      // Small personalization touch if name is known
      if (context.userName && highestScore === 0) {
        response = `Sorry ${context.userName}, ` + response.toLowerCase();
      }
      return response;
    }

    return response;
  }

  // Expose the API to script.js
  return {
    parseSetName,
    getBestAnswerSegments
  };

})();
