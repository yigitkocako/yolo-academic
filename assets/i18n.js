// Lightweight i18n (TR/EN) + language toggle
(() => {
  const DICT = {
  "tr": {
    "nav.home": "Ana Sayfa",
    "nav.finder": "Program Bul",
    "nav.results": "Sonuçlar",
    "nav.insights": "Yazılar",
    "nav.about": "Hakkında",
    "landing.kicker": "TR → Ireland • UK • Canada",
    "landing.h1": "Tek bir hayatın var. Yurt dışında oku, çalış, yaşa.",
    "landing.p": "YOLO Academic; Türkiye’den İrlanda, İngiltere ve Kanada’ya uzanan eğitim yolculuğunda kişisel danışmanlık sunar. Program Bul aracıyla seçeneklerini gör, istersen kısa bir ön görüşmeyle birlikte netleştirelim.",
    "landing.trust.1": "100+ öğrenci desteği",
    "landing.trust.2": "Kişisel danışmanlık",
    "landing.trust.3": "Resmi linklerle doğrulama",
    "landing.cta.start": "Program bul",
    "services.title": "Hizmetler",
    "services.sub": "Başlangıçtan yerleşime kadar, adım adım.",
    "svc.1.t": "Ücretsiz Ön Görüşme",
    "svc.1.p": "Hedefini, bütçeni ve ülkeleri netleştiriyoruz.",
    "svc.2.t": "Okul & Program Seçimi",
    "svc.2.p": "Program Bul aracı + kişisel shortlist ile.",
    "svc.3.t": "Vize & Evrak Desteği",
    "svc.3.p": "Checklist + örnekler + süreç takibi.",
    "svc.4.t": "Yerleşim & Adaptasyon",
    "svc.4.p": "Konaklama, iş arama, pratik ipuçları.",

    "svc.5.t": "Dil Okulu & Yaz Okulu",
    "svc.5.p": "Seviye, süre, şehir ve bütçeye göre seçenekler.",
    "svc.6.t": "Kariyer Yönlendirmesi",
    "svc.6.p": "CV/LinkedIn, iş arama planı, mülakat ipuçları.",
    "svc.7.t": "Niyet Mektubu / SOP Desteği",
    "svc.7.p": "SOP/LOI, cover letter ve başvuru metinleri.",
    "svc.8.t": "Kabul & Başvuru Dosyası",
    "svc.8.p": "Belge kontrolü, başvuru stratejisi ve takip.",
    "svc.9.t": "Vize Yenileme Süreçleri",
    "svc.9.p": "Randevu, gerekli belgeler ve süreç takibi.",
    "svc.10.t": "Oturum / Vatandaşlık Yol Haritası",
    "svc.10.p": "Uzun vadeli plan, adımlar ve gereklilikler.",
    "tool.title": "Program Bul aracı",
    "tool.p": "Bütçe, hedef (prestij / fiyat-performans / kariyer), dil ve intake bilgilerine göre ülke ve okul önerileri al. Her okul kartında resmi sayfalara giden linkler var.",
    "tool.try": "Aracı dene",
    "tool.about": "Hakkında",
    "how.title": "Nasıl çalışır?",
    "how.1.t": "1) Tercihlerini gir",
    "how.1.p": "Ülke / seviye / alan / bütçe / IELTS… (opsiyonel)",
    "how.2.t": "2) Sistem filtreler & sıralar",
    "how.2.p": "Hedef ağırlıklarına göre en uygun seçenekler üste çıkar.",
    "how.3.t": "3) Resmi linklerle kontrol et",
    "how.3.p": "Admissions / Tuition / International sayfalarına tek tık.",
    "cta.title": "Hazır mısın?",
    "cta.p": "İstersen önce Program Bul ile shortlist çıkar, sonra kısa görüşmeyle planı netleştirelim.",
    "call.btn": "Ücretsiz ön görüşme",
    "finder.h1": "Tercihlerini seç",
    "finder.p": "Filtreleri seç → sonuçlarda ülke ve okul önerilerini gör.",
    "form.country": "Ülke (opsiyonel)",
    "form.degree": "Eğitim seviyesi (opsiyonel)",
    "form.field": "Alan (opsiyonel)",
    "form.goal": "Hedef",
    "form.tuition": "Yıllık okul bütçesi (en fazla) (EUR)",
    "form.living": "Aylık yaşam bütçesi (en fazla) (EUR)",
    "form.poststudy": "Mezuniyet sonrası çalışma izni şart mı? (opsiyonel)",
    "form.ielts": "IELTS durumu (opsiyonel)",
    "form.ieltsScore": "IELTS skoru (overall)",
    "form.gpa": "GPA (opsiyonel)",
    "form.gpaHint": "Şimdilik 0–4 formatı.",
    "form.intake": "Başlangıç dönemi (intake) (opsiyonel)",
    "form.year": "Başlangıç yılı (opsiyonel)",
    "form.submit": "Sonuçları gör",
    "opt.any": "Farketmez",
    "opt.year.any": "Yıl farketmez",
    "opt.country.ie": "İrlanda",
    "opt.country.ca": "Kanada",
    "opt.country.uk": "İngiltere",
    "opt.ug": "Lisans (UG)",
    "opt.pg": "Yüksek Lisans (PG)",
    "opt.balanced": "Dengeli",
    "opt.prestige": "Prestij / Ranking",
    "opt.value": "Fiyat / Performans",
    "opt.career": "Kariyer & Çalışma İzni",
    "opt.yes": "Evet",
    "opt.no": "Hayır",
    "opt.ielts.any": "Henüz bilmiyorum / farketmez",
    "opt.ielts.yes": "Var",
    "opt.ielts.no": "Yok",
    "opt.sep": "Eylül (Sep/Autumn)",
    "opt.jan": "Ocak (Jan/Spring)",
    "results.h1": "Öneriler",
    "results.edit": "Filtreleri değiştir",
    "results.countries": "Önerilen Ülkeler",
    "results.unis": "Önerilen Okullar",
    "results.note": "Not: Eksik/uyumsuz bilgilerde ‘Pathway gerekebilir’ etiketi görebilirsin.",
    "summary.tpl": "Seviye: {degree} • Alan: {field} • Hedef: {goal} • Tuition max: {tuition} • Living max: {living} • Intake: {intake} • Yıl: {year}",
    "sort.label": "Sıralama",
    "sort.match": "En iyi eşleşme",
    "sort.cheapest": "En düşük maliyet",
    "sort.ranking": "En yüksek ranking",
    "sort.note": "Not: Ülke skorları ‘en iyi eşleşme’ mantığıyla hesaplanır.",
    "sort.score": "Skor",
    "msg.none": "Sonuç yok",
    "msg.none.p": "Filtreleri genişletmeyi deneyebilirsin.",
    "msg.nouni": "Okul bulunamadı",
    "msg.nouni.p": "Filtreleri genişletmeyi deneyebilirsin.",
    "msg.skipped": "Eksik ülke verisi nedeniyle atlandı.",
    "badge.poststudy.y": "Mezuniyet sonrası izin var",
    "badge.poststudy.n": "Mezuniyet sonrası izin net değil",
    "badge.studentwork.y": "Öğrenci çalışma izni var",
    "badge.studentwork.n": "Öğrenci çalışma izni net değil",
    "badge.placeholder": "Bilgi eksik — resmi siteden doğrula",
    "badge.verified": "Linkler mevcut",
    "val.unknown": "Bilinmiyor",
    "call.cta.title": "Karar vermekte zorlandın mı?",
    "call.cta.p": "Kısa bir ön görüşmede hedefini netleştirip listeni birlikte yorumlayabiliriz."
  },
  "en": {
    "nav.home": "Home",
    "nav.finder": "Find",
    "nav.results": "Results",
    "nav.insights": "Insights",
    "nav.about": "About",
    "landing.kicker": "TR → Ireland • UK • Canada",
    "landing.h1": "You only live once. Study, work, and build a life abroad.",
    "landing.p": "YOLO Academic provides personal, end-to-end guidance from Turkey to Ireland, the UK and Canada. Use the Program Finder to explore options, then book a short intro call to plan your next steps.",
    "landing.trust.1": "100+ students supported",
    "landing.trust.2": "Personal guidance",
    "landing.trust.3": "Verified links",
    "landing.cta.start": "Find programs",
    "services.title": "Services",
    "services.sub": "From planning to settling in, step by step.",
    "svc.1.t": "Free Intro Call",
    "svc.1.p": "We clarify your goals, budget and countries.",
    "svc.2.t": "School & Program Selection",
    "svc.2.p": "With the Finder tool + a personal shortlist.",
    "svc.3.t": "Visa & Documents",
    "svc.3.p": "Checklist + examples + process tracking.",
    "svc.4.t": "Settling-in & Adaptation",
    "svc.4.p": "Accommodation, job search, practical tips.",

    "svc.5.t": "Language School & Summer Programs",
    "svc.5.p": "Options by level, duration, city and budget.",
    "svc.6.t": "Career Guidance",
    "svc.6.p": "CV/LinkedIn, job-search plan, interview tips.",
    "svc.7.t": "SOP / Motivation Letter Support",
    "svc.7.p": "SOP/LOI, cover letters and application texts.",
    "svc.8.t": "Applications & Offer Support",
    "svc.8.p": "Document review, strategy and follow-up.",
    "svc.9.t": "Visa Renewal Support",
    "svc.9.p": "Appointments, required docs and tracking.",
    "svc.10.t": "Residency / Citizenship Roadmap",
    "svc.10.p": "Long-term plan, steps and requirements.",
    "tool.title": "Program Finder",
    "tool.p": "Get country and university suggestions based on budget, goal (prestige / value / career), language and intake. Each university card includes official links.",
    "tool.try": "Try the tool",
    "tool.about": "About",
    "how.title": "How it works",
    "how.1.t": "1) Enter your preferences",
    "how.1.p": "Country / level / field / budget / IELTS… (optional)",
    "how.2.t": "2) We filter & rank",
    "how.2.p": "Options are ranked based on your goal weights.",
    "how.3.t": "3) Verify via official links",
    "how.3.p": "One click to Admissions / Tuition / International pages.",
    "cta.title": "Ready to start?",
    "cta.p": "Create a shortlist with the Finder, then clarify the plan in a short call.",
    "call.btn": "Free intro call",
    "finder.h1": "Choose your preferences",
    "finder.p": "Choose filters → see country & university suggestions in results.",
    "form.country": "Preferred country (optional)",
    "form.degree": "Degree level (optional)",
    "form.field": "Field (optional)",
    "form.goal": "Goal",
    "form.tuition": "Annual tuition budget (max) (EUR)",
    "form.living": "Monthly living budget (max) (EUR)",
    "form.poststudy": "Post-study work required? (optional)",
    "form.ielts": "IELTS status (optional)",
    "form.ieltsScore": "IELTS score (overall)",
    "form.gpa": "GPA (optional)",
    "form.gpaHint": "For now, 0–4 scale.",
    "form.intake": "Intake (optional)",
    "form.year": "Start year (optional)",
    "form.submit": "See results",
    "opt.any": "Any",
    "opt.year.any": "Any year",
    "opt.country.ie": "Ireland",
    "opt.country.ca": "Canada",
    "opt.country.uk": "United Kingdom",
    "opt.ug": "Undergraduate (UG)",
    "opt.pg": "Postgraduate (PG)",
    "opt.balanced": "Balanced",
    "opt.prestige": "Prestige / Ranking",
    "opt.value": "Value for money",
    "opt.career": "Career & Work rights",
    "opt.yes": "Yes",
    "opt.no": "No",
    "opt.ielts.any": "Not sure / any",
    "opt.ielts.yes": "Have it",
    "opt.ielts.no": "Don't have",
    "opt.sep": "September (Autumn)",
    "opt.jan": "January (Spring)",
    "results.h1": "Recommendations",
    "results.edit": "Edit filters",
    "results.countries": "Recommended countries",
    "results.unis": "Recommended universities",
    "results.note": "Note: If info is missing/incompatible you may see 'Pathway may be needed'.",
    "summary.tpl": "Level: {degree} • Field: {field} • Goal: {goal} • Tuition max: {tuition} • Living max: {living} • Intake: {intake} • Year: {year}",
    "sort.label": "Sort",
    "sort.match": "Best match",
    "sort.cheapest": "Lowest cost",
    "sort.ranking": "Highest ranking",
    "sort.note": "Note: Country scores are computed using the 'best match' logic.",
    "sort.score": "Score",
    "msg.none": "No results",
    "msg.none.p": "Try relaxing your filters.",
    "msg.nouni": "No universities found",
    "msg.nouni.p": "Try relaxing your filters.",
    "msg.skipped": "Skipped due to missing country data.",
    "badge.poststudy.y": "Post-study work",
    "badge.poststudy.n": "Post-study unclear",
    "badge.studentwork.y": "Student work",
    "badge.studentwork.n": "Student work unclear",
    "badge.placeholder": "Info missing — verify on official site",
    "badge.verified": "Links available",
    "val.unknown": "Unknown",
    "call.cta.title": "Not sure what to choose?",
    "call.cta.p": "In a short intro call we can clarify your goals and review your list together."
  }
};

  function tpl(str, vars) {
    if (!vars) return str;
    return String(str).replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ""));
  }

  window.t = function(key, vars) {
    const lang = document.documentElement.getAttribute("lang") || "tr";
    const table = DICT[lang] || DICT.tr;
    const s = table[key] ?? key;
    return tpl(s, vars);
  };

  function applyI18n() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = window.t(key);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      el.setAttribute("placeholder", window.t(key));
    });
  }

  function updateLangToggle() {
    const lang = document.documentElement.getAttribute("lang") || "tr";
    const btn = document.getElementById("langToggle");
    if (!btn) return;
    const next = (lang === "tr") ? "en" : "tr";
    btn.dataset.next = next;
    btn.textContent = next.toUpperCase();
  }

  window.setLang = function(lang) {
    const safe = (lang === "en") ? "en" : "tr";
    document.documentElement.setAttribute("lang", safe);
    try { localStorage.setItem("aa_lang", safe); } catch (e) {}
    applyI18n();
    updateLangToggle();
  };

  document.addEventListener("DOMContentLoaded", () => {
    const saved = (() => { try { return localStorage.getItem("aa_lang"); } catch (e) { return null; } })();
    window.setLang(saved || (document.documentElement.getAttribute("lang") || "tr"));

    const btn = document.getElementById("langToggle");
    if (btn) {
      btn.addEventListener("click", () => {
        const lang = document.documentElement.getAttribute("lang") || "tr";
        window.setLang(lang === "tr" ? "en" : "tr");
      });
    }
  });
})();
