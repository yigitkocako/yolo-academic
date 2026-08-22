// Tawk.to chat widget — delayed slightly on mobile and hidden while mobile menu is open.
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function(){
  function injectTawk(){
    if (window.__yoloTawkLoaded) return;
    window.__yoloTawkLoaded = true;
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/69dfcdddd2ad971c3a3293db/1jm93oaph';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
  }

  var delay = window.matchMedia && window.matchMedia('(max-width: 720px)').matches ? 2200 : 900;
  window.setTimeout(injectTawk, delay);

  function toggleTawkForMenu(){
    var hidden = document.body.classList.contains('nav-open');
    Array.prototype.slice.call(document.querySelectorAll('iframe')).forEach(function(frame){
      var src = String(frame.getAttribute('src') || '').toLowerCase();
      var title = String(frame.getAttribute('title') || '').toLowerCase();
      if (src.indexOf('tawk.to') !== -1 || title.indexOf('chat') !== -1 || title.indexOf('tawk') !== -1) {
        frame.style.setProperty('display', hidden ? 'none' : '', 'important');
      }
    });
  }
  document.addEventListener('DOMContentLoaded', function(){
    var obs = new MutationObserver(toggleTawkForMenu);
    obs.observe(document.body, { attributes:true, attributeFilter:['class'], childList:true, subtree:true });
    toggleTawkForMenu();
  });
})();
