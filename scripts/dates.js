// Date functionality for footer
function updateDates() {
    // Get current year for copyright
    const currentYear = new Date().getFullYear();
    const currentYearElement = document.getElementById('currentyear');
    
    if (currentYearElement) {
        currentYearElement.textContent = currentYear;
    }
    
    // Get last modified date
    const lastModified = document.lastModified;
    const lastModifiedElement = document.getElementById('lastModified');
    
    if (lastModifiedElement) {
        lastModifiedElement.textContent = `Last Modification: ${lastModified}`;
    }
}

// Initialize dates when DOM has loaded
document.addEventListener('DOMContentLoaded', updateDates);