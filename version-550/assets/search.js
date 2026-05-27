(function () {
  var input = document.getElementById('site-search');
  var button = document.getElementById('search-button');
  var results = document.getElementById('search-results');
  var status = document.getElementById('search-status');
  var data = window.MOVIE_SEARCH_DATA || [];

  function createCard(movie) {
    return [
      '<article class="movie-card">',
      '  <a class="poster-wrap" href="' + movie.href + '">',
      '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="play-float">▶</span>',
      '  </a>',
      '  <div class="card-body">',
      '    <h3><a href="' + movie.href + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p class="card-line">' + escapeHtml(movie.oneLine || '') + '</p>',
      '    <div class="card-meta">',
      '      <span>' + escapeHtml(movie.category || '') + '</span>',
      '      <span>' + escapeHtml(String(movie.year || '')) + '</span>',
      '    </div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function performSearch() {
    var keyword = (input.value || '').trim().toLowerCase();

    if (!keyword) {
      results.innerHTML = '';
      status.textContent = '请输入关键词开始搜索。';
      return;
    }

    var matches = data.filter(function (movie) {
      var haystack = [
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        movie.category,
        (movie.tags || []).join(' '),
        movie.oneLine
      ].join(' ').toLowerCase();

      return haystack.indexOf(keyword) !== -1;
    }).slice(0, 80);

    status.textContent = '找到 ' + matches.length + ' 条结果，最多显示 80 条。';
    results.innerHTML = matches.map(createCard).join('');
  }

  if (button) {
    button.addEventListener('click', performSearch);
  }

  if (input) {
    input.addEventListener('input', performSearch);
  }
})();
