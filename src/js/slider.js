(function () {
  function initInfoSlider() {
    const infoSection = document.querySelector(".info");
    if (!infoSection || infoSection.dataset.sliderReady === "true") {
      return;
    }

    const sliderViewport = infoSection.querySelector(".info__slider");
    const sliderTrack = infoSection.querySelector(".info__container");
    const prevButton = infoSection.querySelector(".info__control--prev");
    const nextButton = infoSection.querySelector(".info__control--next");

    if (!sliderViewport || !sliderTrack || !prevButton || !nextButton) {
      return;
    }

    const slides = Array.from(sliderTrack.querySelectorAll(".info__item"));
    if (slides.length === 0) {
      return;
    }

    infoSection.dataset.sliderReady = "true";

    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const swipeThreshold = 45;
    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isTouching = false;

    const clampIndex = (value) => Math.max(0, Math.min(value, slides.length - 1));

    const setButtonsState = () => {
      prevButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex === slides.length - 1;
    };

    const setTransform = (animate = true) => {
      if (!mobileQuery.matches) {
        sliderTrack.style.transform = "";
        sliderTrack.style.transition = "";
        prevButton.disabled = false;
        nextButton.disabled = false;
        return;
      }

      const offset = -currentIndex * sliderViewport.clientWidth;
      sliderTrack.style.transition = animate ? "transform 0.35s ease" : "none";
      sliderTrack.style.transform = `translate3d(${offset}px, 0, 0)`;

      if (!animate) {
        requestAnimationFrame(() => {
          sliderTrack.style.transition = "transform 0.35s ease";
        });
      }

      setButtonsState();
    };

    const goToSlide = (nextIndex) => {
      const safeIndex = clampIndex(nextIndex);
      if (safeIndex === currentIndex) {
        setTransform(true);
        return;
      }

      currentIndex = safeIndex;
      setTransform(true);
    };

    const onPrev = () => goToSlide(currentIndex - 1);
    const onNext = () => goToSlide(currentIndex + 1);

    const onTouchStart = (event) => {
      if (!mobileQuery.matches) {
        return;
      }

      isTouching = true;
      startX = event.touches[0].clientX;
      currentX = startX;
      sliderTrack.style.transition = "none";
    };

    const onTouchMove = (event) => {
      if (!isTouching || !mobileQuery.matches) {
        return;
      }

      currentX = event.touches[0].clientX;
      const deltaX = currentX - startX;
      const baseOffset = -currentIndex * sliderViewport.clientWidth;
      sliderTrack.style.transform = `translate3d(${baseOffset + deltaX}px, 0, 0)`;
    };

    const onTouchEnd = () => {
      if (!isTouching || !mobileQuery.matches) {
        return;
      }

      isTouching = false;
      const deltaX = currentX - startX;

      if (Math.abs(deltaX) > swipeThreshold) {
        goToSlide(deltaX < 0 ? currentIndex + 1 : currentIndex - 1);
      } else {
        setTransform(true);
      }
    };

    const onResize = () => {
      currentIndex = clampIndex(currentIndex);
      setTransform(false);
    };

    prevButton.addEventListener("click", onPrev);
    nextButton.addEventListener("click", onNext);

    sliderViewport.addEventListener("touchstart", onTouchStart, { passive: true });
    sliderViewport.addEventListener("touchmove", onTouchMove, { passive: true });
    sliderViewport.addEventListener("touchend", onTouchEnd);
    sliderViewport.addEventListener("touchcancel", onTouchEnd);

    window.addEventListener("resize", onResize);
    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", onResize);
    } else {
      mobileQuery.addListener(onResize);
    }

    setTransform(false);
  }

  window.initInfoSlider = initInfoSlider;
})();
