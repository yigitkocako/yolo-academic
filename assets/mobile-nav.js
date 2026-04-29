// Mobile hamburger nav (additive). Requires existing .tabs + #langToggle (or it will noop).
(() => {
  function setupMobileNav() {
    const tabs = document.querySelector(".tabs");
    if (!tabs) return;

    let burger = document.getElementById("navBurger");
    const langBtn = document.getElementById("langToggle");

    if (!burger) {
      burger = document.createElement("button");
      burger.id = "navBurger";
      burger.type = "button";
      burger.className = "nav-burger";
      burger.setAttribute("aria-label", "Menu");
      burger.setAttribute("aria-expanded", "false");
      burger.innerHTML = "<span aria-hidden=\"true\"></span>";
      if (langBtn && langBtn.parentElement) {
        langBtn.parentElement.insertBefore(burger, langBtn);
      } else {
        const right = document.querySelector(".nav-right");
        if (right) right.appendChild(burger);
      }
    } else if (!burger.querySelector("span")) {
      burger.innerHTML = "<span aria-hidden=\"true\"></span>";
    }

    let overlay = document.querySelector(".nav-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "nav-overlay";
      overlay.setAttribute("aria-hidden", "true");
      document.body.appendChild(overlay);
    }

    const isOpen = () => document.body.classList.contains("nav-open");
    const close = () => {
      document.body.classList.remove("nav-open");
      burger.setAttribute("aria-expanded", "false");
    };
    const open = () => {
      document.body.classList.add("nav-open");
      burger.setAttribute("aria-expanded", "true");
    };
    const toggle = () => (isOpen() ? close() : open());

    burger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    });

    tabs.addEventListener("click", (e) => e.stopPropagation());
    overlay.addEventListener("click", close);
    tabs.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    document.addEventListener("click", () => { if (isOpen()) close(); });
    window.addEventListener("resize", () => { if (window.innerWidth > 920) close(); });
  }

  document.addEventListener("DOMContentLoaded", setupMobileNav);
})();
