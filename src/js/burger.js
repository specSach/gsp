(function () {
  function initBurgerMenu() {
    const header = document.querySelector(".header");
    const burgerButton = document.querySelector(".header__burger");

    if (!header || !burgerButton) {
      return;
    }

    const toggleMenu = () => {
      const isOpen = header.classList.toggle("header--menu-open");
      burgerButton.setAttribute("aria-expanded", String(isOpen));
    };

    const closeMenu = () => {
      header.classList.remove("header--menu-open");
      burgerButton.setAttribute("aria-expanded", "false");
    };

    burgerButton.addEventListener("click", toggleMenu);

    document.addEventListener("click", (event) => {
      if (!header.contains(event.target)) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }

  window.initBurgerMenu = initBurgerMenu;
})();
