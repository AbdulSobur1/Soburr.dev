// ===== Utility Functions =====
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

// Show notification
const showNotification = (message, type = 'success') => {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
};

// Validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ===== Loading Screen =====
document.addEventListener('DOMContentLoaded', function() {
  // Simulate loading time with progress
  const loadingBar = document.querySelector('.loader-bar');
  const loadingText = document.querySelector('.loading-text');
  
  const loadingSteps = [
    { progress: 20, text: 'Loading Soburr assets...' },
    { progress: 40, text: 'Initializing 3D engine...' },
    { progress: 60, text: 'Setting up animations...' },
    { progress: 80, text: 'Preparing interface...' },
    { progress: 100, text: 'Ready! 🚀' }
  ];
  
  let currentStep = 0;
  
  const updateLoading = () => {
    if (currentStep < loadingSteps.length) {
      const step = loadingSteps[currentStep];
      loadingBar.style.width = step.progress + '%';
      loadingText.textContent = step.text;
      currentStep++;
      
      setTimeout(updateLoading, 600);
    } else {
      setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.style.visibility = 'hidden';
          loadingScreen.style.display = 'none';
        }, 500);
      }, 500);
    }
  };
  
  updateLoading();
});

// ===== Particles.js Configuration =====
const initParticles = () => {
  if (typeof particlesJS !== 'undefined') {
    particlesJS("particles-js", {
      "particles": {
        "number": {
          "value": window.innerWidth < 768 ? 40 : 80,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#0077ff"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          }
        },
        "opacity": {
          "value": 0.5,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#0077ff",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 2,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "grab"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 140,
            "line_linked": {
              "opacity": 1
            }
          },
          "push": {
            "particles_nb": 4
          }
        }
      },
      "retina_detect": true
    });
  }
};

// Initialize particles when the library is loaded
if (typeof particlesJS !== 'undefined') {
  initParticles();
} else {
  // Wait for particles.js to load
  window.addEventListener('load', initParticles);
}

// ===== Theme Toggle =====
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  
  // Update particles color based on theme
  if (typeof pJSDom !== 'undefined' && pJSDom[0]) {
    const particleColor = isDark ? "#4facfe" : "#0077ff";
    pJSDom[0].pJS.particles.color.value = particleColor;
    pJSDom[0].pJS.particles.line_linked.color = particleColor;
    pJSDom[0].pJS.fn.particlesRefresh();
  }
});

// ===== Mobile Menu =====
const menuToggle = document.getElementById("menu-toggle");
const navUl = document.querySelector("nav ul");

menuToggle.addEventListener("click", () => {
  const isOpen = navUl.classList.toggle("show");
  menuToggle.setAttribute("aria-expanded", isOpen);
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest("nav") && navUl.classList.contains("show")) {
    navUl.classList.remove("show");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

// ===== Smooth Scroll Navigation =====
const navLinks = document.querySelectorAll("nav ul li a");

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    navUl.classList.remove("show");
    menuToggle.setAttribute("aria-expanded", "false");
    
    const id = link.getAttribute("href").substring(1);
    const section = document.getElementById(id);
    
    if (section) {
      const headerHeight = document.querySelector('header').offsetHeight;
      const targetPosition = section.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    }
  });
});

// ===== Active Navigation Highlight =====
const sections = document.querySelectorAll("section");
const updateActiveNav = throttle(() => {
  let current = "";
  const scrollPosition = window.pageYOffset + 100;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      current = section.id;
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
}, 100);

window.addEventListener("scroll", updateActiveNav);

// ===== Scroll Reveal Animation =====
const revealElements = () => {
  document.querySelectorAll("section").forEach(section => {
    const rect = section.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 100;
    
    if (isVisible && !section.classList.contains("reveal")) {
      section.classList.add("reveal");
    }
  });
};

const debouncedReveal = debounce(revealElements, 50);
window.addEventListener("scroll", debouncedReveal);
window.addEventListener("load", revealElements);

// ===== Skills Chart =====
let skillsChart = null;

function initSkillsChart() {
  const ctx = document.getElementById('skillsChart');
  if (!ctx || typeof Chart === 'undefined') return;
  
  const skillElements = document.querySelectorAll('.skill[data-skill][data-level]');
  const skills = Array.from(skillElements).map(el => el.dataset.skill);
  const levels = Array.from(skillElements).map(el => parseInt(el.dataset.level));
  
  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(0, 119, 255, 0.8)');
  gradient.addColorStop(1, 'rgba(0, 119, 255, 0.2)');
  
  skillsChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: skills,
      datasets: [{
        label: 'Skill Level (%)',
        data: levels,
        backgroundColor: gradient,
        borderColor: '#0077ff',
        borderWidth: 2,
        pointBackgroundColor: '#0077ff',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#0077ff',
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          angleLines: {
            color: 'rgba(255, 255, 255, 0.2)'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.2)'
          },
          pointLabels: {
            color: document.body.classList.contains('dark') ? '#eee' : '#333',
            font: {
              size: 14,
              family: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
            }
          },
          ticks: {
            backdropColor: 'transparent',
            color: document.body.classList.contains('dark') ? '#eee' : '#333',
            stepSize: 20
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.raw}%`;
            }
          }
        }
      },
      animation: {
        duration: 2000,
        easing: 'easeOutQuart'
      }
    }
  });
  
  // Update chart colors when theme changes
  const updateChartTheme = () => {
    if (!skillsChart) return;
    
    const isDark = document.body.classList.contains('dark');
    skillsChart.options.scales.r.pointLabels.color = isDark ? '#eee' : '#333';
    skillsChart.options.scales.r.ticks.color = isDark ? '#eee' : '#333';
    skillsChart.update('none');
  };
  
  themeToggle.addEventListener('click', updateChartTheme);
  
  // Add click event to skills to highlight in chart
  skillElements.forEach((skill, index) => {
    skill.addEventListener('click', () => {
      if (!skillsChart) return;
      
      const newData = Array(levels.length).fill(20);
      newData[index] = levels[index];
      
      skillsChart.data.datasets[0].data = newData;
      skillsChart.update();
      
      setTimeout(() => {
        skillsChart.data.datasets[0].data = levels;
        skillsChart.update();
      }, 1500);
    });
    
    // Add keyboard support
    skill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        skill.click();
      }
    });
  });
}

// Initialize skills chart when section is revealed
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(initSkillsChart, 500); // Delay to ensure Chart.js is loaded
        skillsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  skillsObserver.observe(skillsSection);
}

// ===== 3D Model Viewer with Three.js =====
let scene, camera, renderer, model;
let isModelViewerInitialized = false;
let animationId = null;

function initModelViewer() {
  if (isModelViewerInitialized || typeof THREE === 'undefined') return;
  
  try {
    const container = document.getElementById('model-viewer');
    if (!container) return;
    
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer with error handling
    renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x0077ff, 0.5, 100);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);
    
    // Create default cube model
    createModel('cube');
    
    // Animation loop with error handling
    function animate() {
      try {
        animationId = requestAnimationFrame(animate);
        
        if (model) {
          model.rotation.x += 0.005;
          model.rotation.y += 0.01;
        }
        
        renderer.render(scene, camera);
      } catch (error) {
        console.error('Animation error:', error);
        showFallback();
      }
    }
    
    animate();
    
    // Handle window resize
    const handleResize = debounce(() => {
      if (!camera || !renderer || !container) return;
      
      const newAspect = container.clientWidth / container.clientHeight;
      camera.aspect = newAspect;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }, 250);
    
    window.addEventListener('resize', handleResize);
    
    // Controls with error handling
    const setupControls = () => {
      const rotateLeft = document.getElementById('rotate-left');
      const rotateRight = document.getElementById('rotate-right');
      const zoomIn = document.getElementById('zoom-in');
      const zoomOut = document.getElementById('zoom-out');
      
      if (rotateLeft) {
        rotateLeft.addEventListener('click', () => {
          if (model) model.rotation.y -= Math.PI / 4;
        });
      }
      
      if (rotateRight) {
        rotateRight.addEventListener('click', () => {
          if (model) model.rotation.y += Math.PI / 4;
        });
      }
      
      if (zoomIn) {
        zoomIn.addEventListener('click', () => {
          if (camera && camera.position.z > 2) camera.position.z -= 0.5;
        });
      }
      
      if (zoomOut) {
        zoomOut.addEventListener('click', () => {
          if (camera && camera.position.z < 10) camera.position.z += 0.5;
        });
      }
    };
    
    setupControls();
    isModelViewerInitialized = true;
    
  } catch (error) {
    console.error('Failed to initialize 3D viewer:', error);
    showFallback();
  }
}

function createModel(modelType) {
  if (!scene || typeof THREE === 'undefined') return;
  
  try {
    // Remove existing model
    if (model) {
      scene.remove(model);
      if (model.geometry) model.geometry.dispose();
      if (model.material) model.material.dispose();
    }
    
    let geometry;
    const material = new THREE.MeshPhongMaterial({
      color: 0x0077ff,
      specular: 0x555555,
      shininess: 30,
      transparent: true,
      opacity: 0.9,
    });
    
    // Create geometry based on model type
    switch (modelType) {
      case 'cube':
        geometry = new THREE.BoxGeometry(2, 2, 2);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(1.5, 32, 32);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
        break;
      default:
        geometry = new THREE.BoxGeometry(2, 2, 2);
    }
    
    model = new THREE.Mesh(geometry, material);
    model.castShadow = true;
    model.receiveShadow = true;
    scene.add(model);
    
  } catch (error) {
    console.error('Failed to create 3D model:', error);
    showFallback();
  }
}

function showFallback() {
  const modelViewer = document.getElementById('model-viewer');
  const fallback = document.getElementById('model-fallback');
  
  if (modelViewer && fallback) {
    modelViewer.style.display = 'none';
    fallback.style.display = 'flex';
  }
  
  // Stop animation loop
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

// Initialize model viewer when projects section is visible
const projectsSection = document.getElementById('projects');
if (projectsSection) {
  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(initModelViewer, 1000); // Delay to ensure Three.js is loaded
        projectObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  projectObserver.observe(projectsSection);
}

// ===== Project Card Interactions =====
document.addEventListener('DOMContentLoaded', () => {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const modelType = card.dataset.model;
      
      if (modelType && isModelViewerInitialized) {
        createModel(modelType);
        
        // Update model viewer title
        const projectTitle = card.querySelector('h3').textContent;
        updateModelViewerTitle(`3D Model: ${projectTitle}`);
        
        // Scroll to model viewer
        document.getElementById('model-viewer-container').scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
        
        // Highlight selected project
        projectCards.forEach(c => c.classList.remove('selected-project'));
        card.classList.add('selected-project');
      }
    });
    
    // Keyboard support
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
});

function updateModelViewerTitle(title) {
  // Remove existing title
  const existingTitle = document.querySelector('.model-viewer-title');
  if (existingTitle) existingTitle.remove();
  
  // Add new title
  const modelViewerTitle = document.createElement('div');
  modelViewerTitle.className = 'model-viewer-title';
  modelViewerTitle.textContent = title;
  
  const container = document.getElementById('model-viewer-container');
  if (container) {
    container.prepend(modelViewerTitle);
  }
}

// ===== Enhanced Parallax Effect =====
const parallaxEffect = (e) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  const parallaxElements = document.querySelectorAll('.parallax-element');
  
  // Get mouse position relative to center of screen
  const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  
  parallaxElements.forEach(el => {
    let depth = 5;
    let scale = '';
    
    if (el.classList.contains('parallax-deep')) {
      depth = 15;
      scale = 'scale(1.02)';
    } else if (el.classList.contains('parallax-medium')) {
      depth = 10;
      scale = 'scale(1.01)';
    } else if (el.classList.contains('parallax-shallow')) {
      depth = 5;
    }
    
    const moveX = mouseX * depth;
    const moveY = mouseY * depth;
    
    el.style.transform = `translate(${moveX}px, ${moveY}px) ${scale}`;
  });
};

const debouncedParallax = throttle(parallaxEffect, 16); // ~60fps
document.addEventListener('mousemove', debouncedParallax);

// ===== Enhanced Typing Effect =====
const typingElement = document.querySelector('.typing');
if (typingElement) {
  const phrases = [
    'Web Developer',
    'UI/UX Designer', 
    'Anime weeb',
    'Frontend Engineer',
    'JavaScript Expert',
    'Creative Coder',
    'Software Programmer',
    'Problem Solver'
  ];
  
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 150;
  
  function typeText() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 75;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 150;
    }
    
    if (!isDeleting && charIndex === currentPhrase.length) {
      typingDelay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingDelay = 500;
    }
    
    setTimeout(typeText, typingDelay);
  }
  
  // Start typing effect
  setTimeout(typeText, 1000);
}

// ===== Modal Functionality =====
const modal = document.getElementById("project-modal");
const modalClose = document.getElementById("modal-close");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");

function openModal(title, description) {
  if (modal && modalTitle && modalDesc) {
    modalTitle.textContent = title;
    modalDesc.textContent = description;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    
    // Focus management
    modalClose.focus();
    
    // Trap focus in modal
    trapFocus(modal);
  }
}

function closeModal() {
  if (modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }
}

if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}

// Close modal on escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal && modal.classList.contains("active")) {
    closeModal();
  }
});

// Close modal on backdrop click
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Focus trap utility
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  });
}

// ===== Enhanced Contact Form =====
const form = document.getElementById("contact-form");

if (form) {
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const messageField = document.getElementById("message");
  
  // Real-time validation
  const validateField = (field, validator, errorMsg) => {
    const errorElement = document.getElementById(field.id + '-error');
    
    const validate = () => {
      const isValid = validator(field.value.trim());
      
      if (field.value.trim() && !isValid) {
        errorElement.textContent = errorMsg;
        errorElement.classList.add('show');
        field.setAttribute('aria-invalid', 'true');
      } else {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
        field.setAttribute('aria-invalid', 'false');
      }
    };
    
    field.addEventListener('blur', validate);
    field.addEventListener('input', debounce(validate, 500));
  };
  
  // Set up validation
  if (nameField) {
    validateField(nameField, (value) => value.length >= 2, 'Name must be at least 2 characters long');
  }
  
  if (emailField) {
    validateField(emailField, isValidEmail, 'Please enter a valid email address');
  }
  
  if (messageField) {
    validateField(messageField, (value) => value.length >= 10, 'Message must be at least 10 characters long');
  }
  
  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const name = nameField?.value.trim() || '';
    const email = emailField?.value.trim() || '';
    const message = messageField?.value.trim() || '';
    
    // Validate all fields
    let isValid = true;
    
    if (!name || name.length < 2) {
      showNotification("Please enter a valid name (at least 2 characters)", 'error');
      nameField?.focus();
      isValid = false;
    } else if (!email || !isValidEmail(email)) {
      showNotification("Please enter a valid email address", 'error');
      emailField?.focus();
      isValid = false;
    } else if (!message || message.length < 10) {
      showNotification("Please enter a message (at least 10 characters)", 'error');
      messageField?.focus();
      isValid = false;
    }
    
    if (isValid) {
      // Simulate form submission
      const submitBtn = form.querySelector('.btn');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        showNotification(`Thank you ${name}! Your message has been sent. I'll get back to you soon.`, 'success');
        form.reset();
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Clear any error states
        form.querySelectorAll('.error-message').forEach(error => {
          error.classList.remove('show');
        });
        
        form.querySelectorAll('input, textarea').forEach(field => {
          field.setAttribute('aria-invalid', 'false');
        });
      }, 1500);
    }
  });
}

// ===== Back to Top Button =====
const backBtn = document.getElementById("back-to-top");

if (backBtn) {
  const toggleBackButton = throttle(() => {
    if (window.scrollY > 300) {
      backBtn.style.display = "block";
    } else {
      backBtn.style.display = "none";
    }
  }, 100);
  
  window.addEventListener("scroll", toggleBackButton);
  
  backBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// ===== Lazy Loading Images =====
const images = document.querySelectorAll('img[loading="lazy"]');

if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Add fade-in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s';
        
        img.onload = () => {
          img.style.opacity = '1';
        };
        
        // Handle loading errors
        img.onerror = () => {
          img.style.opacity = '1';
          img.alt = 'Image could not be loaded';
          console.warn('Failed to load image:', img.src);
        };
        
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// ===== Performance Monitoring =====
window.addEventListener('load', () => {
  // Log performance metrics
  if ('performance' in window) {
    const perfData = performance.timing;
    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
  }
  
  // Check for WebGL support
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (!gl) {
    console.warn('WebGL not supported, 3D features may not work');
    showFallback();
  }
});

// ===== Error Handling =====
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
  
  // Show user-friendly error message for critical errors
  if (e.error && e.error.message.includes('THREE')) {
    showFallback();
    showNotification('3D features are not available on this device', 'error');
  }
});

// ===== Service Worker Registration (Optional) =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}