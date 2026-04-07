// Opens Calendly link in a new tab (simple MVP)
(() => {
  function getUrl() {
    return (window.AA_CONFIG && window.AA_CONFIG.calendlyUrl) || "";
  }
  function handler(e) {
    const url = getUrl();
    if (!url) return;
    e.preventDefault();
    window.open(url, "_blank", "noopener,noreferrer");
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-calendly]");
    if (a) handler(e);
  });
})();