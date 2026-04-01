(function () {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const onScroll = () => {
    window.scrollY > 10
      ? header.classList.add('scrolled')
      : header.classList.remove('scrolled');
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();