(function () {
  var video = document.getElementById('movie-player');
  var startButton = document.querySelector('[data-player-start]');
  var message = document.querySelector('[data-player-message]');

  if (!video || !startButton) {
    return;
  }

  var initialized = false;

  function setMessage(text) {
    if (message) {
      message.textContent = text;
    }
  }

  function initializePlayer() {
    if (initialized) {
      video.play().catch(function () {});
      return;
    }

    var source = video.getAttribute('data-src');

    if (!source) {
      setMessage('当前影片暂未配置播放源。');
      return;
    }

    initialized = true;
    startButton.classList.add('hidden');
    setMessage('正在加载播放源，请稍候。');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.play().catch(function () {
        setMessage('浏览器已加载播放源，请点击播放器上的播放按钮。');
      });
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });

      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        setMessage('播放源加载完成。');
        video.play().catch(function () {
          setMessage('播放源加载完成，请点击播放器上的播放按钮。');
        });
      });
      hls.on(window.Hls.Events.ERROR, function () {
        setMessage('播放源加载遇到网络或格式问题，可刷新页面后重试。');
      });
      return;
    }

    setMessage('当前浏览器不支持 HLS 播放，请使用 Chrome、Edge 或 Safari。');
  }

  startButton.addEventListener('click', initializePlayer);
})();
