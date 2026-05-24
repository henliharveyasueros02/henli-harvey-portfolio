// Mobile nav toggle
function toggleNav() {
  const links = document.querySelector('.nav__links');
  const toggle = document.querySelector('.nav__toggle');
  if (!links) return;
  const isOpen = links.classList.toggle('open');
  links.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  if (toggle) toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  // Add a class to body so we can animate or lock scroll if desired
  document.body.classList.toggle('nav-open', isOpen);
  if (toggle) toggle.classList.toggle('is-open', isOpen);
}

// Close nav on link click (mobile)
document.querySelectorAll('.nav__links a').forEach(link => {
  link.addEventListener('click', () => {
    const links = document.querySelector('.nav__links');
    if (links) {
      links.classList.remove('open');
      links.setAttribute('aria-hidden', 'true');
    }
    const toggle = document.querySelector('.nav__toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (toggle) toggle.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  });
});

// Close mobile nav when clicking outside or pressing Escape
document.addEventListener('click', (e) => {
  const links = document.querySelector('.nav__links');
  const toggle = document.querySelector('.nav__toggle');
  if (!links || !links.classList.contains('open')) return;
  const withinNav = e.composedPath && e.composedPath().some(el => el === links || el === toggle);
  if (!withinNav) {
    links.classList.remove('open');
    links.setAttribute('aria-hidden', 'true');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (toggle) toggle.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const links = document.querySelector('.nav__links');
    const toggle = document.querySelector('.nav__toggle');
    if (links && links.classList.contains('open')) {
      links.classList.remove('open');
      links.setAttribute('aria-hidden', 'true');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      if (toggle) toggle.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    }
  }
});

// Dark mode toggle
function initDarkMode() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const isDarkMode = localStorage.getItem('darkMode') === 'true';

  const moonSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const sunSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  // Apply saved preference on page load
  if (isDarkMode) document.body.classList.add('dark-mode');

  if (darkModeToggle) {
    const setIcon = (isDark) => {
      darkModeToggle.innerHTML = isDark ? sunSVG : moonSVG;
      darkModeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    };

    setIcon(isDarkMode);

    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', isDark ? 'true' : 'false');
      setIcon(isDark);
    });
  }
}

// Back to top button functionality
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  
  if (!backToTopBtn) return;
  
  // Show/hide button on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });
  
  // Smooth scroll to top on click
  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Initialize dark mode and back-to-top on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initBackToTop();
  });
} else {
  initDarkMode();
  initBackToTop();
}

// Scroll fade-in animations
const observerOptions = { threshold: 0.12 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Stagger reveal for a broader set of elements
const revealSelectors = ['.service-card', '.project-card', '.skill-group', '.strength-card', '.highlight', 'section', '.intro-strip'];
const revealEls = document.querySelectorAll(revealSelectors.join(','));
revealEls.forEach((el, i) => {
  el.classList.add('fade-in');
  // Stagger slightly per element for a natural reveal
  el.style.transitionDelay = `${Math.min(300, i * 40)}ms`;
  observer.observe(el);
});

// Smooth scrolling for internal anchors with offset for sticky nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 12;
      window.scrollTo({ top, behavior: 'smooth' });
      // Close mobile nav if open
      const links = document.querySelector('.nav__links');
      if (links && links.classList.contains('open')) {
        links.classList.remove('open');
        links.setAttribute('aria-hidden', 'true');
        const toggle = document.querySelector('.nav__toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    }
  });
});

// Rate limiting storage
const RATE_LIMIT_KEY = 'contactFormSubmissions';
const RATE_LIMIT_WINDOW = 3600000; // 1 hour in milliseconds
const RATE_LIMIT_MAX = 5; // Max 5 submissions per hour

function checkRateLimit() {
  const now = Date.now();
  const submissions = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
  const recentSubmissions = submissions.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentSubmissions.length >= RATE_LIMIT_MAX) {
    const oldestSubmission = Math.min(...recentSubmissions);
    const nextAvailableTime = new Date(oldestSubmission + RATE_LIMIT_WINDOW);
    return { allowed: false, retryAfter: nextAvailableTime };
  }
  
  return { allowed: true };
}

function recordSubmission() {
  const now = Date.now();
  const submissions = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
  submissions.push(now);
  const recentSubmissions = submissions.filter(time => now - time < RATE_LIMIT_WINDOW);
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recentSubmissions));
}

// Contact form validation and handling
function initContactForm() {
  const form = document.querySelector('form[action*="web3forms"]');
  if (!form) return;

  const submitBtn = document.getElementById('submit-btn');
  const formMsg = document.getElementById('form-msg');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const honeypotInput = document.getElementById('website');

  // Real-time validation on input
  [nameInput, emailInput, messageInput].forEach(input => {
    if (input) {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => clearError(input));
    }
  });

  // Validate individual field
  function validateField(field) {
    const errorEl = document.getElementById(`error-${field.id}`);
    if (!errorEl) return true;

    let error = '';
    
    if (field.id === 'name') {
      if (!field.value.trim()) error = 'Name is required.';
      else if (field.value.trim().length < 2) error = 'Name must be at least 2 characters.';
    } else if (field.id === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!field.value.trim()) error = 'Email is required.';
      else if (!emailRegex.test(field.value.trim())) error = 'Please enter a valid email address.';
    } else if (field.id === 'message') {
      if (!field.value.trim()) error = 'Message is required.';
      else if (field.value.trim().length < 10) error = 'Message must be at least 10 characters.';
    }

    if (error) {
      errorEl.textContent = error;
      field.setAttribute('aria-invalid', 'true');
      return false;
    } else {
      errorEl.textContent = '';
      field.setAttribute('aria-invalid', 'false');
      return true;
    }
  }

  // Clear error on focus
  function clearError(field) {
    const errorEl = document.getElementById(`error-${field.id}`);
    if (errorEl) {
      errorEl.textContent = '';
      field.removeAttribute('aria-invalid');
    }
  }

  // Validate form before submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Reset message
    formMsg.textContent = '';
    formMsg.style.color = '';

    // Honeypot check (if filled, it's spam)
    if (honeypotInput && honeypotInput.value.trim()) {
      console.warn('Spam attempt detected: honeypot field filled');
      formMsg.textContent = 'Thank you! Your message has been sent.';
      formMsg.style.color = 'var(--peach)';
      form.reset();
      return;
    }

    // Rate limit check
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
      formMsg.textContent = `Please wait before submitting another message. Try again after ${rateLimitCheck.retryAfter.toLocaleTimeString()}.`;
      formMsg.style.color = '#d32f2f';
      return;
    }

    // Validate all required fields
    let isValid = true;
    [nameInput, emailInput, messageInput].forEach(input => {
      if (!validateField(input)) isValid = false;
    });

    if (!isValid) {
      formMsg.textContent = 'Please fix the errors above.';
      formMsg.style.color = '#d32f2f';
      return;
    }

    // Disable button and show loading state
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';

    // Submit form via fetch to avoid page redirect for now
    const formData = new FormData(form);
    
    fetch(form.action, {
      method: form.method,
      body: formData
    })
    .then(response => {
      if (response.ok) {
        recordSubmission();
        formMsg.textContent = 'Thank you! Your message has been sent. I\'ll reply within 24 hours.';
        formMsg.style.color = 'var(--peach)';
        form.reset();
        // Clear validation states
        [nameInput, emailInput, messageInput].forEach(input => {
          input.removeAttribute('aria-invalid');
        });
        // Redirect after delay
        setTimeout(() => {
          window.location.href = form.querySelector('input[name="redirect"]')?.value || '/thankyou.html';
        }, 2000);
      } else {
        formMsg.textContent = 'Error sending message. Please try again.';
        formMsg.style.color = '#d32f2f';
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    })
    .catch(error => {
      console.error('Form submission error:', error);
      formMsg.textContent = 'Error sending message. Please try again.';
      formMsg.style.color = '#d32f2f';
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    });
  });
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForm);
} else {
  initContactForm();
}
