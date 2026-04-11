/* ═══════════════════════════════════════════════
   NextStar — main.js
   Three.js star field + page interactions
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
  });
}

/* ── THREE.JS STAR FIELD ───────────────────────── */
function initThreeHero() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const getW = () => canvas.offsetWidth;
  const getH = () => canvas.offsetHeight;
  const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

  /* Renderer */
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(getW(), getH());

  /* Scene + camera */
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, getW() / getH(), 0.1, 1000);
  camera.position.z = 28;

  /* Root group so we can rotate all stars together */
  const root = new THREE.Group();
  scene.add(root);

  /* Star groups — different colors, sizes, twinkle speeds */
  const GROUPS = [
    { count: 90,  color: 0xFE8C00, size: 1.0,  speed: 0.55, baseOp: 0.45 }, // amber
    { count: 65,  color: 0x4a9e80, size: 0.8,  speed: 0.75, baseOp: 0.38 }, // teal
    { count: 150, color: 0xfff4e8, size: 0.5,  speed: 0.38, baseOp: 0.42 }, // warm white
    { count: 18,  color: 0xe8a87c, size: 2.2,  speed: 0.28, baseOp: 0.55 }, // large accent stars
  ];

  const groups = GROUPS.map(({ count, color, size, speed, baseOp }) => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 85;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 65;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color, size, transparent: true,
      opacity: baseOp, sizeAttenuation: true,
      depthWrite: false,
    });
    const pts = new THREE.Points(geo, mat);
    root.add(pts);
    return { mat, speed, baseOp, phase: Math.random() * Math.PI * 2 };
  });

  /* Mouse parallax */
  let mx = 0, my = 0, camX = 0, camY = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5);
    my = (e.clientY / window.innerHeight - 0.5);
  });

  /* Animation loop */
  let t = 0;
  (function animate() {
    requestAnimationFrame(animate);
    t += 0.008;

    const dark   = isDark();
    const opMult = dark ? 1.0 : 0.55;

    /* Per-group twinkle */
    groups.forEach(({ mat, speed, baseOp, phase }) => {
      mat.opacity = baseOp * opMult * (0.55 + 0.45 * Math.sin(t * speed + phase));
    });

    /* Slow drift */
    root.rotation.y += 0.0007;
    root.rotation.x  = Math.sin(t * 0.08) * 0.04;

    /* Smooth mouse parallax on camera */
    camX += (mx * 4  - camX) * 0.025;
    camY += (-my * 3 - camY) * 0.025;
    camera.position.x = camX;
    camera.position.y = camY;

    renderer.render(scene, camera);
  })();

  /* Resize */
  window.addEventListener('resize', () => {
    camera.aspect = getW() / getH();
    camera.updateProjectionMatrix();
    renderer.setSize(getW(), getH());
  });
}

/* ── HERO FULL WAVE (bottom of room card) ──────── */
function initHeroFullWave() {
  const container = document.getElementById('heroFullWave');
  if (!container) return;

  const BAR_COUNT = 28;
  for (let i = 0; i < BAR_COUNT; i++) {
    const bar = document.createElement('div');
    bar.className = 'mock-fw-bar';
    const pos = i / BAR_COUNT;
    const env = Math.sin(pos * Math.PI);
    bar.style.setProperty('--wh', `${6 + env * 26 + Math.random() * 6}px`);
    bar.style.animationDelay = `${(pos * 1.4).toFixed(2)}s`;
    bar.style.opacity = (0.3 + env * 0.7).toFixed(2);
    container.appendChild(bar);
  }
}

/* ── MINI WAVE (speaking participant) ──────────── */
function initMiniWave() {
  const container = document.getElementById('miniWave1');
  if (!container) return;

  for (let i = 0; i < 7; i++) {
    const bar = document.createElement('div');
    bar.className = 'mock-pw-bar';
    const mh = 3 + Math.random() * 9;
    bar.style.setProperty('--mh', `${mh}px`);
    bar.style.animationDelay = `${(Math.random() * 1.1).toFixed(2)}s`;
    container.appendChild(bar);
  }
}

/* ── LANGUAGE TICKER ────────────────────────────── */
function initTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;

  const langs = [
    { code: 'vn', name: 'Tiếng Việt'      },
    { code: 'gb', name: 'British English'  },
    { code: 'us', name: 'American English' },
    { code: 'cn', name: '普通话'            },
    { code: 'jp', name: '日本語'            },
    { code: 'kr', name: '한국어'            },
    { code: 'es', name: 'Español'          },
    { code: 'fr', name: 'Français'         },
    { code: 'de', name: 'Deutsch'          },
    { code: 'id', name: 'Bahasa'           },
    { code: 'th', name: 'ภาษาไทย'         },
    { code: 'pt', name: 'Português'        },
    { code: 'it', name: 'Italiano'         },
  ];

  /* Duplicate for seamless loop */
  [...langs, ...langs].forEach(({ code, name }) => {
    const chip = document.createElement('span');
    chip.className = 'lang-chip';

    const img = document.createElement('img');
    img.src   = `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${code}.svg`;
    img.alt   = code.toUpperCase();
    img.style.cssText = 'width:22px;height:15px;border-radius:3px;object-fit:cover;flex-shrink:0;';

    /* Fallback: show code text if image fails */
    img.onerror = () => {
      img.style.display = 'none';
      const fb = document.createElement('span');
      fb.textContent = code.toUpperCase();
      fb.style.cssText = 'font-family:monospace;font-size:0.65rem;font-weight:700;color:var(--muted);';
      chip.insertBefore(fb, chip.firstChild);
    };

    const label = document.createElement('span');
    label.textContent = name;

    chip.appendChild(img);
    chip.appendChild(label);
    track.appendChild(chip);
  });
}

/* ── INTERSECTION OBSERVER (scroll reveals) ─────── */
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .stat-card, .sec-card'
  ).forEach(el => observer.observe(el));
}

/* ── NAVBAR SCROLL SHADOW ───────────────────────── */
function initNavScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });
}

/* ── SMOOTH SCROLL ──────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

/* ── CHAT BUBBLE ────────────────────────────────── */
function initChatBubble() {
  const bubble   = document.getElementById('chatBubble');
  const win      = document.getElementById('chatWindow');
  const closeBtn = document.getElementById('chatWinClose');
  const input    = document.getElementById('chatInput');
  const sendBtn  = document.getElementById('chatSend');
  const messages = document.getElementById('chatMessages');
  if (!bubble || !win) return;

  const SYSTEM_PROMPT = `You are Sora, the friendly AI language coach for NextStar — a social language learning platform where learners practice speaking with real people and AI. You are warm, encouraging, and knowledgeable about language learning. Keep responses concise (2-4 sentences) and helpful. You can answer questions about NextStar, language learning tips, or engage in casual conversation.`;

  /* Conversation history for context */
  const history = [{ role: 'system', content: SYSTEM_PROMPT }];

  /* Toggle open / close */
  function toggleChat() {
    const isOpen = win.classList.contains('open');
    bubble.classList.toggle('open');
    win.classList.toggle('open');
    if (!isOpen) setTimeout(() => input.focus(), 280);
  }

  bubble.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  /* Close on Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && win.classList.contains('open')) toggleChat();
  });

  /* Append a message bubble */
  function appendMessage(role, text) {
    const row = document.createElement('div');
    row.className = `chat-msg ${role}`;

    if (role === 'sora') {
      const av = document.createElement('div');
      av.className = 'chat-msg-av';
      av.textContent = '✦';
      row.appendChild(av);
    }

    const bub = document.createElement('div');
    bub.className = 'chat-msg-bubble';
    bub.textContent = text;
    row.appendChild(bub);

    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
    return bub;
  }

  /* Show / remove typing indicator */
  function showTyping() {
    const row = document.createElement('div');
    row.className = 'chat-typing';
    row.id = 'chatTyping';

    const av = document.createElement('div');
    av.className = 'chat-msg-av';
    av.textContent = '✦';

    const dots = document.createElement('div');
    dots.className = 'chat-typing-dots';
    for (let i = 0; i < 3; i++) {
      const d = document.createElement('div');
      d.className = 'chat-typing-dot';
      dots.appendChild(d);
    }

    row.appendChild(av);
    row.appendChild(dots);
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById('chatTyping');
    if (el) el.remove();
  }

  /* Send a message */
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    sendBtn.disabled = true;

    appendMessage('user', text);
    history.push({ role: 'user', content: text });

    showTyping();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `HTTP ${res.status}`);
      }

      const data  = await res.json();
      const reply = data.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't get a response. Please try again!";

      history.push({ role: 'assistant', content: reply });
      removeTyping();
      appendMessage('sora', reply);
    } catch (err) {
      removeTyping();
      appendMessage('sora', 'Oops — something went wrong. Check your connection and try again!');
      console.error('[Sora chat error]', err);
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
}

/* ── BOOT ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initThreeHero();
  initHeroFullWave();
  initMiniWave();
  initTicker();
  initReveal();
  initNavScroll();
  initSmoothScroll();
  initChatBubble();
});