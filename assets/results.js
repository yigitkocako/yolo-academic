// YOLO Academic results — consistent language WITHOUT page reload
// v2026-04-13c
(function () {
  // ---------- Language utilities ----------
  function detectLang() {
    const h = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (h.startsWith("en")) return "en";
    if (h.startsWith("tr")) return "tr";

    const keys = ["lang", "aa_lang", "yolo_lang", "locale", "i18n_lang"];
    for (const k of keys) {
      const v = localStorage.getItem(k);
      if (!v) continue;
      const s = String(v).toLowerCase();
      if (s.startsWith("en")) return "en";
      if (s.startsWith("tr")) return "tr";
    }

    // infer from the toggle button (it usually shows the target language)
    const btn = document.getElementById("langToggle");
    if (btn) {
      const t = btn.textContent.trim().toUpperCase();
      if (t.includes("TR")) return "en";
      if (t.includes("EN")) return "tr";
    }
    return "tr";
  }

  let LANG = detectLang();

  const STR = {
    tr: {
      headings: { h1: "Öneriler", countries: "Önerilen Ülkeler", unis: "Önerilen Okullar" },
      sort: { label: "Sıralama", match: "En iyi eşleşme", cheapest: "En düşük maliyet", ranking: "En yüksek ranking",
              note: "Not: Ülke skorları 'en iyi eşleşme' mantığıyla hesaplanır." },
      buttons: { edit: "Filtreleri değiştir", call: "Ücretsiz ön görüşme", website: "Website", admissions: "Kabul şartları", tuition: "Ücretler", international: "International" },
      badge: {
        score: "Skor", universities: "Üniversite", living: "Yaşam",
        postStudyY: "Mezuniyet sonrası izin var", postStudyN: "Mezuniyet sonrası izin yok",
        studentWorkY: "Öğrenci çalışma izni var", studentWorkN: "Öğrenci çalışma izni yok",
        qs: "QS", tuition: "Okul ücreti ~ {v}", livingCost: "Yaşam ~ {v}", intake: "Dönem: {v}", pathway: "Pathway gerekebilir"
      },
      misc: { unknown: "Bilinmiyor", any: "Farketmez", mo: "ay", yr: "yıl" },
      summary: { level: "Seviye", field: "Alan", goal: "Hedef", tuitionMax: "Okul bütçesi (max)", livingMax: "Yaşam bütçesi (max)", intake: "Intake", year: "Yıl" },
      countryNames: { ie: "İrlanda", uk: "İngiltere", ca: "Kanada" },
      countryNotes: {
        ie: "Genelde teknoloji/finans ekosistemi güçlü; yaşam maliyeti bazı şehirlerde yüksek.",
        uk: "Prestijli okullar çok; ücret ve yaşam maliyeti şehir bazında değişken.",
        ca: "Çalışma/yerleşim yolları net olabilir; bazı eyalet/şehirlerde maliyet yükselir."
      },
      livingBand: { high: "yüksek", "med-high": "orta-yüksek", med: "orta", low: "düşük" },
      empty: { title: "Eşleşme yok", p: "Filtreleri genişletmeyi dene." },
      emptyUni: { title: "Okul bulunamadı", p: "Filtreleri genişletmeyi dene." }
    },
    en: {
      headings: { h1: "Recommendations", countries: "Recommended countries", unis: "Recommended universities" },
      sort: { label: "Sort", match: "Best match", cheapest: "Lowest cost", ranking: "Highest ranking",
              note: "Note: Country scores are computed using the 'best match' logic." },
      buttons: { edit: "Edit filters", call: "Free intro call", website: "Website", admissions: "Admissions", tuition: "Tuition", international: "International" },
      badge: {
        score: "Score", universities: "Universities", living: "Living",
        postStudyY: "Post‑study permission", postStudyN: "No post‑study permission",
        studentWorkY: "Student work allowed", studentWorkN: "Student work not allowed",
        qs: "QS", tuition: "Tuition ~ {v}", livingCost: "Living ~ {v}", intake: "Intake: {v}", pathway: "Pathway may be needed"
      },
      misc: { unknown: "Unknown", any: "Any", mo: "mo", yr: "yr" },
      summary: { level: "Level", field: "Field", goal: "Goal", tuitionMax: "Tuition max", livingMax: "Living max", intake: "Intake", year: "Year" },
      countryNames: { ie: "Ireland", uk: "United Kingdom", ca: "Canada" },
      countryNotes: {
        ie: "Strong tech/finance ecosystem; living costs can be high in some cities.",
        uk: "Many prestigious universities; costs vary widely by city.",
        ca: "Clear study‑to‑work pathways can exist; costs vary by province/city."
      },
      livingBand: { high: "high", "med-high": "med‑high", med: "medium", low: "low" },
      empty: { title: "No matches", p: "Try broadening your filters." },
      emptyUni: { title: "No universities found", p: "Try broadening your filters." }
    }
  };

  function tr(path, vars) {
    let cur = STR[LANG];
    for (const p of path.split(".")) cur = cur && cur[p] != null ? cur[p] : null;
    if (typeof cur !== "string") return path;
    if (!vars) return cur;
    return cur.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? String(vars[k]) : ""));
  }

  function setText(sel, text) {
    const el = document.querySelector(sel);
    if (el) el.textContent = text;
  }

  function applyStaticLabels() {
    // Page H1 (id or data-i18n)
    setText('[data-i18n="results.h1"]', tr("headings.h1"));
    setText("#pageTitle", tr("headings.h1"));

    // Section headings
    setText('[data-i18n="results.countries"]', tr("headings.countries"));
    setText('[data-i18n="results.unis"]', tr("headings.unis"));
    setText("#countriesTitle", tr("headings.countries"));
    setText("#unisTitle", tr("headings.unis"));

    // Sort labels + options
    setText('[data-i18n="sort.label"]', tr("sort.label"));
    setText('[data-i18n="sort.note"]', tr("sort.note"));

    const sel = document.getElementById("sortSelect");
    if (sel) {
      const optMatch = sel.querySelector('option[value="match"]');
      const optCheapest = sel.querySelector('option[value="cheapest"]');
      const optRanking = sel.querySelector('option[value="ranking"]');
      if (optMatch) optMatch.textContent = tr("sort.match");
      if (optCheapest) optCheapest.textContent = tr("sort.cheapest");
      if (optRanking) optRanking.textContent = tr("sort.ranking");
    }

    // Buttons
    document.querySelectorAll('[data-i18n="results.edit"]').forEach(el => el.textContent = tr("buttons.edit"));
    document.querySelectorAll('[data-calendly]').forEach(el => {
      // only change if it's the "call" CTA button (has class ghost or contains language spans)
      if (el.tagName === "A" && (el.classList.contains("ghost") || el.textContent.toLowerCase().includes("intro") || el.textContent.toLowerCase().includes("görüşme"))) {
        el.textContent = tr("buttons.call");
      }
    });
  }

  // ---------- Data parsing ----------
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const splitList = (v) => String(v ?? "").split(",").map(x => x.trim()).filter(Boolean);
  const normHeader = (h) => String(h ?? "").trim().toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[()\[\]]/g, "")
    .replace(/[^a-z0-9_ ]/g, "");
  const findIndexByIncludes = (headers, patterns) => {
    for (let i = 0; i < headers.length; i++) {
      const h = headers[i];
      let ok = true;
      for (const p of patterns) { if (!h.includes(p)) { ok = false; break; } }
      if (ok) return i;
    }
    return -1;
  };
  const toBool = (v) => {
    const s = String(v ?? "").trim().toLowerCase();
    return s === "true" || s === "yes" || s === "1";
  };
  const toNum = (v) => {
    const raw = String(v ?? "").trim();
    if (!raw) return null;
    let t = raw.replace(/[^0-9.,-]/g, "");
    if (!t) return null;
    if (t.includes(",") && t.includes(".")) t = t.replace(/,/g, "");
    else if (t.includes(",") && !t.includes(".")) t = t.replace(/,/g, "");
    else if (t.includes(".") && !t.includes(",")) {
      const dots = (t.match(/\./g) || []).length;
      if (dots >= 2) t = t.replace(/\./g, "");
    }
    const n = Number(t);
    return Number.isFinite(n) ? n : null;
  };
  async function fetchText(url) {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.text();
  }
  function parseTSV(text) {
    const head = text.slice(0, 200).toLowerCase();
    if (head.includes("<html") || head.includes("sign in")) throw new Error("Got HTML instead of TSV");

    const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
    const rows = lines.map(l => l.split("\t")).filter(r => r.length > 1 && r.some(c => String(c).trim() !== ""));
    if (rows.length < 2) throw new Error("TSV seems empty.");

    const headers = rows[0].map(normHeader);
    const idx = {
      id: findIndexByIncludes(headers, ["id"]),
      country_id: findIndexByIncludes(headers, ["country_id"]),
      name: findIndexByIncludes(headers, ["name"]),
      city: findIndexByIncludes(headers, ["city"]),
      qs_band: findIndexByIncludes(headers, ["qs_band"]),
      degree_supported: findIndexByIncludes(headers, ["degree_supported"]),
      fields: findIndexByIncludes(headers, ["fields"]),
      intakes: findIndexByIncludes(headers, ["intakes"]),
      tuition_ug: findIndexByIncludes(headers, ["tuition_est_ug_eur"]),
      tuition_pg: findIndexByIncludes(headers, ["tuition_est_pg_eur"]),
      living_month: findIndexByIncludes(headers, ["living_est_month_eur"]),
      ielts_ug: findIndexByIncludes(headers, ["ielts_min_ug"]),
      ielts_pg: findIndexByIncludes(headers, ["ielts_min_pg"]),
      gpa_min: findIndexByIncludes(headers, ["gpa_min"]),
      career_boost: findIndexByIncludes(headers, ["career_boost"]),
      admissions_url: findIndexByIncludes(headers, ["admissions_url"]),
      tuition_url: findIndexByIncludes(headers, ["tuition_url"]),
      international_url: findIndexByIncludes(headers, ["international_url"]),
            qs_profile_url: findIndexByIncludes(headers, ["qs_profile_url"]),
      is_placeholder: findIndexByIncludes(headers, ["is_placeholder"])
    };
    const get = (row, k) => (idx[k] >= 0 && idx[k] < row.length) ? row[idx[k]] : "";

    return rows.slice(1).map(r => ({
      id: String(get(r, "id")).trim(),
      country_id: String(get(r, "country_id")).trim().toLowerCase(),
      name: String(get(r, "name")).trim(),
      city: String(get(r, "city")).trim(),
      qs_band: String(get(r, "qs_band")).trim().toLowerCase() || "unranked",
      degree_supported: splitList(String(get(r, "degree_supported")).toLowerCase()),
      fields: splitList(String(get(r, "fields")).toLowerCase()),
      intakes: splitList(String(get(r, "intakes")).toLowerCase()),
      tuition_est_ug_eur: toNum(get(r, "tuition_ug")),
      tuition_est_pg_eur: toNum(get(r, "tuition_pg")),
      living_est_month_eur: toNum(get(r, "living_month")),
      ielts_min_ug: toNum(get(r, "ielts_ug")),
      ielts_min_pg: toNum(get(r, "ielts_pg")),
      gpa_min: toNum(get(r, "gpa_min")),
      career_boost: toBool(get(r, "career_boost")),
      links: {
        admissions: String(get(r, "admissions_url")).trim(),
        tuition: String(get(r, "tuition_url")).trim(),
        international: String(get(r, "international_url")).trim(),
        qs: String(get(r, "qs_profile_url")).trim()
      },
      is_placeholder: toBool(get(r, "is_placeholder"))
    })).filter(u => u.id && u.country_id && u.name);
  }
  const normName = (n) => String(n || "").toLowerCase().replace(/\s+/g, " ").replace(/[^a-z0-9 ]/g, "").trim();
  const completeness = (u) =>
    (u.links.international ? 2 : 0) + (u.links.admissions ? 2 : 0) + (u.links.tuition ? 2 : 0) +
    ((u.tuition_est_pg_eur != null || u.tuition_est_ug_eur != null) ? 1 : 0) +
    ((u.living_est_month_eur != null) ? 1 : 0);

  function dedupe(unis) {
    const m = new Map();
    for (const u of unis) {
      const k = `${u.country_id}|${normName(u.name)}`;
      if (!m.has(k) || completeness(u) > completeness(m.get(k))) m.set(k, u);
    }
    return Array.from(m.values());
  }

  // ---------- Scoring + rendering ----------
  const qsScore = (band) => ({ top50:100, top100:92, top200:84, top500:70, top1000:55, unranked:40 }[band] ?? 40);
  const weights = (goal) => ({
    prestige:{prestige:.55,cost:.20,career:.25},
    value:{prestige:.20,cost:.55,career:.25},
    career:{prestige:.20,cost:.25,career:.55},
    balanced:{prestige:.33,cost:.33,career:.34}
  }[goal] || {prestige:.33,cost:.33,career:.34});

  function tuitionFor(prefs, u) {
    if (prefs.degree === "ug") return u.tuition_est_ug_eur;
    if (prefs.degree === "pg") return u.tuition_est_pg_eur;
    const a = u.tuition_est_ug_eur, b = u.tuition_est_pg_eur;
    if (a == null && b == null) return null;
    if (a == null) return b;
    if (b == null) return a;
    return Math.min(a, b);
  }

  function costFit(prefs, tuition, living) {
    if (tuition == null && living == null) return 55;
    const tMax = prefs.tuitionMax ?? 35000;
    const lMax = prefs.livingMax ?? 1200;
    const ts = (tuition == null) ? 55 : clamp(110 - (tuition / tMax) * 100, 0, 100);
    const ls = (living == null) ? 55 : clamp(110 - (living / lMax) * 100, 0, 100);
    return Math.round(ts * 0.6 + ls * 0.4);
  }

  function careerFit(country, u) {
    let s = 50;
    if (country.post_study_work) s += 30;
    if (country.student_work_allowed) s += 10;
    if (u.career_boost) s += 10;
    return clamp(s, 0, 100);
  }

  function bestSite(u) {
    return u.links?.international || u.links?.admissions || u.links?.tuition || "";
  }

  function renderSummary(prefs) {
    const any = tr("misc.any");
    const unknown = tr("misc.unknown");

    const degreeLabel = prefs.degree ? (prefs.degree === "ug" ? "UG" : "PG") : any;
    const fieldLabel = prefs.field ? prefs.field : any;
    const goalLabel = prefs.goal ? prefs.goal : "balanced";
    const intakeLabel = prefs.intake ? prefs.intake.toUpperCase() : any;
    const yearLabel = prefs.year ? String(prefs.year) : any;
    const tuitionMax = prefs.tuitionMax != null ? String(prefs.tuitionMax) : unknown;
    const livingMax = prefs.livingMax != null ? String(prefs.livingMax) : unknown;

    const summary = `${tr("summary.level")}: ${degreeLabel} • ${tr("summary.field")}: ${fieldLabel} • ${tr("summary.goal")}: ${goalLabel} • ` +
                    `${tr("summary.tuitionMax")}: ${tuitionMax} • ${tr("summary.livingMax")}: ${livingMax} • ` +
                    `${tr("summary.intake")}: ${intakeLabel} • ${tr("summary.year")}: ${yearLabel}`;

    const el = document.getElementById("summary");
    if (el) el.textContent = summary;
  }

  function renderCountries(scored, byId) {
    const wrap = document.getElementById("countryResults");
    if (!wrap) return;
    wrap.innerHTML = "";

    const agg = new Map();
    for (const s of scored) {
      const id = s.country.id;
      if (!agg.has(id)) agg.set(id, { country: s.country, scores: [] });
      agg.get(id).scores.push(s.total);
    }

    const list = Array.from(agg.values()).map(x => {
      const top = x.scores.slice(0, 6);
      const avg = top.reduce((a, b) => a + b, 0) / (top.length || 1);
      let bonus = 0;
      if (x.country.post_study_work) bonus += 5;
      if (x.country.student_work_allowed) bonus += 3;
      return { country: x.country, score: clamp(Math.round(avg + bonus), 0, 100), count: x.scores.length };
    }).sort((a, b) => b.score - a.score);

    if (list.length === 0) {
      wrap.innerHTML = `<div class="item"><h3>${STR[LANG].empty.title}</h3><p class="muted">${STR[LANG].empty.p}</p></div>`;
      return;
    }

    for (const c of list) {
      const id = c.country.id;
      const name = STR[LANG].countryNames[id] || c.country.name || id;
      const note = STR[LANG].countryNotes[id] || c.country.short_note || "";
      const livingBand = (c.country.living_cost_band || "").toLowerCase();
      const livingLabel = STR[LANG].livingBand[livingBand] || c.country.living_cost_band || "";

      const postStudy = c.country.post_study_work ? tr("badge.postStudyY") : tr("badge.postStudyN");
      const studentWork = c.country.student_work_allowed ? tr("badge.studentWorkY") : tr("badge.studentWorkN");

      const el = document.createElement("div");
      el.className = "item";
      el.innerHTML =
        `<h3>${name}</h3>` +
        `<div class="meta"><span>${tr("badge.score")}: <strong>${c.score}</strong>/100</span>` +
        `<span>${tr("badge.universities")}: ${c.count}</span>` +
        `<span>${tr("badge.living")}: ${livingLabel}</span></div>` +
        `<div class="badges">` +
        `<span class="badge good">${postStudy}</span>` +
        `<span class="badge good">${studentWork}</span>` +
        `</div>` +
        `<p class="why">${note}</p>`;
      wrap.appendChild(el);
    }
  }

  function renderUniversities(scored, prefs, mode) {
    const wrap = document.getElementById("uniResults");
    if (!wrap) return;
    wrap.innerHTML = "";

    const arr = scored.slice();
    const w = weights(prefs.goal || "balanced");
    const tuitionOf = (x) => (tuitionFor(prefs, x.uni) ?? 1e12);

    if (mode === "cheapest") arr.sort((a, b) => (tuitionOf(a) - tuitionOf(b)) || (b.total - a.total));
    else if (mode === "ranking") arr.sort((a, b) => (b.prestige - a.prestige) || (b.total - a.total));
    else arr.sort((a, b) => b.total - a.total);

    const top = arr.slice(0, 12);
    if (top.length === 0) {
      wrap.innerHTML = `<div class="item"><h3>${STR[LANG].emptyUni.title}</h3><p class="muted">${STR[LANG].emptyUni.p}</p></div>`;
      return;
    }

    for (const s of top) {
      const u = s.uni;
      const site = bestSite(u);
      const tuition = tuitionFor(prefs, u);
      const tuitionTxt = tuition == null ? tr("misc.unknown") : `€${tuition}/${tr("misc.yr")}`;
      const livingTxt = u.living_est_month_eur == null ? tr("misc.unknown") : `€${u.living_est_month_eur}/${tr("misc.mo")}`;

      const countryName = STR[LANG].countryNames[s.country.id] || s.country.name || s.country.id;

      const isIE = (u.country_id === "ie");
      const qsText = `${tr("badge.qs")}: ${String(u.qs_band || "unranked").toUpperCase().replace("TOP","Top ")}`;
      const qsBadge = (isIE && u.links?.qs)
        ? `<a class="badge badge-qs" style="text-decoration:none;color:#111827;background:#F2C94C;border-color:#E0B83E;" href="${escAttr(u.links.qs)}" target="_blank" rel="noopener">${qsText}</a>`
        : `<span class="badge badge-qs" style="color:#111827;background:#F2C94C;border-color:#E0B83E;">${qsText}</span>`;
      const tuitionText = tr("badge.tuition", { v: tuitionTxt });
      const tuitionBadge = (isIE && u.links?.tuition)
        ? `<a class="badge badge-tuition" style="text-decoration:none;color:inherit;" href="${escAttr(u.links.tuition)}" target="_blank" rel="noopener">${tuitionText}</a>`
        : `<span class="badge badge-tuition">${tuitionText}</span>`;

      const badges = [
        qsBadge,
        tuitionBadge,
        `<span class="badge">${tr("badge.livingCost", { v: livingTxt })}</span>`,
      ];
      if (u.intakes?.length) badges.push(`<span class="badge">${tr("badge.intake", { v: u.intakes.join(", ").toUpperCase() })}</span>`);
      if (s.needsPathway) badges.push(`<span class="badge warn">${tr("badge.pathway")}</span>`);

      const buttons = [];
      if (site) buttons.push(`<a class="btn" href="${site}" target="_blank" rel="noreferrer">${tr("buttons.website")}</a>`);
      if (u.links?.admissions) buttons.push(`<a class="btn" href="${u.links.admissions}" target="_blank" rel="noreferrer">${tr("buttons.admissions")}</a>`);
      if (u.links?.tuition) buttons.push(`<a class="btn" href="${u.links.tuition}" target="_blank" rel="noreferrer">${tr("buttons.tuition")}</a>`);
      if (u.links?.international) buttons.push(`<a class="btn" href="${u.links.international}" target="_blank" rel="noreferrer">${tr("buttons.international")}</a>`);

      const title = site ? `<a class="title-link" href="${site}" target="_blank" rel="noreferrer">${u.name}</a>` : u.name;

      const el = document.createElement("div");
      el.className = "item";
      el.innerHTML =
        `<h3>${title}</h3>` +
        `<div class="meta"><span>${countryName} • ${u.city}</span><span>${tr("badge.score")}: <strong>${s.total}</strong>/100</span></div>` +
        `<div class="badges">${badges.join("")}</div>` +
        `<div class="why">QS: ${s.prestige}/100 • Cost fit: ${s.cost}/100 • Career fit: ${s.career}/100</div>` +
        (buttons.length ? `<div class="meta" style="margin-top:10px;">${buttons.join("")}</div>` : "");

      wrap.appendChild(el);
    }

    // Remove any leftover badges from older markup
    wrap.querySelectorAll(".badge").forEach(b => {
      const txt = b.textContent.trim().toLowerCase();
      if (txt === "linkler mevcut" || txt === "links available") b.remove();
    });
  }

  async function main() {
    applyStaticLabels();

    const prefsRaw = localStorage.getItem("aa_prefs");
    if (!prefsRaw) { location.href = "finder.html"; return; }
    const prefs = JSON.parse(prefsRaw);

    renderSummary(prefs);

    const SHEET_ID = "1qotTellCsSp39CmQ1vLuv38VVs5PsyH7SyXRknwIGjQ";
    const GID_UNIS = "214147022";
    const UNIS_TSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=tsv&gid=${GID_UNIS}`;

    let unis = [];
    try {
      const tsv = await fetchText(UNIS_TSV_URL);
      unis = dedupe(parseTSV(tsv));
    } catch (e) {
      try { unis = await fetch("data/universities.json").then(r => r.json()); } catch (_) { unis = []; }
      unis = dedupe(unis);
    }

    const countries = await fetch("data/countries.json").then(r => r.json());
    const byId = Object.fromEntries(countries.map(c => [c.id, c]));

    const w = weights(prefs.goal || "balanced");
    const pool = unis.filter(u => {
      if (prefs.country && u.country_id !== prefs.country) return false;
      if (prefs.degree && !(u.degree_supported || []).includes(prefs.degree)) return false;
      if (prefs.field && !(u.fields || []).includes(prefs.field)) return false;
      if (prefs.intake && !(u.intakes || []).includes(prefs.intake)) return false;
      if (prefs.postStudyRequired === true) {
        const c = byId[u.country_id];
        if (!c || !c.post_study_work) return false;
      }
      if (prefs.tuitionMax != null) {
        const t0 = tuitionFor(prefs, u);
        if (t0 != null && t0 > prefs.tuitionMax) return false;
      }
      if (prefs.livingMax != null) {
        const l0 = u.living_est_month_eur;
        if (l0 != null && l0 > prefs.livingMax) return false;
      }
      return true;
    });

    const scored = [];
    for (const u of pool) {
      const c = byId[u.country_id];
      if (!c) continue;

      const tuition = tuitionFor(prefs, u);
      const prestige = qsScore(u.qs_band);
      const cost = costFit(prefs, tuition, u.living_est_month_eur);
      const career = careerFit(c, u);

      let pen = 0;
      let needsPathway = false;

      const min = (prefs.degree === "ug") ? u.ielts_min_ug : (prefs.degree === "pg") ? u.ielts_min_pg : (u.ielts_min_pg ?? u.ielts_min_ug);
      if (min != null) {
        if (prefs.hasIelts === true && prefs.ieltsScore != null && prefs.ieltsScore < min) { pen += 8; needsPathway = true; }
        if (prefs.hasIelts === false) needsPathway = true;
      }
      if (prefs.gpa != null && u.gpa_min != null && prefs.gpa < u.gpa_min) pen += 8;

      const raw = prestige * w.prestige + cost * w.cost + career * w.career;
      const total = clamp(Math.round(raw - pen), 0, 100);

      scored.push({ uni: u, country: c, total, needsPathway, prestige, cost, career });
    }
    scored.sort((a, b) => b.total - a.total);

    // initial sort
    const sortEl = document.getElementById("sortSelect");
    const saved = localStorage.getItem("aa_sort") || "match";
    const mode = (sortEl && ["match","cheapest","ranking"].includes(saved)) ? saved : "match";
    if (sortEl) sortEl.value = mode;

    renderCountries(scored, byId);
    renderUniversities(scored, prefs, mode);

    if (sortEl) sortEl.addEventListener("change", () => {
      localStorage.setItem("aa_sort", sortEl.value);
      renderUniversities(scored, prefs, sortEl.value);
    });

    // Language toggle: NO reload. Re-render using existing scored list.
    const langBtn = document.getElementById("langToggle");
    if (langBtn && !langBtn.__yoloBound) {
      langBtn.__yoloBound = true;
      langBtn.addEventListener("click", (e) => {
        // ignore programmatic clicks from i18n
        if (e && e.isTrusted === false) return;

        // allow i18n.js to update lang/localStorage first
        setTimeout(() => {
          const next = detectLang();
          if (next === LANG) return;
          LANG = next;
          applyStaticLabels();
          renderSummary(prefs);
          renderCountries(scored, byId);
          renderUniversities(scored, prefs, (sortEl ? sortEl.value : "match"));
        }, 120);
      }, true);
    }
  }

  // Run
  main().catch(err => {
    console.error("results.js error:", err);
  });
})()
  function escAttr(v){
    return String(v ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
;