// Simple hero slider (fade) — no dependencies, supports ANY number of slides
(() => {
  const wrap = document.querySelector("[data-hero-slides]");
  const dotsWrap = document.querySelector("[data-hero-dots]");
  if (!wrap || !dotsWrap) return;

  const slides = Array.from(wrap.querySelectorAll(".hero-slide"));
  if (slides.length === 0) return;

  dotsWrap.innerHTML = "";
  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.className = "dot";
    b.type = "button";
    b.setAttribute("aria-label", `Slide ${i + 1}`);
    dotsWrap.appendChild(b);
    return b;
  });

  let idx = 0;
  let timer = null;

  function setActive(i) {
    idx = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("is-active", k === idx));
    dots.forEach((d, k) => d.classList.toggle("is-active", k === idx));
  }

  function next() { setActive(idx + 1); }
  function prev() { setActive(idx - 1); }

  function start() {
    stop();
    timer = setInterval(next, 6500);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  dots.forEach((d, i) => {
    d.addEventListener("click", () => { setActive(i); start(); });
  });

  wrap.addEventListener("mouseenter", stop);
  wrap.addEventListener("mouseleave", start);

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { next(); start(); }
    if (e.key === "ArrowLeft") { prev(); start(); }
  });

  setActive(0);
  start();
})();