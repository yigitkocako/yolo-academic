// finder.html -> localStorage -> results.html (Ireland-only)
(() => {
  const $ = (id) => document.getElementById(id);
  const hasIelts = $("hasIelts");
  const ieltsWrap = $("ieltsWrap");
  const yearSel = $("year");

  if (yearSel) {
    const thisYear = new Date().getFullYear();
    for (let y = thisYear; y <= thisYear + 3; y++) {
      const opt = document.createElement("option");
      opt.value = String(y);
      opt.textContent = String(y);
      yearSel.appendChild(opt);
    }
  }

  function toggleIelts() {
    if (!hasIelts || !ieltsWrap) return;
    ieltsWrap.style.display = hasIelts.value === "yes" ? "block" : "none";
  }
  if (hasIelts) { hasIelts.addEventListener("change", toggleIelts); toggleIelts(); }

  const form = $("prefsForm");
  if (!form) return;

  const toNum = (x) => {
    const n = Number(String(x ?? "").trim().replace(",", "."));
    return Number.isFinite(n) ? n : null;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const tuitionRaw = $("tuitionMax")?.value || "";
    const livingRaw = $("livingMax")?.value || "";
    let tuitionMax = tuitionRaw ? toNum(tuitionRaw) : null;
    let livingMax = livingRaw ? toNum(livingRaw) : null;
    if (tuitionMax != null && tuitionMax >= 900000) tuitionMax = null;
    if (livingMax != null && livingMax >= 900000) livingMax = null;

    const ieltsState = $("hasIelts")?.value || "any";
    const hasIeltsVal = ieltsState === "yes" ? true : ieltsState === "no" ? false : null;
    const gpaStr = ($("gpa")?.value || "").trim().replace(",", ".");

    const prefs = {
      country: "ie",
      educationType: $("educationType")?.value || "university",
      city: ($("city")?.value || "any") === "any" ? null : $("city").value,
      degree: ($("degree")?.value || "any") === "any" ? null : $("degree").value,
      field: ($("field")?.value || "any") === "any" ? null : $("field").value,
      goal: $("goal")?.value || "balanced",
      tuitionMax,
      livingMax,
      hasIelts: hasIeltsVal,
      ieltsScore: hasIeltsVal === true ? toNum($("ieltsScore")?.value || "") : null,
      gpa: gpaStr ? toNum(gpaStr) : null,
      intake: ($("intake")?.value || "any") === "any" ? null : $("intake").value,
      year: ($("year")?.value || "any") === "any" ? null : Number($("year").value),
      accommodation: ($("accommodation")?.value || "any") === "any" ? null : $("accommodation").value,
      notes: ($("notes")?.value || "").trim()
    };

    try { localStorage.setItem("aa_prefs", JSON.stringify(prefs)); } catch (err) {}
    window.location.href = "results.html";
  });
})();
