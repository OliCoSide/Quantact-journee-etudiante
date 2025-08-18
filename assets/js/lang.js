(function () {
  const KEY = "site.lang";

  function paramLang() {
    const m = location.search.match(/[?&]lang=(fr|en)\b/i);
    return m ? m[1].toLowerCase() : null;
  }

  function curLang() {
    return paramLang() || localStorage.getItem(KEY) || "fr";
  }

  function setLang(lang, pushUrl = true) {
    if (lang !== "fr" && lang !== "en") lang = "fr";
    localStorage.setItem(KEY, lang);

    // <html lang="…">
    try {
      document.documentElement.setAttribute("lang", lang);
    } catch (_) {}

    // Toggle button shows the OTHER language
    const t = document.getElementById("langToggle");
    if (t) t.textContent = lang === "fr" ? "EN" : "FR";

    // Keep ?lang= on internal links, skip toggle and pure hashes
    const q = new URLSearchParams(location.search);
    q.set("lang", lang);
    document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]').forEach(a => {
      if (a.id === "langToggle") return;
      const h = a.getAttribute("href");
      if (!h || h === "#" || h.startsWith("#")) return;
      try {
        const u = new URL(h, location.origin);
        // preserve path/hash, override query with current ?lang
        u.search = q.toString();
        a.setAttribute("href", u.pathname + u.search + u.hash);
      } catch (_) {}
    });

    // Swap bilingual text nodes
    document.querySelectorAll("[data-fr][data-en]").forEach(el => {
      const v = el.getAttribute(`data-${lang}`);
      if (v != null) el.textContent = v;
    });

    // Swap bilingual src (e.g., logos)
    document.querySelectorAll("[data-src-fr][data-src-en]").forEach(el => {
      const v = el.getAttribute(`data-src-${lang}`);
      if (v) el.setAttribute("src", v);
    });

    // Optional: swap placeholders if provided
    document.querySelectorAll("[data-ph-fr][data-ph-en]").forEach(el => {
      const v = el.getAttribute(`data-ph-${lang}`);
      if (v != null) el.setAttribute("placeholder", v);
    });

    // Reflect current lang in the URL (without reloading)
    if (pushUrl) {
      const u = new URL(location.href);
      u.searchParams.set("lang", lang);
      history.replaceState(null, "", u.toString());
    }
  }

  // Click handler for the pill button
  document.addEventListener("click", e => {
    const t = e.target;
    if (t && t.id === "langToggle") {
      e.preventDefault();
      setLang(curLang() === "fr" ? "en" : "fr");
    }
  });

  // Initialize on load
  document.addEventListener("DOMContentLoaded", () => setLang(curLang(), false));
})();
