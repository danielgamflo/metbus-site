/* ===========================
   Carga dinámica de recorridos desde S3
=========================== */

const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
const RECORRIDOS_JSON_URL = isLocal
  ? '/recorridos.json'
  : 'https://metbus-staging-recorridos.s3.us-east-1.amazonaws.com/recorridos.json';

let todosLosRecorridos = [];

function cardHTML(recorrido) {
  return `
    <a href="${recorrido.url}" target="_blank" rel="noopener noreferrer">
      <div class="recorrido-card">
        <div class="recorrido-top">
          <div class="recorrido-numero">
            <span class="numero">${recorrido.recorrido}</span>
          </div>
          <div class="recorrido-icon">
            <img src="assets/icons/bus.svg" alt="Bus">
          </div>
        </div>
        <div class="recorrido-bottom">
          <div class="recorrido-arrow">
            <img src="assets/icons/flecha.svg" alt="">
          </div>
          <div class="recorrido-destino">
            <span>${recorrido.destino}</span>
          </div>
        </div>
      </div>
    </a>
  `;
}

function renderRecorridos(lista) {
  const container = document.querySelector('.recorridos-container');
  const count = document.getElementById('recorridosCount');
  if (!container) return;

  if (!lista.length) {
    container.innerHTML = '<p class="recorridos-sin-resultados">Sin resultados para tu búsqueda.</p>';
    if (count) count.textContent = '';
    return;
  }

  container.innerHTML = lista.map(cardHTML).join('');
  if (count) count.textContent = `${lista.length} recorrido${lista.length !== 1 ? 's' : ''}`;
}

function filtrar(q) {
  const texto = q.trim().toLowerCase();
  if (!texto) return renderRecorridos(todosLosRecorridos);
  const resultado = todosLosRecorridos.filter(r =>
    String(r.recorrido).toLowerCase().includes(texto) ||
    r.destino.toLowerCase().includes(texto)
  );
  renderRecorridos(resultado);
}

async function cargarRecorridos() {
  const container = document.querySelector('.recorridos-container');
  if (!container) return;

  container.innerHTML = '<p style="text-align:center; padding: 2rem;">Cargando recorridos...</p>';

  try {
    const cacheBuster = new Date().getTime();
    const response = await fetch(`${RECORRIDOS_JSON_URL}?v=${cacheBuster}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    let recorridos = await response.json();

    recorridos.sort((a, b) => {
      const matchA = String(a.recorrido).match(/^(\d+)([A-Za-z]*)$/);
      const matchB = String(b.recorrido).match(/^(\d+)([A-Za-z]*)$/);
      if (!matchA || !matchB) return 0;
      const numA = parseInt(matchA[1]), numB = parseInt(matchB[1]);
      const letraA = (matchA[2] || '').toUpperCase();
      const letraB = (matchB[2] || '').toUpperCase();
      if ((letraA === '') !== (letraB === '')) return letraA === '' ? -1 : 1;
      if (letraA && letraB && letraA !== letraB) return letraA.localeCompare(letraB);
      return numA - numB;
    });

    todosLosRecorridos = recorridos;
    renderRecorridos(todosLosRecorridos);

    // Conectar buscador
    const input = document.getElementById('buscadorRecorrido');
    if (input) {
      input.addEventListener('input', () => filtrar(input.value));
    }

  } catch (error) {
    console.error('Error al cargar recorridos:', error);
    container.innerHTML = '<p style="text-align:center; color: #e60024; padding: 2rem;">Error al cargar los recorridos. Por favor, intenta más tarde.</p>';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', cargarRecorridos);
} else {
  cargarRecorridos();
}

