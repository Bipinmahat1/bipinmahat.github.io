(function () {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main > section[id]');
  const contactForm = document.getElementById('contact-form');
  const formResponse = document.getElementById('form-response');

  function applyInitialTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.body.classList.add('dark');
      themeIcon.textContent = '☀️';
    } else if (saved === 'light') {
      document.body.classList.remove('dark');
      themeIcon.textContent = '🌙';
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.body.classList.add('dark');
        themeIcon.textContent = '☀️';
      }
    }
  }

  function toggleTheme() {
    const isDark = document.body.classList.toggle('dark');
    if (isDark) {
      themeIcon.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    } else {
      themeIcon.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    }
  }

  function setupSectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const navId = `#${entry.target.id}`;
          const link = document.querySelector(`.nav-link[href='${navId}']`);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((section) => observer.observe(section));
  }

  function handleContactSubmit(event) {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject') || 'Portfolio Website Inquiry';
    const message = formData.get('message');
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailto = `mailto:Bipinmahat643@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setTimeout(() => {
      window.location.href = mailto;
    }, 100);
    formResponse.hidden = false;
    formResponse.textContent = 'Thank you! Your email client should now open – if not, please send an email to bipinmahat643@gmail.com.';
    contactForm.reset();
  }

  applyInitialTheme();
  setupSectionObserver();

  themeToggle.addEventListener('click', toggleTheme);
  contactForm.addEventListener('submit', handleContactSubmit);

  const bgCanvas = document.getElementById('bg-canvas');
  if (bgCanvas && bgCanvas.getContext) {
    const ctx = bgCanvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let lines = [];
    const lineCount = 32;

    function createLines() {
      lines = [];
      for (let i = 0; i < lineCount; i++) {
        const horizontal = Math.random() > 0.3;
        lines.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          speed: 0.15 + Math.random() * 0.45,
          length: 60 + Math.random() * 160,
          horizontal
        });
      }
    }

    function resizeCanvas() {
      const { innerWidth, innerHeight } = window;
      bgCanvas.width = innerWidth * dpr;
      bgCanvas.height = innerHeight * dpr;
      ctx.scale(dpr, dpr);
      createLines();
    }

    function draw() {
      ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      ctx.lineWidth = 1;
      ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--primary');
      lines.forEach((line) => {
        ctx.beginPath();
        if (line.horizontal) {
          ctx.moveTo(line.x, line.y);
          ctx.lineTo(line.x + line.length, line.y);
        } else {
          ctx.moveTo(line.x, line.y);
          ctx.lineTo(line.x, line.y + line.length);
        }
        ctx.stroke();
        if (line.horizontal) {
          line.x += line.speed;
          if (line.x > window.innerWidth + line.length) {
            line.x = -line.length;
            line.y = Math.random() * window.innerHeight;
          }
        } else {
          line.y += line.speed;
          if (line.y > window.innerHeight + line.length) {
            line.y = -line.length;
            line.x = Math.random() * window.innerWidth;
          }
        }
      });
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    draw();
  }

  const projectCards = document.querySelectorAll('.project-card');
  if (projectCards.length) {
    const cardsArray = Array.from(projectCards);
    const projectObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = cardsArray.indexOf(entry.target);
            const delay = idx * 200;
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);
            projectObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    cardsArray.forEach((card) => projectObserver.observe(card));
  }

  const skillLevels = document.querySelectorAll('.skill-level');
  if (skillLevels.length) {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const level = el.dataset.level;
            requestAnimationFrame(() => {
              el.style.width = `${level}%`;
            });
            skillObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );
    skillLevels.forEach((el) => skillObserver.observe(el));
  }

  function initCursor() {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    let ringScale = 1;
    let ringTimeout;
    function position(event) {
      const x = event.clientX;
      const y = event.clientY;
      dot.style.transform = `translate(${x}px, ${y}px)`;
      ring.style.transform = `translate(${x}px, ${y}px) scale(${ringScale})`;
    }
    function click() {
      ringScale = 2.5;
      ring.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      ring.style.opacity = '0.6';
      clearTimeout(ringTimeout);
      ringTimeout = setTimeout(() => {
        ringScale = 1;
        ring.style.opacity = '0.4';
      }, 300);
    }
    document.addEventListener('mousemove', position);
    document.addEventListener('mousedown', click);
  }
  initCursor();
})();