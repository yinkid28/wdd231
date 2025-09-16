const directoryContainer = document.getElementById('directory-container');
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const themeToggle = document.getElementById('theme-toggle');

// State
let currentView = 'grid';
let members = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', async function() {
    updateFooterDates();
    setupEventListeners();
    await loadMembers();
    displayMembers();
    initializeTheme();
});

// Load members data
// Load members data
async function loadMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        members = await response.json();
    } catch (error) {
        console.error('Error loading members:', error);
        directoryContainer.innerHTML = '<p class="loading">Error loading member directory. Please try again later.</p>';
    }
}


// Display members based on current view
function displayMembers() {
    if (!members.length) {
        directoryContainer.innerHTML = '<p class="loading">Loading members...</p>';
        return;
    }

    const isGridView = currentView === 'grid';
    directoryContainer.className = isGridView ? 'directory-grid' : 'directory-list';
    
    directoryContainer.innerHTML = members.map(member => createMemberCard(member)).join('');
}

// Create member card HTML
function createMemberCard(member) {
    const membershipLevel = getMembershipLevel(member.membershipLevel || 'Member');
    const membershipClass = membershipLevel.toLowerCase();
    
    return `
        <div class="member-card ${membershipClass}">
            <div class="member-header">
                <div class="member-logo">
                    ${member.name.substring(0, 2).toUpperCase()}
                </div>
                <div class="member-info">
                    <h3>${member.name}</h3>
                    ${member.tagline ? `<p class="member-tagline">${member.tagline}</p>` : ''}
                </div>
            </div>
            <div class="member-details">
                <div class="member-contact">
                    ${member.email ? `<p><strong>Email:</strong> <a href="mailto:${member.email}">${member.email}</a></p>` : ''}
                    <p><strong>Phone:</strong> <a href="tel:${member.phone}">${member.phone}</a></p>
                    <p><strong>Website:</strong> <a href="${member.website}" target="_blank" rel="noopener">${member.website}</a></p>
                    <p><strong>Address:</strong> ${member.address}</p>
                </div>
                <span class="membership-level level-${membershipClass}">${membershipLevel} Member</span>
            </div>
        </div>
    `;
}

// Get membership level name
function getMembershipLevel(level) {
    const validLevels = ['Member', 'Silver', 'Gold'];
    if (!level) return 'Member';
    const formatted = level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
    return validLevels.includes(formatted) ? formatted : 'Member';
}

// Setup event listeners
function setupEventListeners() {
    // View toggle buttons
    gridViewBtn.addEventListener('click', () => {
        currentView = 'grid';
        updateViewButtons();
        displayMembers();
    });

    listViewBtn.addEventListener('click', () => {
        currentView = 'list';
        updateViewButtons();
        displayMembers();
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && !e.target.closest('.menu-toggle')) {
            navMenu.classList.remove('show');
        }
    });
}

// Update view button states
function updateViewButtons() {
    gridViewBtn.classList.toggle('active', currentView === 'grid');
    listViewBtn.classList.toggle('active', currentView === 'list');
}

// Theme management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
}

// Update footer dates
function updateFooterDates() {
    const currentYear = new Date().getFullYear();
    const lastModified = new Date(document.lastModified);
    
    document.getElementById('currentYear').textContent = currentYear;
    document.getElementById('lastModified').textContent = lastModified.toLocaleString();
}

// Responsive image loading (for when actual images are added)
function loadMemberImage(imageName) {
    // This would handle responsive image loading
    // For now, we're using CSS-generated logos
    return `images/members/${imageName}`;
}