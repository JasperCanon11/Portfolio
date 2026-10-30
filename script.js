(() => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const progressLine = document.querySelector(".progress-line");
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  // 1. Scroll progress indicator
  let scrollTicking = false;

  function updateScrollProgress() {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollable > 0
      ? (window.scrollY / scrollable) * 100
      : 0;

    progressLine.style.width = `${progress}%`;
    scrollTicking = false;
  }

   window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateScrollProgress);
      scrollTicking = true;
    }
  }, { passive: true });

  updateScrollProgress();

  // 2. Reveal sections when they enter the viewport
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealItems.forEach((item, index) => {
      item.style.transitionDelay =
        `${Math.min(index % 4, 3) * 70}ms`;

      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });
  }

   // 3. Custom cursor for desktop
  if (
    cursorDot &&
    cursorRing &&
    window.matchMedia("(pointer: fine)").matches &&
    !reduceMotion
  ) {
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;

    window.addEventListener("pointermove", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      cursorDot.style.left = `${pointerX}px`;
      cursorDot.style.top = `${pointerY}px`;
    }, { passive: true });

    function animateCursor() {
      ringX += (pointerX - ringX) * 0.16;
      ringY += (pointerY - ringY) * 0.16;

      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;

      window.requestAnimationFrame(animateCursor);
    }

    animateCursor();

    document.querySelectorAll(
      "a, button, .skill-tags span, .project-card"
    ).forEach((element) => {
      element.addEventListener("pointerenter", () => {
        cursorRing.classList.add("is-hover");
      });

      element.addEventListener("pointerleave", () => {
        cursorRing.classList.remove("is-hover");
      });
    });
  }

  // 4. Mobile navigation
  function closeMenu() {
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("menu-open");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      nav.classList.add("is-open");
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Close navigation");
      document.body.classList.add("menu-open");
    }
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });

  // 5. Subtle pointer parallax on the hero grid
  const hero = document.querySelector(".hero");
  const heroGrid = document.querySelector(".hero-grid");

  if (
    hero &&
    heroGrid &&
    window.matchMedia("(pointer: fine)").matches &&
    !reduceMotion
  ) {
    hero.addEventListener("pointermove", (event) => {
      const bounds = hero.getBoundingClientRect();

      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      heroGrid.style.transform =
        `translate(${x * -12}px, ${y * -12}px)`;
    });

    hero.addEventListener("pointerleave", () => {
      heroGrid.style.transform = "";
    });
  }

   // 6. Automatically update the copyright year
  const yearElement = document.querySelector("#year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
})();
  


