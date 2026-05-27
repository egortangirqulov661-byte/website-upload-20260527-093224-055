(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const input = form.querySelector('input[name="q"]');
      const value = input ? input.value.trim() : '';
      if (!value) {
        return;
      }
      const action = form.getAttribute('action') || 'search.html';
      window.location.href = action + '?q=' + encodeURIComponent(value);
    });
  });

  document.querySelectorAll('img').forEach(function (image) {
    const hide = function () {
      image.classList.add('image-hidden');
    };
    image.addEventListener('error', hide);
    if (image.complete && image.naturalWidth === 0) {
      hide();
    }
  });

  const hero = document.querySelector('[data-hero-slider]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    let current = 0;

    const show = function (index) {
      current = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const index = Number(dot.getAttribute('data-hero-dot')) || 0;
        show(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show((current + 1) % slides.length);
      }, 5200);
    }
  }

  const filterRoot = document.querySelector('[data-filter-root]');
  if (filterRoot) {
    const queryInput = filterRoot.querySelector('[data-filter-query]');
    const categorySelect = filterRoot.querySelector('[data-filter-category]');
    const yearSelect = filterRoot.querySelector('[data-filter-year]');
    const regionSelect = filterRoot.querySelector('[data-filter-region]');
    const cards = Array.from(filterRoot.querySelectorAll('[data-title]'));
    const state = filterRoot.querySelector('[data-result-state]');
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || '';

    if (queryInput && query) {
      queryInput.value = query;
    }

    const normalize = function (value) {
      return String(value || '').toLowerCase().trim();
    };

    const apply = function () {
      const text = normalize(queryInput ? queryInput.value : '');
      const category = normalize(categorySelect ? categorySelect.value : '');
      const year = normalize(yearSelect ? yearSelect.value : '');
      const region = normalize(regionSelect ? regionSelect.value : '');
      let visible = 0;

      cards.forEach(function (card) {
        const haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-region'),
          card.getAttribute('data-category'),
          card.getAttribute('data-year')
        ].join(' '));
        const matchText = !text || haystack.indexOf(text) !== -1;
        const matchCategory = !category || normalize(card.getAttribute('data-category')) === category;
        const matchYear = !year || normalize(card.getAttribute('data-year')) === year;
        const matchRegion = !region || normalize(card.getAttribute('data-region')) === region;
        const matched = matchText && matchCategory && matchYear && matchRegion;
        card.classList.toggle('is-filter-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (state) {
        state.classList.toggle('is-visible', visible === 0);
      }
    };

    [queryInput, categorySelect, yearSelect, regionSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });

    apply();
  }
})();
