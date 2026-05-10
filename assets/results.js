// YOLO Academic results — Ireland-only route cards
(() => {
  const $ = (id) => document.getElementById(id);
  const lang = () => document.documentElement.getAttribute("lang") || "tr";
  const esc = (v) => String(v ?? "").replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const money = (n, suffix) => n == null ? (lang()==='tr'?'Belirlenecek':'TBD') : `€${Number(n).toLocaleString('en-IE')}${suffix||''}`;
  const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));

  const labels = {
    tr: { any:'Farketmez', unknown:'Belirlenecek', score:'Skor', city:'Şehir', type:'Tür', tuition:'Ücret', living:'Yaşam', intake:'Başlangıç', website:'Website', admissions:'Kabul', tuitionBtn:'Ücretler', international:'International', pathway:'Pathway gerekebilir', noneT:'Sonuç yok', noneP:'Filtreleri genişletmeyi deneyebilirsin.', summary:'Eğitim türü: {type} • Şehir: {city} • Seviye: {degree} • Alan: {field} • Hedef: {goal} • Intake: {intake} • Yıl: {year}' },
    en: { any:'Any', unknown:'TBD', score:'Score', city:'City', type:'Type', tuition:'Fee', living:'Living', intake:'Start', website:'Website', admissions:'Admissions', tuitionBtn:'Tuition', international:'International', pathway:'Pathway may be needed', noneT:'No results', noneP:'Try broadening your filters.', summary:'Education type: {type} • City: {city} • Level: {degree} • Field: {field} • Goal: {goal} • Intake: {intake} • Year: {year}' }
  };
  const map = {
    tr: { university:'Üniversite', language:'Dil okulu', highschool:'Lise', life:'Yaşam & kariyer', ug:'Lisans', pg:'Yüksek Lisans', foundation:'Foundation / Pathway', computing:'Computing / Data / AI', business:'Business / Management', engineering:'Engineering', health:'Health', arts:'Arts / Humanities', english:'İngilizce', balanced:'Dengeli', prestige:'Prestij', value:'Fiyat / performans', career:'Kariyer', fast:'Hızlı başlangıç', sep:'Eylül', jan:'Ocak', summer:'Yaz', flexible:'Esnek' },
    en: { university:'University', language:'Language school', highschool:'High school', life:'Life & career', ug:'Undergraduate', pg:'Postgraduate', foundation:'Foundation / Pathway', computing:'Computing / Data / AI', business:'Business / Management', engineering:'Engineering', health:'Health', arts:'Arts / Humanities', english:'English', balanced:'Balanced', prestige:'Prestige', value:'Value', career:'Career', fast:'Fast start', sep:'September', jan:'January', summer:'Summer', flexible:'Flexible' }
  };
  function L(k){ return labels[lang()][k]; }
  function M(k){ return k ? (map[lang()][k] || k) : L('any'); }
  function tpl(str, vars){ return str.replace(/\{(\w+)\}/g, (_,k)=>vars[k]??''); }

  function score(prefs, p){
    let s = 70;
    if (prefs.educationType === p.type) s += 18;
    if (prefs.city && p.city_key && prefs.city === p.city_key) s += 6;
    if (prefs.degree && p.degree_supported && p.degree_supported.includes(prefs.degree)) s += 5;
    if (prefs.field && p.fields && p.fields.includes(prefs.field)) s += 5;
    if (prefs.intake && p.intakes && p.intakes.includes(prefs.intake)) s += 4;
    if (prefs.goal === 'career' && p.career_boost) s += 5;
    if (prefs.goal === 'prestige' && ['top50','top100'].includes(p.qs_band)) s += 5;
    if (prefs.tuitionMax && p.tuition_est_eur && p.tuition_est_eur > prefs.tuitionMax) s -= 12;
    if (prefs.livingMax && p.living_est_month_eur && p.living_est_month_eur > prefs.livingMax) s -= 8;
    return clamp(Math.round(s), 0, 100);
  }

  function renderSummary(prefs){
    const text = tpl(L('summary'), { type:M(prefs.educationType), city:prefs.city?prefs.city:L('any'), degree:M(prefs.degree), field:M(prefs.field), goal:M(prefs.goal), intake:M(prefs.intake), year:prefs.year||L('any') });
    const el = $('summary'); if (el) el.textContent = text;
  }

  function render(cards, prefs){
    const wrap = $('routeResults'); if (!wrap) return; wrap.innerHTML = '';
    const mode = $('sortSelect')?.value || 'match';
    let arr = cards.map(p => ({p, score:score(prefs,p)}));
    if (mode === 'cheapest') arr.sort((a,b)=>(a.p.tuition_est_eur??1e12)-(b.p.tuition_est_eur??1e12)||b.score-a.score);
    else if (mode === 'ranking') arr.sort((a,b)=>({top50:5,top100:4,top200:3,top500:2,unranked:1}[b.p.qs_band]||0)-(({top50:5,top100:4,top200:3,top500:2,unranked:1}[a.p.qs_band]||0)) || b.score-a.score);
    else arr.sort((a,b)=>b.score-a.score);

    // show selected type first, but keep life/career route as support if useful
    arr = arr.filter(x => x.p.type === prefs.educationType || x.p.type === 'life').slice(0, 8);
    if (!arr.length) { wrap.innerHTML = `<div class="item"><h3>${L('noneT')}</h3><p class="muted">${L('noneP')}</p></div>`; return; }
    for (const {p, score} of arr) {
      const title = lang()==='tr' ? p.name_tr : p.name_en;
      const desc = lang()==='tr' ? p.description_tr : p.description_en;
      const badges = [`<span class="badge">${L('score')}: <strong>${score}</strong>/100</span>`, `<span class="badge">${L('type')}: ${M(p.type)}</span>`];
      if (p.city) badges.push(`<span class="badge">${L('city')}: ${esc(p.city)}</span>`);
      if (p.tuition_est_eur != null) badges.push(`<span class="badge">${L('tuition')}: ${money(p.tuition_est_eur, p.tuition_suffix || '')}</span>`);
      if (p.living_est_month_eur != null) badges.push(`<span class="badge">${L('living')}: ${money(p.living_est_month_eur, '/mo')}</span>`);
      if (p.intakes?.length) badges.push(`<span class="badge">${L('intake')}: ${p.intakes.map(M).join(', ')}</span>`);
      if (prefs.hasIelts === false && p.type === 'university') badges.push(`<span class="badge warn">${L('pathway')}</span>`);
      const links = [];
      if (p.links?.website) links.push(`<a class="btn" href="${esc(p.links.website)}" target="_blank" rel="noreferrer">${L('website')}</a>`);
      if (p.links?.admissions) links.push(`<a class="btn" href="${esc(p.links.admissions)}" target="_blank" rel="noreferrer">${L('admissions')}</a>`);
      if (p.links?.tuition) links.push(`<a class="btn" href="${esc(p.links.tuition)}" target="_blank" rel="noreferrer">${L('tuitionBtn')}</a>`);
      if (p.links?.international) links.push(`<a class="btn" href="${esc(p.links.international)}" target="_blank" rel="noreferrer">${L('international')}</a>`);
      const card = document.createElement('article');
      card.className = 'item route-card';
      card.innerHTML = `<h3>${esc(title)}</h3><div class="badges">${badges.join('')}</div><p class="why">${esc(desc)}</p>${links.length?`<div class="meta" style="margin-top:10px;">${links.join('')}</div>`:''}`;
      wrap.appendChild(card);
    }
  }

  async function main(){
    let prefs = null; try { prefs = JSON.parse(localStorage.getItem('aa_prefs') || 'null'); } catch(e) {}
    if (!prefs) { prefs = { country:'ie', educationType:'university', goal:'balanced' }; }
    renderSummary(prefs);
    let cards = [];
    try { cards = await fetch('data/programs.json', {cache:'no-store'}).then(r=>r.json()); } catch(e) { cards = []; }
    render(cards, prefs);
    const sortEl = $('sortSelect');
    if (sortEl) sortEl.addEventListener('change', () => render(cards, prefs));
    window.addEventListener('aa:lang', () => { renderSummary(prefs); render(cards, prefs); });
  }
  document.addEventListener('DOMContentLoaded', main);
})();
