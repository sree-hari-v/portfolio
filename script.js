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

// Start Typing
document.addEventListener('DOMContentLoaded', typeEffect);


// 3. Scroll Reveal Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));