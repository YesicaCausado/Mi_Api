// detalle.js - muestra detalle de un lanzamiento usando la API proporcionada

var esFavorito = false;

// Base de la API (usaremos la URL que proporcionaste)
const BASE_LAUNCHES = 'https://api.spacexdata.com/v4/launches';
const PLACEHOLDER_IMG = 'https://via.placeholder.com/120x120?text=No+Image';

// Agregar/Quitar favorito
function toggleFavorito(paramid, paramname) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    const existe = favoritos.some(f => f.id === paramid || f.name === paramname);

    if (existe) {
        favoritos = favoritos.filter(f => !(f.id === paramid || f.name === paramname));
        esFavorito = false;
    } else {
        favoritos.push({
            id: paramid,
            name: paramname,
            url: `${BASE_LAUNCHES}/${paramid}`
        });
        esFavorito = true;
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));

    const boton = document.querySelector(`#corazon-${paramid}`);
    if (boton) boton.textContent = esFavorito ? "❤️" : "🤍";
}

// Mostrar detalle de lanzamiento
async function Detalle(parametro) {
    const root = document.getElementById("root");
    if (!root) return;
    root.innerHTML = '';

    const url = `${BASE_LAUNCHES}/${parametro}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
        esFavorito = favoritos.some(f => f.id === data.id || f.name === data.name);

    const imagen = window.getLaunchImage ? window.getLaunchImage(data) : (data.links?.patch?.small || window.PLACEHOLDER_IMG || PLACEHOLDER_IMG);

                const detalle = `
                <section class="c-detalle">
                    <img src="${imagen}" alt="${data.name || 'Sin nombre'}" height="120" width="auto">
                    <h2>${data.name || 'Sin nombre'}</h2>
                    <p><strong>ID:</strong> ${data.id || '—'}</p>
                    <p><strong>Fecha:</strong> ${data.date_utc ? new Date(data.date_utc).toLocaleString() : 'Sin fecha'}</p>
                    <p><strong>Éxito:</strong> ${data.success === true ? 'Sí' : (data.success === false ? 'No' : 'Desconocido')}</p>
                    <p><strong>Detalles:</strong> ${data.details || 'Sin detalles disponibles.'}</p>

                    <div style="margin-top:10px;display:flex;gap:8px;align-items:center">
                        <button id="btn-fav-${data.id}" onClick="toggleFavorito('${data.id}', '${(data.name||'').replace(/'/g, "\'")}')">
                            <span id="corazon-${data.id}">${esFavorito ? '❤️' : '🤍'}</span> Favorito
                        </button>
                    </div>
                </section>
            `;

        root.innerHTML = detalle;

        // nota: botón 'Recursos' eliminado; si necesitas mostrar data.links creamos otra vista separada
    } catch (err) {
        console.error('Error cargando detalle:', err);
        root.innerHTML = `<p>Error al cargar el detalle. ${err.message}</p>`;
    }
}

// Exponer funciones globalmente
window.toggleFavorito = toggleFavorito;
window.Detalle = Detalle;