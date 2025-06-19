// DOM Elements
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const loaderCounter = document.getElementById('loaderCounter');
const loaderLShape = document.getElementById('loaderLShape');
const navbar = document.getElementById('navbar');
const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const carousel = document.getElementById('carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicators = document.querySelectorAll('.indicator');
const navLinks = document.querySelectorAll('.nav-link');

// State Management
let currentSlide = 0;
const totalSlides = document.querySelectorAll('.carousel-slide').length;
let isScrolling = false;
let loadingProgress = 0;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeEnhancedLoader();
    initializeTheme();
    initializeNavigation();
    initializeCarousel();
    initializeScrollEffects();
    initializeRippleEffect();
    initializeEnhancedRippleEffect();
    initializeParallax();
    initializePopupElements();
    initializeFormHandling();
});

// Enhanced Loader Functionality
function initializeEnhancedLoader() {
    const loadingInterval = setInterval(() => {
        loadingProgress += Math.random() * 3 + 1;
        
        if (loadingProgress >= 100) {
            loadingProgress = 100;
            clearInterval(loadingInterval);
            
            // Update final state
            loaderBar.style.width = '100%';
            loaderCounter.textContent = '100%';
            
            // Start L-shape animation after a brief pause
            setTimeout(() => {
                startLShapeAnimation();
            }, 500);
        } else {
            // Update progress bar and counter
            loaderBar.style.width = loadingProgress + '%';
            loaderCounter.textContent = Math.floor(loadingProgress) + '%';
        }
    }, 50);
}

function startLShapeAnimation() {
    // Hide loader content
    document.querySelector('.loader-content').style.opacity = '0';
    
    // Show and animate L-shape
    loaderLShape.classList.add('active');
    
    // After L-shape animation, expand to full screen
    setTimeout(() => {
        loaderLShape.classList.add('expand');
        
        // Hide loader completely after expansion
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = 'visible';
        }, 1000);
    }, 1200);
}

// Enhanced Ripple Effect System
function initializeEnhancedRippleEffect() {
    // Add ocean ripple effect to all ripple-hover elements
    document.querySelectorAll('.ripple-hover').forEach(element => {
        element.addEventListener('mouseenter', createOceanRipple);
        element.addEventListener('mousemove', createFollowingRipples);
    });
    
    // Add continuous ripple effect to specific elements
    document.querySelectorAll('.service-card, .testimonial-card').forEach(element => {
        element.addEventListener('mouseenter', startContinuousRipples);
        element.addEventListener('mouseleave', stopContinuousRipples);
    });
}

function createOceanRipple(event) {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('div');
    
    const size = Math.max(rect.width, rect.height) * 1.5;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.classList.add('ocean-ripple');
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 2000);
}

function createFollowingRipples(event) {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    
    // Create multiple small ripples that follow the mouse
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const ripple = document.createElement('div');
            const size = 30 + Math.random() * 20;
            const offsetX = (Math.random() - 0.5) * 40;
            const offsetY = (Math.random() - 0.5) * 40;
            const x = event.clientX - rect.left - size / 2 + offsetX;
            const y = event.clientY - rect.top - size / 2 + offsetY;
            
            ripple.classList.add('multi-ripple');
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            element.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 1500);
        }, i * 100);
    }
}

let continuousRippleIntervals = new Map();

function startContinuousRipples(event) {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    
    const interval = setInterval(() => {
        const ripple = document.createElement('div');
        const size = 40 + Math.random() * 30;
        const x = Math.random() * (rect.width - size);
        const y = Math.random() * (rect.height - size);
        
        ripple.classList.add('ocean-ripple');
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.animationDuration = (1 + Math.random()) + 's';
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 2000);
    }, 300);
    
    continuousRippleIntervals.set(element, interval);
}

function stopContinuousRipples(event) {
    const element = event.currentTarget;
    const interval = continuousRippleIntervals.get(element);
    
    if (interval) {
        clearInterval(interval);
        continuousRippleIntervals.delete(element);
    }
}

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Add transition effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

function updateThemeIcon(theme) {
    const themeIcon = themeToggle.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Navigation Functionality
function initializeNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Active link highlighting
    window.addEventListener('scroll', updateActiveNavLink);
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function handleNavbarScroll() {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function updateActiveNavLink() {
    if (isScrolling) return;
    
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Carousel Functionality
function initializeCarousel() {
    if (!carousel) return;
    
    prevBtn.addEventListener('click', () => changeSlide(-1));
    nextBtn.addEventListener('click', () => changeSlide(1));
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
    
    // Auto-play carousel
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.carousel-slide');
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide += direction;
    
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function goToSlide(slideIndex) {
    const slides = document.querySelectorAll('.carousel-slide');
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = slideIndex;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

// Scroll Effects and Popup Elements
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    document.querySelectorAll('.popup-element').forEach(element => {
        observer.observe(element);
    });
}

function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}

function initializePopupElements() {
    // Additional popup animations can be added here
    const popupElements = document.querySelectorAll('.popup-element');
    
    popupElements.forEach((element, index) => {
        element.style.transitionDelay = `${index * 0.1}s`;
    });
}

// Original Ripple Effect for Buttons
function initializeRippleEffect() {
    document.querySelectorAll('.ripple-btn').forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Parallax Effect
function initializeParallax() {
    window.addEventListener('scroll', handleParallax);
}

function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

// Form Handling
function initializeFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData);
    
    // Simulate form submission
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        alert('Thank you for your message! We\'ll get back to you soon.');
        event.target.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        isScrolling = true;
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    });
});

// Keyboard Navigation Support
document.addEventListener('keydown', function(event) {
    // Escape key closes mobile menu
    if (event.key === 'Escape') {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
    
    // Arrow keys for carousel navigation
    if (event.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (event.key === 'ArrowRight') {
        changeSlide(1);
    }
});

// Performance Optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
const debouncedParallax = debounce(handleParallax, 10);
const debouncedNavbarScroll = debounce(handleNavbarScroll, 10);
const debouncedActiveNavLink = debounce(updateActiveNavLink, 100);

window.removeEventListener('scroll', handleParallax);
window.removeEventListener('scroll', handleNavbarScroll);
window.removeEventListener('scroll', updateActiveNavLink);

window.addEventListener('scroll', debouncedParallax);
window.addEventListener('scroll', debouncedNavbarScroll);
window.addEventListener('scroll', debouncedActiveNavLink);

// Accessibility Improvements
function initializeAccessibility() {
    // Add focus indicators for keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Announce theme changes to screen readers
    const themeAnnouncer = document.createElement('div');
    themeAnnouncer.setAttribute('aria-live', 'polite');
    themeAnnouncer.setAttribute('aria-atomic', 'true');
    themeAnnouncer.className = 'sr-only';
    document.body.appendChild(themeAnnouncer);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        themeAnnouncer.textContent = `Switched to ${currentTheme} mode`;
    });
}

// Initialize accessibility features
initializeAccessibility();

// Error Handling
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
    // You could send error reports to a logging service here
});

// Page Visibility API for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.classList.add('page-hidden');
        
        // Stop all continuous ripples
        continuousRippleIntervals.forEach((interval, element) => {
            clearInterval(interval);
        });
        continuousRippleIntervals.clear();
    } else {
        // Resume animations when page becomes visible
        document.body.classList.remove('page-hidden');
    }
});

// Preload critical images
function preloadImages() {
    const criticalImages = [
        'graph.png',
        'stats.png',
        'cards.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
preloadImages();

// Service Worker Registration (for future PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker registration would go here
        console.log('Service Worker support detected');
    });
}

// Analytics and Performance Monitoring
function trackPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart);
            }, 0);
        });
    }
}

trackPerformance();

// Initialize all features when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DataViz Pro website with enhanced effects initialized successfully');
    });
} else {
    console.log('DataViz Pro website with enhanced effects initialized successfully');
}