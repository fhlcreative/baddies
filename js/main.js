/**
 * Baddies Burger House - Main JavaScript
 */

(function () {
  'use strict';

  // ── Navbar scroll effect ──
  const navbar = document.getElementById('navbar');

  function handleScroll() {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on load

  // ── Mobile menu toggle ──
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuIcon = mobileMenuBtn ? mobileMenuBtn.querySelector('.menu-icon') : null;
  const closeIcon = mobileMenuBtn ? mobileMenuBtn.querySelector('.close-icon') : null;

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      if (menuIcon) menuIcon.style.display = isOpen ? 'none' : 'block';
      if (closeIcon) closeIcon.style.display = isOpen ? 'block' : 'none';
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        if (menuIcon) menuIcon.style.display = 'block';
        if (closeIcon) closeIcon.style.display = 'none';
      });
    });
  }

  // ── Smooth scrolling for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu if open
        if (mobileMenu && mobileMenu.classList.contains('open')) {
          mobileMenu.classList.remove('open');
          if (menuIcon) menuIcon.style.display = 'block';
          if (closeIcon) closeIcon.style.display = 'none';
        }
      }
    });
  });

  // ── Hero polaroid fly-in animation ──
  // Matches Framer Motion spring animation from the original React app
  var isMobile = window.innerWidth < 768;

  // Polaroid data: [finalRotate, baseX, baseY]
  // Source positions from hero.tsx
  var polaroidData = [
    { rotate: -12, x: -40,  y: 20,   },  // 1: Double Smash
    { rotate: 15,  x: 60,   y: -30,  },  // 2: Loaded Fries
    { rotate: -2,  x: 0,    y: 0, tripleCombo: true },  // 3: The Triple Combo (shifted left extra)
    { rotate: 6,   x: 120,  y: 80,   },  // 4: Our Spot
    { rotate: -8,  x: -120, y: -60,  },  // 5: Sweet Treats
    { rotate: 18,  x: -90,  y: 110,  },  // 6: Saucy Goodness
    { rotate: -6,  x: -80,  y: -140, },  // 7: Hot & Fresh
    { rotate: 10,  x: 80,   y: 130,  },  // 8: Family Vibes
  ];

  var polaroids = document.querySelectorAll('.polaroid');
  var puddinText = document.querySelector('.hero-puddin-text');

  // Calculate spread positions (desktop: 1.5x + 15px offset, mobile: 0.7x)
  function getSpreadPos(data) {
    var spreadX = isMobile ? data.x * 0.7 : data.x * 1.5 + 15;
    var spreadY = isMobile ? data.y * 0.7 : data.y * 1.5;
    if (data.tripleCombo) {
      spreadX -= isMobile ? 20 : 40;
    }
    return { x: spreadX, y: spreadY };
  }

  // Fly in polaroids with staggered timing
  function animatePolaroids() {
    polaroids.forEach(function (el, i) {
      if (!polaroidData[i]) return;
      var data = polaroidData[i];
      var pos = getSpreadPos(data);
      var delay = i * 100; // 100ms stagger per photo

      setTimeout(function () {
        el.style.opacity = '1';
        el.style.transform = 'translate(' + pos.x + 'px, ' + pos.y + 'px) rotate(' + data.rotate + 'deg)';
      }, delay);
    });

    // Puddin text flies in last
    if (puddinText) {
      setTimeout(function () {
        puddinText.style.opacity = '0.9';
        puddinText.style.transform = 'translate(100px, -100px) rotate(-15deg)';
      }, 800);
    }
  }

  // ── Hero text stagger animation ──
  function animateHeroText() {
    var heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    var badge = heroContent.querySelector('.hero-badge');
    var heading = heroContent.querySelector('.hero-heading');
    var desc = heroContent.querySelector('.hero-description');
    var buttons = heroContent.querySelector('.hero-buttons');
    var trust = heroContent.querySelector('.trust-badge');

    var elements = [badge, heading, desc, buttons, trust];
    elements.forEach(function (el, i) {
      if (!el) return;
      setTimeout(function () {
        el.style.transitionDelay = (i * 0.1) + 's';
      }, 0);
    });

    // Trigger all animations by adding class
    requestAnimationFrame(function () {
      heroContent.classList.add('animated');
    });
  }

  // ── Scroll-based polaroid tilt ──
  // Each polaroid tilts slightly as the user scrolls, alternating direction
  var ticking = false;

  function updatePolaroidTilt() {
    var scrollY = window.scrollY;
    var scrollFraction = Math.min(scrollY / 600, 1); // 0 to 1 over 600px scroll

    polaroids.forEach(function (el, i) {
      if (!polaroidData[i]) return;
      var data = polaroidData[i];
      var pos = getSpreadPos(data);

      // Alternate tilt direction, vary magnitude
      var tiltDirection = (i % 2 === 0) ? 1 : -1;
      var tiltFactor = 5 + (i % 3) * 3; // 5, 8, or 11 degrees max
      var tiltAmount = scrollFraction * tiltDirection * tiltFactor;

      var totalRotate = data.rotate + tiltAmount;
      el.style.transform = 'translate(' + pos.x + 'px, ' + pos.y + 'px) rotate(' + totalRotate + 'deg)';
    });

    ticking = false;
  }

  function onScrollTilt() {
    if (!ticking) {
      requestAnimationFrame(updatePolaroidTilt);
      ticking = true;
    }
  }

  // Only run hero animations if we have polaroids (i.e., on the homepage)
  if (polaroids.length > 0) {
    // Kick off animations after a brief moment
    requestAnimationFrame(function () {
      animateHeroText();
      animatePolaroids();
    });

    // Start scroll tilt listener after fly-in completes
    setTimeout(function () {
      window.addEventListener('scroll', onScrollTilt, { passive: true });
    }, 1200);
  }

  // ── Scroll-reveal animations (IntersectionObserver) ──
  var fadeEls = document.querySelectorAll('.fade-in-up');
  if ('IntersectionObserver' in window && fadeEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ── Menu stamp scroll rotation ──
  // Matches Framer Motion useTransform(scrollYProgress, [0, 1], [-35, 35])
  var menuStamp = document.querySelector('.menu-stamp');
  if (menuStamp) {
    var stampTicking = false;

    function updateStampRotation() {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrollFraction = docHeight > 0 ? window.scrollY / docHeight : 0;
      // Map 0..1 to -35..35 degrees
      var rotation = -35 + scrollFraction * 70;
      menuStamp.style.transform = 'rotate(' + rotation + 'deg)';
      stampTicking = false;
    }

    window.addEventListener('scroll', function () {
      if (!stampTicking) {
        requestAnimationFrame(updateStampRotation);
        stampTicking = true;
      }
    }, { passive: true });

    // Set initial rotation
    updateStampRotation();
  }

  // ── Catering form handling ──
  var cateringForm = document.getElementById('cateringForm');
  if (cateringForm) {
    cateringForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      var firstName = cateringForm.querySelector('[name="firstName"]');
      var lastName = cateringForm.querySelector('[name="lastName"]');
      var email = cateringForm.querySelector('[name="email"]');
      var phone = cateringForm.querySelector('[name="phone"]');
      var date = cateringForm.querySelector('[name="date"]');
      var deliveryMethod = cateringForm.querySelector('[name="deliveryMethod"]');
      var details = cateringForm.querySelector('[name="details"]');

      // Clear previous errors
      cateringForm.querySelectorAll('.form-error').forEach(function (el) {
        el.remove();
      });
      cateringForm.querySelectorAll('.input-error').forEach(function (el) {
        el.classList.remove('input-error');
      });

      var valid = true;

      function showError(input, message) {
        valid = false;
        input.classList.add('input-error');
        var err = document.createElement('p');
        err.className = 'form-error';
        err.textContent = message;
        input.parentNode.appendChild(err);
      }

      if (!firstName.value.trim()) showError(firstName, 'First name is required');
      if (!lastName.value.trim()) showError(lastName, 'Last name is required');
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) showError(email, 'Valid email is required');
      if (!phone.value.trim() || phone.value.trim().length < 10) showError(phone, 'Phone number is required');
      if (!date.value) showError(date, 'Date is required');
      if (!deliveryMethod.value) showError(deliveryMethod, 'Delivery method is required');
      if (!details.value.trim()) showError(details, 'Please provide details about your event');

      if (!valid) return;

      // Show success toast
      showToast('Inquiry Sent!', "We'll get back to you shortly about your catering event.");
      cateringForm.reset();
    });
  }

  // ── Toast notification ──
  function showToast(title, message) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML =
      '<strong class="toast-title">' + title + '</strong>' +
      '<p class="toast-message">' + message + '</p>';
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(function () {
      toast.classList.add('toast-visible');
    });

    setTimeout(function () {
      toast.classList.remove('toast-visible');
      setTimeout(function () {
        toast.remove();
      }, 300);
    }, 4000);
  }

  // ── Copyright year ──
  var yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
