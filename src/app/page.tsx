'use client';

import React, { useEffect } from 'react';
import './globals.css';
import initInteractions from '@/lib/script';
import { setupChatbot } from '@/lib/chatbot';

export default function Portfolio() {
  useEffect(() => {
    setupChatbot();
    // Initialize vanilla JS interactions
    initInteractions();
  }, []);

  return (
    <>
      {/* Original Portfolio Content */}

      <div className="cursor-dot"></div>
      <div className="cursor-outline"></div>

      <canvas id="canvas-bg"></canvas>
      <div className="scroll-progress"></div>

      <section className="cin-stage" id="cinStage" aria-label="Cinematic Stage">
        <div className="cin-vignette"></div>

        <div className="rope-zone" id="ropeZone" aria-label="Pull the rope" style={{ display: 'none' }}>
          <div className="rope" id="rope"></div>
          <div className="pull-hint" id="pullHint">PULL DOWN</div>
          <div className="or-hint" id="orHint">OR</div>
          <button className="rope-click" id="ropeClick" type="button">CLICK HERE</button>
        </div>

        <div className="cin-center">
          <div className="cin-center-inner">
            <h1 className="cin-name" id="cinName">SREEHARI V</h1>

            <div className="cin-pages-wrapper">
              <div className="cin-page cin-page-1">
                <nav className="cin-links" id="cinLinks" aria-label="Landing links">
                  <a href="https://drive.google.com/file/d/1o1KKzYHzRdbiPagUZu1ik9rLi5ewDoie/view?usp=drive_link"
                    target="_blank" rel="noreferrer">Resume</a>
                  <a href="https://github.com/sree-hari-v" target="_blank" rel="noreferrer">GitHub</a>
                  <a href="https://www.linkedin.com/in/sreehari-v-a15084321/" target="_blank" rel="noreferrer">LinkedIn</a>
                  <a href="mailto:sreehari.vengalil@gmail.com">Mail</a>
                </nav>
              </div>

              <div className="cin-page cin-page-2">
                <div className="cin-summary" id="cinSummary" aria-label="Summary">
                  I am a&nbsp;<span className="cin-type" id="cinType"></span><span className="cin-type-cursor"
                    aria-hidden="true">&nbsp;</span>
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

            <button className="cin-cta" id="cinCta" type="button">CLICK HERE</button>
          </div>
        </div>


        <div className="accent-picker" id="accentPicker" aria-label="Accent color picker">
          <button className="stage-theme-toggle" id="theme-toggle-stage" type="button" aria-label="Toggle Light Mode" onClick={(e) => { if (typeof window !== 'undefined' && (window as any).toggleTheme) (window as any).toggleTheme(); }}>
            <i className="fas fa-moon"></i>
          </button>
          <button className="accent-dot" data-accent="#E84545" data-rgb="232 69 69" title="Red" aria-label="Red"></button>
          <button className="accent-dot" id="wb-dot" data-accent="#FFFFFF" data-rgb="255 255 255" title="White"
            aria-label="White"></button>
          <button className="accent-dot" data-accent="#4D7CFF" data-rgb="77 124 255" title="Blue" aria-label="Blue"></button>
          <button className="accent-dot" data-accent="#9B6BFF" data-rgb="155 107 255" title="Purple"
            aria-label="Purple"></button>
          <button className="accent-dot" data-accent="#D6B35A" data-rgb="214 179 90" title="Gold" aria-label="Gold"></button>
        </div>

        <div className="cin-flicker" id="cinFlicker"></div>
        <div className="cin-scanlines" id="cinScanlines"></div>
        <div className="cin-jitter" id="cinJitter"></div>
      </section>

      <nav className="site-nav">
        <div className="logo">
          <a href="#top">Sreehari <span>V</span></a>
        </div>

        <div className="nav-right-mobile">
          <button className="menu-btn" id="menu-btn" aria-label="Open menu" aria-expanded="false">
            <i className="fas fa-bars"></i>
          </button>
        </div>

        <ul className="nav-links" id="nav-links">
          <li className="menu-close-li">
            <button className="menu-close-btn" id="menu-close-btn" aria-label="Close menu">
              <i className="fas fa-times"></i>
            </button>
          </li>

          <li><a href="#top">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#skills">Tech</a></li>
          <li><a href="#experience">Experience</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#achievements">Achievements</a></li>
          <li><a href="#timeline">Timeline</a></li>
          <li><a href="#contact">Contact</a></li>

          <li className="theme-li">
            <button id="theme-toggle-nav" aria-label="Toggle Light Mode" onClick={(e) => { if (typeof window !== 'undefined' && (window as any).toggleTheme) (window as any).toggleTheme(); }}>
              <i className="fas fa-moon"></i>
            </button>
          </li>
        </ul>
      </nav>

      <div className="menu-backdrop" id="menu-backdrop" aria-hidden="true"></div>

      <div id="top" className="cin-scroll-space" aria-hidden="true"></div>

      <section id="about">
        <h2 className="section-title reveal">About <span>Me</span></h2>

        <div className="about-split reveal delay-1">
          <div className="about-text">
            <p style={{ marginBottom: '14px' }}>
              I am Sreehari, a <strong style={{ color: 'var(--primary)' }}>Computer Science Undergraduate and Full-Stack Developer</strong>{' '}
              passionate about building scalable web applications and robust software systems.
              I enjoy transforming complex problems into clean, efficient, and performance-driven solutions, with a strong
              focus on writing maintainable code and designing systems that are both user-centric and technically sound.
            </p>
            <p>
              From architecting secure data platforms like <em>EduNex</em> to developing responsive front-end interfaces and
              structured back-end services,
              I take ownership of the entire development lifecycle — from concept to deployment.
              I continuously refine my skills in modern web technologies, API design, authentication systems, and scalable
              architectures to build reliable, secure, and future-ready digital products.
            </p>

            {/* Metric / Stat Cards Strip */}
            <div className="about-stats-grid">
              <div className="about-stat-card tilt-card">
                <span className="stat-number">15+</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="about-stat-card tilt-card">
                <span className="stat-number">1</span>
                <span className="stat-label">ML Internship</span>
              </div>
              <div className="about-stat-card tilt-card">
                <span className="stat-number">4+</span>
                <span className="stat-label">Hackathons</span>
              </div>
              <div className="about-stat-card tilt-card">
                <span className="stat-number">4+</span>
                <span className="stat-label">Certifications</span>
              </div>
            </div>
          </div>

          <div className="about-image-wrapper">
            <div className="about-frame" aria-label="Profile picture">
              <img src="https://github.com/sree-hari-v.png" alt="Sreehari V" className="about-pic" />
            </div>
          </div>
        </div>
      </section>

      <section id="skills">
        <h2 className="section-title reveal">My <span>Tech Arsenal</span></h2>
        <div className="skills-grid reveal delay-2">
          <div className="skill-item"><img src="https://skillicons.dev/icons?i=nextjs" alt="Next.js" />
            <p>Next.js</p>
          </div>
          <div className="skill-item"><img src="https://skillicons.dev/icons?i=react" alt="React.js" />
            <p>React.js</p>
          </div>
          <div className="skill-item"><img src="https://skillicons.dev/icons?i=nodejs" alt="Node.js" />
            <p>Node.js</p>
          </div>
          <div className="skill-item"><img src="https://skillicons.dev/icons?i=python" alt="Python" />
            <p>Python</p>
          </div>
          <div className="skill-item"><img src="https://skillicons.dev/icons?i=java" alt="Java" />
            <p>Java</p>
          </div>
          <div className="skill-item"><img src="https://skillicons.dev/icons?i=cpp" alt="C++" />
            <p>C++</p>
          </div>
          <div className="skill-item"><img src="https://skillicons.dev/icons?i=js" alt="JavaScript" />
            <p>JavaScript</p>
          </div>
          <div className="skill-item"><img src="https://skillicons.dev/icons?i=mongodb" alt="MongoDB" />
            <p>MongoDB</p>
          </div>
          <div className="skill-item"><img src="https://skillicons.dev/icons?i=supabase" alt="Supabase" />
            <p>Supabase</p>
          </div>
          <div className="skill-item"><img src="https://skillicons.dev/icons?i=firebase" alt="Firebase" />
            <p>Firebase</p>
          </div>
          <div className="skill-item"><img src="https://skillicons.dev/icons?i=tailwind" alt="Tailwind" />
            <p>Tailwind</p>
          </div>
          <div className="skill-item"><img src="https://skillicons.dev/icons?i=html" alt="HTML5" />
            <p>HTML5</p>
          </div>
          <div className="skill-item"><img src="https://skillicons.dev/icons?i=linux" alt="Linux" />
            <p>Linux</p>
          </div>
          <div className="skill-item"><img src="https://skillicons.dev/icons?i=git" alt="Git" />
            <p>Git</p>
          </div>
          <div className="skill-item"><img src="https://skillicons.dev/icons?i=github" alt="GitHub" />
            <p>GitHub</p>
          </div>
          <div className="skill-item"><img src="https://skillicons.dev/icons?i=postman" alt="Postman" />
            <p>Postman</p>
          </div>
          <div className="skill-item"><img src="https://skillicons.dev/icons?i=androidstudio" alt="Android Studio" />
            <p>Android Studio</p>
          </div>
          <div className="skill-item"><img src="https://skillicons.dev/icons?i=vscode" alt="VS Code" />
            <p>VS Code</p>
          </div>
          <div className="skill-item"><img src="https://skillicons.dev/icons?i=webstorm" alt="WebStorm" />
            <p>WebStorm</p>
          </div>
          <div className="skill-item"><img src="https://skillicons.dev/icons?i=pycharm" alt="PyCharm" />
            <p>PyCharm</p>
          </div>
          <div className="skill-item"><img src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg"
            alt="Salesforce" style={{ background: 'white', padding: '2px', borderRadius: '10px' }} />
            <p>Salesforce</p>
          </div>
          <div className="skill-item"><img
            src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Microsoft_365_%282022%29.svg" alt="MS Office"
            style={{ background: 'white', padding: '2px', borderRadius: '10px' }} />
            <p>MS Office</p>
          </div>
        </div>
      </section>

      <section id="experience">
        <h2 className="section-title reveal">Professional <span>Experience</span></h2>

        <div className="experience-container reveal delay-2" id="experience-container">
          <div className="experience-list" id="experience-list">
            <div className="exp-card tilt-card" onClick={(e) => { if (typeof window !== 'undefined' && (window as any).selectExperience) (window as any).selectExperience(0, e.nativeEvent) }}>
              <div className="card-header">
                <i className="fas fa-laptop-code folder-icon"></i>
                <i className="fas fa-arrow-right expand-icon"></i>
              </div>
              <h3>Lab Technician Intern</h3>
              <p>Assisted in managing lab infrastructure, troubleshooting, and technical support.</p>
              <div className="card-footer-links">
                <span className="exp-mini-date">Jun 2025 - Nov 2025</span>
              </div>
            </div>

            <div className="exp-card tilt-card" onClick={(e) => { if (typeof window !== 'undefined' && (window as any).selectExperience) (window as any).selectExperience(1, e.nativeEvent) }}>
              <div className="card-header">
                <i className="fas fa-book folder-icon"></i>
                <i className="fas fa-arrow-right expand-icon"></i>
              </div>
              <h3>Computing Fundamentals and C Programming</h3>
              <p>Co-authored a guide on C programming, memory management, and practice examples.</p>
              <div className="card-footer-links">
                <span className="exp-mini-date">Published Jan 2025</span>
              </div>
            </div>

            <div className="exp-card tilt-card" onClick={(e) => { if (typeof window !== 'undefined' && (window as any).selectExperience) (window as any).selectExperience(2, e.nativeEvent) }}>
              <div className="card-header">
                <i className="fas fa-book folder-icon"></i>
                <i className="fas fa-arrow-right expand-icon"></i>
              </div>
              <h3>Essentials Of Java</h3>
              <p>Co-authored a Java/OOP textbook including DS, multithreading, and application design.</p>
              <div className="card-footer-links">
                <span className="exp-mini-date">Published Jan 2025</span>
              </div>
            </div>
          </div>

          <div className="experience-detail-view" id="experience-details"></div>
        </div>
      </section>

      <section id="projects">
        <h2 className="section-title reveal">Featured <span>Projects</span></h2>
        <div className="projects-container reveal delay-2" id="projects-container">
          <div className="project-list" id="project-list">
            <div className="project-card tilt-card" onClick={(e) => { if (typeof window !== 'undefined' && (window as any).selectProject) (window as any).selectProject(0, e.nativeEvent) }}>
              <div className="card-header">
                <i className="far fa-folder folder-icon"></i>
                <i className="fas fa-arrow-right expand-icon"></i>
              </div>
              <h3>EduNex</h3>
              <p>Built a secure, AI-driven college chatbot to automate campus inquiries and assist students.</p>
              <div className="card-footer-links">
                <a href="https://github.com/sree-hari-v/Edunex" className="card-link-btn" target="_blank"
                  rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}><i className="fab fa-github"></i> GitHub</a>
                <a href="https://edunex-bot.vercel.app/" className="card-link-btn card-link-live" target="_blank"
                  rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}><i className="fas fa-external-link-alt"></i>
                  Live</a>
              </div>
            </div>

            <div className="project-card tilt-card" onClick={(e) => { if (typeof window !== 'undefined' && (window as any).selectProject) (window as any).selectProject(1, e.nativeEvent) }}>
              <div className="card-header">
                <i className="far fa-folder folder-icon"></i>
                <i className="fas fa-arrow-right expand-icon"></i>
              </div>
              <h3>Project Hub</h3>
              <p>A centralized dashboard to showcase development projects.</p>
              <div className="card-footer-links">
                <a href="https://github.com/sree-hari-v/cs-tech-hub" className="card-link-btn" target="_blank"
                  rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}><i className="fab fa-github"></i> GitHub</a>
                <a href="https://cs-tech-hub.vercel.app/" className="card-link-btn card-link-live" target="_blank"
                  rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}><i className="fas fa-external-link-alt"></i>
                  Live</a>
              </div>
            </div>

            <div className="project-card tilt-card" onClick={(e) => { if (typeof window !== 'undefined' && (window as any).selectProject) (window as any).selectProject(2, e.nativeEvent) }}>
              <div className="card-header">
                <i className="far fa-folder folder-icon"></i>
                <i className="fas fa-arrow-right expand-icon"></i>
              </div>
              <h3>Grievance Portal</h3>
              <p>A secure platform for students to raise concerns and get timely resolutions.</p>
              <div className="card-footer-links">
                <a href="https://github.com/sree-hari-v/department-grievance-portal" className="card-link-btn" target="_blank"
                  rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}><i className="fab fa-github"></i> GitHub</a>
                <a href="https://cs-dept-grievance-portal.vercel.app/" className="card-link-btn card-link-live" target="_blank"
                  rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}><i className="fas fa-external-link-alt"></i>
                  Live</a>
              </div>
            </div>
          </div>

          <div className="project-detail-view" id="project-details"></div>
        </div>
      </section>

      <section id="achievements">
        <h2 className="section-title reveal">Key <span>Achievements</span></h2>

        <div className="achievement-deck reveal delay-1" id="achievement-deck">
          {/* Card 1: Department Tech Team Head */}
          <div className="achievement-card tilt-card" tabIndex={0} role="button" aria-label="Tech Team Head">
            <div className="card-header">
              <i className="far fa-folder folder-icon"></i>
              <i className="fas fa-arrow-right expand-icon"></i>
            </div>
            <h3>Tech Team Head</h3>
            <p>Appointed Head of the Department Tech Team. Led technical initiatives, symposiums, and mentored student developer teams.</p>
            <div className="card-footer-links">
              <span className="card-link-btn"><i className="fas fa-crown"></i> Leadership</span>
              <span className="card-link-btn card-link-live"><i className="fas fa-shield-alt"></i> Tech Lead</span>
            </div>
          </div>

          {/* Card 2: Innovative Excellence Award */}
          <div className="achievement-card tilt-card" tabIndex={0} role="button" aria-label="Innovative Excellence Award">
            <div className="card-header">
              <i className="far fa-folder folder-icon"></i>
              <i className="fas fa-arrow-right expand-icon"></i>
            </div>
            <h3>Innovative Excellence</h3>
            <p>Conferred with Department Award for Innovative Excellence in building campus platforms and AI solutions like EduNex.</p>
            <div className="card-footer-links">
              <span className="card-link-btn"><i className="fas fa-award"></i> Dept Award</span>
              <span className="card-link-btn card-link-live"><i className="fas fa-star"></i> Honored</span>
            </div>
          </div>

          {/* Card 3: Academic Track 7.1 CGPA */}
          <div className="achievement-card tilt-card" tabIndex={0} role="button" aria-label="Academic Track 7.1 CGPA">
            <div className="card-header">
              <i className="far fa-folder folder-icon"></i>
              <i className="fas fa-arrow-right expand-icon"></i>
            </div>
            <h3>Academic Track</h3>
            <p>Maintained a solid 7.1 CGPA in B.Sc. Computer Science while actively co-authoring 2 published programming textbooks.</p>
            <div className="card-footer-links">
              <span className="card-link-btn"><i className="fas fa-graduation-cap"></i> Academics</span>
              <span className="card-link-btn card-link-live"><i className="fas fa-chart-line"></i> 7.1 CGPA</span>
            </div>
          </div>

          {/* Card 4: Peer Teaching & Seminars */}
          <div className="achievement-card tilt-card" tabIndex={0} role="button" aria-label="Peer Teaching & Seminars">
            <div className="card-header">
              <i className="far fa-folder folder-icon"></i>
              <i className="fas fa-arrow-right expand-icon"></i>
            </div>
            <h3>Peer Teaching & Seminars</h3>
            <p>Conducted peer-to-peer coding sessions, seminars on OOP and web architectures, and hands-on workshops for junior students.</p>
            <div className="card-footer-links">
              <span className="card-link-btn"><i className="fas fa-chalkboard-teacher"></i> Mentorship</span>
              <span className="card-link-btn card-link-live"><i className="fas fa-users"></i> Seminars</span>
            </div>
          </div>
        </div>
      </section>

      <section id="timeline">
        <h2 className="section-title reveal">My <span>Journey</span></h2>
        <div className="timeline-container" id="timeline-container">
          <div className="timeline-item reveal slide-right">
            <div className="timeline-dot"></div>
            <div className="timeline-content tilt-card">
              <span className="time-date">2021 - 2023</span>
              <h3>High School Education</h3>
              <p>Completed Higher Secondary under Tamil Nadu State Board with a strong focus on Mathematics and Computer
                Science.</p>
            </div>
          </div>

          <div className="timeline-item reveal slide-left">
            <div className="timeline-dot"></div>
            <div className="timeline-content tilt-card">
              <span className="time-date">2023 - 2026</span>
              <h3>College Journey Begins</h3>
              <p>Started B.Sc. Computer Science at Nilgiri College of Arts and Science. Began deeply exploring data
                structures, algorithms, and software engineering principles.</p>
            </div>
          </div>

          <div className="timeline-item reveal slide-right">
            <div className="timeline-dot"></div>
            <div className="timeline-content tilt-card">
              <span className="time-date">Mid 2024</span>
              <h3>Language & Tech Mastery</h3>
              <p>Mastered modern JavaScript, React.js, and backend technologies like Node.js and Supabase. Began building
                complex full-stack architectural prototypes.</p>
            </div>
          </div>

          <div className="timeline-item reveal slide-left">
            <div className="timeline-dot"></div>
            <div className="timeline-content tilt-card">
              <span className="time-date">Late 2025</span>
              <h3>Major Projects Launch</h3>
              <p>Architected and deployed &quot;EduNex&quot; (AI Chatbot) and multiple department-level applications, gaining hands-on
                experience with production-level code.</p>
            </div>
          </div>

          <div className="timeline-item reveal slide-right">
            <div className="timeline-dot"></div>
            <div className="timeline-content tilt-card">
              <span className="time-date">2025 - Present</span>
              <h3>Internships & Publications</h3>
              <p>Stepped into the professional world through software internships and published technical writing, bridging
                the gap between academia and industry.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="contact-container reveal zoom-in" style={{ maxWidth: '1260px', width: '100%', margin: '0 auto', paddingTop: '40px' }}>
          <h2 className="section-title" style={{ marginBottom: '32px' }}>Keep In <span>Touch</span></h2>
          <p style={{ color: 'var(--text-gray)', marginBottom: '48px', maxWidth: '680px', margin: '0 auto 48px' }}>
            I am currently open to new opportunities and collaborations. Whether you have a question about my stack, a
            project idea, or just want to connect, feel free to reach out!
          </p>

          <div className="contact-deck" id="contact-deck">
            {/* Card 1: LinkedIn */}
            <a href="https://www.linkedin.com/in/sreehari-v-a15084321/" target="_blank" rel="noopener noreferrer" className="contact-card achievement-card tilt-card" aria-label="LinkedIn Profile" style={{ textDecoration: 'none' }}>
              <div className="card-header" style={{ marginBottom: 0 }}>
                <i className="fab fa-linkedin-in folder-icon"></i>
                <i className="fas fa-arrow-right expand-icon"></i>
              </div>
              <h3 style={{ marginTop: 'auto', marginBottom: 0, fontSize: '1.8rem' }}>LinkedIn</h3>
            </a>

            {/* Card 2: GitHub */}
            <a href="https://github.com/sree-hari-v" target="_blank" rel="noopener noreferrer" className="contact-card achievement-card tilt-card" aria-label="GitHub Profile" style={{ textDecoration: 'none' }}>
              <div className="card-header" style={{ marginBottom: 0 }}>
                <i className="fab fa-github folder-icon"></i>
                <i className="fas fa-arrow-right expand-icon"></i>
              </div>
              <h3 style={{ marginTop: 'auto', marginBottom: 0, fontSize: '1.8rem' }}>GitHub</h3>
            </a>

            {/* Card 3: Resume */}
            <a href="https://drive.google.com/file/d/1o1KKzYHzRdbiPagUZu1ik9rLi5ewDoie/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="contact-card achievement-card tilt-card" aria-label="Resume" style={{ textDecoration: 'none' }}>
              <div className="card-header" style={{ marginBottom: 0 }}>
                <i className="far fa-file-alt folder-icon"></i>
                <i className="fas fa-arrow-right expand-icon"></i>
              </div>
              <h3 style={{ marginTop: 'auto', marginBottom: 0, fontSize: '1.8rem' }}>Resume</h3>
            </a>

            {/* Card 4: Send Message */}
            <button type="button" className="contact-card achievement-card tilt-card" aria-label="Send Message"
              onClick={() => (window as unknown as { openContactModal?: () => void }).openContactModal?.()} style={{ outline: 'none', textAlign: 'left', fontFamily: 'inherit', color: 'inherit' }}>
              <div className="card-header" style={{ marginBottom: 0 }}>
                <i className="fas fa-paper-plane folder-icon"></i>
                <i className="fas fa-arrow-right expand-icon"></i>
              </div>
              <h3 style={{ marginTop: 'auto', marginBottom: 0, fontSize: '1.8rem' }}>Send Message</h3>
            </button>

            {/* Card 5: Send Mail */}
            <a href="mailto:sreehari.vengalil@gmail.com" className="contact-card achievement-card tilt-card" aria-label="Send Mail" style={{ textDecoration: 'none' }}>
              <div className="card-header" style={{ marginBottom: 0 }}>
                <i className="far fa-envelope folder-icon"></i>
                <i className="fas fa-arrow-right expand-icon"></i>
              </div>
              <h3 style={{ marginTop: 'auto', marginBottom: 0, fontSize: '1.8rem' }}>Send Mail</h3>
            </a>
          </div>
        </div>
      </section>

      {/* ============================
       CONTACT FORM MODAL POPUP
       ============================ */}
      <div className="contact-modal-backdrop" id="contactModalBackdrop" aria-hidden="true">
        <div className="contact-modal-card" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <button className="contact-modal-close" id="closeContactModalBtn" type="button" aria-label="Close modal">
            <i className="fas fa-times"></i>
          </button>

          <form id="portfolio-form" className="contact-form-card modal-form">
            {/* Web3Forms Access Key (Hidden) */}
            <input type="hidden" name="access_key" value={process.env.NEXT_PUBLIC_WEB3FORMS_KEY} />
            <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

            <div className="form-header">
              <h3 id="modalTitle">Message Me</h3>
              <p>Have a question or proposal? Send a direct message to my inbox.</p>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="form-name">Name</label>
                <div className="input-with-icon">
                  <i className="fas fa-user input-icon"></i>
                  <input type="text" id="form-name" name="name" placeholder="Your Name" required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="form-email">Email</label>
                <div className="input-with-icon">
                  <i className="fas fa-envelope input-icon"></i>
                  <input type="email" id="form-email" name="email" placeholder="your@email.com" required />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="form-phone">Phone Number <span style={{ fontSize: '0.75rem', textTransform: 'none', color: 'var(--text-muted)', fontWeight: '400' }}>(Optional)</span></label>
              <div className="input-with-icon">
                <i className="fas fa-phone input-icon"></i>
                <input type="tel" id="form-phone" name="phone" placeholder="Your Phone Number" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="form-message">Message</label>
              <div className="input-with-icon textarea-icon">
                <i className="fas fa-comment-alt input-icon"></i>
                <textarea id="form-message" name="message" rows={4} placeholder="How can I help you?" required></textarea>
              </div>
            </div>

            <button type="submit" id="form-submit-btn" className="form-submit-btn">
              <span>Send Message</span>
              <i className="fas fa-paper-plane"></i>
            </button>

            <div id="form-status" className="form-status" role="status" aria-live="polite"></div>
          </form>
        </div>
      </div>

      <footer style={{ textAlign: 'center', padding: '20px', color: 'var(--text-gray)', fontSize: '0.8rem', marginTop: '50px' }}>
        <p>Designed & Built by Sreehari V</p>
      </footer>

      {/* ============================
       VISITOR NOTIFICATION TOAST
       ============================ */}
      <aside className="visitor-toast" id="visitorToast" role="region" aria-label="Visitor notification" aria-hidden="true">
        {/* Collapsed State */}
        <button className="visitor-toast-collapsed" id="visitorToastCollapsed" type="button" aria-label="Say Hi">
          <span className="wave-icon">👋</span> <span className="collapsed-text">Say Hi!</span>
        </button>

        {/* Expanded State */}
        <div className="visitor-toast-expanded" id="visitorToastExpanded">
          <button className="visitor-toast-close" id="visitorToastClose" type="button" aria-label="Dismiss notification" title="Dismiss">
            <i className="fas fa-times"></i>
          </button>

          <div className="visitor-toast-content" id="visitorToastContent">
            <div className="visitor-toast-header">
              <span className="visitor-toast-badge">👋 Say Hi!</span>
            </div>

            <form className="visitor-toast-form" id="visitorToastForm" autoComplete="off">
              <input type="hidden" name="access_key" value={process.env.NEXT_PUBLIC_WEB3FORMS_KEY} />

              <div className="visitor-toast-input-wrap">
                <i className="fas fa-user visitor-toast-icon"></i>
                <input
                  type="text"
                  id="visitorToastName"
                  name="visitor_name"
                  placeholder="Your Name"
                  maxLength={60}
                  required
                />
              </div>

              <div className="visitor-toast-input-wrap">
                <i className="fas fa-comment-alt visitor-toast-icon" style={{ top: '12px', transform: 'none' }}></i>
                <textarea
                  id="visitorToastMessage"
                  name="message"
                  placeholder="Your message (Optional)..."
                  rows={2}
                ></textarea>
              </div>

              <button type="submit" className="visitor-toast-submit" id="visitorToastSubmit">
                <span>Send</span>
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>

          {/* Success confirmation state */}
          <div className="visitor-toast-success" id="visitorToastSuccess" style={{ display: 'none' }}>
            <div className="visitor-toast-success-icon">
              <i className="fas fa-check"></i>
            </div>
            <div className="visitor-toast-success-text">
              <h4>Sent!</h4>
              <p id="visitorToastSuccessMsg">Thanks for saying hi!</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ============================
       OFFLINE CHATBOT (UI)
       ============================ */}
      <button className="chat-fab" id="chatFab" type="button" aria-label="Open chat" title="Chat">
        <i className="fa-solid fa-comment-dots"></i>
      </button>

      <aside className="chat-widget" id="chatWidget" aria-label="Offline chatbot" aria-hidden="true">
        <header className="chat-header">
          <button className="chat-brand" id="chatBrand" type="button" aria-label="Open/Close chat">
            <div className="chat-title">
              <div className="chat-avatar" id="chatAvatar" aria-hidden="true">B</div>
              <div className="chat-title-text">
                <div className="chat-name" id="chatBotName">Offline Bot</div>
                <div className="chat-sub" id="chatBotSub">Set your bot name</div>
              </div>
            </div>
          </button>

          <button className="chat-close" id="chatClose" type="button" aria-label="Close chat" title="Close">
            <i className="fas fa-times"></i>
          </button>
        </header>

        <div className="chat-body" id="chatBody" role="log" aria-live="polite" aria-relevant="additions"></div>

        <div className="chat-chips" id="chatChips" aria-label="Chat suggestions">
          <button type="button" className="chat-chip" data-msg="projects"><i className="fa-solid fa-folder-open"></i><span>Projects</span></button>
          <button type="button" className="chat-chip" data-msg="skills"><i className="fa-solid fa-bolt"></i><span>Skills</span></button>
          <button type="button" className="chat-chip" data-msg="resume link"><i className="fa-solid fa-file-lines"></i><span>Resume</span></button>
          <button type="button" className="chat-chip" data-msg="contact"><i className="fa-solid fa-address-card"></i><span>Contact</span></button>
        </div>

        <form className="chat-input" id="chatForm" autoComplete="off">
          <input id="chatText" type="text" inputMode="text" placeholder="Ask about projects, skills, resume, contact..."
            aria-label="Chat message" />
          <button id="chatSend" type="submit" aria-label="Send message" title="Send">
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </aside>



    </>
  );
}
