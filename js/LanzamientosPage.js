// Muestra todos los lanzamientos en formato de galería
async function LanzamientosPage() {
    const root = document.getElementById('root');
    root.innerHTML = ''; // Limpia el contenido anterior

    // Carga la lista de lanzamientos si es necesario
    if (typeof cargarLanzamientos === 'function') await cargarLanzamientos();
    let lista = (typeof lanzamientos !== 'undefined' && Array.isArray(lanzamientos)) ? lanzamientos : [];
    if ((!lista || lista.length === 0) && typeof conexionLista === 'function') {
        lista = await conexionLista('all');
    }

    // Filtra los que tienen imagen (si hay función para eso)
    if (window.hasLaunchImage) lista = lista.filter(l => hasLaunchImage(l));

    // Crea el contenedor de la galería
    const grid = document.createElement('div');
    grid.className = 'grid-gallery';

    // Crea una tarjeta para cada lanzamiento
    lista.forEach(l => {
        const card = document.createElement('div');
        card.className = 'poster-card';
        const imgSrc = window.getLaunchImage ? window.getLaunchImage(l) : window.PLACEHOLDER_IMG;
        card.innerHTML = `
            <img src="${imgSrc}" alt="${l.name}">
            <div class="poster-info">
                <h4>${l.name}</h4>
                <p class="small muted">${l.date_utc ? new Date(l.date_utc).toLocaleDateString() : ''}</p>
                <div class="poster-actions">
                    <button class="view" onclick="MostrarLanzamiento('${l.id}')">Ver</button>
                    <button class="fav" onclick="(typeof toggleFavorito === 'function' ? toggleFavorito('${l.id}','${(l.name||'sin nombre').replace(/'/g, "\'")}') : null)">❤</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Muestra la galería en pantalla
    root.appendChild(grid);
}

// Hace que la función esté disponible globalmente
window.LanzamientosPage = LanzamientosPage;