import { H as Hls } from './hls-vendor-dru42stk.js';

(function () {
  document.querySelectorAll('[data-player]').forEach(function (player) {
    const video = player.querySelector('video');
    const overlay = player.querySelector('[data-play-overlay]');
    const streamUrl = player.getAttribute('data-hls');
    let ready = false;
    let hls = null;

    const prepare = function () {
      if (ready || !video || !streamUrl) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (Hls && Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }

      ready = true;
    };

    const start = function () {
      prepare();
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      const playback = video.play();
      if (playback && typeof playback.catch === 'function') {
        playback.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    };

    if (overlay) {
      overlay.addEventListener('click', start);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!ready || video.paused) {
          start();
        } else {
          video.pause();
        }
      });
      video.addEventListener('play', function () {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      });
      window.addEventListener('beforeunload', function () {
        if (hls) {
          hls.destroy();
        }
      });
    }
  });
})();
