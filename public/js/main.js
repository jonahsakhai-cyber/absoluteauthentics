/**
 * Absolute Authentics - Premium Sports Memorabilia
 * Main JavaScript for interactions and animations
 */

// ==========================================
// SMOOTH SCROLLING & NAVIGATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initFiltering();
    initScrollEffects();
    initHeroAnimations();
    initProductCards();
    initPaymentStepsAnimation();
    initNewsletterPopup();
});

/**
 * Navigation interactions
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.8)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
    
    // Active link highlighting
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close menu when clicking outside
    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Product filtering system
 */
function initFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter products with smooth animation
            productCards.forEach((card, index) => {
                const categories = card.getAttribute('data-category');
                
                setTimeout(() => {
                    if (filter === 'all' || categories.includes(filter)) {
                        card.classList.remove('hidden');
                        card.style.animation = 'fadeInUp 0.6s ease forwards';
                    } else {
                        card.style.animation = 'fadeOut 0.4s ease forwards';
                        setTimeout(() => {
                            card.classList.add('hidden');
                        }, 400);
                    }
                }, index * 50);
            });
        });
    });
}

/**
 * Scroll-based animations and effects
 */
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.product-card, .auth-feature, .trust-item, .payment-plans-section .section-header');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Who We Are Section - Enhanced scroll animations
    const whoSection = document.querySelector('.who-we-are-section');
    const whoLabel = document.querySelector('.who-label');
    const whoTitle = document.querySelector('.who-title');
    const whoDescription = document.querySelector('.who-description');
    const whoFeatureCards = document.querySelectorAll('.who-feature-card');
    
    if (whoSection) {
        // Trigger section animations
        const whoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    whoSection.classList.add('section-visible');
                    whoObserver.unobserve(whoSection);
                }
            });
        }, {
            threshold: 0.2
        });
        
        whoObserver.observe(whoSection);
        
        // Stagger animations for individual elements
        const elementsToAnimate = [whoLabel, whoTitle, whoDescription];
        elementsToAnimate.forEach((el, index) => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
            }
        });
        
        // Animate feature cards
        whoFeatureCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
        });
        
        // Observer for triggering staggered animations
        const contentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate header elements
                    elementsToAnimate.forEach((el, index) => {
                        if (el) {
                            setTimeout(() => {
                                el.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                                el.style.opacity = '1';
                                el.style.transform = 'translateY(0)';
                            }, 300 + (index * 200));
                        }
                    });
                    
                    // Animate feature cards with stagger
                    whoFeatureCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 900 + (index * 150));
                    });
                    
                    contentObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15
        });
        
        if (whoLabel) contentObserver.observe(whoLabel);
        
        // Parallax effect on background image
        const whoBackground = document.querySelector('.who-background-image');
        if (whoBackground) {
            window.addEventListener('scroll', throttle(() => {
                const rect = whoSection.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // Only apply parallax when section is in viewport
                if (rect.top < windowHeight && rect.bottom > 0) {
                    // Calculate parallax offset
                    const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
                    const parallaxOffset = (scrollProgress - 0.5) * 50; // Subtle parallax
                    whoBackground.style.transform = `translateY(${parallaxOffset}px) scale(1.05)`;
                }
            }, 16));
        }
    }
}

/**
 * Hero section animations
 */
function initHeroAnimations() {
    const heroContent = document.querySelector('.hero-content');
    const heroElements = heroContent.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-cta');
    
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 200 + (index * 150));
    });
    
    // Scroll indicator animation
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const filterSection = document.querySelector('.filter-section');
            filterSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

/**
 * Product card interactions
 */
function initProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const viewDetailsBtn = card.querySelector('.btn-view-details');
        const inquireBtn = card.querySelector('.btn-inquire');
        
        // View details interaction
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showProductModal(card);
            });
        }
        
        // Inquire button interaction
        if (inquireBtn) {
            inquireBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showInquiryForm(card);
            });
        }
        
        // LED glow effect on hover
        card.addEventListener('mouseenter', () => {
            const ledGlow = card.querySelector('.product-led-glow');
            if (ledGlow) {
                ledGlow.style.opacity = '1';
                ledGlow.style.transition = 'opacity 0.6s ease';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const ledGlow = card.querySelector('.product-led-glow');
            if (ledGlow) {
                ledGlow.style.opacity = '0.6';
            }
        });
        
        // Parallax effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/**
 * Show product detail modal (placeholder)
 */
function showProductModal(card) {
    const productTitle = card.querySelector('.product-title').textContent;
    const productPrice = card.querySelector('.product-price').textContent;
    
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h2>${productTitle}</h2>
            <p class="modal-price">${productPrice}</p>
            <div class="modal-details">
                <h3>Product Details</h3>
                <ul>
                    <li><strong>Authenticity:</strong> 100% Verified with COA</li>
                    <li><strong>Condition:</strong> Gem Mint</li>
                    <li><strong>Frame:</strong> Museum-grade LED display</li>
                    <li><strong>Delivery:</strong> Fully insured shipping</li>
                </ul>
                <button class="btn btn-primary" style="margin-top: 2rem;">Request Information</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: linear-gradient(135deg, #151515 0%, #1a1a1a 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 3rem;
            max-width: 600px;
            width: 100%;
            position: relative;
            animation: slideUp 0.4s ease;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
        }
        
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: transparent;
            border: none;
            color: #c0c0c0;
            font-size: 2rem;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-close:hover {
            color: #00d4ff;
            transform: rotate(90deg);
        }
        
        .modal-content h2 {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 1rem;
            color: #ffffff;
        }
        
        .modal-price {
            font-size: 2rem;
            font-weight: 800;
            color: #00d4ff;
            margin-bottom: 2rem;
        }
        
        .modal-details h3 {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #ffffff;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
        
        .modal-details ul {
            list-style: none;
            padding: 0;
        }
        
        .modal-details li {
            padding: 0.75rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            color: #c0c0c0;
            font-size: 1rem;
        }
        
        .modal-details li strong {
            color: #ffffff;
            margin-right: 0.5rem;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Close modal handlers
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        }, 300);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBtn.click();
        }
    });
}

/**
 * Show inquiry form (placeholder)
 */
function showInquiryForm(card) {
    const productTitle = card.querySelector('.product-title').textContent;
    
    // Create inquiry modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h2>Inquire About ${productTitle}</h2>
            <form class="inquiry-form">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="Enter your full name" required>
                </div>
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="Enter your phone number">
                </div>
                <div class="form-group">
                    <label>Message</label>
                    <textarea rows="4" placeholder="Tell us about your interest in this piece..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                    Submit Inquiry
                </button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add form styles
    const style = document.createElement('style');
    style.textContent = `
        .inquiry-form {
            margin-top: 2rem;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            font-size: 0.9rem;
            font-weight: 600;
            color: #c0c0c0;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: #ffffff;
            font-family: 'Inter', sans-serif;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #00d4ff;
            background: rgba(0, 212, 255, 0.05);
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
        }
        
        .form-group textarea {
            resize: vertical;
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Form submission handler
    const form = modal.querySelector('.inquiry-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show success message
        const modalContent = modal.querySelector('.modal-content');
        modalContent.innerHTML = `
            <button class="modal-close">&times;</button>
            <div style="text-align: center; padding: 2rem 0;">
                <div style="font-size: 4rem; color: #00d4ff; margin-bottom: 1rem;">✓</div>
                <h2>Inquiry Received</h2>
                <p style="color: #c0c0c0; margin-top: 1rem; font-size: 1.1rem;">
                    Thank you for your interest. Our team will contact you within 24 hours.
                </p>
                <button class="btn btn-primary" style="margin-top: 2rem;" onclick="this.closest('.modal-overlay').querySelector('.modal-close').click()">
                    Close
                </button>
            </div>
        `;
        
        const closeBtn = modalContent.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.head.removeChild(style);
            }, 300);
        });
    });
    
    // Close modal handlers
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        }, 300);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBtn.click();
        }
    });
}

// ==========================================
// SMOOTH PAGE TRANSITIONS
// ==========================================

// Add CSS animations
const animations = document.createElement('style');
animations.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.95);
        }
    }
`;
document.head.appendChild(animations);

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================

// Lazy load images when they're implemented
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Throttle function for performance
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
}

// Debounce function for performance
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// ==========================================
// PAYMENT STEPS SCROLL ANIMATION
// ==========================================

/**
 * Animate payment steps on scroll with staggered timing
 */
function initPaymentStepsAnimation() {
    const paymentSteps = document.querySelectorAll('.payment-step');
    
    if (paymentSteps.length === 0) return;
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class
                entry.target.classList.add('animate-in');
                
                // Optional: Unobserve after animation to prevent re-triggering
                // stepObserver.unobserve(entry.target);
            } else {
                // Remove class when scrolling back up for re-animation
                // entry.target.classList.remove('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all payment steps
    paymentSteps.forEach(step => {
        stepObserver.observe(step);
    });
    
    // Add special effects for arrows
    const arrows = document.querySelectorAll('.step-connector-arrow');
    arrows.forEach((arrow, index) => {
        const stepNumber = index + 1;
        arrow.style.transitionDelay = `${0.3 + (stepNumber * 0.2)}s`;
    });
}

// ==========================================
// ACCESSIBILITY ENHANCEMENTS
// ==========================================

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key closes modals
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) closeBtn.click();
        }
    }
});

// Focus trap for modals
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// ==========================================
// CONTACT FORM SUBMISSION
// ==========================================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('contactSubmitBtn');
        const statusDiv = document.getElementById('contactFormStatus');
        const originalBtnText = submitBtn.textContent;
        
        // Get form data
        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value || '',
            subject: document.getElementById('contactSubject').value || 'General Inquiry',
            message: document.getElementById('contactMessage').value || '',
            status: 'new',
            source: 'contact-form'
        };
        
        try {
            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            submitBtn.style.opacity = '0.6';
            
            // Submit to database
            const response = await fetch('tables/contact_inquiries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to submit form');
            }
            
            // Success
            statusDiv.innerHTML = `
                <div style="color: #22c55e; font-weight: 600; padding: 1rem; background: rgba(34, 197, 94, 0.1); border-radius: 8px; border: 1px solid rgba(34, 197, 94, 0.3);">
                    <i class="fas fa-check-circle"></i> Message sent successfully! We'll get back to you soon.
                </div>
            `;
            
            // Reset form
            contactForm.reset();
            
            // Reset button after 2 seconds
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                submitBtn.style.opacity = '1';
            }, 2000);
            
            // Clear success message after 5 seconds
            setTimeout(() => {
                statusDiv.innerHTML = '';
            }, 5000);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Error message
            statusDiv.innerHTML = `
                <div style="color: #ef4444; font-weight: 600; padding: 1rem; background: rgba(239, 68, 68, 0.1); border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.3);">
                    <i class="fas fa-exclamation-circle"></i> Failed to send message. Please try again or contact us directly.
                </div>
            `;
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            submitBtn.style.opacity = '1';
            
            // Clear error message after 5 seconds
            setTimeout(() => {
                statusDiv.innerHTML = '';
            }, 5000);
        }
    });
}

// ==========================================
// NEWSLETTER POP-UP
// ==========================================

function initNewsletterPopup() {
    const popup = document.getElementById('newsletterPopup');
    const closeBtn = document.getElementById('newsletterClose');
    const form = document.getElementById('newsletterForm');
    const successDiv = document.getElementById('newsletterSuccess');
    
    if (!popup) return;
    
    // Check if user has already subscribed (using localStorage)
    const hasSubscribed = localStorage.getItem('aa_newsletter_subscribed');
    
    if (!hasSubscribed) {
        // Show popup after 30 seconds
        setTimeout(() => {
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 30000);
    }
    
    // Close popup
    const closePopup = () => {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    closeBtn.addEventListener('click', closePopup);
    
    // Close on overlay click
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closePopup();
        }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            closePopup();
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.newsletter-submit');
        const originalHTML = submitBtn.innerHTML;
        
        // Get form data
        const formData = {
            name: document.getElementById('subscriberName').value,
            email: document.getElementById('subscriberEmail').value,
            phone: document.getElementById('subscriberPhone').value,
            interests: document.getElementById('subscriberInterests').value,
            subscribed_at: new Date().toISOString(),
            source: 'homepage-popup'
        };
        
        try {
            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining...';
            
            // Submit to database
            const response = await fetch('tables/newsletter_subscribers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to subscribe');
            }
            
            // Success - hide form and show success message
            form.style.display = 'none';
            successDiv.style.display = 'block';
            
            // Mark as subscribed in localStorage
            localStorage.setItem('aa_newsletter_subscribed', 'true');
            
            // Close popup after 3 seconds
            setTimeout(() => {
                closePopup();
            }, 3000);
            
        } catch (error) {
            console.error('Error subscribing:', error);
            
            // Show error message
            alert('Failed to join the VIP list. Please try again or contact us directly.');
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
        }
    });
}

console.log('🔷 Absolute Authentics - Premium Sports Memorabilia Platform Initialized');
