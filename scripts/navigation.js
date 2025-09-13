// Navigation functionality
const hamburger = document.getElementById('hamburger');
const navigation = document.getElementById('navigation');

// Toggle mobile navigation menu
hamburger.addEventListener('click', () => {
    navigation.classList.toggle('open');
    
    // Update aria-expanded attribute for accessibility
    const isOpen = navigation.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
});

// Close navigation when clicking on a link (mobile)
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        navigation.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// Handle window resize to close mobile menu
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        navigation.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

// Initialize navigation accessibility attributes
document.addEventListener('DOMContentLoaded', () => {
    hamburger.setAttribute('aria-expanded', 'false');
});