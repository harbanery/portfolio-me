"use client";

import { useEffect } from "react";

/**
 * Scroll-reveal engine — the Tailwind-native replacement for the removed
 * AOS library (rekomendasi_feature.md 1.6). Markup keeps its `data-aos` /
 * `data-aos-delay` attributes; the global stylesheet holds the hidden
 * initial state and the site-wide 0.5s ease-in-out transition. This
 * component only watches `[data-aos]` elements with an IntersectionObserver
 * and flips them to `.aos-in` once they enter the viewport — each element
 * reveals exactly once.
 *
 * A MutationObserver picks up elements rendered after mount (filter
 * pagination, late route content) so registration does not depend on the
 * render order. `prefers-reduced-motion` needs no JavaScript here: the
 * stylesheet reveals everything immediately for those users.
 */
const ScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("aos-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0 },
    );

    /** Apply the `data-aos-delay` attribute as a CSS transition delay. */
    const register = (element: Element) => {
      const delay = Number(element.getAttribute("data-aos-delay") ?? "0");
      if (Number.isFinite(delay) && delay > 0) {
        (element as HTMLElement).style.transitionDelay = `${delay}ms`;
      }
      observer.observe(element);
    };

    const registerAll = (root: ParentNode) => {
      root.querySelectorAll?.("[data-aos]:not(.aos-in)").forEach(register);
    };

    registerAll(document);

    // Elements added after mount (show-more lists, late hydration)
    // register as they appear.
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (
            node.hasAttribute("data-aos") &&
            !node.classList.contains("aos-in")
          ) {
            register(node);
          }
          registerAll(node);
        });
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
};

export default ScrollReveal;
