import { H as Hls } from './hls-vendor-dru42stk.js';

const players = document.querySelectorAll('[data-player]');

players.forEach(function (box) {
  const video = box.querySelector('video');
  const button = box.querySelector('[data-video-start]');
  const message = box.querySelector('[data-video-message]');
  const source = box.dataset.videoSrc;
  let loaded = false;
  let hlsInstance = null;

  const setMessage = function (text) {
    if (message) {
      message.textContent = text || '';
    }
  };

  const loadVideo = function () {
    if (!video || loaded) {
      return;
    }

    if (!source) {
      setMessage('当前影片未检测到播放源。');
      return;
    }

    if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        lowLatencyMode: false,
        enableWorker: true
      });

      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
        loaded = true;
        setMessage('播放源已载入。');
        video.play().catch(function () {
          setMessage('浏览器拦截了自动播放，请再次点击播放按钮。');
        });
      });
      hlsInstance.on(Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hlsInstance.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hlsInstance.recoverMediaError();
          } else {
            setMessage('播放源暂时无法载入，请稍后重试。');
            hlsInstance.destroy();
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      loaded = true;
      video.play().catch(function () {
        setMessage('浏览器拦截了自动播放，请再次点击播放按钮。');
      });
    } else {
      setMessage('当前浏览器不支持 HLS 播放。');
    }
  };

  if (button) {
    button.addEventListener('click', function () {
      box.classList.add('is-playing');
      loadVideo();
    });
  }

  if (video) {
    video.addEventListener('play', function () {
      box.classList.add('is-playing');
    });
    video.addEventListener('pause', function () {
      setMessage('');
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
});
