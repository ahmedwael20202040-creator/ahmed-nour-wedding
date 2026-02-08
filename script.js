// script.js
(() => {
  // ===== Elements =====
  const intro = document.getElementById("intro");
  const startBtn = document.getElementById("startBtn");
  const mainCard = document.getElementById("mainCard");

  const messageEl = document.getElementById("message");
  const countLabel = document.getElementById("countLabel");
  const dateLine = document.getElementById("dateLine");

  const dEl = document.getElementById("d");
  const hEl = document.getElementById("h");
  const mEl = document.getElementById("m");
  const sEl = document.getElementById("s");

  const crown = document.getElementById("crown");

  // ===== Data =====
  const weddingDate = new Date(2026, 5, 6, 19, 0, 0); // June 6, 2026 - 7:00 PM local
  const messageText = `To Ahmed and Nour,

Every passing day brings us closer to the most beautiful day of our lives. 💍

We are counting the moments until we begin our forever story.`;

  // ===== Helpers =====
  const rand = (min, max) => Math.random() * (max - min) + min;

  function heartPoint(t) {
    // Parametric heart:
    // x = 16 sin^3(t)
    // y = 13cos(t)-5cos(2t)-2cos(3t)-cos(4t)
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);
    return { x, y };
  }

  // ===== Fit to screen (important for mobile full view) =====
  function fitToScreen() {
    const wrap = document.querySelector(".wrap");
    if (!wrap) return;

    // base design size
    const baseW = 390;
    const baseH = 844;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(vw / baseW, vh / baseH);

    wrap.style.transformOrigin = "top center";
    wrap.style.transform = `scale(${scale})`;
  }

  // ===== Init text/date =====
  messageEl.textContent = messageText;

  const fmtDate = weddingDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const fmtTime = weddingDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  dateLine.textContent = `Wedding Date: ${fmtDate} — ${fmtTime}`;

  // ===== Countdown =====
  function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      dEl.textContent = "0";
      hEl.textContent = "0";
      mEl.textContent = "0";
      sEl.textContent = "0";
      countLabel.textContent = "Congratulations to the beautiful couple! 💍❤️";
      return;
    }

    const total = Math.floor(diff / 1000);
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const secs = total % 60;

    dEl.textContent = String(days);
    hEl.textContent = String(hours).padStart(2, "0");
    mEl.textContent = String(mins).padStart(2, "0");
    sEl.textContent = String(secs).padStart(2, "0");
  }

  // ===== Tree growth =====
  function buildHeartTree() {
    crown.innerHTML = "";

    const palette = [
      "#ff7f92",
      "#ff92a3",
      "#ffb5c2",
      "#ffcbd6",
      "#ff6f88",
      "#f7b8c5",
      "#f59aac",
    ];

    const leavesBuffer = [];
    const totalLeaves = window.innerWidth <= 768 ? 170 : 300;

    // Use actual crown size for better fit
    const crownRect = crown.getBoundingClientRect();
    const W = Math.max(220, Math.round(crownRect.width));
    const H = Math.max(180, Math.round(crownRect.height));
    const cx = W / 2;
    const cy = H / 2 + 6;

    for (let i = 0; i < totalLeaves; i++) {
      const leaf = document.createElement("span");
      leaf.className = "leaf";

      const t = rand(0, Math.PI * 2);
      const p = heartPoint(t);
      const mobile = window.innerWidth <= 768;
const scale = mobile ? rand(7.6, 10.2) : rand(6.8, 9.1);

      let x = cx + p.x * scale + rand(-8, 8);
      let y = cy - p.y * scale + rand(-10, 10);

      x = Math.max(8, Math.min(W - 28, x));
      y = Math.max(8, Math.min(H - 28, y));

      const size = rand(
        window.innerWidth <= 768 ? 9 : 12,
        window.innerWidth <= 768 ? 16 : 22
      );

      leaf.style.left = `${x}px`;
      leaf.style.top = `${y}px`;
      leaf.style.width = `${size}px`;
      leaf.style.height = `${size}px`;
      leaf.style.background = palette[Math.floor(Math.random() * palette.length)];
      leaf.style.opacity = `${rand(0.82, 1)}`;
      leaf.style.animationDelay = `${rand(0, 3)}s`;
      leaf.style.animationDuration = `${rand(2.8, 4.9)}s`;

      // Per-leaf pseudo-element sizing
      const st = document.createElement("style");
      st.textContent = `
        .leaf.leaf-${i}::before,.leaf.leaf-${i}::after{
          width:${size}px;height:${size}px;
        }
        .leaf.leaf-${i}::before{top:${-size / 2}px;left:0}
        .leaf.leaf-${i}::after{left:${size / 2}px;top:0}
      `;
      document.head.appendChild(st);

      leaf.classList.add(`leaf-${i}`);
      leavesBuffer.push(leaf);
    }

    // Bottom -> top build
    leavesBuffer.sort((a, b) => parseFloat(b.style.top) - parseFloat(a.style.top));

    let idx = 0;
    const timer = setInterval(() => {
      if (idx >= leavesBuffer.length) {
        clearInterval(timer);
        return;
      }

      const progress = idx / leavesBuffer.length;
      const chunk = Math.min(11, 2 + Math.floor(progress * 9));

      for (let k = 0; k < chunk && idx < leavesBuffer.length; k++, idx++) {
        const leaf = leavesBuffer[idx];
        leaf.style.opacity = "0";
        leaf.style.transform = "scale(.2) rotate(-45deg)";
        crown.appendChild(leaf);

        requestAnimationFrame(() => {
          leaf.style.transition = "transform 320ms ease, opacity 320ms ease";
          leaf.style.opacity = "0.96";
          leaf.style.transform = "scale(1) rotate(-45deg)";
        });
      }
    }, 75);

    return timer;
  }

  // ===== Falling hearts =====
  function startFallingHearts() {
    const palette = [
      "#ff7f92",
      "#ff92a3",
      "#ffb5c2",
      "#ffcbd6",
      "#ff6f88",
      "#f7b8c5",
      "#f59aac",
    ];

    function spawn() {
      const h = document.createElement("span");
      h.className = "leaf falling";

      const mobile = window.innerWidth <= 768;
      const size = rand(mobile ? 7 : 8, mobile ? 13 : 16);

      h.style.left = `${rand(0, 100)}vw`;
      h.style.width = `${size}px`;
      h.style.height = `${size}px`;
      h.style.background = palette[Math.floor(Math.random() * palette.length)];
      h.style.animationDuration = `${rand(6, 11)}s`;
      h.style.opacity = `${rand(0.35, 0.9)}`;

      document.body.appendChild(h);
      setTimeout(() => h.remove(), 12000);
    }

    const fallInterval = window.innerWidth <= 768 ? 520 : 260;
    return setInterval(spawn, fallInterval);
  }

  // ===== Start flow =====
  let countdownTimer = null;
  let fallTimer = null;
  let growTimer = null;
  let opened = false;

  function openPage() {
    if (opened) return; // prevent duplicate starts
    opened = true;

    if (intro) intro.classList.add("hidden");
    if (mainCard) mainCard.classList.add("show");

    fitToScreen();
    updateCountdown();

    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = setInterval(updateCountdown, 1000);

    if (growTimer) clearInterval(growTimer);
    growTimer = buildHeartTree();

    if (fallTimer) clearInterval(fallTimer);
    fallTimer = startFallingHearts();
  }

  // Auto open
  setTimeout(openPage, 1200);

  // Optional manual open
  if (startBtn) {
    startBtn.addEventListener("click", openPage, { once: true });
  }

  // Refit on resize/orientation
  let resizeDebounce = null;
  window.addEventListener("resize", () => {
    fitToScreen();

    if (!mainCard.classList.contains("show")) return;
    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(() => {
      if (growTimer) clearInterval(growTimer);
      growTimer = buildHeartTree();

      if (fallTimer) clearInterval(fallTimer);
      fallTimer = startFallingHearts();

      updateCountdown();
    }, 250);
  });

  window.addEventListener("orientationchange", () => {
    setTimeout(fitToScreen, 120);
  });

  // initial fit
  fitToScreen();
})();
