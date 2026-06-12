(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.getElementById("flow-canvas");
  const obiOpening = document.querySelector(".obi-opening");

  if (obiOpening) {
    if (reduceMotion) {
      obiOpening.remove();
    } else {
      window.setTimeout(() => {
        obiOpening.classList.add("is-end");
        window.setTimeout(() => {
          obiOpening.remove();
        }, 1000);
      }, 250);
    }
  }

  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d", { alpha: true });
    const palette = [
      [223, 163, 170],
      [143, 184, 200],
      [143, 175, 155],
      [197, 160, 90]
    ];
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particleCount = window.innerWidth < 768 ? 30 : 56;
    const particles = [];

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    function setup() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles.length = 0;
      for (let i = 0; i < particleCount; i += 1) {
        particles.push({
          x: rand(0, w),
          y: rand(0, h),
          r: rand(1.2, 3.2),
          a: rand(0.07, 0.28),
          speed: rand(0.15, 0.5),
          drift: rand(0.15, 0.45),
          seed: rand(0, Math.PI * 2),
          tone: palette[Math.floor(rand(0, palette.length))]
        });
      }
    }

    function drawGlow(x, y, radius, alpha, tone) {
      const [r, g, b] = tone;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function animate(t) {
      const time = t * 0.001;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(126, 110, 92, 0.06)";
      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += Math.sin(time * p.drift + p.seed) * p.speed;
        p.y += Math.cos(time * p.drift * 0.8 + p.seed) * p.speed;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        drawGlow(p.x, p.y, p.r * 8, p.a, p.tone);
      }

      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.12;
            ctx.strokeStyle = `rgba(126, 110, 92, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      window.requestAnimationFrame(animate);
    }

    setup();
    window.addEventListener("resize", setup);
    window.requestAnimationFrame(animate);
  }

  const revealTargets = document.querySelectorAll("[data-reveal]");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealTargets.forEach((el) => io.observe(el));

  const lines = document.querySelectorAll(".fade-line");
  const lineIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          lines.forEach((line, idx) => {
            window.setTimeout(() => line.classList.add("is-visible"), idx * 180);
          });
          lineIo.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const manifesto = document.querySelector(".manifesto-copy");
  if (manifesto) {
    lineIo.observe(manifesto);
  }

  const heroSteps = document.querySelectorAll("[data-hero-step]");
  if (heroSteps.length) {
    if (reduceMotion) {
      heroSteps.forEach((step) => step.classList.add("is-visible"));
    } else {
      window.requestAnimationFrame(() => {
        heroSteps.forEach((step, idx) => {
          window.setTimeout(() => {
            step.classList.add("is-visible");
          }, 140 + idx * 180);
        });
      });
    }
  }

  const hero = document.querySelector(".hero");
  if (hero && !reduceMotion) {
    let ticking = false;

    const updateHeroMist = () => {
      const rect = hero.getBoundingClientRect();
      const offset = Math.max(-28, Math.min(28, -rect.top * 0.12));
      hero.style.setProperty("--hero-mist-offset", `${offset.toFixed(1)}px`);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeroMist);
    };

    updateHeroMist();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
})();