document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");

  if (typeof window.initBurgerMenu === "function") {
    window.initBurgerMenu();
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
