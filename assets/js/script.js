(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setupCurtain();
    setupHeaderScroll();
    setupMobileNav();
    setupAccordions();
    setupHeroLine();
    setupScrollReveal();
    setupMobileFeatureFocus();
    setupImageLoading();
    setupScrollEdges();
    setupActiveNavIndicator();
    setupLightbox();

    if (isFinePointer && !reduceMotion) {
      setupCursorDot();
      setupTiltCards();
      setupMagneticButtons();
      setupHeroParallax();
    }
  }

  /* -------------------------------------------------
     Page-load curtain: one orchestrated entrance moment
  ------------------------------------------------- */
  function setupCurtain() {
    var curtain = document.getElementById('curtain');
    if (!curtain) return;
    window.addEventListener('load', function () {
      requestAnimationFrame(function () {
        curtain.classList.add('is-hidden');
        setTimeout(function () {
          if (curtain.parentNode) curtain.parentNode.removeChild(curtain);
        }, 800);
      });
    });
  }

  /* -------------------------------------------------
     Sticky header background on scroll (rAF-throttled)
  ------------------------------------------------- */
  function setupHeaderScroll() {
    var header = document.getElementById('siteHeader');
    if (!header) return;
    var ticking = false;

    function apply() {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(apply);
        ticking = true;
      }
    }
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* -------------------------------------------------
     Mobile nav toggle
  ------------------------------------------------- */
  function setupMobileNav() {
    var navToggle = document.getElementById('navToggle');
    var navMobile = document.getElementById('navMobile');
    if (!navToggle || !navMobile) return;

    navToggle.addEventListener('click', function () {
      var isOpen = navMobile.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMobile.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* -------------------------------------------------
     Footer accordions
  ------------------------------------------------- */
  function setupAccordions() {
    document.querySelectorAll('.accordion-trigger').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var accordion = btn.parentElement;
        var isOpen = accordion.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });
  }

  /* -------------------------------------------------
     Hero underline draw — once, on load
  ------------------------------------------------- */
  function setupHeroLine() {
    var line = document.getElementById('drawLine');
    if (!line) return;
    if (reduceMotion) {
      line.style.transform = 'scaleX(1)';
      return;
    }
    requestAnimationFrame(function () {
      setTimeout(function () {
        line.style.transition = 'transform 0.9s cubic-bezier(0.22,1,0.36,1)';
        line.style.transform = 'scaleX(1)';
      }, 300);
    });
  }

  /* -------------------------------------------------
     Scroll reveal for grouped cards (feature/product/related grids)
     One IntersectionObserver, staggered via --reveal-i custom property
  ------------------------------------------------- */
  function setupScrollReveal() {
    var groups = document.querySelectorAll('.feature-grid, .product-grid, .detail-features, .related-grid');
    if (!groups.length) return;

    groups.forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.classList.add('reveal');
        child.style.setProperty('--reveal-i', i);
      });
    });

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* -------------------------------------------------
     Mobile scroll-driven focus for feature cards
  ------------------------------------------------- */
  function setupMobileFeatureFocus() {
    var cards = document.querySelectorAll('.feature-grid .feature');
    if (!cards.length) return;

    if (!('IntersectionObserver' in window)) {
      cards.forEach(function (card) { card.classList.add('is-active'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && window.innerWidth <= 900) {
          cards.forEach(function (c) { c.classList.remove('is-active'); });
          entry.target.classList.add('is-active');
        }
      });
    }, {
      threshold: 0.25,
      rootMargin: '-20% 0px -20% 0px'
    });

    cards.forEach(function (card) {
      observer.observe(card);
    });

    if (cards[0] && window.innerWidth <= 900) {
      cards[0].classList.add('is-active');
    }
  }

  /* -------------------------------------------------
     Load-aware image entrance with a restrained group stagger
  ------------------------------------------------- */
  function setupImageLoading() {
    var observer = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var image = entry.target;
        if (!entry.isIntersecting) return;
        image.dataset.inView = 'true';
        if (image.dataset.loaded === 'true') reveal(image);
        observer.unobserve(image);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }) : null;

    function reveal(image) {
      requestAnimationFrame(function () {
        image.classList.add('is-loaded');
      });
    }

    document.querySelectorAll('img').forEach(function (image) {
      var group = image.closest('.product-grid, .clients-track, .product-hero-media');
      var siblings = group ? group.querySelectorAll('img') : [image];
      var index = Array.prototype.indexOf.call(siblings, image);
      var delay = Math.min(Math.max(index, 0), 7) * 110;
      var shouldWaitForScroll = Boolean(group);

      image.classList.add('image-reveal');
      image.style.setProperty('--image-delay', delay + 'ms');
      image.dataset.loaded = 'false';

      function markLoaded() {
        image.dataset.loaded = 'true';
        if (!shouldWaitForScroll || image.dataset.inView === 'true') reveal(image);
      }

      if (image.complete) {
        markLoaded();
      } else {
        image.addEventListener('load', markLoaded, { once: true });
        image.addEventListener('error', markLoaded, { once: true });
      }

      if (shouldWaitForScroll && observer) {
        observer.observe(image);
      } else {
        image.dataset.inView = 'true';
        if (image.dataset.loaded === 'true') reveal(image);
      }
    });
  }

  /* -------------------------------------------------
     Soft settle at the natural scroll boundaries
  ------------------------------------------------- */
  function setupScrollEdges() {
    var root = document.documentElement;
    var body = document.body;
    var ticking = false;
    var lastScrollY = window.scrollY;

    function apply() {
      var currentScrollY = window.scrollY;
      var maxScrollY = Math.max(0, root.scrollHeight - window.innerHeight);
      var movingUp = currentScrollY < lastScrollY;
      var movingDown = currentScrollY > lastScrollY;
      var atTop = currentScrollY <= 2;
      var atBottom = currentScrollY >= maxScrollY - 2;

      body.classList.toggle('edge-top', atTop && movingUp);
      body.classList.toggle('edge-bottom', atBottom && movingDown);
      lastScrollY = currentScrollY;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(apply);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', apply, { passive: true });
  }

  /* -------------------------------------------------
     Active nav indicator — slides a pill under the current section link
  ------------------------------------------------- */
  function setupActiveNavIndicator() {
    var nav = document.querySelector('.nav-desktop');
    if (!nav) return;
    var indicator = document.createElement('span');
    indicator.className = 'nav-indicator';
    nav.appendChild(indicator);

    var links = Array.prototype.filter.call(nav.querySelectorAll('a[href*="#"]'), function (a) {
      return a.getAttribute('href').indexOf('#') !== -1 && !a.classList.contains('btn');
    });
    if (!links.length) return;

    function moveTo(link) {
      var linkRect = link.getBoundingClientRect();
      var navRect = nav.getBoundingClientRect();
      indicator.style.width = linkRect.width + 'px';
      indicator.style.transform = 'translateX(' + (linkRect.left - navRect.left) + 'px)';
    }

    links.forEach(function (link) {
      link.addEventListener('mouseenter', function () { moveTo(link); });
    });
    nav.addEventListener('mouseleave', function () {
      var current = links.filter(function (l) { return l.classList.contains('is-current'); })[0];
      if (current) moveTo(current); else indicator.style.width = '0';
    });

    // Track current section on scroll (relevant on the homepage, where these sections exist)
    var sectionIds = links
      .map(function (l) { return l.getAttribute('href').split('#')[1]; })
      .filter(Boolean);
    var sections = sectionIds
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            links.forEach(function (l) { l.classList.remove('is-current'); });
            var match = links.filter(function (l) { return l.getAttribute('href').indexOf('#' + entry.target.id) !== -1; })[0];
            if (match) {
              match.classList.add('is-current');
              moveTo(match);
            }
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(function (s) { sectionObserver.observe(s); });
    }
  }

  /* -------------------------------------------------
     Cursor-tracked glow + tilt on product/feature cards
  ------------------------------------------------- */
  function setupTiltCards() {
    var cards = document.querySelectorAll('.product-card');
    cards.forEach(function (card) {
      card.classList.add('tilt-card');
      var rect = null;
      var targetX = 0;
      var targetY = 0;
      var currentX = 0;
      var currentY = 0;
      var frame = null;

      function animate() {
        currentX += (targetX - currentX) * 0.16;
        currentY += (targetY - currentY) * 0.16;
        card.style.transform = 'perspective(600px) rotateX(' + currentX + 'deg) rotateY(' + currentY + 'deg)';
        if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
          frame = requestAnimationFrame(animate);
        } else {
          frame = null;
        }
      }

      function startAnimation() {
        if (!frame) frame = requestAnimationFrame(animate);
      }

      card.addEventListener('mouseenter', function () {
        rect = card.getBoundingClientRect();
      });
      card.addEventListener('mousemove', function (e) {
        if (!rect) rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var px = (x / rect.width) * 100;
        var py = (y / rect.height) * 100;
        card.style.setProperty('--mx', px + '%');
        card.style.setProperty('--my', py + '%');

        targetX = ((y / rect.height) - 0.5) * -6;
        targetY = ((x / rect.width) - 0.5) * 6;
        startAnimation();
      });
      card.addEventListener('mouseleave', function () {
        targetX = 0;
        targetY = 0;
        startAnimation();
      });
    });
  }

  /* -------------------------------------------------
     Magnetic buttons: nudge toward cursor within a small radius
  ------------------------------------------------- */
  function setupMagneticButtons() {
    var buttons = document.querySelectorAll('.btn');
    buttons.forEach(function (btn) {
      btn.classList.add('magnetic');
      var targetX = 0;
      var targetY = 0;
      var currentX = 0;
      var currentY = 0;
      var frame = null;

      function animate() {
        currentX += (targetX - currentX) * 0.18;
        currentY += (targetY - currentY) * 0.18;
        btn.style.transform = 'translate(' + currentX + 'px, ' + currentY + 'px)';
        if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
          frame = requestAnimationFrame(animate);
        } else {
          frame = null;
        }
      }

      function startAnimation() {
        if (!frame) frame = requestAnimationFrame(animate);
      }

      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        targetX = (e.clientX - rect.left - rect.width / 2) * 0.25;
        targetY = (e.clientY - rect.top - rect.height / 2) * 0.3;
        startAnimation();
      });
      btn.addEventListener('mouseleave', function () {
        targetX = 0;
        targetY = 0;
        startAnimation();
      });
    });
  }

  /* -------------------------------------------------
     Custom cursor dot — desktop only, hides over touch
  ------------------------------------------------- */
  function setupCursorDot() {
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(dot);

    var targetX = 0;
    var targetY = 0;
    var currentX = 0;
    var currentY = 0;
    var raf = null;

    function animate() {
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
      dot.style.left = currentX + 'px';
      dot.style.top = currentY + 'px';
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);

    document.addEventListener('mousemove', function (e) {
      dot.classList.add('is-active');
      targetX = e.clientX;
      targetY = e.clientY;
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      dot.classList.remove('is-active');
    });

    var hoverables = document.querySelectorAll('a, button, .product-card');
    hoverables.forEach(function (el) {
      el.addEventListener('mouseenter', function () { dot.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { dot.classList.remove('is-hover'); });
    });
  }

  /* -------------------------------------------------
     Hero parallax: subtle image drift on scroll, rAF-throttled
  ------------------------------------------------- */
  function setupHeroParallax() {
    var media = document.querySelector('.hero-media img, .hero-media video, .product-hero-media img');
    if (!media) return;
    var ticking = false;

    function apply() {
      var offset = window.scrollY;
      if (offset < window.innerHeight * 1.2) {
        media.style.transform = 'translateY(' + (offset * 0.15) + 'px) scale(1.05)';
      }
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(apply);
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* -------------------------------------------------
     Interactive Lightbox Modal for Product Galleries
  ------------------------------------------------- */
  function setupLightbox() {
    var items = document.querySelectorAll('[data-gallery-item]');
    if (!items.length) return;

    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image Gallery Lightbox');
    lightbox.innerHTML =
      '<button type="button" class="lightbox-btn lightbox-close" aria-label="Close image modal">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
      '</button>' +
      '<button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous image">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>' +
      '</button>' +
      '<button type="button" class="lightbox-btn lightbox-next" aria-label="Next image">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
      '</button>' +
      '<div class="lightbox-dialog">' +
        '<div class="lightbox-img-wrap">' +
          '<img class="lightbox-img" src="" alt="">' +
        '</div>' +
        '<div class="lightbox-caption">' +
          '<span class="lightbox-title"></span>' +
          '<span class="lightbox-counter"></span>' +
        '</div>' +
      '</div>';

    document.body.appendChild(lightbox);

    var img = lightbox.querySelector('.lightbox-img');
    var titleEl = lightbox.querySelector('.lightbox-title');
    var counterEl = lightbox.querySelector('.lightbox-counter');
    var btnClose = lightbox.querySelector('.lightbox-close');
    var btnPrev = lightbox.querySelector('.lightbox-prev');
    var btnNext = lightbox.querySelector('.lightbox-next');

    var currentIndex = 0;
    var imageList = [];
    var lastFocusedElement = null;

    items.forEach(function (card, index) {
      var itemImg = card.querySelector('img');
      if (!itemImg) return;
      var src = card.getAttribute('data-full') || itemImg.getAttribute('src');
      var alt = itemImg.getAttribute('alt') || 'Product installation photograph';
      imageList.push({ src: src, alt: alt });

      card.addEventListener('click', function () {
        open(index);
      });
    });

    function open(index) {
      lastFocusedElement = document.activeElement;
      currentIndex = (index + imageList.length) % imageList.length;
      update();
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      btnClose.focus();
    }

    function close() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }

    function prev() {
      currentIndex = (currentIndex - 1 + imageList.length) % imageList.length;
      update();
    }

    function next() {
      currentIndex = (currentIndex + 1) % imageList.length;
      update();
    }

    function update() {
      var current = imageList[currentIndex];
      if (!current) return;
      img.src = current.src;
      img.alt = current.alt;
      titleEl.textContent = current.alt;
      counterEl.textContent = '(' + (currentIndex + 1) + ' / ' + imageList.length + ')';
    }

    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', prev);
    btnNext.addEventListener('click', next);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-dialog')) {
        close();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      }
    });
  }
})();

