// --- 1. THEME TOGGLE LOGIC ---
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const body = document.body;

// Check saved theme or system preference
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
        initCanvas(); 
    } else {
        body.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'light');
        initCanvas(); 
    }
});


// --- 2. CANVAS CONSTELLATION BACKGROUND (Professional & Free Flow) ---
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let particlesArray;

// Resize canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Particle Class
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    
    // Method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    
    // Check particle position, move the particle, draw the particle
    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        
        // Free flow movement (Linear, constant speed)
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

// Create particle array
function initCanvas() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000; 
    
    // CONSTANT PROFESSIONAL SETTINGS (Both Dark & Light modes)
    // Red, Connected, Small, Free Flow
    let color = '#ff0000'; 
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 1.5) + 0.5; // SMALLER: 0.5 to 2.0px
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        
        // Slower, smoother speed
        let directionX = (Math.random() * 0.4) - 0.2; 
        let directionY = (Math.random() * 0.4) - 0.2;
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Animation Loop
function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Connect particles with lines
function connect() {
    let opacityValue = 1;
    let maxDistance = 140; 
    
    const strokeRGB = '255, 0, 0'; // Red lines
    
    // RED ON BLACK requires MUCH higher opacity to be seen than RED ON WHITE
    const isLightMode = body.getAttribute('data-theme') === 'light';
    
    // Light mode: 0.15 is subtle and nice
    // Dark mode: 0.6 is needed because red fades into black easily
    const opacityMultiplier = isLightMode ? 0.15 : 0.6; 

    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                           ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            if (distance < (maxDistance * maxDistance)) {
                // Calculate opacity based on distance
                opacityValue = 1 - (distance / (maxDistance * maxDistance));
                if(opacityValue < 0) opacityValue = 0;
                
                ctx.strokeStyle = `rgba(${strokeRGB}, ${opacityValue * opacityMultiplier})`; 
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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initCanvas();
});


// --- 3. MAGNETIC BUTTONS EFFECT ---
const magnets = document.querySelectorAll('.magnetic');
magnets.forEach((magnet) => {
    magnet.addEventListener('mousemove', (e) => {
        const position = magnet.getBoundingClientRect();
        const x = e.pageX - position.left - position.width / 2;
        const y = e.pageY - position.top - position.height / 2;

        magnet.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    magnet.addEventListener('mouseleave', () => {
        magnet.style.transform = 'translate(0px, 0px)';
    });
});

// --- 4. 3D TILT EFFECT FOR CARDS ---
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xPct = x / rect.width;
        const yPct = y / rect.height;
        
        const xRotation = (yPct - 0.5) * 15; // Subtle 15deg
        const yRotation = (0.5 - xPct) * 15;
        
        card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.02, 1.02, 1.02)`;
        
        const glow = card.querySelector('.card-glow');
        if(glow) {
            glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,0,0,0.15), transparent 70%)`;
        }
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        const glow = card.querySelector('.card-glow');
        if(glow) glow.style.background = `radial-gradient(circle at 50% 50%, rgba(255,0,0,0.05), transparent 70%)`;
    });
});


// --- 5. SCROLL PROGRESS BAR ---
window.onscroll = function() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.querySelector(".scroll-progress").style.width = scrolled + "%";
};


// --- MENU & SCROLL RESTORATION LOGIC ---

// Toggle Menu
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuBtnIcon = document.querySelector('.menu-btn i');
    
    navLinks.classList.toggle('active');

    if (navLinks.classList.contains('active')) {
        menuBtnIcon.classList.remove('fa-bars');
        menuBtnIcon.classList.add('fa-times');
        document.body.style.overflow = 'hidden'; // Lock Scroll
    } else {
        menuBtnIcon.classList.remove('fa-times');
        menuBtnIcon.classList.add('fa-bars');
        document.body.style.overflow = 'auto'; // Unlock Scroll
    }
}

// Close Menu explicitly (for nav links)
function closeMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuBtnIcon = document.querySelector('.menu-btn i');
    
    // Only act if currently active (Mobile)
    if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuBtnIcon.classList.remove('fa-times');
        menuBtnIcon.classList.add('fa-bars');
        document.body.style.overflow = 'auto'; // Ensure scroll is unlocked
    }
}


// --- TYPING EFFECT ---
const textElement = document.querySelector('.type-text');
const roles = ["Software Developer", "Full Stack Developer", "Web Developer", "Open Source Enthusiast"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeEffect() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
        textElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        textElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2000; 
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
    }
    setTimeout(typeEffect, typeSpeed);
}


// --- PROJECT SELECTION & CLICK OUTSIDE ---
const projects = [
    {
        title: "EduNex",
        description: "A secure platform for student data management and learning resources.",
        existingProblems: "Managing student data manually leads to inconsistency and security risks in resource distribution.",
        solvedProblems: "Integrated Supabase for secure data storage with role-based access control and streamlined Next.js dashboard.",
        techUsed: ["Next.js", "Supabase", "React.js", "Tailwind CSS"],
        liveLink: "https://edunex-bot.vercel.app/",
        githubLink: "https://github.com/sree-hari-v/Edunex"
    },
    {
        title: "Project Hub",
        description: "A centralized dashboard to showcase development projects.",
        existingProblems: "Personal projects were difficult to navigate and lack a professional, unified showcase experience.",
        solvedProblems: "Developed a responsive dashboard with categorized projects, smooth animations, and direct access to source code.",
        techUsed: ["HTML5", "CSS3", "JavaScript", "Intersection Observer API"],
        liveLink: "https://cs-tech-hub.vercel.app/",
        githubLink: "https://github.com/sree-hari-v/cs-tech-hub"
    },
    {
        title: "Grievance Portal",
        description: "A secure platform for students to raise concerns and get timely resolutions.",
        existingProblems: "Manual grievance reporting in departments is often slow, opaque, and hard to track for students.",
        solvedProblems: "Built a transparent system for real-time reporting and status tracking, enhancing accountability and resolution speed.",
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
    if (!project) return;

    detailsContainer.innerHTML = `
        <span class="close-details" onclick="closeProjectDetails(event)" aria-label="Close">
            <i class="fas fa-times"></i>
        </span>
        <div class="detail-header">
            <h2>${project.title}</h2>
            <div class="detail-links">
                <a href="${project.githubLink}" class="detail-link-btn" target="_blank"><i class="fab fa-github"></i> GitHub</a>
                <a href="${project.liveLink}" class="detail-link-btn detail-link-live" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>
            </div>
        </div>
        <div class="detail-content">
            <p>${project.description}</p>
            <h4><i class="fas fa-exclamation-circle"></i> The Challenge</h4>
            <p>${project.existingProblems}</p>
            <h4><i class="fas fa-check-circle"></i> The Solution</h4>
            <p>${project.solvedProblems}</p>
            <h4><i class="fas fa-tools"></i> Tech Stack</h4>
            <div class="tech-stack-detail">
                ${project.techUsed.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
            </div>
        </div>
    `;

    projectCards.forEach((card, i) => card.classList.toggle('active', i === index));
    container.classList.add('active-view');
    
    if (window.innerWidth <= 1024) {
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    }
}

function closeProjectDetails(event) {
    if (event) event.stopPropagation();
    const container = document.querySelector('.projects-container');
    const projectCards = document.querySelectorAll('.project-card');
    container.classList.remove('active-view');
    projectCards.forEach(card => card.classList.remove('active'));
}

// Click outside logic
document.addEventListener('click', (e) => {
    const container = document.querySelector('.projects-container');
    
    // If details are open
    if (container && container.classList.contains('active-view')) {
        // Check if click was NOT on a project card and NOT inside the details view
        const clickedCard = e.target.closest('.project-card');
        const clickedDetails = e.target.closest('.project-detail-view');
        
        if (!clickedCard && !clickedDetails) {
            closeProjectDetails(e);
        }
    }
});

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    animateParticles();
    typeEffect();

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.hidden, .hidden-stagger, .section-title').forEach(el => revealObserver.observe(el));
});