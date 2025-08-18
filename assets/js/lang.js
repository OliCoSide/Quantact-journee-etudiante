(function () {
  const KEY = "site.lang";
  function paramLang() {
    const m = location.search.match(/[?&]lang=(fr|en)\b/i);
    return m ? m[1].toLowerCase() : null;
  }
  function curLang() { return paramLang() || localStorage.getItem(KEY) || "fr"; }

  function setLang(lang, pushUrl = true) {
    if (lang !== "fr" && lang !== "en") lang = "fr";
    localStorage.setItem(KEY, lang);

    // Toggle button shows opposite
    const t = document.getElementById("langToggle");
    if (t) t.textContent = lang === "fr" ? "EN" : "FR";

    // Keep ?lang= on internal links
    const q = new URLSearchParams(location.search);
    q.set("lang", lang);
    document.querySelectorAll('a[href^="/"],a[href^="./"],a[href^="../"]').forEach(a => {
      try {
        const u = new URL(a.getAttribute("href"), location.origin);
        u.search = q.toString();
        a.setAttribute("href", u.pathname + u.search + u.hash);
      } catch {}
    });

    // Swap any elements carrying bilingual text (optional, if you use data-fr/en)
    document.querySelectorAll("[data-fr][data-en]").forEach(el => {
      el.textContent = el.getAttribute(`data-${lang}`);
    });

    if (pushUrl) {
      const u = new URL(location.href);
      u.searchParams.set("lang", lang);
      history.replaceState(null, "", u.toString());
    }
  }

  document.addEventListener("click", e => {
    if (e.target && e.target.id === "langToggle") {
      e.preventDefault();
      setLang(curLang() === "fr" ? "en" : "fr");
    }
  });

  document.addEventListener("DOMContentLoaded", () => setLang(curLang(), false));
})();
