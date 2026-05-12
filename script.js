// --- 0. EYE CATCHING PRELOADER LOGIC ---
window.addEventListener('load', () => {
    // Lock scrolling while loading
    document.body.style.overflow = 'hidden';
    
    const percentText = document.getElementById('status-percent');
    const statusText = document.getElementById('status-text');
    const loadingBar = document.querySelector('.loading-bar');
    
    // Status text pool to make it look like it's doing complex work
    const statuses = [
        "Booting core assets...",
        "Connecting to database...",
        "Compiling styles...",
        "Fetching project data...",
        "Rendering UI components...",
        "System Initialized."
    ];
    
    let percent = 0;
    let statusIndex = 0;
    
    // Animate percentage and loading bar
    const interval = setInterval(() => {
        // Randomly increment percentage by 1 to 5 for organic feel
        percent += Math.floor(Math.random() * 5) + 1;
        
        if (percent >= 100) {
            percent = 100;
            clearInterval(interval);
            statusText.innerText = statuses[statuses.length - 1]; // System Initialized
        } else if (percent % 20 === 0 || Math.random() > 0.8) {
            // Change status text occasionally as progress increases
            if (statusIndex < statuses.length - 2) {
                statusIndex++;
                statusText.innerText = statuses[statusIndex];
            }
        }
        
        // Update DOM
        percentText.innerText = percent + '%';
        loadingBar.style.width = percent + '%';
        
    }, 50); // Fast interval to complete in ~2.5 seconds

    // Remove the preloader after exactly 3 seconds
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        preloader.classList.add('hide-preloader');
        
        // Restore scrolling
        document.body.style.overflow = 'auto';
        
        // Clean up DOM after fade-out transition
        setTimeout(() => preloader.remove(), 600);
    }, 3000); 
});

// --- 1. THEME TOGGLE ---
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.setAttribute('data-theme', 'light');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
} 

themeToggle.addEventListener('click', () => {
    const isLight = body.getAttribute('data-theme') === 'light';
    if (isLight) {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-moon'; 
        localStorage.setItem('theme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'light');
    }
    initCanvas(); 
});

// --- 2. OPTIMIZED CANVAS BACKGROUND ---
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let particlesArray;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x; this.y = y;
        this.directionX = directionX; this.directionY = directionY;
        this.size = size; this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color; ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        this.x += this.directionX; this.y += this.directionY;
        this.draw();
    }
}

function initCanvas() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 15000; 
    let color = '#ff0000'; 
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 1.5) + 0.5; 
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2; 
        let directionY = (Math.random() * 0.4) - 0.2;
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

function connect() {
    let opacityValue = 1;
    let maxDistance = 120; 
    const isLightMode = body.getAttribute('data-theme') === 'light';
    const opacityMultiplier = isLightMode ? 0.1 : 0.4; 

    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = (dx * dx) + (dy * dy);
            
            if (distance < (maxDistance * maxDistance)) {
                opacityValue = 1 - (distance / (maxDistance * maxDistance));
                ctx.strokeStyle = `rgba(255, 0, 0, ${opacityValue * opacityMultiplier})`; 
                ctx.lineWidth = 0.8; 
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    initCanvas();
});

// --- 3. SCROLL PROGRESS & MENU ---
window.onscroll = function() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.querySelector(".scroll-progress").style.width = scrolled + "%";
};

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.querySelector('.menu-btn i');
    navLinks.classList.toggle('active');
    menuIcon.classList.toggle('fa-bars');
    menuIcon.classList.toggle('fa-times');
}

function closeMenu() {
    document.querySelector('.nav-links').classList.remove('active');
    const menuIcon = document.querySelector('.menu-btn i');
    menuIcon.classList.add('fa-bars');
    menuIcon.classList.remove('fa-times');
}

// --- 4. TYPING EFFECT ---
const textElement = document.querySelector('.type-text');
const roles = ["Software Developer", "Full Stack Developer", "Web Developer", "Open Source Enthusiast"];
let roleIndex = 0, charIndex = 0, isDeleting = false;

function typeEffect() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
        textElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        textElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true; typeSpeed = 2000; 
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; typeSpeed = 500;
    }
    setTimeout(typeEffect, typeSpeed);
}

// --- 5. MAGNETIC & TILT EFFECTS ---
document.querySelectorAll('.magnetic').forEach(magnet => {
    magnet.addEventListener('mousemove', (e) => {
        const position = magnet.getBoundingClientRect();
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;
        magnet.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    magnet.addEventListener('mouseleave', () => magnet.style.transform = 'translate(0px, 0px)');
});

document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; const y = e.clientY - rect.top;
        const xRotation = ((y / rect.height) - 0.5) * 15; 
        const yRotation = (0.5 - (x / rect.width)) * 15;
        card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// --- 6. SMOOTH SCROLL OBSERVER ---
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); 
        }
    });
}, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

revealElements.forEach(el => revealObserver.observe(el));

// --- 7. PROJECT DATA INJECTION ---
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

function selectProject(index, event) {
    if (event) event.stopPropagation();
    const container = document.querySelector('.projects-container');
    const detailsContainer = document.getElementById('project-details');
    const projectCards = document.querySelectorAll('.project-card');
    const project = projects[index];

    detailsContainer.innerHTML = `
        <div class="close-details" onclick="closeProjectDetails(event)"><i class="fas fa-times"></i></div>
        <h2 style="margin-bottom: 15px; color: var(--text-white); font-size: 2rem;">${project.title}</h2>
        <p style="color: var(--text-gray); margin-bottom: 20px; line-height: 1.8;">${project.description}</p>
        
        <div style="margin-bottom: 25px; color: var(--text-gray); text-align: left;">
            <h4 style="color: var(--text-white); margin-bottom: 5px;"><i class="fas fa-exclamation-circle" style="color: var(--primary);"></i> The Challenge</h4>
            <p style="font-size: 0.95rem; margin-bottom: 15px; line-height: 1.7;">${project.challenge}</p>
            
            <h4 style="color: var(--text-white); margin-bottom: 5px;"><i class="fas fa-check-circle" style="color: var(--primary);"></i> The Solution</h4>
            <p style="font-size: 0.95rem; margin-bottom: 15px; line-height: 1.7;">${project.solution}</p>
            
            <h4 style="color: var(--text-white); margin-bottom: 5px;"><i class="fas fa-star" style="color: var(--primary);"></i> Key Features</h4>
            <ul style="font-size: 0.95rem; margin-bottom: 15px; padding-left: 20px; list-style-type: disc; line-height: 1.7;">
                ${project.features.map(feat => `<li>${feat}</li>`).join('')}
            </ul>

            <h4 style="color: var(--text-white); margin-bottom: 5px;"><i class="fas fa-chart-line" style="color: var(--primary);"></i> Impact / Results</h4>
            <p style="font-size: 0.95rem; margin-bottom: 15px; line-height: 1.7;">${project.impact}</p>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 25px;">
            ${project.techUsed.map(tech => `<span style="background:rgba(255,0,0,0.1); color:var(--primary); padding: 6px 12px; border-radius: 5px; font-size: 0.85rem; font-weight: 600;">${tech}</span>`).join('')}
        </div>
        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
            <a href="${project.githubLink}" target="_blank" style="padding: 12px 24px; border: 1px solid rgba(255,255,255,0.2); color: var(--text-white); border-radius: 5px; text-decoration: none; transition: 0.3s; font-weight: 600;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'"><i class="fab fa-github"></i> GitHub</a>
            <a href="${project.liveLink}" target="_blank" style="padding: 12px 24px; background: rgba(255,0,0,0.1); color: var(--primary); border: 1px solid transparent; border-radius: 5px; text-decoration: none; transition: 0.3s; font-weight: 600;" onmouseover="this.style.background='var(--primary)'; this.style.color='#fff'" onmouseout="this.style.background='rgba(255,0,0,0.1)'; this.style.color='var(--primary)'"><i class="fas fa-external-link-alt"></i> Live Demo</a>
        </div>
    `;

    projectCards.forEach((card, i) => card.classList.toggle('active', i === index));
    container.classList.add('active-view');
}

function closeProjectDetails(event) {
    if (event) event.stopPropagation();
    document.querySelector('.projects-container').classList.remove('active-view');
    document.querySelectorAll('.project-card').forEach(card => card.classList.remove('active'));
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    animateParticles();
    typeEffect();
});
// --- CLOSE PROJECT DETAILS ON OUTSIDE CLICK ---
document.addEventListener('click', (e) => {
    const container = document.querySelector('.projects-container');
    // Check if the detailed view is currently open
    if (container && container.classList.contains('active-view')) {
        const clickedCard = e.target.closest('.project-card');
        const clickedDetails = e.target.closest('.project-detail-view');
        
        // If the click wasn't on a project card AND wasn't inside the detailed view panel
        if (!clickedCard && !clickedDetails) {
            closeProjectDetails();
        }
    }
});
// --- CUSTOM TRAILING CURSOR ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    
    // Dot follows instantly
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    
    // Outline follows with a smooth delay
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Enlarge cursor when hovering over clickable elements
const interactables = document.querySelectorAll('a, button, .magnetic, .project-card, .exp-card, .close-details');

interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '60px';
        cursorOutline.style.height = '60px';
        cursorOutline.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
        cursorOutline.style.border = '2px solid transparent';
    });
    
    el.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorOutline.style.backgroundColor = 'transparent';
        cursorOutline.style.border = '2px solid rgba(255, 0, 0, 0.5)';
    });
});