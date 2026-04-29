// Services carousel — no dependencies
(() => {
  const track = document.querySelector("[data-svc-track]");
  const dotsWrap = document.querySelector("[data-svc-dots]");
  const prevBtn = document.querySelector("[data-svc-prev]");
  const nextBtn = document.querySelector("[data-svc-next]");
  const viewport = document.querySelector("[data-svc-viewport]");
  if (!track || !dotsWrap || !viewport) return;

  const cards = Array.from(track.querySelectorAll(".svc-card"));
  if (cards.length === 0) return;

  dotsWrap.innerHTML = "";
  const dots = cards.map((_, i) => {
    const b = document.createElement("button");
    b.className = "dot";
    b.type = "button";
    b.setAttribute("aria-label", `Service ${i + 1}`);
    b.addEventListener("click", () => { setActive(i, true); resetAuto(); });
    dotsWrap.appendChild(b);
    return b;
  });

  let idx = 0;
  let raf = null;

  // Auto-rotate (slow) — one step per interval
  const AUTO_MS = 10000; // 10s per slide (slower than hero)
  const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let autoTimer = null;
  let paused = false;

  function resetAuto() {
    if (prefersReducedMotion) return;
    clearTimeout(autoTimer);
    autoTimer = setTimeout(() => {
      if (!paused) {
        setActive((idx + 1) % cards.length, true);
      }
      resetAuto();
    }, AUTO_MS);
  }


  function setActive(i, smooth) {
    idx = Math.max(0, Math.min(cards.length - 1, i));
    dots.forEach((d, k) => d.classList.toggle("is-active", k === idx));
      resetAuto();
    const el = cards[idx];
    if (!el) return;
    el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", inline: "start", block: "nearest" });
  }

  function next() { setActive(idx + 1, true); resetAuto(); }
  function prev() { setActive(idx - 1, true); resetAuto(); }

  prevBtn && prevBtn.addEventListener("click", prev);
  nextBtn && nextBtn.addEventListener("click", next);

  // Update idx based on scroll position (nearest card)
  function onScroll() {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const vpRect = viewport.getBoundingClientRect();
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const dist = Math.abs(r.left - vpRect.left);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      if (best !== idx) {
        idx = best;
        dots.forEach((d, k) => d.classList.toggle("is-active", k === idx));
      resetAuto();
      }
    });
  }

  viewport.addEventListener("scroll", onScroll, { passive: true });

  // Pause auto-rotate while user hovers/focuses the carousel
  viewport.addEventListener("mouseenter", () => { paused = true; });
  viewport.addEventListener("mouseleave", () => { paused = false; resetAuto(); });
  viewport.addEventListener("focusin", () => { paused = true; });
  viewport.addEventListener("focusout", () => { paused = false; resetAuto(); });

  // Any interaction should push the next auto step out
  ["pointerdown","wheel","touchstart"].forEach((ev) => {
    viewport.addEventListener(ev, () => { resetAuto(); }, { passive: true });
  });


  // initial
  setActive(0, false);
  resetAuto();
})();
