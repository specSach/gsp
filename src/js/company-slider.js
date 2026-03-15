(function () {
  function initCompanyMarquee() {
    const companySection = document.querySelector(".company");
    if (!companySection || companySection.dataset.marqueeReady === "true") {
      return;
    }

    const slider = companySection.querySelector(".company__slider");
    const rows = Array.from(companySection.querySelectorAll(".company__list"));
    if (!slider || rows.length < 2) {
      return;
    }

    companySection.dataset.marqueeReady = "true";

    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const rowConfigs = rows.map((row, index) => ({
      row,
      originalMarkup: row.innerHTML,
      direction: index === 0 ? 1 : -1,
      speed: index === 0 ? 42 : 38,
      singleWidth: 0,
      offset: 0,
      dragging: false,
      pointerId: null,
      startX: 0,
      startOffset: 0,
      pauseUntil: 0,
    }));

    let enabled = false;
    let rafId = null;
    let lastTime = 0;

    const normalizeOffset = (state) => {
      if (!state.singleWidth) {
        return;
      }

      while (state.offset <= -state.singleWidth) {
        state.offset += state.singleWidth;
      }

      while (state.offset > 0) {
        state.offset -= state.singleWidth;
      }
    };

    const renderState = (state) => {
      state.row.style.transform = `translate3d(${state.offset.toFixed(3)}px, 0, 0)`;
    };

    const setupMobileRows = () => {
      rowConfigs.forEach((state) => {
        state.row.innerHTML = state.originalMarkup + state.originalMarkup;
      });
    };

    const restoreDesktopRows = () => {
      rowConfigs.forEach((state) => {
        state.row.innerHTML = state.originalMarkup;
        state.row.style.transform = "";
        state.row.classList.remove("is-dragging");
      });
    };

    const recalculate = () => {
      if (!enabled) {
        return;
      }

      rowConfigs.forEach((state) => {
        state.singleWidth = state.row.scrollWidth / 2;
        if (!state.singleWidth) {
          return;
        }

        state.offset = state.direction > 0 ? -state.singleWidth : 0;
        renderState(state);
      });
    };

    const startAnimation = () => {
      if (rafId !== null) {
        return;
      }

      const tick = (timestamp) => {
        if (!enabled) {
          rafId = null;
          return;
        }

        if (!lastTime) {
          lastTime = timestamp;
        }

        const delta = Math.min((timestamp - lastTime) / 1000, 0.05);
        lastTime = timestamp;

        rowConfigs.forEach((state) => {
          if (!state.singleWidth || state.dragging || timestamp < state.pauseUntil) {
            return;
          }

          state.offset += state.direction * state.speed * delta;
          normalizeOffset(state);
          renderState(state);
        });

        rafId = window.requestAnimationFrame(tick);
      };

      rafId = window.requestAnimationFrame(tick);
    };

    const stopAnimation = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }

      lastTime = 0;
    };

    const enableMobile = () => {
      if (enabled) {
        recalculate();
        return;
      }

      enabled = true;
      setupMobileRows();
      recalculate();
      startAnimation();
    };

    const disableMobile = () => {
      if (!enabled) {
        return;
      }

      enabled = false;
      stopAnimation();
      restoreDesktopRows();
    };

    const syncMode = () => {
      if (mobileQuery.matches) {
        enableMobile();
      } else {
        disableMobile();
      }
    };

    rowConfigs.forEach((state) => {
      const onPointerDown = (event) => {
        if (!enabled) {
          return;
        }

        state.dragging = true;
        state.pointerId = event.pointerId;
        state.startX = event.clientX;
        state.startOffset = state.offset;
        state.pauseUntil = performance.now() + 1400;
        state.row.classList.add("is-dragging");

        if (typeof state.row.setPointerCapture === "function") {
          state.row.setPointerCapture(event.pointerId);
        }
      };

      const onPointerMove = (event) => {
        if (!enabled || !state.dragging || event.pointerId !== state.pointerId) {
          return;
        }

        const deltaX = event.clientX - state.startX;
        state.offset = state.startOffset + deltaX;
        normalizeOffset(state);
        renderState(state);
      };

      const finishDrag = (event) => {
        if (!state.dragging || event.pointerId !== state.pointerId) {
          return;
        }

        state.dragging = false;
        state.pointerId = null;
        state.pauseUntil = performance.now() + 1700;
        state.row.classList.remove("is-dragging");

        if (typeof state.row.releasePointerCapture === "function") {
          state.row.releasePointerCapture(event.pointerId);
        }
      };

      const onWheel = (event) => {
        if (!enabled) {
          return;
        }

        const horizontalIntent = Math.abs(event.deltaX) >= Math.abs(event.deltaY);
        if (!horizontalIntent || !event.deltaX) {
          return;
        }

        event.preventDefault();
        state.offset -= event.deltaX * 0.35;
        normalizeOffset(state);
        renderState(state);
        state.pauseUntil = performance.now() + 1200;
      };

      const onDragStart = (event) => event.preventDefault();

      state.row.addEventListener("pointerdown", onPointerDown);
      state.row.addEventListener("pointermove", onPointerMove);
      state.row.addEventListener("pointerup", finishDrag);
      state.row.addEventListener("pointercancel", finishDrag);
      state.row.addEventListener("wheel", onWheel, { passive: false });
      state.row.addEventListener("dragstart", onDragStart);
    });

    window.addEventListener("resize", recalculate, { passive: true });
    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", syncMode);
    } else {
      mobileQuery.addListener(syncMode);
    }

    syncMode();
  }

  window.initCompanyMarquee = initCompanyMarquee;
})();
