/* ===========================
   KPIs: lazy background video + contadores + reveal en cascada
=========================== */
(function(){
  const bgVideo = document.getElementById('kpiBgVideo');
  // Lazy-load del video de fondo
  if (bgVideo) {
    const src = bgVideo.dataset.srcMp4;
    if ('IntersectionObserver' in window && src) {
      const vObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const s = document.createElement('source');
            s.src = src; s.type = 'video/mp4';
            bgVideo.appendChild(s);
            bgVideo.load();
            bgVideo.play().catch(()=>{});
            obs.unobserve(e.target);
          }
        });
      }, { rootMargin:'150px 0px' });
      vObs.observe(bgVideo);
    } else if (src) {
      const s = document.createElement('source');
      s.src = src; s.type = 'video/mp4';
      bgVideo.appendChild(s);
      bgVideo.load();
      bgVideo.play().catch(()=>{});
    }
  }

  // Contadores
  const counters = Array.from(document.querySelectorAll('.count'));
  let counted = false;

  function animateCount(el, to, { duration=1400, prefix='', suffix='', onComplete=null } = {}){
    const start = performance.now();
    const from = 0;
    const isInt = Number.isInteger(to);

    function frame(now){
      const t = Math.min(1, (now - start) / duration);
      // easing out-cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const val = from + (to - from) * eased;
      el.textContent = `${prefix}${isInt ? Math.round(val) : val.toFixed(1)}${suffix}`;
      if (t < 1) requestAnimationFrame(frame);
      else if (onComplete) onComplete();
    }
    requestAnimationFrame(frame);
  }

  // Reveal en cascada + disparo de contadores al entrar en viewport
  const kpiCards = Array.from(document.querySelectorAll('.kpi.reveal'));
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger para reveal
          kpiCards.forEach((card, i) => {
            setTimeout(() => card.classList.add('in'), i * 120);
          });

          if (!counted) {
            counters.forEach((el, i) => {
              const to = Number(el.dataset.to || '0');
              const prefix = el.dataset.prefix || '';
              const suffix = el.dataset.suffix || '';
              const icon = kpiCards[i]?.querySelector('.kpi-icon');
              setTimeout(() => {
                animateCount(el, to, {
                  duration: 1400 + i*150,
                  prefix,
                  suffix,
                  onComplete: () => { if (icon) icon.classList.add('visible'); }
                });
              }, i * 120);
            });
            counted = true;
          }
          observer.disconnect();
        }
      });
    }, { threshold: 0.25 });
    if (kpiCards[0]) obs.observe(kpiCards[0]);
  } else {
    // Fallback sin IO
    kpiCards.forEach((c,i)=> setTimeout(()=> c.classList.add('in'), i*120));
    if (!counted) {
      counters.forEach((el, i) => {
        const to = Number(el.dataset.to || '0');
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const icon = kpiCards[i]?.querySelector('.kpi-icon');
        setTimeout(() => {
          animateCount(el, to, {
            duration: 1400 + i*150,
            prefix,
            suffix,
            onComplete: () => { if (icon) icon.classList.add('visible'); }
          });
        }, i * 120);
      });
      counted = true;
    }
  }
})();