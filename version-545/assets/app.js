(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    initMenu();
    initHero();
    initPlayers();
    initSearch();
  });

  function initMenu() {
    var button = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".nav-menu");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      var expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      menu.classList.toggle("open", !expanded);
    });
  }

  function initHero() {
    var root = document.querySelector("[data-hero-slider]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
    var bgs = Array.prototype.slice.call(root.querySelectorAll(".hero-bg"));
    var dots = Array.prototype.slice.call(root.querySelectorAll(".hero-dot"));
    var index = 0;
    var timer = null;
    function show(next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      bgs.forEach(function (bg, i) {
        bg.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }
    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        start();
      });
    });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function initPlayers() {
    var boxes = document.querySelectorAll("[data-player]");
    boxes.forEach(function (box) {
      var video = box.querySelector("video");
      var button = box.querySelector(".player-cover");
      if (!video || !button) {
        return;
      }
      var loaded = false;
      function attach() {
        if (loaded) {
          return;
        }
        var url = video.getAttribute("data-playback");
        if (!url) {
          return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(url);
          hls.attachMedia(video);
          video.hlsItem = hls;
        } else {
          video.src = url;
        }
        video.setAttribute("controls", "controls");
        loaded = true;
      }
      function play() {
        attach();
        box.classList.add("is-playing");
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {});
        }
      }
      button.addEventListener("click", play);
      video.addEventListener("click", function () {
        if (!loaded || video.paused) {
          play();
        }
      });
    });
  }

  function initSearch() {
    var input = document.getElementById("site-search");
    var select = document.getElementById("category-filter");
    var resultBox = document.getElementById("search-results");
    var heading = document.getElementById("search-heading");
    if (!input || !select || !resultBox || !window.searchItems) {
      return;
    }
    function safe(text) {
      return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }
    function renderCard(item) {
      return [
        '<a class="movie-card" href="' + safe(item.url) + '">',
        '  <figure class="movie-thumb">',
        '    <img src="' + safe(item.cover) + '" alt="' + safe(item.title) + '" loading="lazy">',
        '    <span class="score-badge">' + safe(item.score) + '</span>',
        '    <span class="type-badge">' + safe(item.type) + '</span>',
        '  </figure>',
        '  <div class="movie-card-body">',
        '    <h3>' + safe(item.title) + '</h3>',
        '    <p>' + safe(item.text) + '</p>',
        '    <div class="movie-meta">',
        '      <span>' + safe(item.year) + '</span>',
        '      <span>' + safe(item.region) + '</span>',
        '      <span>' + safe(item.category) + '</span>',
        '    </div>',
        '  </div>',
        '</a>'
      ].join("");
    }
    function run() {
      var q = input.value.trim().toLowerCase();
      var category = select.value;
      var items = window.searchItems.filter(function (item) {
        var haystack = [item.title, item.region, item.category, item.type, item.year, item.genre, item.text, item.tags].join(" ").toLowerCase();
        var okQuery = !q || haystack.indexOf(q) !== -1;
        var okCategory = !category || item.category === category;
        return okQuery && okCategory;
      }).slice(0, 120);
      heading.textContent = q || category ? "筛选结果" : "推荐内容";
      if (!items.length) {
        resultBox.innerHTML = '<div class="text-card"><h2>没有找到匹配内容</h2><p>换一个标题、地区、年份或题材继续搜索。</p></div>';
        return;
      }
      resultBox.innerHTML = items.map(renderCard).join("");
    }
    input.addEventListener("input", run);
    select.addEventListener("change", run);
  }
})();
