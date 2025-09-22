// Join Page JavaScript Functionality

// Set timestamp when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set current timestamp
    const timestampField = document.getElementById('timestamp');
    const now = new Date();
    timestampField.value = now.toISOString();

    // Initialize modal functionality
    initializeModals();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Set animation delays for cards
    setCardAnimations();
});

// Modal functionality
function initializeModals() {
    // Get all modal triggers
    const modalTriggers = document.querySelectorAll('.info-btn');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');

    // Add click event to each trigger
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'block';
                // Add focus to modal for accessibility
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });

    // Add click event to close buttons
    closeButtons.forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="block"]');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

function closeModal(modal) {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto'; // Re-enable background scrolling
}

// Form validation
function initializeFormValidation() {
    const form = document.getElementById('membershipForm');
    const inputs = form.querySelectorAll('input[required], select[required]');

    // Add real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            // Clear error styling on input
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                removeErrorMessage(this);
            }
        });
    });

    // Form submission validation
    form.addEventListener('submit', function(e) {
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            e.preventDefault();
            // Focus on first invalid field
            const firstInvalid = form.querySelector('.error');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        } else {
            // Update timestamp before submission
            const timestampField = document.getElementById('timestamp');
            const now = new Date();
            timestampField.value = now.toISOString();
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error styling
    field.classList.remove('error');
    removeErrorMessage(field);

    // Check required fields
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }

    // Pattern validation for organizational title
    if (field.id === 'orgTitle' && value) {
        const pattern = /^[A-Za-z\s\-]{7,}$/;
        if (!pattern.test(value)) {
            isValid = false;
            errorMessage = 'Title must be at least 7 characters and contain only letters, spaces, and hyphens.';
        }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
        const phonePattern = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phonePattern.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }

    if (!isValid) {
        field.classList.add('error');
        showErrorMessage(field, errorMessage);
    }

    return isValid;
}

function showErrorMessage(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
}

function removeErrorMessage(field) {
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Card animations
function setCardAnimations() {
    const cards = document.querySelectorAll('.membership-card');
    
    // Set up intersection observer for animation on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        observer.observe(card);
    });
}

// Enhanced accessibility for form navigation
document.addEventListener('keydown', function(e) {
    // Enhanced tab navigation
    if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
            'input, select, textarea, button, a[href], [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Trap focus in modal if one is open
        const openModal = document.querySelector('.modal[style*="block"]');
        if (openModal) {
            const modalFocusableElements = openModal.querySelectorAll(
                'input, select, textarea, button, a[href], [tabindex]:not([tabindex="-1"])'
            );
            
            if (modalFocusableElements.length > 0) {
                const firstModalElement = modalFocusableElements[0];
                const lastModalElement = modalFocusableElements[modalFocusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstModalElement) {
                        e.preventDefault();
                        lastModalElement.focus();
                    }
                } else {
                    if (document.activeElement === lastModalElement) {
                        e.preventDefault();
                        firstModalElement.focus();
                    }
                }
            }
        }
    }
});

// Add smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// Auto-fill timestamp periodically to ensure accuracy
setInterval(() => {
    const timestampField = document.getElementById('timestamp');
    if (timestampField && !document.querySelector('.modal[style*="block"]')) {
        const now = new Date();
        timestampField.value = now.toISOString();
    }
}, 30000); // Update every 30 seconds