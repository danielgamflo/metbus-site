(() => {
  const STORAGE_KEY = "metbus-dark-mode";
  const body = document.body;

  // Aplicar solo preferencia guardada explícitamente por el usuario
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark") {
    body.classList.add("dark");
  }

  // Actualizar icono del botón
  function updateIcon(btn) {
    btn.textContent = body.classList.contains("dark") ? "☀️" : "🌙";
    btn.setAttribute("aria-label", body.classList.contains("dark") ? "Modo claro" : "Modo oscuro");
  }

  // Inicializar botones (puede haber más de uno)
  document.querySelectorAll(".dark-toggle").forEach(btn => {
    updateIcon(btn);
    btn.addEventListener("click", () => {
      body.classList.toggle("dark");
      localStorage.setItem(STORAGE_KEY, body.classList.contains("dark") ? "dark" : "light");
      document.querySelectorAll(".dark-toggle").forEach(updateIcon);
    });
  });
})();
