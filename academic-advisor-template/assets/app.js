// finder.html -> localStorage -> results.html
(() => {
  const $ = (id) => document.getElementById(id);

  const hasIelts = $("hasIelts");
  const ieltsWrap = $("ieltsWrap");
  const yearSel = $("year");

  // year options (this year.. +2)
  if (yearSel) {
    const thisYear = new Date().getFullYear();
    for (let y = thisYear; y <= thisYear + 2; y++) {
      const opt = document.createElement("option");
      opt.value = String(y);
      opt.textContent = String(y);
      yearSel.appendChild(opt);
    }
  }

  function toggleIelts() {
    if (!hasIelts || !ieltsWrap) return;
    const v = hasIelts.value;
    ieltsWrap.style.display = (v === "yes") ? "block" : "none";
  }

  if (hasIelts) {
    hasIelts.addEventListener("change", toggleIelts);
    toggleIelts();
  }

  const form = $("prefsForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const country = ($("country")?.value || "any");
    const degree = ($("degree")?.value || "any");
    const field = ($("field")?.value || "any");
    const goal = ($("goal")?.value || "balanced");

    const tuitionMaxRaw = $("tuitionMax")?.value ?? "";
    const livingMaxRaw = $("livingMax")?.value ?? "";

    const toNum = (x) => {
      const n = Number(String(x).trim());
      return Number.isFinite(n) ? n : null;
    };

    let tuitionMax = tuitionMaxRaw ? toNum(tuitionMaxRaw) : null;
    let livingMax = livingMaxRaw ? toNum(livingMaxRaw) : null;
    if (tuitionMax != null && tuitionMax >= 900000) tuitionMax = null;
    if (livingMax != null && livingMax >= 900000) livingMax = null;

    const postStudy = ($("postStudyRequired")?.value || "any");
    const postStudyRequired = postStudy === "yes" ? true : postStudy === "no" ? false : null;

    const ieltsState = ($("hasIelts")?.value || "any");
    const hasIeltsVal = ieltsState === "yes" ? true : ieltsState === "no" ? false : null;
    const ieltsScore = toNum($("ieltsScore")?.value || "");

    const gpaStr = ($("gpa")?.value || "").trim().replace(",", ".");
    const gpa = gpaStr ? toNum(gpaStr) : null;

    const intake = ($("intake")?.value || "any");
    const year = ($("year")?.value || "any");

    const prefs = {
      country: country === "any" ? null : country,
      degree: degree === "any" ? null : degree,
      field: field === "any" ? null : field,
      goal,
      tuitionMax,
      livingMax,
      postStudyRequired,
      hasIelts: hasIeltsVal,
      ieltsScore: hasIeltsVal === true ? ieltsScore : null,
      gpa,
      intake: intake === "any" ? null : intake,
      year: year === "any" ? null : Number(year)
    };

    try { localStorage.setItem("aa_prefs", JSON.stringify(prefs)); } catch (err) {}
    window.location.href = "results.html";
  });
})();