// ==============================================
// ABSOLUTE AUTHENTICS - SELL PAGE (SIMPLIFIED)
// ==============================================

// ==============================================
// MOBILE MENU FUNCTIONALITY
// ==============================================

const menuToggle = document.getElementById('menuToggle');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const body = document.body;

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        mobileMenuOverlay.classList.add('active');
        body.style.overflow = 'hidden';
    });
}

if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', () => {
        mobileMenuOverlay.classList.remove('active');
        body.style.overflow = '';
    });
}

// Close menu when clicking on overlay
if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
            mobileMenuOverlay.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

// Close menu when clicking on a link
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuOverlay.classList.remove('active');
        body.style.overflow = '';
    });
});

// ==============================================
// NEWSLETTER POPUP FUNCTIONALITY
// ==============================================

function initNewsletterPopup() {
    const popup = document.getElementById('newsletterPopup');
    if (!popup) {
        console.error('Newsletter popup not found');
        return;
    }
    
    const closeBtn = popup.querySelector('.close-popup');
    const form = document.getElementById('newsletterForm');
    
    // Check if user has already subscribed
    const hasSubscribed = localStorage.getItem('aa_newsletter_subscribed');
    
    console.log('Newsletter popup initialized. Has subscribed:', hasSubscribed);
    
    if (!hasSubscribed) {
        // Show popup after 5 seconds
        console.log('Newsletter popup will show in 5 seconds...');
        setTimeout(() => {
            console.log('Showing newsletter popup now');
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 5000);
    } else {
        console.log('User already subscribed, popup will not show');
    }
    
    // Close button handler
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            popup.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close when clicking overlay
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Form submission
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            submitBtn.disabled = true;
            
            try {
                const formData = {
                    name: document.getElementById('subscriberName').value,
                    email: document.getElementById('subscriberEmail').value,
                    phone: document.getElementById('subscriberPhone').value,
                    interests: document.getElementById('subscriberInterests').value,
                    source: 'sell-page-popup',
                    subscribed_at: new Date().toISOString()
                };
                
                const response = await fetch('tables/newsletter_subscribers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    // Store subscription status
                    localStorage.setItem('aa_newsletter_subscribed', 'true');
                    
                    // Show success and close
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                    
                    setTimeout(() => {
                        popup.classList.remove('active');
                        document.body.style.overflow = '';
                        form.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 2000);
                } else {
                    throw new Error('Subscription failed');
                }
            } catch (error) {
                console.error('Newsletter subscription error:', error);
                submitBtn.innerHTML = 'Try Again';
                submitBtn.disabled = false;
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                }, 3000);
            }
        });
    }
}

// ==============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==============================================
// SCROLL ANIMATIONS
// ==============================================

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

// Observe sections
document.querySelectorAll('.athletes-section, .what-we-buy-section, .sell-contact-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Staggered animation for athlete cards
const athleteCards = document.querySelectorAll('.athlete-card');
athleteCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
    
    observer.observe(card);
});

// ==============================================
// INITIALIZE ON PAGE LOAD
// ==============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing newsletter popup...');
    initNewsletterPopup();
    
    // Add scroll indicator animation
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }
    
    // Developer tool: Press Shift+N to test newsletter popup
    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key === 'N') {
            console.log('Manual popup trigger (Shift+N pressed)');
            const popup = document.getElementById('newsletterPopup');
            if (popup) {
                popup.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
        // Press Shift+C to clear newsletter subscription status
        if (e.shiftKey && e.key === 'C') {
            localStorage.removeItem('aa_newsletter_subscribed');
            console.log('Newsletter subscription status cleared. Reload page to see popup again.');
            alert('Newsletter subscription cleared! Reload the page to see the popup again.');
        }
    });
});

// ==============================================
// NAVBAR SCROLL EFFECT
// ==============================================

let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});
