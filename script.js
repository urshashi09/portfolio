/* ==========================================================================
   Urshashi Majumder Portfolio Script
   Logic: Particle System, Scroll Reveal, Form Handling, Interactivity
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

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
  // 3. Scroll Reveal Animation
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Triggers when 15% of the element is visible
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once revealed to keep layout responsive
        observer.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });


  // ==========================================
  // 4. Interactive Canvas Particle Background
  // ==========================================
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  const heroSection = document.getElementById('hero');

  let particlesArray = [];
  let numberOfParticles = 70;
  
  // Set dimensions
  function resizeCanvas() {
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  // Track mouse coordinates
  let mouse = {
    x: null,
    y: null,
    radius: 120
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

  // Particle blueprint class
  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }

    // Draw particle
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    // Update particle position
    update() {
      // Bounce particles off borders
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // Attract/Repel mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < mouse.radius) {
          // Pull towards mouse slightly
          this.x += dx * 0.03;
          this.y += dy * 0.03;
        }
      }

      // Move particle
      this.x += this.directionX;
      this.y += this.directionY;

      this.draw();
    }
  }

  // Populate particles array
  function initParticles() {
    particlesArray = [];
    numberOfParticles = Math.floor((canvas.width * canvas.height) / 13000);
    // Boundary checks
    if (numberOfParticles > 120) numberOfParticles = 120;
    if (numberOfParticles < 30) numberOfParticles = 30;

    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 2) + 1;
      let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
      let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
      let directionX = (Math.random() * 0.8) - 0.4;
      let directionY = (Math.random() * 0.8) - 0.4;
      
      // Dual-color cosmic particle selection (violet vs cyan)
      const isViolet = Math.random() > 0.5;
      let color = isViolet ? 'rgba(139, 92, 246, 0.45)' : 'rgba(6, 182, 212, 0.45)';

      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  // Draw connecting network lines
  function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx*dx + dy*dy);

        if (distance < 110) {
          opacityValue = 1 - (distance / 110);
          // Connection color matches particle a's primary color channel (139 for violet, 6 for cyan)
          const baseColor = particlesArray[a].color.includes('139') ? '139, 92, 246' : '6, 182, 212';
          ctx.strokeStyle = `rgba(${baseColor}, ${opacityValue * 0.15})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Main animation frame loop
  function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connect();
  }

  // Initialize and trigger particles canvas loop
  initParticles();
  animateParticles();


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

  form.addEventListener('submit', (event) => {
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

    // Simulated successful message submission
    showToast('Thank you! Your message has been sent successfully.', true);
    form.reset();
  });

  // Clear error border color when user focuses back on the fields
  const inputs = document.querySelectorAll('.form-input');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.style.borderColor = '';
    });
  });

});
