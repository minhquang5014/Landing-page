/* ═══════════════════════════════════════════════
   NextStar — main.js
   Landing page interactions & animations
═══════════════════════════════════════════════ */

/* ── THEME TOGGLE ──────────────────────────────── */
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const html   = document.documentElement;
  let theme    = localStorage.getItem('ns-theme') || 'light';

  html.setAttribute('data-theme', theme);

  toggle.addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('ns-theme', theme);
    // Restart star canvas colours
    drawStars();
  });
}

/* ── STAR FIELD CANVAS ─────────────────────────── */
function initStarCanvas() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  let stars    = [];
  let raf;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    buildStars();
  }

  function buildStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 6000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x:      Math.random() * canvas.width,
        y:      Math.random() * canvas.height,
        r:      Math.random() * 1.5 + 0.3,
        phase:  Math.random() * Math.PI * 2,
        speed:  0.003 + Math.random() * 0.008,
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const fill   = isDark ? 'rgba(255,255,255,' : 'rgba(26,26,26,';

    stars.forEach(s => {
      s.phase += s.speed;
      const alpha = 0.3 + Math.sin(s.phase) * 0.3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = fill + alpha + ')';
      ctx.fill();
    });

    raf = requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', resize);
  resize();
  drawStars();

  // expose drawStars so theme toggle can call it
  window.drawStars = drawStars;
}

/* ── HERO STAGE METER ──────────────────────────── */
function initStageMeter() {
  const container = document.getElementById('stageMeter');
  if (!container) return;

  const BAR_COUNT = 40;

  for (let i = 0; i < BAR_COUNT; i++) {
    const bar    = document.createElement('div');
    bar.className = 'stage-bar';

    const position = i / BAR_COUNT;
    const envelope = Math.sin(position * Math.PI);          // 0 → 1 → 0
    const minH   = 4 + envelope * 8;
    const maxH   = 14 + envelope * 48 + Math.random() * 10;
    const delay  = (position * 1.6).toFixed(3);

    bar.style.setProperty('--min-h', `${minH}px`);
    bar.style.setProperty('--max-h', `${maxH}px`);
    bar.style.animationDelay = `${delay}s`;
    bar.style.opacity = (0.35 + envelope * 0.65).toFixed(2);

    container.appendChild(bar);
  }
}

/* ── ROOM VISUALIZER ───────────────────────────── */
function initRoomViz() {
  const container = document.getElementById('roomViz');
  if (!container) return;

  for (let i = 0; i < 32; i++) {
    const bar    = document.createElement('div');
    bar.className = 'room-viz-bar';
    const rh     = (5 + Math.random() * 26).toFixed(1);
    bar.style.setProperty('--rh', `${rh}px`);
    bar.style.animationDelay = `${(Math.random() * 1.3).toFixed(2)}s`;
    container.appendChild(bar);
  }
}

/* ── LANGUAGE TICKER ───────────────────────────── */
function initTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;

  const langs = [
    { flag: '🇻🇳', name: 'Tiếng Việt' },
    { flag: '🇬🇧', name: 'English'    },
    { flag: '🇨🇳', name: '普通话'      },
    { flag: '🇯🇵', name: '日本語'      },
    { flag: '🇰🇷', name: '한국어'      },
    { flag: '🇪🇸', name: 'Español'    },
    { flag: '🇫🇷', name: 'Français'   },
    { flag: '🇩🇪', name: 'Deutsch'    },
    { flag: '🇮🇩', name: 'Bahasa'     },
    { flag: '🇹🇭', name: 'ภาษาไทย'   },
    { flag: '🇵🇹', name: 'Português'  },
    { flag: '🇮🇹', name: 'Italiano'   },
  ];

  // Duplicate for seamless infinite loop
  [...langs, ...langs].forEach(({ flag, name }) => {
    const chip = document.createElement('span');
    chip.className   = 'lang-chip';
    chip.textContent = `${flag} ${name}`;
    track.appendChild(chip);
  });
}

/* ── INTERSECTION OBSERVER ─────────────────────── */
function initReveal() {
  const targets = document.querySelectorAll(
    '.reveal, .feat-card, .step-item, .stat-card, .sec-card'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  targets.forEach(el => observer.observe(el));
}

/* ── NAVBAR SCROLL SHADOW ──────────────────────── */
function initNavShadow() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.style.boxShadow = '0 2px 24px rgba(0,0,0,0.08)';
    } else {
      nav.style.boxShadow = 'none';
    }
  }, { passive: true });
}

/* ── SMOOTH SCROLL FOR NAV LINKS ───────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── BOOT ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initStarCanvas();
  initStageMeter();
  initRoomViz();
  initTicker();
  initReveal();
  initNavShadow();
  initSmoothScroll();
});