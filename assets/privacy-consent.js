/* YOLO Academic: opt-in analytics, advertising and chat preferences.
   Third-party scripts are not loaded until the corresponding choice is granted. */
(function () {
  "use strict";
  var KEY = "yolo_cookie_consent_v1";
  var GA_ID = "G-2Z8W67R6XB";
  var META_ID = "1655884982640648";
  var stored = null;
  var launched = { analytics:false, marketing:false, chat:false };
  var root;

  function getConsent() {
    try {
      var value = JSON.parse(localStorage.getItem(KEY) || "null");
      if (value && value.version === 1 && typeof value.analytics === "boolean" &&
          typeof value.marketing === "boolean" && typeof value.chat === "boolean") return value;
    } catch (e) {}
    return null;
  }
  function getLang() {
    return document.documentElement.getAttribute("lang") === "en" ? "en" : "tr";
  }
  function words(tr, en) { return getLang() === "en" ? en : tr; }
  function inject(url) {
    var script = document.createElement("script");
    script.src = url;
    script.async = true;
    document.head.appendChild(script);
  }
  function launchAnalytics() {
    if (launched.analytics) return;
    launched.analytics = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
    inject("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID));
    inject("assets/clarity.js");
  }
  function launchMarketing() {
    if (launched.marketing) return;
    launched.marketing = true;
    if (!window.fbq) {
      var q = function () {
        if (q.callMethod) q.callMethod.apply(q, arguments);
        else q.queue.push(arguments);
      };
      q.queue = [];
      q.push = q;
      q.loaded = true;
      q.version = "2.0";
      window.fbq = q;
      window._fbq = q;
      inject("https://connect.facebook.net/en_US/fbevents.js");
    }
    window.fbq("init", META_ID);
    window.fbq("track", "PageView");
  }
  function launchChat() {
    if (launched.chat) return;
    launched.chat = true;
    inject("assets/tawk.js");
  }
  function startApproved(value) {
    if (!value) return;
    if (value.analytics) launchAnalytics();
    if (value.marketing) launchMarketing();
    if (value.chat) launchChat();
  }
  function clearTrackingCookies() {
    var names = ["_ga", "_gid", "_gat", "_fbp", "_fbc", "_clck", "_clsk"];
    document.cookie.split(";").forEach(function (part) {
      var name = part.split("=")[0].trim();
      if (name.indexOf("_ga_") === 0) names.push(name);
    });
    var host = window.location.hostname;
    names.forEach(function (name) {
      ["", "; domain=" + host, "; domain=." + host, "; domain=.yoloacademic.com"].forEach(function (domain) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + domain + "; SameSite=Lax";
      });
    });
  }
  function save(analytics, marketing, chat) {
    var previous = stored;
    stored = {
      version: 1,
      analytics: !!analytics,
      marketing: !!marketing,
      chat: !!chat,
      savedAt: new Date().toISOString()
    };
    try { localStorage.setItem(KEY, JSON.stringify(stored)); } catch (e) {}
    root.hidden = true;
    var revoked = previous &&
      ((previous.analytics && !stored.analytics) ||
       (previous.marketing && !stored.marketing) ||
       (previous.chat && !stored.chat));
    if (revoked) {
      clearTrackingCookies();
      // A refresh unloads trackers that had already been activated.
      window.location.reload();
      return;
    }
    startApproved(stored);
  }
  function button(label, action, cls) {
    return '<button type="button" data-yolo-consent-action="' + action + '" class="' + cls + '">' + label + '</button>';
  }
  function bannerHtml() {
    return '<div class="yolo-consent-card" role="region" aria-label="' +
      words("Çerez tercihleri", "Cookie choices") + '">' +
      '<div class="yolo-consent-heading">' + words("Gizlilik tercihlerin", "Your privacy choices") + '</div>' +
      '<p>' + words(
        "Sitenin çalışması için gerekli depolamayı kullanıyoruz. Analitik, reklam ölçümü (Meta Pixel) ve canlı sohbet yalnızca izin verirsen etkinleşir.",
        "Essential storage keeps the site working. Analytics, advertising measurement (Meta Pixel) and live chat load only with your permission."
      ) + ' <a href="privacy.html">' + words("Gizlilik bilgileri", "Privacy details") + '</a></p>' +
      '<div class="yolo-consent-actions">' +
      button(words("Hepsini reddet", "Reject optional"), "reject", "yolo-cb secondary") +
      button(words("Tercihleri yönet", "Manage choices"), "manage", "yolo-cb secondary") +
      button(words("Tümünü kabul et", "Accept all"), "accept", "yolo-cb primary") +
      '</div></div>';
  }
  function prefsHtml() {
    var a = stored ? stored.analytics : false;
    var m = stored ? stored.marketing : false;
    var c = stored ? stored.chat : false;
    return '<div class="yolo-consent-card yolo-consent-preferences" role="dialog" aria-modal="true" aria-label="' +
      words("Çerez tercihleri", "Cookie preferences") + '">' +
      '<div class="yolo-consent-heading">' + words("Çerez tercihleri", "Cookie preferences") + '</div>' +
      '<p>' + words("Zorunlu site işlevleri her zaman açıktır. Diğerlerini ayrı ayrı seçebilirsin.", "Essential site features are always on. Other categories are optional.") + '</p>' +
      '<div class="yolo-consent-option"><span>' + words("Zorunlu", "Essential") +
      '<small>' + words("Tercihlerini hatırlama", "Remember your choices") + '</small></span><strong>' +
      words("Açık", "On") + '</strong></div>' +
      '<label class="yolo-consent-option"><span>' + words("Analitik", "Analytics") +
      '<small>Google Analytics, Microsoft Clarity</small></span><input id="yoloAnalytics" type="checkbox"' + (a ? " checked" : "") + '></label>' +
      '<label class="yolo-consent-option"><span>' + words("Reklam ölçümü", "Marketing") +
      '<small>Meta Pixel</small></span><input id="yoloMarketing" type="checkbox"' + (m ? " checked" : "") + '></label>' +
      '<label class="yolo-consent-option"><span>' + words("Canlı destek", "Live chat") +
      '<small>Tawk.to</small></span><input id="yoloChat" type="checkbox"' + (c ? " checked" : "") + '></label>' +
      '<div class="yolo-consent-actions">' +
      button(words("Hepsini reddet", "Reject optional"), "reject", "yolo-cb secondary") +
      button(words("Seçimlerimi kaydet", "Save choices"), "save", "yolo-cb primary") +
      '</div></div>';
  }
  function openPreferences() {
    root.hidden = false;
    root.innerHTML = prefsHtml();
    var focused = root.querySelector("#yoloAnalytics");
    if (focused) focused.focus();
  }
  function showBanner() {
    root.hidden = false;
    root.innerHTML = bannerHtml();
  }
  function addSettingsLink() {
    document.querySelectorAll(".site-footer .footer-mini").forEach(function (footer) {
      if (footer.querySelector("[data-yolo-cookie-settings]")) return;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "yolo-cookie-link";
      b.setAttribute("data-yolo-cookie-settings", "");
      b.innerHTML = '<span class="lang-tr">Çerez tercihleri</span><span class="lang-en">Cookie preferences</span>';
      footer.appendChild(b);
    });
  }
  function init() {
    root = document.createElement("div");
    root.id = "yolo-cookie-root";
    root.className = "yolo-cookie-root";
    root.hidden = true;
    document.body.appendChild(root);
    stored = getConsent();
    if (stored) startApproved(stored);
    else showBanner();
    addSettingsLink();

    document.addEventListener("click", function (event) {
      if (event.target.closest("[data-yolo-cookie-settings]")) {
        event.preventDefault();
        openPreferences();
        return;
      }
      var b = event.target.closest("[data-yolo-consent-action]");
      if (!b || !root.contains(b)) return;
      var action = b.getAttribute("data-yolo-consent-action");
      if (action === "accept") save(true, true, true);
      else if (action === "reject") save(false, false, false);
      else if (action === "manage") openPreferences();
      else if (action === "save") {
        save(
          !!root.querySelector("#yoloAnalytics:checked"),
          !!root.querySelector("#yoloMarketing:checked"),
          !!root.querySelector("#yoloChat:checked")
        );
      }
    });
    var langBtn = document.getElementById("langToggle");
    if (langBtn) langBtn.addEventListener("click", function () {
      window.setTimeout(function () {
        if (!root.hidden) {
          if (root.querySelector("#yoloAnalytics")) root.innerHTML = prefsHtml();
          else root.innerHTML = bannerHtml();
        }
      }, 0);
    });
  }
  window.yoloOpenCookiePreferences = function () {
    if (root) openPreferences();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();