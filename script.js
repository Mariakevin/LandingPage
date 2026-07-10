// ═══════════════════════════════════════════
    // CUSTOM CURSOR (fine pointer only)
    // ═══════════════════════════════════════════
    if (window.matchMedia('(pointer: fine)').matches) {
    const cursorOuter = document.querySelector('.cursor-outer');
    const cursorDot = document.querySelector('.cursor-dot');
    let mouseX = 0, mouseY = 0;
    let outerX = 0, outerY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
    }, { passive: true });

    function animateCursor() {
      outerX += (mouseX - outerX) * 0.12;
      outerY += (mouseY - outerY) * 0.12;
      cursorOuter.style.transform = `translate(calc(${outerX}px - 50%), calc(${outerY}px - 50%))`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener('mousedown', () => cursorOuter.classList.add('clicking'));
    document.addEventListener('mouseup', () => cursorOuter.classList.remove('clicking'));

    document.querySelectorAll('a, button, .service-card, .work-card, .insight-card, .step').forEach(el => {
      el.addEventListener('mouseenter', () => cursorOuter.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursorOuter.classList.remove('hovering'));
    });
    document.querySelectorAll('[data-open-consultation], [data-close-dialog]').forEach(el => {
      el.addEventListener('click', () => cursorOuter.classList.remove('hovering'));
    });
    }

    // ═══════════════════════════════════════════
    // SCROLL PERCENTAGE
    // ═══════════════════════════════════════════
    const scrollPercent = document.getElementById('scroll-percent');
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          scrollPercent.textContent = Math.round((scrolled / maxScroll) * 100) + '%';
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

    // ═══════════════════════════════════════════
    // TOAST STACKING SYSTEM
    // ═══════════════════════════════════════════
    const toastContainer = document.getElementById('toast-container');
    function showToast(message, type = 'info') {
      const el = document.createElement('div');
      el.className = 'toast-item ' + type;
      el.innerHTML = message + '<div class="toast-bar"></div>';
      toastContainer.appendChild(el);
      requestAnimationFrame(() => el.classList.add('show'));
      setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 400); }, 3000);
    }

    // ═══════════════════════════════════════════
    // DIALOG + FOCUS TRAP
    // ═══════════════════════════════════════════
    const consultationDialog = document.getElementById('consultation-dialog');
    const policyDialog = document.getElementById('policy-dialog');
    const formStatus = document.getElementById('form-status');
    let lastFocused = null;

    function trapFocus(dialog) {
      const focusable = dialog.querySelectorAll('button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      dialog.addEventListener('keydown', function handler(e) {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
    }

    document.querySelectorAll('[data-open-consultation]').forEach(btn => {
      btn.addEventListener('click', () => {
        lastFocused = document.activeElement;
        formStatus.style.display = 'none';
        document.getElementById('form-name').value = localStorage.getItem('draft_name') || '';
        document.getElementById('form-email').value = localStorage.getItem('draft_email') || '';
        document.getElementById('form-context').value = localStorage.getItem('draft_context') || '';
        consultationDialog.showModal();
        trapFocus(consultationDialog);
      });
    });

    document.querySelectorAll('[data-open-policy]').forEach(btn => {
      btn.addEventListener('click', () => { lastFocused = document.activeElement; policyDialog.showModal(); trapFocus(policyDialog); });
    });

    document.querySelectorAll('[data-close-dialog]').forEach(btn => {
      btn.addEventListener('click', () => { btn.closest('dialog').close(); if (lastFocused) lastFocused.focus(); });
    });

    document.querySelectorAll('dialog').forEach(d => {
      d.addEventListener('click', e => { if (e.target === d) { d.close(); if (lastFocused) lastFocused.focus(); } });
    });

    // ═══════════════════════════════════════════
    // FORM VALIDATION + CHAR COUNT + DRAFT SAVE
    // ═══════════════════════════════════════════
    const form = document.getElementById('consultation-form');
    const formSubmit = form.querySelector('.form-submit');
    const originalText = formSubmit.textContent;
    const formName = document.getElementById('form-name');
    const formEmail = document.getElementById('form-email');
    const formContext = document.getElementById('form-context');
    const charCount = document.getElementById('char-count');

    formContext.addEventListener('input', () => {
      const len = formContext.value.length;
      charCount.textContent = len;
      charCount.parentElement.classList.toggle('over', len > 450);
      localStorage.setItem('draft_context', formContext.value);
    });
    formName.addEventListener('input', () => localStorage.setItem('draft_name', formName.value));
    formEmail.addEventListener('input', () => localStorage.setItem('draft_email', formEmail.value));

    function validateField(group) {
      const input = group.querySelector('input, textarea, select');
      if (!input) return true;
      if (input.hasAttribute('required') && !input.value.trim()) { group.classList.add('error'); return false; }
      if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) { group.classList.add('error'); return false; }
      if (input.minLength && input.value.length < parseInt(input.minLength)) { group.classList.add('error'); return false; }
      group.classList.remove('error'); return true;
    }

    form.querySelectorAll('input, textarea, select').forEach(el => {
      el.addEventListener('blur', () => validateField(el.closest('.form-group')));
      el.addEventListener('input', () => el.closest('.form-group').classList.remove('error'));
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const groups = form.querySelectorAll('.form-group');
      let valid = true;
      groups.forEach(g => { if (!validateField(g)) valid = false; });
      if (!valid) { showToast('Please fix the errors above', 'error'); return; }

      const endpoint = form.getAttribute('data-endpoint') || '';
      const data = { name: formName.value, email: formEmail.value, focus: document.getElementById('form-focus').value, context: formContext.value };
      formSubmit.innerHTML = '<span class="spinner"></span>Sending...';
      formSubmit.classList.add('loading');

      function done() {
        form.reset();
        ['draft_name', 'draft_email', 'draft_context'].forEach(k => localStorage.removeItem(k));
        charCount.textContent = '0';
        formStatus.textContent = 'Thank you — I will be in touch within 24 hours.';
        formStatus.style.display = 'block';
        formSubmit.innerHTML = originalText;
        formSubmit.classList.remove('loading');
        groups.forEach(g => g.classList.remove('error'));
        showToast('Message sent successfully!', 'success');
      }

      if (endpoint) {
        fetch(endpoint, {
          method: 'POST', body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        }).then(r => { if (r.ok) done(); else throw Error(); }).catch(() => {
          formSubmit.innerHTML = originalText;
          formSubmit.classList.remove('loading');
          showToast('Could not send. Try alex@buildwithchen.com', 'error');
        });
      } else {
        setTimeout(done, 1200);
      }
    });

    // ═══════════════════════════════════════════
    // SCROLL REVEAL
    // ═══════════════════════════════════════════
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal-up, .reveal-scale, .reveal-left, .reveal-right, .reveal-rotate, .reveal-flip, .reveal-skew, .reveal-clip').forEach(el => {
      observer.observe(el);
    });

    // ═══════════════════════════════════════════
    // SCROLL SPY + SMOOTH SCROLL (NO TOAST)
    // ═══════════════════════════════════════════
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links .nav-link, .footer-link[href^="#"]');
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#') return;
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    let spyTicking = false;
    window.addEventListener('scroll', () => {
      if (!spyTicking) {
        requestAnimationFrame(() => {
          const fromTop = window.pageYOffset + 120;
          let current = '';
          sections.forEach(s => { if (s.offsetTop <= fromTop) current = s.id; });
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
          });
          spyTicking = false;
        });
        spyTicking = true;
      }
    }, { passive: true });

    // ═══════════════════════════════════════════
    // MALEOVER MOBILE NAV
    // ═══════════════════════════════════════════
    const navOverlay = document.getElementById('nav-overlay');
    const menuToggle = document.getElementById('menu-toggle');
    const navOverlayClose = document.getElementById('nav-overlay-close');
    menuToggle.addEventListener('click', () => navOverlay.classList.add('open'));
    navOverlayClose.addEventListener('click', () => navOverlay.classList.remove('open'));
    navOverlay.querySelectorAll('[data-nav], [data-open-consultation]').forEach(el => {
      el.addEventListener('click', () => navOverlay.classList.remove('open'));
    });

    // ═══════════════════════════════════════════

    // ═══════════════════════════════════════════
    // STATS COUNTER ANIMATION
    // ═══════════════════════════════════════════
    const statObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-number').forEach(stat => {
            const text = stat.textContent;
            const suffix = text.replace(/[\d.]+/, '');
            const target = parseFloat(text) || 0;
            let current = 0;
            const step = Math.max(1, Math.floor(target / 40));
            const interval = setInterval(() => {
              current += step;
              if (current >= target) { current = target; clearInterval(interval); }
              stat.textContent = (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
            }, 30);
          });
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.hero-stats').forEach(el => statObserver.observe(el));

    // ═══════════════════════════════════════════
    // PROJECT FILTER
    // ═══════════════════════════════════════════
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.work-card');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // ═══════════════════════════════════════════
    // SKILL BAR ANIMATION
    // ═══════════════════════════════════════════
    const skillObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => { bar.classList.add('filled'); });
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skill-bars').forEach(el => skillObserver.observe(el));

    // ═══════════════════════════════════════════
    // TYPING EFFECT
    // ═══════════════════════════════════════════
    const typingEl = document.getElementById('typing-text');
    if (typingEl) {
      const phrases = ['React • TypeScript • Next.js', 'clean APIs that scale', 'design systems that last', 'apps users actually enjoy'];
      let phraseIdx = 0, charIdx = 0, isDeleting = false;
      function typeLoop() {
        const current = phrases[phraseIdx];
        if (!isDeleting) {
          typingEl.textContent = current.substring(0, charIdx + 1);
          charIdx++;
          if (charIdx === current.length) { isDeleting = true; setTimeout(typeLoop, 2000); return; }
          setTimeout(typeLoop, 60 + Math.random() * 40);
        } else {
          typingEl.textContent = current.substring(0, charIdx - 1);
          charIdx--;
          if (charIdx === 0) { isDeleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(typeLoop, 400); return; }
          setTimeout(typeLoop, 30 + Math.random() * 20);
        }
      }
      setTimeout(typeLoop, 1500);
    }

    // ═══════════════════════════════════════════
    // KEYBOARD SHORTCUTS
    // ═══════════════════════════════════════════
    const shortcuts = { s: '#skills', a: '#about', p: '#projects', c: '#contact' };
    let kbdHelpVisible = false;
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('dialog').forEach(d => d.close());
        navOverlay.classList.remove('open');
      }
      if (shortcuts[e.key] && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        const target = document.querySelector(shortcuts[e.key]);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (!kbdHelpVisible) {
          showToast('S: Skills · A: About · P: Projects · C: Contact · ?: Help', 'info');
          kbdHelpVisible = true;
          setTimeout(() => kbdHelpVisible = false, 4000);
        }
      }
    });

    // ═══════════════════════════════════════════
    // CV DOWNLOAD
    // ═══════════════════════════════════════════
    document.getElementById('resume-download')?.addEventListener('click', () => {
      const blob = new Blob([
`ALEX CHEN
Full-Stack Developer & Designer
alex@buildwithchen.com · github.com/alexchen · linkedin.com/in/alexchen

EXPERIENCE
Senior Full-Stack Engineer · Stripe (Remote) · 2024-Present
  Payment infrastructure APIs, React Server Components migration.
Frontend Lead · Vercel (San Francisco, CA) · 2022-2024
  Dashboard architecture, design system for 100k+ developers.
Full-Stack Developer · Rainbow Studios (New York, NY) · 2020-2022
  12+ products shipped for fintech and health startups.
Junior Developer · Digital Agency (Austin, TX) · 2018-2020
  React, WordPress, CI/CD pipeline development.

EDUCATION
M.Sc. Computer Science · Stanford University · 2020-2022
B.Sc. Software Engineering · UC Berkeley · 2016-2020

SKILLS
React · TypeScript · Next.js · Node.js · Python · Go
PostgreSQL · Docker · AWS · Terraform · Design Systems

Open source maintainer. Available for freelance and full-time.`
      ], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'Alex_Chen_Resume.txt';
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      showToast('Resume downloaded!', 'success');
    });

    // ═══════════════════════════════════════════
    // EASTER EGG - KONAMI CODE
    // ═══════════════════════════════════════════
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    document.addEventListener('keydown', e => {
      konamiCode.push(e.key);
      konamiCode = konamiCode.slice(-10);
      if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbow 2s linear';
        showToast('Konami code activated!', 'success');
        setTimeout(() => document.body.style.animation = '', 2000);
      }
    });

    // ═══════════════════════════════════════════
    // 3D TILT ON CARDS
    // ═══════════════════════════════════════════
    document.querySelectorAll('.work-card, .insight-card, .service-card, .timeline-content').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(10px)`;
        card.style.transition = 'transform 0.1s ease';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
      });
    });

    // ═══════════════════════════════════════════
    // MAGNETIC BUTTONS
    // ═══════════════════════════════════════════
    document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta, .cta-btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.25;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s ease';
      });
    });

    // ═══════════════════════════════════════════
    // RIPPLE ON CLICK
    // ═══════════════════════════════════════════
    document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta, .cta-btn, .filter-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute; border-radius: 50%;
          background: rgba(255,255,255,0.4);
          width: 20px; height: 20px;
          left: ${e.clientX - this.getBoundingClientRect().left - 10}px;
          top: ${e.clientY - this.getBoundingClientRect().top - 10}px;
          transform: scale(0); pointer-events: none;
          animation: ripple-out 0.6s ease-out forwards;
        `;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // ═══════════════════════════════════════════
    // BACK TO TOP
    // ═══════════════════════════════════════════
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        backToTop.classList.toggle('visible', window.pageYOffset > 400);
      });
    }, { passive: true });

    // ═══════════════════════════════════════════
    // PAGE VISIBILITY
    // ═══════════════════════════════════════════
    document.addEventListener('visibilitychange', () => {
      document.title = document.hidden ? 'Come back to build something!' : 'Alex Chen — Full-Stack Developer & Designer';
      if (!document.hidden) showToast('Welcome back!', 'info');
    });

    // ═══════════════════════════════════════════
    // CONSOLE EASTER EGG
    // ═══════════════════════════════════════════
    console.log('%c Alex Chen ', 'background: #1A1A2E; color: #FF6B35; font-size: 2rem; font-weight: bold; padding: 10px 20px;');
    console.log('%c Full-stack developer building bold experiences ', 'background: #4361EE; color: white; font-size: 0.875rem; padding: 5px 10px;');
    console.log('%c Press ? for keyboard shortcuts ', 'background: #1A1A2E; color: #E8E0D0; font-size: 0.8rem; padding: 5px 10px;');
