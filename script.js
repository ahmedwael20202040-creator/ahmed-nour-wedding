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
  const weddingDate = new Date(2026, 5, 6, 19, 0, 0);

  // ===== Helpers =====
  const rand = (min, max) => Math.random() * (max - min) + min;

  function heartPoint(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);
    return { x, y };
  }

  // ===== Init text/date =====
  messageEl.innerHTML = `
    To Ahmed and Nour,<br><br>
    Every passing day brings us closer to the most beautiful day of our lives. 💍<br><br>
    We are counting the moments until we begin our forever story.
  `;

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

    const palette = ["#ff7f92", "#ff92a3", "#ffb5c2", "#ffcbd6", "#ff6f88", "#f7b8c5", "#f59aac"];
    const leavesBuffer = [];
    const mobile = window.innerWidth <= 768;
    const totalLeaves = mobile ? 150 : 280;

    const crownRect = crown.getBoundingClientRect();
    const W = Math.max(180, Math.round(crownRect.width));
    const H = Math.max(150, Math.round(crownRect.height));
    const cx = W / 2;
    const cy = H / 2 + (mobile ? 4 : 8);

    for (let i = 0; i < totalLeaves; i++) {
      const leaf = document.createElement("span");
      leaf.className = "leaf";

      const t = rand(0, Math.PI * 2);
      const p = heartPoint(t);
      const shapeScale = mobile ? rand(6.8, 9.2) : rand(6.5, 9.0);

      let x = cx + p.x * shapeScale + rand(-7, 7);
      let y = cy - p.y * shapeScale + rand(-8, 8);

      x = Math.max(6, Math.min(W - 24, x));
      y = Math.max(6, Math.min(H - 24, y));

      const size = rand(mobile ? 8 : 10, mobile ? 14 : 18);

      leaf.style.left = `${x}px`;
      leaf.style.top = `${y}px`;
      leaf.style.width = `${size}px`;
      leaf.style.height = `${size}px`;
      leaf.style.background = palette[Math.floor(Math.random() * palette.length)];
      leaf.style.opacity = `${rand(0.82, 1)}`;
      leaf.style.animationDelay = `${rand(0, 3)}s`;
      leaf.style.animationDuration = `${rand(2.8, 4.9)}s`;

      const st = document.createElement("style");
      st.textContent = `
        .leaf.leaf-${i}::before,.leaf.leaf-${i}::after{width:${size}px;height:${size}px;}
        .leaf.leaf-${i}::before{top:${-size / 2}px;left:0}
        .leaf.leaf-${i}::after{left:${size / 2}px;top:0}
      `;
      document.head.appendChild(st);

      leaf.classList.add(`leaf-${i}`);
      leavesBuffer.push(leaf);
    }

    leavesBuffer.sort((a, b) => parseFloat(b.style.top) - parseFloat(a.style.top));

    let idx = 0;
    const timer = setInterval(() => {
      if (idx >= leavesBuffer.length) {
        clearInterval(timer);
        return;
      }

      const progress = idx / leavesBuffer.length;
      const chunk = Math.min(10, 2 + Math.floor(progress * 8));

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
    const palette = ["#ff7f92", "#ff92a3", "#ffb5c2", "#ffcbd6", "#ff6f88", "#f7b8c5", "#f59aac"];

    function spawn() {
      const h = document.createElement("span");
      h.className = "leaf falling";
      const mobile = window.innerWidth <= 768;
      const size = rand(mobile ? 7 : 8, mobile ? 12 : 15);

      h.style.left = `${rand(0, 100)}vw`;
      h.style.width = `${size}px`;
      h.style.height = `${size}px`;
      h.style.background = palette[Math.floor(Math.random() * palette.length)];
      h.style.animationDuration = `${rand(6, 11)}s`;
      h.style.opacity = `${rand(0.35, 0.85)}`;

      document.body.appendChild(h);
      setTimeout(() => h.remove(), 12000);
    }

    const fallInterval = window.innerWidth <= 768 ? 520 : 280;
    return setInterval(spawn, fallInterval);
  }

  // ===== Start flow =====
  let countdownTimer = null;
  let fallTimer = null;
  let growTimer = null;
  let opened = false;

  function openPage() {
    if (opened) return;
    opened = true;

    if (intro) intro.classList.add("hidden");
    if (mainCard) mainCard.classList.add("show");

    updateCountdown();

    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = setInterval(updateCountdown, 1000);

    if (growTimer) clearInterval(growTimer);
    growTimer = buildHeartTree();

    if (fallTimer) clearInterval(fallTimer);
    fallTimer = startFallingHearts();
  }

  setTimeout(openPage, 700);

  if (startBtn) {
    startBtn.addEventListener("click", openPage, { once: true });
  }

  let resizeDebounce = null;
  window.addEventListener("resize", () => {
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
})();
