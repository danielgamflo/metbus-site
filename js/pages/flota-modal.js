/* =========================================================
   FLOTA MODAL — abre detalle de cada bus sin cambiar página
   ========================================================= */

const flotaData = {
  'k9fe': {
    nombre: 'BYD K9FE',
    subtitulo: 'Bus eléctrico de piso bajo',
    descripcion: 'El BYD K9FE es el modelo más desplegado en la flota Metbus. Con piso bajo de acceso universal y motores eléctricos de alto rendimiento, ofrece una autonomía optimizada para la operación continua en la ciudad de Santiago.',
    specs: [
      { label: 'Autonomía', valor: '250 km' },
      { label: 'Capacidad', valor: '81 pasajeros' },
      { label: 'Motor', valor: '2 × 150 kW' },
      { label: 'Longitud', valor: '12 metros' },
      { label: 'Emisiones', valor: '0 CO₂' },
      { label: 'Carga', valor: 'Plug-in conductive' },
    ],
    imagen: 'assets/images/buses/byd-k9fe.jpg'
  },
  'b12co1': {
    nombre: 'BYD B12CO1',
    subtitulo: 'Primer bus eléctrico de dos pisos en Latinoamérica',
    descripcion: 'Hito histórico en la región: el BYD B12CO1 llegó a Chile en 2023 siendo el primer bus eléctrico de dos pisos en Latinoamérica. Equipado con WiFi, 30 puertos USB, aire acondicionado y accesibilidad universal.',
    specs: [
      { label: 'Autonomía', valor: '280 km' },
      { label: 'Capacidad', valor: '112 pasajeros' },
      { label: 'Batería', valor: '356 kWh Blade' },
      { label: 'Longitud', valor: '12.1 metros' },
      { label: 'Emisiones', valor: '0 CO₂' },
      { label: 'Carga', valor: 'Plug-in < 2 horas' },
    ],
    imagen: 'assets/images/buses/byd-b12co1.jpg'
  },
  'articulado': {
    nombre: 'BYD K11 Articulado',
    subtitulo: 'Primer bus eléctrico articulado en Chile',
    descripcion: 'En mayo de 2019, Metbus y BYD Chile presentaron el primer bus eléctrico articulado en operar en Chile. Con 18.5 metros y rampa eléctrica en todas las puertas, es la solución de mayor capacidad de la flota para los corredores principales de Santiago.',
    specs: [
      { label: 'Autonomía', valor: '320 km' },
      { label: 'Capacidad', valor: '104 pasajeros' },
      { label: 'Motor', valor: '2 × 180 kW' },
      { label: 'Longitud', valor: '18.5 metros' },
      { label: 'Emisiones', valor: '0 CO₂' },
      { label: 'Carga', valor: 'Plug-in nocturno' },
    ],
    imagen: 'assets/images/buses/byd-k11-articulado.jpg'
  }
};

let currentSlide = 0;

function abrirModal(id) {
  const data = flotaData[id];
  if (!data) return;

  currentSlide = 0;

  // Imagen
  document.getElementById('modalImg').src = data.imagen;
  document.getElementById('modalThumbs').innerHTML = '';
  document.getElementById('modalPrev').style.display = 'none';
  document.getElementById('modalNext').style.display = 'none';

  // Texto
  document.getElementById('modalNombre').textContent = data.nombre;
  document.getElementById('modalSubtitulo').textContent = data.subtitulo;
  document.getElementById('modalDescripcion').textContent = data.descripcion;

  // Specs
  document.getElementById('modalSpecs').innerHTML = data.specs.map(s =>
    `<div class="modal-spec"><span class="spec-valor">${s.valor}</span><span class="spec-label">${s.label}</span></div>`
  ).join('');

  // Abrir
  const modal = document.getElementById('flotaModal');
  const inner = modal.querySelector('.flota-modal-inner');
  inner.classList.remove('revealed');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Foto aparece centrada → luego revela ficha
  setTimeout(() => inner.classList.add('revealed'), 380);
}

function cerrarModal() {
  const modal = document.getElementById('flotaModal');
  modal.querySelector('.flota-modal-inner').classList.remove('revealed');
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function cambiarSlide(index) {
  const modal = document.getElementById('flotaModal');
  const busId = modal.dataset.busId;
  // Obtener datos activos
  const activeCard = document.querySelector('.fleet .card.modal-active');
  const id = modal.dataset.busId;
  const data = Object.values(flotaData)[
    Object.keys(flotaData).indexOf(id)
  ];

  if (!data) return;

  currentSlide = (index + data.imagenes.length) % data.imagenes.length;
  document.getElementById('modalImg').src = data.imagenes[currentSlide];

  document.querySelectorAll('.modal-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === currentSlide);
  });
}

// Inicialización: añadir listeners a las cards
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.fleet .card');
  const ids = ['k9fe', 'b12co1', 'articulado'];

  cards.forEach((card, i) => {
    card.style.cursor = 'pointer';
    card.dataset.busId = ids[i];
    card.addEventListener('click', () => {
      document.getElementById('flotaModal').dataset.busId = ids[i];
      abrirModal(ids[i]);
    });
  });

  // Cerrar con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarModal();
  });

  // Cerrar al click en overlay
  document.getElementById('flotaModal').addEventListener('click', e => {
    if (e.target === document.getElementById('flotaModal')) cerrarModal();
  });

  // Navegación carrusel
  document.getElementById('modalPrev').addEventListener('click', (e) => {
    e.stopPropagation();
    const id = document.getElementById('flotaModal').dataset.busId;
    const data = flotaData[id];
    cambiarSlide(currentSlide - 1);
  });
  document.getElementById('modalNext').addEventListener('click', (e) => {
    e.stopPropagation();
    const id = document.getElementById('flotaModal').dataset.busId;
    const data = flotaData[id];
    cambiarSlide(currentSlide + 1);
  });
});
