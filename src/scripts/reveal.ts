/** Arms `.reveal` elements and shows them as they scroll into view. */
function initReveal() {
  const nodes = document.querySelectorAll<HTMLElement>(".reveal[data-armed='false']");
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (!nodes.length || reduced || typeof IntersectionObserver === "undefined") return;

  const show = (el: HTMLElement) => requestAnimationFrame(() => (el.dataset.shown = "true"));
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        show(entry.target as HTMLElement);
        io.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.06 },
  );

  for (const el of nodes) {
    el.dataset.armed = "true";
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) show(el);
    else io.observe(el);
  }
}

initReveal();
