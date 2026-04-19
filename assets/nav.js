(() => {
  const nav = document.querySelector(".nav");
  const btn = document.getElementById("menuToggle");
  if (!nav || !btn) return;

  btn.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });
})();