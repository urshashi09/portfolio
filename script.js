/* ==========================================================================
   Urshashi Majumder Portfolio Script
   Logic: Particle System, Scroll Reveal, Form Handling, Interactivity
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const skillsGrid = document.querySelector('.skills-grid');
  if (skillsGrid) {
    const skillCards = Array.from(skillsGrid.querySelectorAll('.skills-card'))
      .sort((first, second) => Number(first.dataset.skillOrder) - Number(second.dataset.skillOrder));
    skillsGrid.replaceChildren(...skillCards);
  }

  const projectGrid = document.querySelector('.projects-grid');
  if (projectGrid) {
    const projectCards = Array.from(projectGrid.querySelectorAll('.project-card'))
      .sort((first, second) => Number(first.dataset.projectPriority) - Number(second.dataset.projectPriority));
    projectGrid.replaceChildren(...projectCards);
  }

  // ==========================================
  // 1. Navigation & Header Scroll Behavior
  // ==========================================
  const header = document.getElementById('header');
  const menuBtn = document.getElementById('menu-btn');
  const navLinksList = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  const scrollProgress = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    // 1. Scroll Progress Bar
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
    } else {
      scrollProgress.style.width = '0%';
    }

    // 2. Header Scrolled Styling
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile navigation drawer toggle
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    navLinksList.classList.toggle('open');
  });

  // Close mobile navigation drawer on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('open');
      navLinksList.classList.remove('open');
    });
  });


  // ==========================================
  // 2. Active Link Highlighting on Scroll
  // ==========================================
  const sections = document.querySelectorAll('section');
  
  const navObserverOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Triggers when section occupies middle part of screen
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => {
    navObserver.observe(section);
  });


  // ==========================================
  // 3. Scroll Reveal Animation with Staggering
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -6% 0px',
    threshold: 0.05
  };

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger card reveals smoothly
          setTimeout(() => {
            entry.target.classList.remove('reveal-pending');
            entry.target.classList.add('active');
          }, index * 40);
          observer.unobserve(entry.target);
        }
      });
    }, revealObserverOptions);

    revealElements.forEach(element => {
      element.classList.add('reveal-pending');
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(element => {
      element.classList.add('active');
    });
  }


  // ==========================================
  // 3b. Scroll-Triggered Tactile Box Entrance
  // ==========================================
  const scrollBoxes = document.querySelectorAll('.scroll-box');

  const scrollBoxOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.08
  };

  if ('IntersectionObserver' in window) {
    const boxObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, scrollBoxOptions);

    scrollBoxes.forEach(box => boxObserver.observe(box));
  } else {
    scrollBoxes.forEach(box => box.classList.add('active'));
  }


  // ==========================================
  // 4. Dynamic Retro Terminal Typewriter Effect
  // ==========================================
  const typewriterElement = document.getElementById('role-typewriter');
  if (typewriterElement) {
    const roles = [
      'BACKEND & AI DEVELOPER',
      'REST APIs & MICROSERVICES',
      'EVENT-DRIVEN ARCHITECTURE',
      'RAG & AGENTIC WORKFLOWS',
      'DISTRIBUTED SYSTEMS BUILDER'
    ];
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let isDeleting = false;
    let typingSpeed = 65;

    function typeLoop() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 30;
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 65;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2200; // Pause at end of title
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400; // Brief breath before starting next title
      }

      setTimeout(typeLoop, typingSpeed);
    }

    // Start typing after initial display pause
    setTimeout(typeLoop, 2000);
  }


  // ==========================================
  // 5. Animated Number Counters
  // ==========================================
  const counters = document.querySelectorAll('.stat-counter');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseFloat(counter.getAttribute('data-target'));
          const isDecimal = counter.getAttribute('data-decimal') === '1';
          const duration = 1200;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = target * easeOut;

            counter.textContent = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = isDecimal ? target.toFixed(1) : target;
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.25 });

    counters.forEach(counter => counterObserver.observe(counter));
  }


  // ==========================================
  // 6. Tactile 3D Tilt on Hover for Project Cards
  // ==========================================
  if (window.matchMedia('(hover: hover) and (min-width: 768px)').matches) {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }


  // ==========================================
  // 7. Tactile Ambient Sparks Canvas (Hero)
  // ==========================================
  const canvas = document.getElementById('particles-canvas');
  const heroSection = document.getElementById('hero');

  if (canvas && heroSection) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    function resizeCanvas() {
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', () => {
      resizeCanvas();
      initSparks();
    });

    let mouse = {
      x: null,
      y: null,
      radius: 100
    };

    heroSection.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    const sparkShapes = ['✦', '•', '+', '◆'];
    const sparkColors = [
      'rgba(30, 41, 59, 0.22)',   // soft slate
      'rgba(245, 158, 11, 0.35)', // warm amber
      'rgba(16, 185, 129, 0.28)', // fresh emerald
      'rgba(59, 130, 246, 0.30)'  // gentle blue
    ];

    class Spark {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.shape = sparkShapes[Math.floor(Math.random() * sparkShapes.length)];
        this.color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
        this.size = Math.floor(Math.random() * 6) + 8; // 8px - 14px
        this.speedX = (Math.random() * 0.4) - 0.2;
        this.speedY = (Math.random() * -0.5) - 0.1; // slow gentle upward drift
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() * 0.6) - 0.3;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.font = `${this.size}px "Plus Jakarta Sans", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.shape, 0, 0);
        ctx.restore();
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        // Wrap around smoothly
        if (this.y < -10) this.y = canvas.height + 10;
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;

        // Soft magnetic mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const force = (1 - distance / mouse.radius) * 1.5;
            this.x -= (dx / distance) * force;
            this.y -= (dy / distance) * force;
          }
        }

        this.draw();
      }
    }

    function initSparks() {
      particlesArray = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 16000), 40);
      for (let i = 0; i < count; i++) {
        particlesArray.push(new Spark());
      }
    }

    let animationId;
    function animateSparks() {
      animationId = requestAnimationFrame(animateSparks);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
    }

    initSparks();
    animateSparks();
  }


  // ==========================================
  // 5. Form Validation & Toast Notification
  // ==========================================
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  function showToast(message, isSuccess = true) {
    toastText.textContent = message;
    toast.style.borderColor = isSuccess ? '#8b5cf6' : '#ef4444';
    toast.querySelector('.toast-icon').style.color = isSuccess ? '#8b5cf6' : '#ef4444';
    
    // Toggle icon depending on state
    if (isSuccess) {
      toast.querySelector('svg').innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />';
    } else {
      toast.querySelector('svg').innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />';
    }

    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    let isValid = true;
    let errorMessage = '';

    // Validate Name
    if (nameInput.value.trim() === '') {
      isValid = false;
      nameInput.style.borderColor = '#ef4444';
      errorMessage = 'Please enter your name.';
    } else {
      nameInput.style.borderColor = '';
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      isValid = false;
      emailInput.style.borderColor = '#ef4444';
      if (!errorMessage) errorMessage = 'Please enter a valid email address.';
    } else {
      emailInput.style.borderColor = '';
    }

    // Validate Subject
    if (subjectInput.value.trim() === '') {
      isValid = false;
      subjectInput.style.borderColor = '#ef4444';
      if (!errorMessage) errorMessage = 'Please enter a subject.';
    } else {
      subjectInput.style.borderColor = '';
    }

    // Validate Message
    if (messageInput.value.trim() === '') {
      isValid = false;
      messageInput.style.borderColor = '#ef4444';
      if (!errorMessage) errorMessage = 'Please enter your message.';
    } else {
      messageInput.style.borderColor = '';
    }

    if (!isValid) {
      showToast(errorMessage, false);
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnContent = submitBtn ? submitBtn.innerHTML : '<span>SEND MESSAGE</span> <span>✈️</span>';

    // Show sending / pending state on submit button
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>SENDING...</span> <span>⏳</span>';
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'd9aff404-848b-4a1a-8fb4-b638eea10f5f',
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          subject: subjectInput.value.trim(),
          message: messageInput.value.trim(),
          from_name: 'Portfolio Contact Memo',
          botcheck: document.getElementById('botcheck')?.checked || false
        })
      });

      const result = await response.json();

      if (response.status === 200 && result.success) {
        // Confetti burst on successful submission
        if (submitBtn) {
          const rect = submitBtn.getBoundingClientRect();
          spawnConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 36);
        }
        showToast('Thank you! Your message has been sent successfully.', true);
        form.reset();
      } else {
        const errorMsg = result.message || 'Submission failed. Please email urshashimaj@gmail.com directly.';
        showToast(errorMsg, false);
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      showToast('Network error. Please email urshashimaj@gmail.com directly.', false);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
      }
    }
  });

  // Clear error border color when user focuses back on the fields
  const inputs = document.querySelectorAll('.form-input');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.style.borderColor = '';
    });
  });


  // ==========================================
  // 8. Tactile Scrapbook Confetti Burst
  // ==========================================
  function spawnConfetti(originX, originY, count = 28) {
    const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#1e293b'];
    for (let i = 0; i < count; i++) {
      const flake = document.createElement('div');
      flake.className = 'confetti-flake';
      const color = colors[Math.floor(Math.random() * colors.length)];
      flake.style.backgroundColor = color;

      const angle = (Math.random() * Math.PI * 2);
      const distance = Math.random() * 120 + 30;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 20; // slight upward burst bias
      const rot = (Math.random() * 720) - 360;
      const size = Math.floor(Math.random() * 6) + 6;

      flake.style.width = `${size}px`;
      flake.style.height = `${size}px`;
      flake.style.left = `${originX}px`;
      flake.style.top = `${originY}px`;
      flake.style.setProperty('--tx', `${tx}px`);
      flake.style.setProperty('--ty', `${ty}px`);
      flake.style.setProperty('--rot', `${rot}deg`);

      document.body.appendChild(flake);
      setTimeout(() => flake.remove(), 900);
    }
  }


  // ==========================================
  // 9. Magnetic Button Hover Physics
  // ==========================================
  if (window.matchMedia('(hover: hover) and (min-width: 768px)').matches) {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }


  // ==========================================
  // 10. Hand-Drawn Doodle SVG Stroke Animation
  // ==========================================
  const doodlePaths = document.querySelectorAll('.doodle-path');
  if (doodlePaths.length > 0 && 'IntersectionObserver' in window) {
    doodlePaths.forEach(path => {
      try {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)';
      } catch (err) {
        // Fallback gracefully for any unsupported SVG engines
      }
    });

    const pathObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.strokeDashoffset = '0';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    doodlePaths.forEach(path => pathObserver.observe(path));
  }

});
