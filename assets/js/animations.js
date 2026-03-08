// ═══════════════════════════════════════════
//   GALAXY ANIMATIONS MODULE
// ═══════════════════════════════════════════

const GalaxyAnimation = (() => {
  let canvas, ctx, stars = [], shootingStars = [], animId;

  const config = {
    starCount: 280,
    starColors: ['#ffffff', '#e8eaff', '#c8d0ff', '#64ffda', '#bd93f9'],
    shootingStarInterval: 3200,
  };

  function init() {
    canvas = document.getElementById('galaxy-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    createStars();
    animate();
    scheduleShootingStars();
    window.addEventListener('resize', resize);
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (stars.length) createStars(); // Redistribute
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < config.starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.2,
        color: config.starColors[Math.floor(Math.random() * config.starColors.length)],
        opacity: Math.random() * 0.7 + 0.2,
        blinkSpeed: Math.random() * 0.008 + 0.002,
        blinkDir: Math.random() > 0.5 ? 1 : -1,
        depth: Math.random(), // parallax layer
      });
    }
  }

  function drawStars() {
    stars.forEach(star => {
      // Twinkle
      star.opacity += star.blinkSpeed * star.blinkDir;
      if (star.opacity >= 0.9 || star.opacity <= 0.1) star.blinkDir *= -1;

      ctx.save();
      ctx.globalAlpha = star.opacity;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.fill();

      // Glow on larger stars
      if (star.r > 1.2) {
        ctx.globalAlpha = star.opacity * 0.3;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r * 2.5, 0, Math.PI * 2);
        const grd = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r * 2.5);
        grd.addColorStop(0, star.color);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.fill();
      }
      ctx.restore();
    });
  }

  function scheduleShootingStars() {
    setInterval(() => {
      if (Math.random() > 0.3) spawnShootingStar();
    }, config.shootingStarInterval);
  }

  function spawnShootingStar() {
    const angle = Math.PI / 6 + (Math.random() * Math.PI / 8);
    shootingStars.push({
      x: Math.random() * canvas.width * 0.8,
      y: Math.random() * canvas.height * 0.4,
      speed: Math.random() * 12 + 8,
      length: Math.random() * 160 + 80,
      angle,
      opacity: 1,
      life: 1,
    });
  }

  function drawShootingStars() {
    shootingStars = shootingStars.filter(s => s.life > 0);
    shootingStars.forEach(s => {
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.life -= 0.018;

      const tailX = s.x - Math.cos(s.angle) * s.length;
      const tailY = s.y - Math.sin(s.angle) * s.length;

      ctx.save();
      ctx.globalAlpha = s.life;
      const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.6, 'rgba(200, 210, 255, 0.4)');
      grad.addColorStop(1, '#ffffff');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();

      // Head glow
      ctx.globalAlpha = s.life * 0.8;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.restore();
    });
  }

  function drawNebula() {
    // Subtle nebula clouds
    const clouds = [
      { x: canvas.width * 0.75, y: canvas.height * 0.2, r: 200, color: '100,255,218', a: 0.025 },
      { x: canvas.width * 0.1, y: canvas.height * 0.7, r: 250, color: '189,147,249', a: 0.02 },
      { x: canvas.width * 0.5, y: canvas.height * 0.9, r: 180, color: '100,255,218', a: 0.015 },
    ];
    clouds.forEach(c => {
      const grd = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
      grd.addColorStop(0, `rgba(${c.color},${c.a})`);
      grd.addColorStop(1, 'transparent');
      ctx.save();
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNebula();
    drawStars();
    drawShootingStars();
    animId = requestAnimationFrame(animate);
  }

  function destroy() {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
  }

  return { init, destroy };
})();

// ─── Planets ────────────────────────────────
const Planets = (() => {
  function createPlanet(options) {
    const container = document.querySelector(options.selector);
    if (!container) return;

    const planet = document.createElement('div');
    planet.className = 'planet-element';
    planet.style.cssText = `
      position: absolute;
      width: ${options.size}px;
      height: ${options.size}px;
      border-radius: 50%;
      background: ${options.gradient};
      box-shadow: ${options.glow};
      opacity: ${options.opacity || 0.6};
      pointer-events: none;
      animation: planetFloat ${options.floatDuration || 8}s ease-in-out infinite alternate;
    `;
    if (options.top) planet.style.top = options.top;
    if (options.right) planet.style.right = options.right;
    if (options.left) planet.style.left = options.left;
    if (options.bottom) planet.style.bottom = options.bottom;

    if (options.ring) {
      const ring = document.createElement('div');
      ring.style.cssText = `
        position: absolute;
        width: ${options.size * 2}px;
        height: ${options.size * 0.3}px;
        left: ${-options.size * 0.5}px;
        top: ${options.size * 0.35}px;
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.08);
        transform: rotateX(70deg);
      `;
      planet.appendChild(ring);
    }

    container.appendChild(planet);
  }

  // Inject planet float keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes planetFloat {
      from { transform: translateY(0px) rotate(0deg); }
      to { transform: translateY(-20px) rotate(5deg); }
    }
  `;
  document.head.appendChild(style);

  return { createPlanet };
})();

export { GalaxyAnimation, Planets };
