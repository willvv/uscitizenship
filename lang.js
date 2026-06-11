// ── SHARED LANGUAGE HANDLING ──
// Single source of truth for the EN/ES toggle across every page.
//
// Language is resolved from the ?lang= URL parameter first (so the choice
// carries over from prepmundo.com, a separate origin that can't share
// localStorage), then from localStorage, then defaults to English. The
// resolved value is persisted so it sticks across in-site navigation.
//
// Pages with dynamic content (rendered lists, placeholders, etc.) register a
// window.onLangApply() callback; it runs on initial load and on every toggle.
var lang = (function () {
  try {
    var urlLang = new URLSearchParams(window.location.search).get('lang');
    if (urlLang === 'en' || urlLang === 'es') {
      localStorage.setItem('usc-lang', urlLang);
      return urlLang;
    }
    return localStorage.getItem('usc-lang') || 'en';
  } catch (e) { return 'en'; }
})();

function applyLang() {
  document.querySelectorAll('[data-en]').forEach(function (el) {
    var txt = el.getAttribute('data-' + lang);
    if (txt) el.innerHTML = txt;
  });
  if (typeof window.onLangApply === 'function') window.onLangApply();
}

function setLang(l) {
  lang = l;
  syncLangButtons();
  document.documentElement.lang = l;
  try { localStorage.setItem('usc-lang', l); } catch (e) {}
  applyLang();
}

function syncLangButtons() {
  var btnEn = document.getElementById('btn-en');
  var btnEs = document.getElementById('btn-es');
  if (btnEn) btnEn.classList.toggle('active', lang === 'en');
  if (btnEs) btnEs.classList.toggle('active', lang === 'es');
}

// Applies the resolved language on page load. Call this once, after the
// page's render functions and any onLangApply hook have been defined.
function initLang() {
  syncLangButtons();
  document.documentElement.lang = lang;
  applyLang();
}
