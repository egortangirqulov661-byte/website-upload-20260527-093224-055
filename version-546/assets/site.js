(function () {
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mainNav = document.querySelector('[data-main-nav]');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      mainNav.classList.toggle('open');
    });
  }

  const hero = document.querySelector('[data-hero-slider]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const tabs = Array.from(hero.querySelectorAll('[data-hero-tab]'));
    let current = 0;

    const showSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      tabs.forEach(function (tab, tabIndex) {
        tab.classList.toggle('active', tabIndex === current);
      });
    };

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const index = Number(tab.dataset.heroTab || 0);
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  const localSearch = document.querySelector('[data-local-search]');
  const globalSearch = document.querySelector('[data-global-search]');
  const resultCount = document.querySelector('[data-result-count]');
  const clearSearch = document.querySelector('[data-clear-search]');
  const cards = Array.from(document.querySelectorAll('.searchable-card'));

  const normalize = function (value) {
    return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
  };

  const filterCards = function (query) {
    const q = normalize(query);
    let visible = 0;

    cards.forEach(function (card) {
      const text = normalize((card.dataset.title || '') + ' ' + (card.dataset.meta || '') + ' ' + card.textContent);
      const matched = !q || text.includes(q);
      card.classList.toggle('hidden-by-search', !matched);
      if (matched) {
        visible += 1;
      }
    });

    if (resultCount) {
      resultCount.textContent = visible + ' 部';
    }
  };

  if (localSearch) {
    localSearch.addEventListener('input', function () {
      filterCards(localSearch.value);
    });
  }

  if (globalSearch) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || '';
    if (query) {
      globalSearch.value = query;
      filterCards(query);
    }

    globalSearch.addEventListener('input', function () {
      filterCards(globalSearch.value);
    });
  }

  if (clearSearch && globalSearch) {
    clearSearch.addEventListener('click', function () {
      globalSearch.value = '';
      filterCards('');
      history.replaceState(null, '', window.location.pathname);
    });
  }
})();
