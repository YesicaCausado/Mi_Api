// Muestra la lista de lanzamientos guardados como favoritos
function Favoritos() {
    const root = document.getElementById("root");
    if (!root) return console.warn('Favoritos(): no se encontró #root');

    root.innerHTML = "<h2>Mis Favoritos</h2>";

    // Carga los favoritos desde el almacenamiento local
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    // Si no hay favoritos, muestra un mensaje
    if (favoritos.length === 0) {
        root.innerHTML += "<p>No tienes lanzamientos favoritos aún.</p>";
        return;
    }

    // Crea el contenedor para mostrar los favoritos
    const contenedor = document.createElement("div");
    contenedor.classList.add("c-contenedor-favoritos");

    // Muestra cada favorito con botones para ver o quitar
    favoritos.forEach((fav, idx) => {
        const item = document.createElement("div");
        item.classList.add("c-favorito");

        const safeName = (fav.name || '').replace(/'/g, "\\'");
        const id = fav.id || fav.url || idx;

        item.innerHTML = `
            <p><strong>${fav.name || 'Sin nombre'}</strong></p>
            <button onclick="MostrarLanzamiento('${id}')">Ver detalle</button>
            <button class="fav-quitar" data-idx="${idx}">Quitar</button>
        `;

        contenedor.appendChild(item);
    });

    root.appendChild(contenedor);

    // Agrega funcionalidad a los botones "Quitar"
    contenedor.querySelectorAll('.fav-quitar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = Number(e.currentTarget.getAttribute('data-idx'));
            const favs = JSON.parse(localStorage.getItem('favoritos')) || [];
            favs.splice(idx, 1); // Elimina el favorito
            localStorage.setItem('favoritos', JSON.stringify(favs)); // Guarda los cambios
            Favoritos(); // Recarga la vista
        });
    });
}

// Hace que la función Favoritos esté disponible globalmente
window.Favoritos = Favoritos;