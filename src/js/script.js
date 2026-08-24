/**
 * ==========================================================================
 * OVERLOAD - GYM & PROGRESS TRACKER (MAIN SCRIPT)
 * ==========================================================================
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initTheme();
  initAutoHideNavbar();
  initCounters();
  initModalHashRouting();
});

/* --------------------------------------------------------------------------
   01. PRELOADER HANDLING
   -------------------------------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById("page-preloader");
  if (preloader) {
    preloader.style.opacity = "0";
    preloader.style.visibility = "hidden";
    setTimeout(() => preloader.remove(), 350);
  }
}

/* --------------------------------------------------------------------------
   02. THEME HANDLING (DARK / LIGHT SYNC)
   -------------------------------------------------------------------------- */
function initTheme() {
  const html = document.documentElement;
  const themeToggleBtn = document.getElementById("theme-toggle");

  function updateMetaTheme(theme) {
    const color = theme === "dark" ? "#0b0f19" : "#ffffff";
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.setAttribute("content", color);
    });
  }

  // Initialer Theme-Check
  const currentTheme = html.getAttribute("data-theme") || "dark";
  updateMetaTheme(currentTheme);

  // Manuelles Umschalten per Button (falls vorhanden)
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const activeTheme = html.getAttribute("data-theme");
      const newTheme = activeTheme === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", newTheme);
      html.style.colorScheme = newTheme;
      localStorage.setItem("theme", newTheme);
      updateMetaTheme(newTheme);
    });
  }

  // Reagiere auf System-Änderungen
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      const systemTheme = e.matches ? "dark" : "light";
      html.setAttribute("data-theme", systemTheme);
      html.style.colorScheme = systemTheme;
      updateMetaTheme(systemTheme);
    }
  });
}

/* --------------------------------------------------------------------------
   03. AUTO-HIDE NAVBAR (PERFORMANCE-OPTIMIERT)
   -------------------------------------------------------------------------- */
function initAutoHideNavbar() {
  const nav = document.querySelector(".nav-container");
  if (!nav) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > 80 && currentScrollY > lastScrollY) {
            nav.classList.add("nav-hidden");
          } else {
            nav.classList.remove("nav-hidden");
          }
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
}

/* --------------------------------------------------------------------------
   04. STATISTIK-COUNTER ANIMATION
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;

  const animate = (counter) => {
    if (counter.dataset.animated === "true") return;
    counter.dataset.animated = "true";

    const target = parseFloat(counter.getAttribute("data-target")) || 0;
    if (target === 0) {
      counter.innerText = "0";
      return;
    }

    const duration = 1400;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // Cubic Ease-Out
      counter.innerText = Math.floor(ease * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.innerText = target;
      }
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  counters.forEach((c) => observer.observe(c));
}

/* --------------------------------------------------------------------------
   05. MODAL HASH ROUTING (DEEP LINKING)
   -------------------------------------------------------------------------- */
function initModalHashRouting() {
  const checkHash = () => {
    const hash = window.location.hash.replace("#", "").toLowerCase().trim();
    if (!hash) return;

    const modal = document.getElementById(`modal-${hash}`);
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  };

  window.addEventListener("hashchange", checkHash);
  checkHash();
}