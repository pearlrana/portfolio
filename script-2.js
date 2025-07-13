// Pearl Rana Portfolio - JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Initialize EmailJS
    emailjs.init("uRsGGzL8s7dRdkpig");

    // Mobile Navigation Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('show');
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = document.querySelectorAll('#mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('show');
        });
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact Form Handling with EmailJS
    const contactForm = document.getElementById('contact-form');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const submitText = document.getElementById('submit-text');
    const loadingText = document.getElementById('loading-text');
    const formMessage = document.getElementById('form-message');
    const messageText = document.getElementById('message-text');

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitText.classList.add('hidden');
        loadingText.classList.remove('hidden');
        
        // Hide previous messages
        formMessage.classList.add('hidden');
        
        // Get form data
        const formData = new FormData(contactForm);
        const templateParams = {
            from_name: formData.get('name'),
            from_email: formData.get('email'),
            message: formData.get('message'),
            to_name: 'Pearl Rana'
        };

        try {
            // Send email using EmailJS
            const response = await emailjs.send(
                'service_9o8vr7m',
                'template_jkemihk',
                templateParams
            );

            if (response.status === 200) {
                // Success
                showMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('EmailJS error:', error);
            showMessage('Sorry, there was an error sending your message. Please try again or contact me directly.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitText.classList.remove('hidden');
            loadingText.classList.add('hidden');
        }
    });

    // Function to show success/error messages
    function showMessage(message, type) {
        messageText.textContent = message;
        formMessage.className = `mt-4 p-4 rounded-lg ${type}`;
        formMessage.classList.remove('hidden');
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 5000);
    }

    // Form validation enhancement
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            // Remove error styling when user starts typing
            this.classList.remove('border-red-500');
            const errorMsg = this.parentNode.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Validate based on field type
        switch(field.type) {
            case 'text':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            default:
                if (field.tagName.toLowerCase() === 'textarea' && value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long';
                }
        }

        // Show error styling and message
        if (!isValid) {
            field.classList.add('border-red-500');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message text-red-400 text-sm mt-1';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        } else {
            field.classList.remove('border-red-500');
            field.classList.add('border-green-500');
            setTimeout(() => {
                field.classList.remove('border-green-500');
            }, 2000);
        }

        return isValid;
    }

    // Enhanced scroll effects
    let lastScrollTop = 0;
    const navbar = document.querySelector('nav');
    
    window.addEventListener('scroll', function() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove navbar background opacity based on scroll
        if (currentScrollTop > 50) {
            navbar.classList.add('backdrop-blur-md');
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        } else {
            navbar.classList.remove('backdrop-blur-md');
            navbar.style.backgroundColor = '#000000';
        }
        
        // Update active navigation link
        updateActiveNavLink();
        
        lastScrollTop = currentScrollTop;
    });

    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        let currentSection = '';
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('text-purple-300');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('text-purple-300');
            }
        });
    }

    // Parallax effect for hero section
    const heroSection = document.getElementById('home');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }

    // Add loading animation to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            console.warn('Image failed to load:', this.src);
            // You could add a placeholder image here
        });
    });

    // Typing animation for hero text (optional enhancement)
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Enhanced accessibility features
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('show');
        }
    });

    // Focus management for mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        if (!mobileMenu.classList.contains('hidden')) {
            // Focus first link when menu opens
            const firstLink = mobileMenu.querySelector('a');
            if (firstLink) {
                firstLink.focus();
            }
        }
    });

    // Preload critical images
    const criticalImages = ['pearl.jpg'];
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Performance optimization: Lazy load non-critical content
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.trait-card, .card');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    console.log('Portfolio loaded successfully! ✨');
});

// Utility functions
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

// Error handling for global errors
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // You could send error reports to a logging service here
});

// Service worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment if you want to add PWA capabilities
        // navigator.serviceWorker.register('/sw.js');
    });
}
