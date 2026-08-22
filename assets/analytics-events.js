// YOLO Academic — GA4 + Clarity micro-conversions
// Tracks useful, non-PII actions: plan CTAs, Calendly clicks, finder submits, result link clicks.
(function(){
  function clean(v){ return String(v || '').replace(/\s+/g,' ').trim().slice(0,120); }
  function currentLang(){ return document.documentElement.getAttribute('lang') || 'tr'; }
  function send(name, params){
    var data = Object.assign({ page_path: location.pathname, page_title: document.title, language: currentLang() }, params || {});
    try { if (typeof window.gtag === 'function') window.gtag('event', name, data); } catch(e) {}
    try { if (typeof window.clarity === 'function') window.clarity('event', name); } catch(e) {}
  }
  function linkText(el){ return clean(el.getAttribute('aria-label') || el.textContent || el.innerText || el.href || el.id || el.className); }
  function selectorContext(el){
    if (el.closest('.hero-actions')) return 'hero';
    if (el.closest('.call-cta')) return 'call_cta';
    if (el.closest('.nav')) return 'navigation';
    if (el.closest('#prefsForm')) return 'finder_form';
    if (el.closest('.route-card')) return 'results_card';
    if (el.closest('.site-footer')) return 'footer';
    return 'page';
  }
  document.addEventListener('click', function(e){
    var el = e.target.closest('a,button');
    if (!el) return;
    if (el.id === 'langToggle') {
      send('language_toggle', { event_label: linkText(el) });
      return;
    }
    if (el.id === 'navBurger') {
      send('mobile_menu_toggle', { nav_open: document.body.classList.contains('nav-open') ? 'closing' : 'opening' });
      return;
    }
    if (el.matches('[data-calendly]')) {
      send('calendly_click', { click_text: linkText(el), location: selectorContext(el) });
      return;
    }
    var href = el.getAttribute('href') || '';
    if (!href) return;
    if (href.indexOf('finder.html') !== -1) {
      send('plan_cta_click', { click_text: linkText(el), location: selectorContext(el) });
      return;
    }
    if (el.closest('.route-card') && /^https?:\/\//.test(href)) {
      var card = el.closest('.route-card');
      var institution = card && card.querySelector('h3') ? clean(card.querySelector('h3').textContent) : '';
      send('school_link_click', { click_text: linkText(el), institution: institution, outbound_url_host: (function(){ try { return new URL(href).hostname; } catch(e){ return ''; } })() });
      return;
    }
  }, true);

  document.addEventListener('submit', function(e){
    var form = e.target;
    if (!form || form.id !== 'prefsForm') return;
    function v(id){ var x=document.getElementById(id); return x ? x.value : ''; }
    send('finder_submit', {
      education_type: v('educationType'), city: v('city'), degree: v('degree'), field: v('field'), goal: v('goal'),
      tuition_max: v('tuitionMax'), has_ielts: v('hasIelts'), intake: v('intake'), year: v('year'), accommodation: v('accommodation')
    });
  }, true);

  document.addEventListener('change', function(e){
    if (e.target && e.target.id === 'sortSelect') send('results_sort_change', { sort_value: e.target.value });
  }, true);
})();
