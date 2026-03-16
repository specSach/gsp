document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");

  if (typeof window.initInfoSlider === "function") {
    window.initInfoSlider();
  }

  if (typeof window.initFaqAccordion === "function") {
    window.initFaqAccordion();
  }

  if (typeof window.initCompanyMarquee === "function") {
    window.initCompanyMarquee();
  }

  if (!header) {
    return;
  }

  const updateHeaderScrollState = () => {
    if (window.scrollY > 8) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  };

  updateHeaderScrollState();
  window.addEventListener("scroll", updateHeaderScrollState, { passive: true });
});
