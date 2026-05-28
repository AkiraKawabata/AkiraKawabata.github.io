/* ============================================================
   Editorial Grid — interactions
   Two motions only (§06):
     1. Scroll fade-in for top-level sections (once).
     2. Hover preview popover for publication cards.
   Everything degrades gracefully without JS and respects
   prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 06.2 Scroll fade-in ---------- */
  var reveals = document.querySelectorAll("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 06.1 Hover preview ---------- */
  var root = document.querySelector(".eg-root");
  var pubs = document.querySelectorAll(".eg-pub");
  if (!root || !pubs.length) return;

  var pop = document.createElement("div");
  pop.className = "eg-preview";
  pop.setAttribute("aria-hidden", "true");
  root.appendChild(pop);

  var timer = null;
  var current = null;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function build(card) {
    var venue = card.getAttribute("data-venue") || "";
    var year = card.getAttribute("data-year") || "";
    var tldr = card.getAttribute("data-tldr") || "";
    var tags = (card.getAttribute("data-tags") || "")
      .split("|")
      .filter(Boolean);

    var html =
      '<div class="eyebrow">Abstract — ' +
      esc(venue) + " " + esc(year) +
      "</div>" +
      '<div class="tldr">' + esc(tldr) + "</div>";
    if (tags.length) {
      html += '<div class="eg-tags">';
      tags.forEach(function (t) { html += "<span>" + esc(t) + "</span>"; });
      html += "</div>";
    }
    pop.innerHTML = html;
  }

  function position(card) {
    var r = card.getBoundingClientRect();
    var rr = root.getBoundingClientRect();
    var top = r.top - rr.top;
    var left = r.right - rr.left + 20;

    // Clamp so the popover never overflows the content column.
    var wrap = card.closest(".eg-wrap") || root;
    var wr = wrap.getBoundingClientRect();
    var maxLeft = wr.right - rr.left - pop.offsetWidth;
    if (left > maxLeft) left = maxLeft;
    if (left < 0) left = 0;

    pop.style.top = top + "px";
    pop.style.left = left + "px";
  }

  function show(card) {
    build(card);
    position(card);
    pop.classList.add("is-visible");
  }

  function hide() {
    pop.classList.remove("is-visible");
  }

  pubs.forEach(function (card) {
    card.addEventListener("pointerenter", function (e) {
      // Touch uses the inline focus fallback, not the popover.
      if (e.pointerType === "touch") return;
      current = card;
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (current === card) show(card);
      }, 120);
    });
    card.addEventListener("pointerleave", function () {
      current = null;
      clearTimeout(timer);
      hide();
    });
  });

  window.addEventListener(
    "scroll",
    function () {
      if (current || pop.classList.contains("is-visible")) {
        current = null;
        clearTimeout(timer);
        hide();
      }
    },
    { passive: true }
  );
})();
