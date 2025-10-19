let lanzamientos = []; // Lista global de lanzamientos

// Imagen por defecto si no hay imagen disponible
window.PLACEHOLDER_IMG = window.PLACEHOLDER_IMG || 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100">' +
  '<rect width="100%" height="100%" fill="#94a3b8"/>' +
  '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#e2e8f0" font-family="Arial, Helvetica, sans-serif" font-size="14">No Image</text>' +
  '</svg>'
);

// Busca la mejor imagen disponible para un lanzamiento
window.getLaunchImage = function(launch) {
  if (!launch || !launch.links) return window.PLACEHOLDER_IMG;
  const links = launch.links;
  if (Array.isArray(links.flickr?.original) && links.flickr.original.length > 0) return links.flickr.original[0];
  if (Array.isArray(links.flickr?.small) && links.flickr.small.length > 0) return links.flickr.small[0];
  if (links.patch?.small) return links.patch.small;
  if (links.youtube_id) return `https://img.youtube.com/vi/${links.youtube_id}/hqdefault.jpg`;
  return window.PLACEHOLDER_IMG;
};

// Verifica si el lanzamiento tiene alguna imagen útil
window.hasLaunchImage = function(launch) {
  if (!launch || !launch.links) return false;
  const links = launch.links;
  if (Array.isArray(links.flickr?.original) && links.flickr.original.length > 0) return true;
  if (Array.isArray(links.flickr?.small) && links.flickr.small.length > 0) return true;
  if (links.patch?.small) return true;
  if (links.youtube_id) return true;
  return false;
};

// Carga los lanzamientos desde la API y los guarda
async function cargarLanzamientos() {
  if (lanzamientos.length > 0) return lanzamientos;
  const res = await fetch('https://api.spacexdata.com/v4/launches');
  const data = await res.json();
  lanzamientos = Array.isArray(data) ? data : [];
  return lanzamientos;
}

// Filtra los lanzamientos según el tipo indicado
async function conexionLista(filtrotipo = 'all') {
  await cargarLanzamientos();
  const tipo = (filtrotipo || 'all').toLowerCase();
  if (tipo === 'all') return lanzamientos;
  if (tipo === 'success') return lanzamientos.filter(l => l.success === true);
  if (tipo === 'failure') return lanzamientos.filter(l => l.success === false);
  if (tipo === 'upcoming') return lanzamientos.filter(l => l.upcoming === true);
  const encontrado = lanzamientos.find(l => l.id === filtrotipo || l.id === tipo);
  return encontrado ? [encontrado] : [];
}

// Carga lanzamientos y muestra la vista principal
async function General() {
  await cargarLanzamientos();
  Home();
  if (lanzamientos.length > 0) console.log(lanzamientos[0].name);
}

// Estas funciones se pueden usar desde otros scripts o el HTML
window.cargarLanzamientos = cargarLanzamientos;
window.conexionLista = conexionLista;
window.General = General;

// Aplica el filtro y actualiza la lista en pantalla
async function FiltroConexion(elfiltro) {
  const contenedor = document.getElementById('la-lista');
  if (!contenedor) return;
  contenedor.innerHTML = '';
  const lista = await conexionLista(elfiltro);
  const listaHTML = GenerarLista(lista);
  contenedor.innerHTML = listaHTML;
}

// También se exporta para usar desde el HTML
window.FiltroConexion = FiltroConexion;