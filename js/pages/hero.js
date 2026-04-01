
/* ===========================
   HERO SLIDER (solo index)
=========================== */
(function () {

  const slider = document.getElementById('heroSlider');
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('.slide'));
  if (!slides.length) return;

  const intervalMs = 6500;
  const SEEK_F = 0.06;
  const XFADE = 350;

  let current = slides.findIndex(s => s.classList.contains('active'));
  if (current === -1) current = 0;

  let timer;

  function whenReady(video, cb) {
    if (!video) return;
    if (video.readyState >= 2) cb();
    else video.addEventListener('loadeddata', cb, { once: true });
  }

  function playSafe(video) {
    if (!video) return;
    video.muted = true;
    video.setAttribute('muted','');
    video.playsInline = true;
    video.autoplay = true;

    const p = video.play();
    if (p && typeof p.then === 'function') {
      p.catch(()=>{});
    }
  }

  function loadVideo(video) {
    if (!video || video.dataset.loaded) return;

    const mp4 = video.dataset.srcMp4;
    if (mp4) {
      const s = document.createElement('source');
      s.src = mp4;
      s.type = 'video/mp4';
      video.appendChild(s);
    }

    video.dataset.loaded = '1';
    video.load();
  }

  function go(n) {
    if (n === current) return;

    const prev = slides[current];
    const next = slides[n];

    const prevVid = prev?.querySelector('video');
    const nextVid = next?.querySelector('video');

    loadVideo(nextVid);

    prev?.classList.remove('active');
    prev?.classList.add('leaving');

    next?.classList.add('active');
    next?.offsetHeight;

    playSafe(nextVid);

    setTimeout(() => {
      if (prevVid) {
        prevVid.pause();
        try { prevVid.currentTime = 0; } catch(_) {}
      }
      prev?.classList.remove('leaving');
    }, XFADE);

    current = n;
  }

  function next(){ go((current + 1) % slides.length); }
  function start(){ stop(); timer = setInterval(next, intervalMs); }
  function stop(){ if (timer) clearInterval(timer); }

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });

  loadVideo(slides[current]?.querySelector('video'));
  playSafe(slides[current]?.querySelector('video'));
  start();

})();