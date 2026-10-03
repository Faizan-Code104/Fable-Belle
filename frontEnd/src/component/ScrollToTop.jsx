import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    let observer;
    let timeoutId;

    const scrollToSection = () => {
      if (!hash) return false;

      let sectionId;

      try {
        sectionId = decodeURIComponent(hash.slice(1));
      } catch {
        sectionId = hash.slice(1);
      }

      const section = document.getElementById(sectionId);

      if (!section) return false;

      section.scrollIntoView({
        behavior: "instant",
        block: "start",
      });

      return true;
    };

    const frameId = window.requestAnimationFrame(() => {
      if (!hash) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant",
        });
        return;
      }

      if (scrollToSection()) return;

      observer = new MutationObserver(() => {
        if (scrollToSection()) {
          observer.disconnect();
          window.clearTimeout(timeoutId);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      timeoutId = window.setTimeout(() => {
        observer.disconnect();
      }, 5000);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
      observer?.disconnect();
    };
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;