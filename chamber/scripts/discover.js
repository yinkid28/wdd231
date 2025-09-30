// Discover Page JavaScript

// DOM Elements
const attractionsContainer = document.getElementById('attractions-container');
const visitMessage = document.getElementById('visit-message');

// Local Storage for visit tracking
const STORAGE_KEY = 'lastVisitDate';

// Initialize the page
document.addEventListener('DOMContentLoaded', async function() {
    await loadAttractions();
    updateVisitMessage();
});

// Load attractions from JSON data
async function loadAttractions() {
    try {
        const response = await fetch('data/attractions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const attractionsData = await response.json();

        const attractions = attractionsData.attractions;
        
        if (!attractions || attractions.length === 0) {
            throw new Error('No attractions data available');
        }

        displayAttractions(attractions);
    } catch (error) {
        console.error('Error loading attractions:', error);
        displayError('Failed to load attractions. Please try again later.');
    }
}

// Display attractions in the grid
function displayAttractions(attractions) {
    attractionsContainer.innerHTML = '';
    
    attractions.forEach(attraction => {
        const card = createAttractionCard(attraction);
        attractionsContainer.appendChild(card);
    });
}

// Create individual attraction card
function createAttractionCard(attraction) {
    const card = document.createElement('article');
    card.className = 'attraction-card';
    
    card.innerHTML = `
        <h2>${attraction.name}</h2>
        <figure>
            <img src="${attraction.image}" alt="${attraction.name}" class="attraction-image" loading="lazy" 
                 onerror="this.onerror=null; this.src='images/placeholder.jpg'; this.alt='Image coming soon'; this.style.backgroundColor='#f0f0f0'; this.style.padding='2rem';">
            <figcaption style="display: none;">${attraction.name}</figcaption>
        </figure>
        <div class="attraction-address">${attraction.address}</div>
        <p class="attraction-description">${attraction.description}</p>
        <button class="learn-more-btn" data-id="${attraction.id}">Learn More</button>
    `;
    
    // Add event listener to the button - FIXED VERSION
    const learnMoreBtn = card.querySelector('.learn-more-btn');
    learnMoreBtn.addEventListener('click', () => {
        console.log('Learn More clicked for:', attraction.name); // Debug line
        showAttractionDetails(attraction); // Pass the entire attraction object
    });
    
    return card;
}

// Show attraction details - FIXED VERSION
function showAttractionDetails(attraction) {
    console.log('showAttractionDetails called with:', attraction); // Debug line
    alert(`More information about: ${attraction.name}\n\nAddress: ${attraction.address}\n\nDescription: ${attraction.description}`);
}

// Update visit message based on localStorage
function updateVisitMessage() {
    const now = Date.now();
    const lastVisit = localStorage.getItem(STORAGE_KEY);
    const messageElement = visitMessage.querySelector('p');
    
    if (!lastVisit) {
        // First visit
        messageElement.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const lastVisitDate = parseInt(lastVisit);
        const daysSinceVisit = Math.floor((now - lastVisitDate) / (1000 * 60 * 60 * 24));
        
        if (daysSinceVisit === 0) {
            messageElement.textContent = "Back so soon! Awesome!";
        } else if (daysSinceVisit === 1) {
            messageElement.textContent = "You last visited 1 day ago.";
        } else {
            messageElement.textContent = `You last visited ${daysSinceVisit} days ago.`;
        }
    }
    
    // Store current visit
    localStorage.setItem(STORAGE_KEY, now.toString());
}

// Display error message
function displayError(message) {
    attractionsContainer.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
            <button onclick="loadAttractions()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">Try Again</button>
        </div>
    `;
}
