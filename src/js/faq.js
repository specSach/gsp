(function () {
  function initFaqAccordion() {
    const faqSection = document.querySelector(".faq");

    if (!faqSection || faqSection.dataset.accordionReady === "true") {
      return;
    }

    const items = Array.from(faqSection.querySelectorAll(".faq__item"));
    if (items.length === 0) {
      return;
    }

    const mobileQuery = window.matchMedia("(max-width: 768px)");

    const setItemState = (item, isOpen) => {
      const trigger = item.querySelector(".faq__item-trigger");
      item.classList.toggle("faq__item--open", isOpen);

      if (trigger) {
        trigger.setAttribute("aria-expanded", String(isOpen));
      }
    };

    const applyDesktopState = () => {
      faqSection.classList.remove("faq--accordion");
      items.forEach((item) => {
        const trigger = item.querySelector(".faq__item-trigger");
        if (trigger) {
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    };

    const applyMobileState = () => {
      faqSection.classList.add("faq--accordion");

      const hasOpenItem = items.some((item) => item.classList.contains("faq__item--open"));
      if (!hasOpenItem && items[0]) {
        setItemState(items[0], true);
      }
    };

    items.forEach((item, index) => {
      const trigger = item.querySelector(".faq__item-trigger");
      const content = item.querySelector(".faq__item-content");

      if (!trigger || !content) {
        return;
      }

      const contentId = `faq-content-${index + 1}`;
      content.id = contentId;
      trigger.setAttribute("aria-controls", contentId);

      trigger.addEventListener("click", () => {
        if (!mobileQuery.matches) {
          return;
        }

        const isOpen = item.classList.contains("faq__item--open");
        setItemState(item, !isOpen);
      });
    });

    const syncLayout = () => {
      if (mobileQuery.matches) {
        applyMobileState();
      } else {
        applyDesktopState();
      }
    };

    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", syncLayout);
    } else {
      mobileQuery.addListener(syncLayout);
    }

    syncLayout();
    faqSection.dataset.accordionReady = "true";
  }

  window.initFaqAccordion = initFaqAccordion;
})();
