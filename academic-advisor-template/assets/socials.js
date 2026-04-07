// Wire social icons from AA_CONFIG.socials
(() => {
  const s = (window.AA_CONFIG && window.AA_CONFIG.socials) || {};
  const map = { instagram: s.instagram, youtube: s.youtube, linkedin: s.linkedin };
  document.querySelectorAll("[data-social]").forEach((el) => {
    const key = el.getAttribute("data-social");
    const url = map[key] || "#";
    el.setAttribute("href", url);
    if (url === "#") {
      el.setAttribute("aria-disabled", "true");
      el.style.opacity = "0.65";
    } else {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noreferrer noopener");
      el.style.opacity = "1";
    }
  });
})();