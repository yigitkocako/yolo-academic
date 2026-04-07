// results.html: loads data, applies filters & scoring, renders results.
// Debug banner is hidden by default. Add ?debug=1 to results.html to show diagnostics.

(async function () {
  const DEBUG = new URLSearchParams(location.search).get("debug") === "1";
  const $ = (id) => document.getElementById(id);
  const tt = (k, v) => (window.t ? window.t(k, v) : k);

  const prefsRaw = localStorage.getItem("aa_prefs");
  if (!prefsRaw) { window.location.href = "finder.html"; return; }
  const prefs = JSON.parse(prefsRaw);

  // Sheets config
  const cfg = (window.AA_CONFIG && window.AA_CONFIG.sheets) || {};
  const SHEET_ID = cfg.sheetId || "";
  const GID_UNIS = cfg.universitiesGid || "";
  const UNIS_TSV_URL = (SHEET_ID && GID_UNIS)
    ? `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=tsv&gid=${GID_UNIS}`
    : "";

  function ensureBanner() {
    if (!DEBUG) return null;
    let el = document.getElementById("dataBanner");
    if (!el) {
      el = document.createElement("div");
      el.id = "dataBanner";
      el.className = "card";
      el.style.marginTop = "12px";
      const header = document.querySelector("header.container");
      if (header && header.parentNode) header.parentNode.insertBefore(el, header.nextSibling);
      else document.body.insertBefore(el, document.body.firstChild);
    }
    return el;
  }
  function setBanner(html) { const b = ensureBanner(); if (b) b.innerHTML = html; }
  function appendBanner(html) { const b = ensureBanner(); if (b) b.innerHTML += html; }

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
        international: String(get(r, "international_url")).trim()
      },
      is_placeholder: toBool(get(r, "is_placeholder"))
    })).filter(u => u.id && u.country_id && u.name);
  }

  const normName = (n) => String(n || "").toLowerCase().replace(/\s+/g, " ").replace(/[^a-z0-9 ]/g, "").trim();
  const complete = (u) =>
    (u.links.international ? 2 : 0) + (u.links.admissions ? 2 : 0) + (u.links.tuition ? 2 : 0) +
    ((u.tuition_est_pg_eur != null || u.tuition_est_ug_eur != null) ? 1 : 0) +
    ((u.living_est_month_eur != null) ? 1 : 0) +
    (!u.is_placeholder ? 1 : 0);

  function dedupe(unis) {
    const m = new Map();
    for (const u of unis) {
      const k = `${u.country_id}|${normName(u.name)}`;
      if (!m.has(k) || complete(u) > complete(m.get(k))) m.set(k, u);
    }
    return Array.from(m.values());
  }

  async function loadUnis() {
    if (UNIS_TSV_URL) {
      try {
        const tsv = await fetchText(UNIS_TSV_URL);
        return { unis: dedupe(parseTSV(tsv)), source: "sheets" };
      } catch (e) {
        return { unis: null, source: "sheets", error: String(e && e.message ? e.message : e) };
      }
    }
    return { unis: null, source: "none", error: "Sheets URL not configured" };
  }

  const [countries, sheetPack] = await Promise.all([
    fetch("data/countries.json").then(r => r.json()),
    loadUnis()
  ]);

  let universities = sheetPack.unis;
  let dataSource = sheetPack.source;
  let sheetError = sheetPack.error;

  if (!universities) {
    universities = await fetch("data/universities.json").then(r => r.json()).then(dedupe);
    dataSource = "local";
  }

  const byId = Object.fromEntries(countries.map(c => [c.id, c]));

  if (DEBUG) {
    const errLine = (dataSource === "local" && sheetError)
      ? `<div class="muted" style="margin-top:6px;color:#92400e;">Sheets failed → local JSON. Reason: <code>${sheetError}</code></div>`
      : "";
    setBanner(
      `<div><strong>Data source:</strong> ${dataSource} • <strong>Universities loaded:</strong> ${universities.length}</div>` +
      (UNIS_TSV_URL ? `<div class="muted" style="margin-top:4px;">Sheets TSV URL: <a href="${UNIS_TSV_URL}" target="_blank" rel="noreferrer">${UNIS_TSV_URL}</a></div>` : "") +
      errLine
    );
  }

  const qsScore = (band) => ({ top50:100, top100:92, top200:84, top500:70, top1000:55, unranked:40 }[band] ?? 40);
  const weights = (goal) => ({
    prestige:{prestige:.55,cost:.20,career:.25},
    value:{prestige:.20,cost:.55,career:.25},
    career:{prestige:.20,cost:.25,career:.55},
    balanced:{prestige:.33,cost:.33,career:.34}
  }[goal] || {prestige:.33,cost:.33,career:.34});
  const w = weights(prefs.goal || "balanced");

  const tuitionFor = (u) => {
    if (prefs.degree === "ug") return u.tuition_est_ug_eur;
    if (prefs.degree === "pg") return u.tuition_est_pg_eur;
    const a = u.tuition_est_ug_eur, b = u.tuition_est_pg_eur;
    if (a == null && b == null) return null;
    if (a == null) return b;
    if (b == null) return a;
    return Math.min(a, b);
  };

  const costFit = (tuition, living) => {
    if (tuition == null && living == null) return 55;
    const tMax = prefs.tuitionMax ?? 35000;
    const lMax = prefs.livingMax ?? 1200;
    const ts = (tuition == null) ? 55 : clamp(110 - (tuition / tMax) * 100, 0, 100);
    const ls = (living == null) ? 55 : clamp(110 - (living / lMax) * 100, 0, 100);
    return Math.round(ts * 0.6 + ls * 0.4);
  };

  const careerFit = (country, u) => {
    let s = 50;
    if (country.post_study_work) s += 30;
    if (country.student_work_allowed) s += 10;
    if (u.career_boost) s += 10;
    return clamp(s, 0, 100);
  };

  const pool = universities.filter(u => {
    if (prefs.country && u.country_id !== prefs.country) return false;
    if (prefs.degree && !(u.degree_supported || []).includes(prefs.degree)) return false;
    if (prefs.field && !(u.fields || []).includes(prefs.field)) return false;
    if (prefs.intake && !(u.intakes || []).includes(prefs.intake)) return false;
    if (prefs.postStudyRequired === true) {
      const c = byId[u.country_id];
      if (!c || !c.post_study_work) return false;
    }
    if (prefs.tuitionMax != null) {
      const t = tuitionFor(u);
      if (t != null && t > prefs.tuitionMax) return false;
    }
    if (prefs.livingMax != null) {
      const l = u.living_est_month_eur;
      if (l != null && l > prefs.livingMax) return false;
    }
    return true;
  });

  if (DEBUG) appendBanner(`<div class="muted" style="margin-top:6px;">Pool after filters: <strong>${pool.length}</strong></div>`);

  let skipped = 0;
  const scored = [];
  for (const u of pool) {
    const c = byId[u.country_id];
    if (!c) { skipped++; continue; }

    const tuition = tuitionFor(u);
    const prestige = qsScore(u.qs_band);
    const cost = costFit(tuition, u.living_est_month_eur);
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

    const reasons = [
      `QS: ${String(u.qs_band || "unranked").toUpperCase().replace("TOP","Top ")}`,
      `Cost fit: ${cost}/100`,
      `Career fit: ${career}/100`
    ];
    if (needsPathway) reasons.push(`Language: min IELTS ${min} (Pathway may be needed)`);

    scored.push({ uni: u, country: c, total, needsPathway, reasons });
  }
  scored.sort((a, b) => b.total - a.total);

  const degreeLabel = prefs.degree ? (prefs.degree === "ug" ? tt("opt.ug") : tt("opt.pg")) : tt("opt.any");
  const fieldLabel = prefs.field ? (tt(`opt.${prefs.field}`) || prefs.field) : tt("opt.any");
  const goalLabel = tt(`opt.${prefs.goal || "balanced"}`) || (prefs.goal || "balanced");
  const intakeLabel = prefs.intake ? (tt(`opt.${prefs.intake}`) || prefs.intake) : tt("opt.any");
  const yearLabel = prefs.year ? String(prefs.year) : tt("opt.any");
  if ($("summary")) {
    $("summary").textContent = tt("summary.tpl", {
      degree: degreeLabel,
      field: fieldLabel,
      goal: goalLabel,
      tuition: (prefs.tuitionMax ?? tt("val.unknown")),
      living: (prefs.livingMax ?? tt("val.unknown")),
      intake: intakeLabel,
      year: yearLabel
    });
  }

  // Countries
  const countryWrap = $("countryResults");
  if (countryWrap) {
    countryWrap.innerHTML = "";
    let list = [];
    if (prefs.country && byId[prefs.country]) list = [{ country: byId[prefs.country], score: 100, count: scored.length }];
    else {
      const agg = new Map();
      for (const s of scored) {
        const id = s.country.id;
        if (!agg.has(id)) agg.set(id, { country: s.country, scores: [] });
        agg.get(id).scores.push(s.total);
      }
      list = Array.from(agg.values()).map(x => {
        const top = x.scores.slice(0, 6);
        const avg = top.reduce((a, b) => a + b, 0) / (top.length || 1);
        let bonus = 0;
        if (x.country.post_study_work) bonus += 5;
        if (x.country.student_work_allowed) bonus += 3;
        return { country: x.country, score: clamp(Math.round(avg + bonus), 0, 100), count: x.scores.length };
      }).sort((a, b) => b.score - a.score);
    }

    if (list.length === 0) {
      countryWrap.innerHTML = `<div class="item"><h3>${tt("msg.none")}</h3><p class="muted">${tt("msg.none.p")}</p></div>`;
    } else {
      for (const c of list) {
        const el = document.createElement("div");
        el.className = "item";
        el.innerHTML =
          `<h3>${c.country.name}</h3>` +
          `<div class="meta"><span>${tt("sort.score")}: <strong>${c.score}</strong>/100</span><span>Universities: ${c.count}</span><span>Living: ${c.country.living_cost_band}</span></div>` +
          `<div class="badges">` +
          (c.country.post_study_work ? `<span class="badge good">${tt("badge.poststudy.y")}</span>` : `<span class="badge warn">${tt("badge.poststudy.n")}</span>`) +
          (c.country.student_work_allowed ? `<span class="badge good">${tt("badge.studentwork.y")}</span>` : `<span class="badge warn">${tt("badge.studentwork.n")}</span>`) +
          `</div>` +
          `<p class="why">${c.country.short_note || ""}</p>`;
        countryWrap.appendChild(el);
      }
    }
  }

  // Sort + universities
  const bestSite = (u) => u.links?.international || u.links?.admissions || u.links?.tuition || "";
  const getSorted = (mode) => {
    const arr = scored.slice();
    if (mode === "cheapest") arr.sort((a, b) => ((tuitionFor(a.uni) ?? 1e12) - (tuitionFor(b.uni) ?? 1e12)) || (b.total - a.total));
    else if (mode === "ranking") arr.sort((a, b) => (qsScore(b.uni.qs_band) - qsScore(a.uni.qs_band)) || (b.total - a.total));
    else arr.sort((a, b) => b.total - a.total);
    return arr;
  };

  function render(mode) {
    const wrap = $("uniResults");
    if (!wrap) return;
    wrap.innerHTML = "";
    const top = getSorted(mode).slice(0, 12);
    if (top.length === 0) {
      wrap.innerHTML = `<div class="item"><h3>${tt("msg.nouni")}</h3><p class="muted">${tt("msg.nouni.p")}</p></div>`;
      return;
    }

    for (const s of top) {
      const u = s.uni;
      const site = bestSite(u);
      const tuition = tuitionFor(u);
      const tuitionTxt = tuition == null ? tt("val.unknown") : `€${tuition}/yr`;
      const livingTxt = u.living_est_month_eur == null ? tt("val.unknown") : `€${u.living_est_month_eur}/mo`;
      const title = site ? `<a class="title-link" href="${site}" target="_blank" rel="noreferrer">${u.name}</a>` : u.name;

      const placeholderBadge = u.is_placeholder ? `<span class="badge warn">${tt("badge.placeholder")}</span>` : `<span class="badge good">${tt("badge.verified")}</span>`;
      const linkBtns =
        `<div class="meta" style="margin-top:10px;">` +
        (site ? `<a class="btn" href="${site}" target="_blank" rel="noreferrer">Website</a>` : "") +
        (u.links?.admissions ? `<a class="btn" href="${u.links.admissions}" target="_blank" rel="noreferrer">Admissions</a>` : "") +
        (u.links?.tuition ? `<a class="btn" href="${u.links.tuition}" target="_blank" rel="noreferrer">Tuition</a>` : "") +
        (u.links?.international ? `<a class="btn" href="${u.links.international}" target="_blank" rel="noreferrer">International</a>` : "") +
        `</div>`;

      const el = document.createElement("div");
      el.className = "item";
      el.innerHTML =
        `<h3>${title}</h3>` +
        `<div class="meta"><span>${s.country.name} • ${u.city}</span><span>${tt("sort.score")}: <strong>${s.total}</strong>/100</span></div>` +
        `<div class="badges">` +
        placeholderBadge +
        `<span class="badge">QS: ${String(u.qs_band || "unranked").toUpperCase().replace("TOP","Top ")}</span>` +
        (u.links?.tuition ? `<a class="badge badge-link" href="${u.links.tuition}" target="_blank" rel="noreferrer">Tuition ~ ${tuitionTxt}</a>` : `<span class="badge">Tuition ~ ${tuitionTxt}</span>`) +
        `<span class="badge">Living ~ ${livingTxt}</span>` +
        (u.intakes?.length ? `<span class="badge">Intake: ${u.intakes.join(", ").toUpperCase()}</span>` : "") +
        (s.needsPathway ? `<span class="badge warn">Pathway may be needed</span>` : "") +
        `</div>` +
        `<div class="why">${s.reasons.join(" • ")}</div>` +
        linkBtns;
      wrap.appendChild(el);
    }
  }

  const sel = $("sortSelect");
  const saved = localStorage.getItem("aa_sort") || "match";
  const initial = (sel && ["match", "cheapest", "ranking"].includes(saved)) ? saved : "match";
  if (sel) sel.value = initial;
  render(initial);
  if (sel) sel.addEventListener("change", () => { localStorage.setItem("aa_sort", sel.value); render(sel.value); });

  if (DEBUG) console.log({ prefs, dataSource, universitiesLoaded: universities.length, poolCount: pool.length, skipped, sheetUrl: UNIS_TSV_URL });
})();