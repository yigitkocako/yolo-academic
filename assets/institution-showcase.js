// YOLO Academic institution showcase cards
(() => {
  const esc = (v) => String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const lang = () => document.documentElement.getAttribute('lang') || 'tr';
  const labels = {
    tr: { website: 'Website', admissions: 'Kabul', tuition: 'Ücretler', empty: 'Kurum bulunamadı.' },
    en: { website: 'Website', admissions: 'Admissions', tuition: 'Tuition', empty: 'No institutions found.' }
  };
  function L(k){ return (labels[lang()] || labels.tr)[k] || k; }
  function categoryTitle(cat){
    const map = { tr:{ university:'Üniversiteler', language:'Dil Okulları', highschool:'Liseler' }, en:{ university:'Universities', language:'Language Schools', highschool:'High Schools' } };
    return (map[lang()] || map.tr)[cat] || cat;
  }
  function card(item){
    const note = lang()==='tr' ? item.short_note_tr : item.short_note_en;
    const img = item.image || 'assets/hero-1.jpg';
    const links = [];
    if (item.website) links.push(`<a class="mini-link" href="${esc(item.website)}" target="_blank" rel="noreferrer">${L('website')}</a>`);
    if (item.admissions_url) links.push(`<a class="mini-link" href="${esc(item.admissions_url)}" target="_blank" rel="noreferrer">${L('admissions')}</a>`);
    if (item.tuition_url) links.push(`<a class="mini-link" href="${esc(item.tuition_url)}" target="_blank" rel="noreferrer">${L('tuition')}</a>`);
    return `<article class="institution-card reveal-step" style="--institution-bg:url('${esc(img)}')">
      <div class="institution-card-overlay"></div>
      <div class="institution-card-content">
        <div class="institution-chip">${esc(categoryTitle(item.category))}</div>
        <h4>${esc(item.name)}</h4>
        <p>${esc(note || item.city || '')}</p>
        <div class="institution-meta">${esc(item.city || '')}</div>
        <div class="institution-links">${links.join('')}</div>
      </div>
    </article>`;
  }

  const norm = (v) => String(v ?? '').trim().toLowerCase()
    .replace(/[()\[\]]/g, '')
    .replace(/[^a-z0-9_ ]/g, '')
    .replace(/\s+/g, '_');
  const yes = (v) => {
    const s = String(v ?? '').trim().toLowerCase();
    if (!s) return true;
    return ['true','yes','y','1','active','aktif'].includes(s);
  };
  const num = (v, d=999) => {
    const n = Number(String(v ?? '').replace(/[^0-9.-]/g,''));
    return Number.isFinite(n) ? n : d;
  };
  const cleanCategory = (v) => {
    const s = String(v ?? '').trim().toLowerCase();
    if (['university','universities','üniversite','universite'].includes(s)) return 'university';
    if (['language','language_school','language_schools','dil','dil_okulu','dil okulu','dil_okullari','dil okulları'].includes(s)) return 'language';
    if (['highschool','high_school','highschools','high_schools','lise','liseler','secondary'].includes(s)) return 'highschool';
    return s || 'university';
  };
  function parseTSV(text) {
    const head = text.slice(0, 300).toLowerCase();
    if (head.includes('<html') || head.includes('sign in')) throw new Error('Google Sheets returned HTML instead of TSV');
    const rows = String(text).replace(/\r\n/g,'\n').replace(/\r/g,'\n').split('\n')
      .map(line => line.split('\t'))
      .filter(row => row.some(cell => String(cell).trim() !== ''));
    if (rows.length < 2) return [];
    const headers = rows[0].map(norm);
    const idx = (names) => {
      const wanted = names.map(norm);
      for (const w of wanted) {
        const i = headers.indexOf(w);
        if (i >= 0) return i;
      }
      for (let i=0; i<headers.length; i++) {
        if (wanted.some(w => headers[i].includes(w))) return i;
      }
      return -1;
    };
    const map = {
      id: idx(['id','institution_id']),
      category: idx(['category','type','institution_type']),
      name: idx(['name','school_name','institution_name']),
      city: idx(['city']),
      county: idx(['county']),
      website: idx(['website','website_url','url']),
      admissions_url: idx(['admissions_url','application_url','admissions']),
      tuition_url: idx(['tuition_url','fees_url','fee_url','fees']),
      international_url: idx(['international_url','international']),
      image: idx(['image','image_filename','image_url']),
      featured_order: idx(['featured_order','order','priority']),
      short_note_tr: idx(['short_note_tr','note_tr','description_tr']),
      short_note_en: idx(['short_note_en','note_en','description_en']),
      source_url: idx(['source_url','source']),
      active: idx(['active','is_active'])
    };
    const get = (row, k) => (map[k] >= 0 && map[k] < row.length) ? String(row[map[k]] ?? '').trim() : '';
    return rows.slice(1).map((r, n) => ({
      id: get(r,'id') || `inst_${n+1}`,
      category: cleanCategory(get(r,'category')),
      name: get(r,'name'),
      city: get(r,'city'),
      county: get(r,'county'),
      website: get(r,'website'),
      admissions_url: get(r,'admissions_url'),
      tuition_url: get(r,'tuition_url'),
      international_url: get(r,'international_url'),
      image: get(r,'image') || 'assets/hero-1.jpg',
      featured_order: num(get(r,'featured_order')),
      short_note_tr: get(r,'short_note_tr'),
      short_note_en: get(r,'short_note_en'),
      source_url: get(r,'source_url'),
      active: yes(get(r,'active'))
    })).filter(x => x.name && x.category);
  }
  async function loadLocal(){
    try { return await fetch('data/institutions.json', {cache:'no-store'}).then(r=>r.json()); }
    catch(e){ return []; }
  }
  async function loadSheet(){
    const cfg = (window.AA_CONFIG && window.AA_CONFIG.sheets) || {};
    if (!cfg.sheetId || !cfg.institutionsGid) return [];
    const url = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(cfg.sheetId)}/export?format=tsv&gid=${encodeURIComponent(cfg.institutionsGid)}`;
    const text = await fetch(url, {cache:'no-store'}).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    });
    return parseTSV(text);
  }
  async function load(){
    try {
      const fromSheet = await loadSheet();
      if (fromSheet && fromSheet.length) return fromSheet;
    } catch(e) {
      console.warn('Institutions sheet could not be loaded; using local data.', e);
    }
    return await loadLocal();
  }
  function revealNewCards(root){
    const cards = Array.from(root.querySelectorAll('.institution-card'));
    if (!cards.length) return;
    if (!('IntersectionObserver' in window)) {
      cards.forEach(c => c.classList.add('is-visible'));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    cards.forEach(c => obs.observe(c));
    // If the browser starts the section already in view, trigger a cheap fallback pass.
    setTimeout(() => cards.forEach(c => {
      const r = c.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) c.classList.add('is-visible');
    }), 180);
  }

  function initAutoCarousel(el){
    if (el.classList.contains('directory')) return;
    const shouldAuto = el.dataset.autoplay === 'true';
    if (!shouldAuto) return;

    const originals = Array.from(el.querySelectorAll('.institution-card:not([data-clone="true"])'));
    if (originals.length <= 1) return;

    el.classList.add('auto-carousel');

    // Duplicate the cards once so the row can loop smoothly without changing card sizes.
    const originalCount = originals.length;
    originals.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.dataset.clone = 'true';
      clone.setAttribute('aria-hidden', 'true');
      clone.classList.add('is-visible');
      el.appendChild(clone);
    });

    let timer = null;
    let paused = false;
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const getStep = () => {
      const first = el.querySelector('.institution-card');
      if (!first) return 320;
      const rect = first.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const gap = parseFloat(style.columnGap || style.gap || '14') || 14;
      return rect.width + gap;
    };

    const originalWidth = () => {
      const cards = Array.from(el.querySelectorAll('.institution-card')).slice(0, originalCount);
      if (!cards.length) return 0;
      const first = cards[0].offsetLeft;
      const last = cards[cards.length - 1];
      return (last.offsetLeft - first) + getStep();
    };

    const resetIfNeeded = () => {
      const width = originalWidth();
      if (!width) return;
      if (el.scrollLeft >= width - 2) {
        el.classList.add('is-resetting');
        el.scrollLeft = el.scrollLeft - width;
        requestAnimationFrame(() => el.classList.remove('is-resetting'));
      }
    };

    const tick = () => {
      resetIfNeeded();
      if (!paused) {
        el.scrollBy({ left: getStep(), behavior: 'smooth' });
        window.setTimeout(resetIfNeeded, 750);
      }
    };

    const start = () => {
      stop();
      timer = window.setInterval(tick, 3600);
    };
    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
    };

    el.addEventListener('mouseenter', () => { paused = true; });
    el.addEventListener('mouseleave', () => { paused = false; });
    el.addEventListener('focusin', () => { paused = true; });
    el.addEventListener('focusout', () => { paused = false; });
    ['pointerdown','touchstart','wheel'].forEach(ev => el.addEventListener(ev, () => {
      paused = true;
      window.clearTimeout(el.__yoloResumeTimer);
      el.__yoloResumeTimer = window.setTimeout(() => { paused = false; resetIfNeeded(); }, 2600);
    }, { passive:true }));
    el.addEventListener('scroll', () => {
      window.clearTimeout(el.__yoloResetTimer);
      el.__yoloResetTimer = window.setTimeout(resetIfNeeded, 140);
    }, { passive:true });

    start();
  }

  function renderInto(el, data){
    const category = el.dataset.institutionList;
    const limit = Number(el.dataset.limit || 0);
    let arr = data.filter(x => x.active !== false && x.category === category).sort((a,b)=>(a.featured_order||999)-(b.featured_order||999));
    if (limit > 0) arr = arr.slice(0, limit);
    el.innerHTML = arr.length ? arr.map(card).join('') : `<div class="item"><p class="muted">${L('empty')}</p></div>`;
    revealNewCards(el);
    initAutoCarousel(el);
  }
  async function main(){
    const targets = [...document.querySelectorAll('[data-institution-list]')];
    if (!targets.length) return;
    const data = await load();
    targets.forEach(el => renderInto(el, data));
    window.addEventListener('aa:lang', () => targets.forEach(el => renderInto(el, data)));
  }
  document.addEventListener('DOMContentLoaded', main);
})();
