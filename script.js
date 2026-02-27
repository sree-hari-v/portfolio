// 1. Mobile Menu Toggle
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuBtnIcon = document.querySelector('.menu-btn i');
    
    navLinks.classList.toggle('active');

    // Switch icon between bars and times (X)
    if (navLinks.classList.contains('active')) {
        menuBtnIcon.classList.remove('fa-bars');
        menuBtnIcon.classList.add('fa-times');
    } else {
        menuBtnIcon.classList.remove('fa-times');
        menuBtnIcon.classList.add('fa-bars');
    }
}

// 2. Typing Animation Script
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
        typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

// 3. Scroll Reveal Animation (initialised in DOMContentLoaded below)

// 4. Project Selection Logic
const projects = [
    {
        title: "EduNex",
        description: "A secure platform for student data management and learning resources.",
        existingProblems: "Managing student data manually leads to inconsistency and security risks in resource distribution.",
        solvedProblems: "Integrated Supabase for secure data storage with role-based access control and streamlined Next.js dashboard.",
        techUsed: ["Next.js", "Supabase", "React.js", "Tailwind CSS"],
        liveLink: "https://github.com/sree-hari-v/Edunex",
        githubLink: "https://github.com/sree-hari-v/Edunex"
    },
    {
        title: "Project Hub",
        description: "A centralized dashboard to showcase development projects.",
        existingProblems: "Personal projects were difficult to navigate and lack a professional, unified showcase experience.",
        solvedProblems: "Developed a responsive dashboard with categorized projects, smooth animations, and direct access to source code.",
        techUsed: ["HTML5", "CSS3", "JavaScript", "Intersection Observer API"],
        liveLink: "https://cs-tech-hub.vercel.app/",
        githubLink: "https://github.com/sree-hari-v"
    },
    {
        title: "Grievance Portal",
        description: "A secure platform for students to raise concerns and get timely resolutions.",
        existingProblems: "Manual grievance reporting in departments is often slow, opaque, and hard to track for students.",
        solvedProblems: "Built a transparent system for real-time reporting and status tracking, enhancing accountability and resolution speed.",
        techUsed: ["Next.js", "Tailwind CSS", "Firebase", "TypeScript"],
        liveLink: "https://cs-dept-grievance-portal.vercel.app/",
        githubLink: "https://github.com/sree-hari-v"
    }
];

function selectProject(index, event) {
    if (event) event.stopPropagation();

    const container = document.querySelector('.projects-container');
    const detailsContainer = document.getElementById('project-details');
    const projectCards = document.querySelectorAll('.project-card');
    const project = projects[index];
    if (!project) return;

    // Populate detail panel before making it visible
    detailsContainer.innerHTML = `
        <span class="close-details" onclick="closeProjectDetails(event)" aria-label="Close">
            <i class="fas fa-times"></i>
        </span>
        <div class="detail-header">
            <h2>${project.title}</h2>
            <div class="detail-links">
                <a href="${project.githubLink}" class="detail-link-btn"><i class="fab fa-github"></i> GitHub</a>
                <a href="${project.liveLink}" class="detail-link-btn detail-link-live"><i class="fas fa-external-link-alt"></i> Live Demo</a>
            </div>
        </div>
        <div class="detail-content">
            <p>${project.description}</p>
            <h4><i class="fas fa-exclamation-circle"></i> Existing Problems</h4>
            <p>${project.existingProblems}</p>
            <h4><i class="fas fa-check-circle"></i> Solved Problems</h4>
            <p>${project.solvedProblems}</p>
            <h4><i class="fas fa-tools"></i> Tech Stack</h4>
            <div class="tech-stack-detail">
                ${project.techUsed.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
            </div>
        </div>
    `;

    // Toggle classes — CSS handles all transitions
    projectCards.forEach((card, i) => card.classList.toggle('active', i === index));
    container.classList.add('active-view');
}

function closeProjectDetails(event) {
    if (event) event.stopPropagation();

    const container = document.querySelector('.projects-container');
    const projectCards = document.querySelectorAll('.project-card');

    container.classList.remove('active-view');
    projectCards.forEach(card => card.classList.remove('active'));
}

// Click outside the project container → close
document.addEventListener('click', (e) => {
    const container = document.querySelector('.projects-container');
    if (container && container.classList.contains('active-view') && !container.contains(e.target)) {
        closeProjectDetails();
    }
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    typeEffect();

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('show');
        });
    });
    document.querySelectorAll('.hidden').forEach(el => revealObserver.observe(el));
});