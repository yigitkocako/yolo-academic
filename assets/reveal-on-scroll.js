// Fade-in timeline cards/arrows once; process visuals fade in/out as they enter/leave viewport
(() => {
  const steps = document.querySelectorAll('.reveal-step');
  const visuals = document.querySelectorAll('.flow-visual');

  if (!('IntersectionObserver' in window)) {
    steps.forEach((el) => el.classList.add('is-visible'));
    visuals.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  if (steps.length) {
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          stepObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.22, rootMargin: '0px 0px -8% 0px' });
    steps.forEach((el) => stepObserver.observe(el));
  }

  if (visuals.length) {
    const visualObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { threshold: 0.28, rootMargin: '-6% 0px -12% 0px' });
    visuals.forEach((el) => visualObserver.observe(el));
  }
})();
