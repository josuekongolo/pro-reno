/**
 * Pro-Reno AS - Main JavaScript
 * Profesjonell Renovering i Namdalen
 */

(function() {
    'use strict';

    // DOM Elements
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const header = document.querySelector('.header');
    const contactForm = document.getElementById('contact-form');

    /**
     * Mobile Navigation Toggle
     */
    function initMobileNav() {
        if (!mobileMenuToggle || !mobileNav) return;

        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');

            // Toggle aria-expanded
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);

            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking a link
        const mobileNavLinks = mobileNav.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    /**
     * Header scroll effect
     */
    function initHeaderScroll() {
        if (!header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    /**
     * Smooth scroll for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');

                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = header ? header.offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Contact Form Handling
     */
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const formMessage = document.getElementById('form-message');
            const originalBtnText = submitBtn.textContent;

            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sender...';

            // Collect form data
            const formData = {
                name: this.querySelector('#name').value.trim(),
                email: this.querySelector('#email').value.trim(),
                phone: this.querySelector('#phone').value.trim(),
                location: this.querySelector('#location')?.value.trim() || '',
                projectType: this.querySelector('#project-type').value,
                description: this.querySelector('#description').value.trim(),
                wantInspection: this.querySelector('#inspection')?.checked || false
            };

            // Basic validation
            if (!formData.name || !formData.email || !formData.phone || !formData.description) {
                showFormMessage(formMessage, 'Vennligst fyll ut alle obligatoriske felt.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showFormMessage(formMessage, 'Vennligst oppgi en gyldig e-postadresse.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                return;
            }

            // Phone validation (Norwegian format)
            const phoneRegex = /^(\+47)?[\s]?[2-9]\d{7}$/;
            const cleanPhone = formData.phone.replace(/\s/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                showFormMessage(formMessage, 'Vennligst oppgi et gyldig telefonnummer.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                return;
            }

            try {
                // Send form data via Resend API
                // Note: In production, this would call your backend endpoint
                // that handles the Resend API integration
                const response = await sendContactForm(formData);

                if (response.success) {
                    showFormMessage(formMessage,
                        'Takk for din henvendelse! Vi vil kontakte deg så snart som mulig.',
                        'success'
                    );
                    contactForm.reset();
                } else {
                    throw new Error(response.error || 'Noe gikk galt');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showFormMessage(formMessage,
                    'Beklager, noe gikk galt. Vennligst prøv igjen eller ring oss direkte.',
                    'error'
                );
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    /**
     * Send contact form data
     * In production, this would send to your backend API
     */
    async function sendContactForm(data) {
        // Simulate API call for demo purposes
        // Replace with actual API endpoint in production

        return new Promise((resolve) => {
            setTimeout(() => {
                // For demo, always succeed
                // In production, this would be:
                // const response = await fetch('/api/contact', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(data)
                // });
                // return response.json();

                console.log('Form data:', data);
                resolve({ success: true });
            }, 1000);
        });
    }

    /**
     * Show form message
     */
    function showFormMessage(element, message, type) {
        if (!element) return;

        element.textContent = message;
        element.className = 'form-message ' + type;
        element.style.display = 'block';

        // Scroll to message
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
    }

    /**
     * Lazy load images
     */
    function initLazyLoad() {
        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        } else {
            // Fallback for browsers that don't support lazy loading
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
            document.body.appendChild(script);
        }
    }

    /**
     * Set active navigation link
     */
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (currentPath.endsWith(href) ||
                (currentPath === '/' && href === 'index.html') ||
                (currentPath.endsWith('/') && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Animate elements on scroll
     */
    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animate class
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Initialize all functions
     */
    function init() {
        initMobileNav();
        initHeaderScroll();
        initSmoothScroll();
        initContactForm();
        initLazyLoad();
        setActiveNavLink();
        initScrollAnimations();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
