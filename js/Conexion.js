let lanzamientos = [];

// Carga todos los lanzamientos desde la API (una sola vez) y los guarda en la variable `lanzamientos`.
async function cargarLanzamientos() {
  if (lanzamientos.length > 0) return lanzamientos;
  const res = await fetch('https://api.spacexdata.com/v4/launches');
  const data = await res.json();
  lanzamientos = Array.isArray(data) ? data : [];
  return lanzamientos;
}

// Devuelve la lista filtrada en memoria según el tipo: 'all', 'success', 'failure', 'upcoming'
async function conexionLista(filtrotipo = 'all') {
  await cargarLanzamientos();
  const tipo = (filtrotipo || 'all').toString().toLowerCase();
  if (tipo === 'all' || tipo === 'ALL') return lanzamientos;

  if (tipo === 'success') {
    return lanzamientos.filter(l => l.success === true);
  }

  if (tipo === 'failure') {
    // Consideramos failure cuando success === false
    return lanzamientos.filter(l => l.success === false);
  }

  if (tipo === 'upcoming') {
    return lanzamientos.filter(l => l.upcoming === true);
  }

  // Si recibe un id o valor inesperado, intentar encontrar por id
  const encontrado = lanzamientos.find(l => l.id === filtrotipo || l.id === tipo);
  return encontrado ? [encontrado] : [];
}

async function General() {
  await cargarLanzamientos();
  Home();
  if (lanzamientos.length > 0) console.log(lanzamientos[0].name);
}

General();

async function FiltroConexion(elfiltro) {
  const contenedor = document.getElementById('la-lista');
  if (!contenedor) return;
  contenedor.innerHTML = '';
  const lista = await conexionLista(elfiltro);
  const listaHTML = GenerarLista(lista);
  contenedor.innerHTML = listaHTML;
}

// Exportar funciones al scope global para que los otros scripts puedan llamarlas desde el HTML
window.FiltroConexion = FiltroConexion;
window.conexionLista = conexionLista;
window.General = General;
                              