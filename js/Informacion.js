async function Informacion() {
    const root = document.getElementById('root');
    if (!root) return;

    // Estructura principal de la página
    root.innerHTML = `
        <section class="archive-wrap">
            <header class="archive-header">
                <h1>Space Archive</h1>
                <p class="subtitle">Explora los momentos más memorables de la historia de SpaceX. Cada misión cuenta una historia.</p>
                <div class="filters">
                    <label for="filter-year">Filtrar por año:</label>
                    <select id="filter-year"><option value="all">Todos</option></select>
                    <button id="shuffle-posters" class="btn-mini">🔀 Aleatorio</button>
                </div>
            </header>

            <div id="highlight-gallery" class="highlight-gallery">
                <div class="gallery-track" id="gallery-track">Cargando misiones...</div>
            </div>

            <main>
                <h2 class="section-title">Catálogo de Misiones</h2>
                <div id="grid-gallery" class="grid-gallery">Cargando...</div>
            </main>

            <!-- Modal para ver detalles -->
            <div id="poster-modal" class="poster-modal" style="display:none">
                <div class="poster-modal-inner">
                    <button id="modal-close" class="modal-close">✕</button>
                    <div id="modal-content"></div>
                </div>
            </div>
        </section>
    `;

    // Carga la lista completa de lanzamientos
    const lista = await conexionLista('all');
    if (!lista || lista.length === 0) {
        document.getElementById('grid-gallery').innerHTML = '<p>No se encontraron misiones.</p>';
        document.getElementById('gallery-track').innerHTML = '';
        return;
    }

    // Filtra los que tienen imagen
    const listaConImg = window.hasLaunchImage ? lista.filter(l => hasLaunchImage(l)) : lista;

    // Muestra los 5 más recientes como destacados
    const destacados = listaConImg.slice().reverse().slice(0, 5);
    renderHighlightGallery(destacados);

    // Crea opciones de filtro por año
    const years = Array.from(new Set(lista.map(l => l.date_utc ? new Date(l.date_utc).getFullYear() : null).filter(Boolean))).sort((a,b)=>b-a);
    const sel = document.getElementById('filter-year');
    years.forEach(y => {
        const o = document.createElement('option');
        o.value = y;
        o.textContent = y;
        sel.appendChild(o);
    });

    // Muestra las primeras 48 misiones
    let items = listaConImg.slice().reverse().slice(0, 48);
    renderGrid(items);

    // Botón para mezclar las misiones
    document.getElementById('shuffle-posters').addEventListener('click', () => {
        items = shuffleArray(items);
        renderGrid(items);
    });

    // Filtro por año
    sel.addEventListener('change', () => {
        const y = sel.value;
        const filtered = y === 'all'
            ? lista.slice().reverse().slice(0, 48)
            : lista.filter(l => l.date_utc && new Date(l.date_utc).getFullYear().toString() === y).slice(0, 48);
        renderGrid(filtered);
    });

    // Modal: cerrar al hacer clic fuera o en el botón x
    const modal = document.getElementById('poster-modal');
    const modalContent = document.getElementById('modal-content');
    document.getElementById('modal-close').addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    // Muestra los destacados en la parte superior
    function renderHighlightGallery(arr) {
        const container = document.getElementById('gallery-track');
        container.innerHTML = '';
        arr.forEach(a => {
            const card = document.createElement('div');
            card.className = 'highlight-card';
            const img = window.getLaunchImage ? window.getLaunchImage(a) : window.PLACEHOLDER_IMG;
            card.innerHTML = `
                <img src="${img}" alt="${a.name}">
                <div class="highlight-info">
                    <h3>${a.name}</h3>
                    <p>${a.date_utc ? new Date(a.date_utc).toLocaleDateString() : 'Sin fecha'}</p>
                </div>
            `;
            card.addEventListener('click', () => openModal(a));
            container.appendChild(card);
        });
    }

    // Muestra las misiones en formato de cuadrícula
    function renderGrid(list) {
        const grid = document.getElementById('grid-gallery');
        grid.innerHTML = '';
        list.forEach(l => {
            const div = document.createElement('div');
            div.className = 'poster-card';
            const img = window.getLaunchImage ? window.getLaunchImage(l) : window.PLACEHOLDER_IMG;
            div.innerHTML = `
                <img src="${img}" alt="${l.name}">
                <div class="poster-info">
                    <h4>${l.name}</h4>
                    <p>${l.date_utc ? new Date(l.date_utc).toLocaleDateString() : 'Sin fecha'}</p>
                    <div class="poster-actions">
                        <button class="view" onclick="MostrarLanzamiento('${l.id}')">Ver</button>
                        <button class="fav" onclick="toggleFavorito('${l.id}','${(l.name || '').replace(/'/g, "\\'")}')">❤</button>
                    </div>
                </div>
            `;
            div.addEventListener('click', () => openModal(l));
            grid.appendChild(div);
        });
    }

    // Mezcla aleatoriamente los elementos de una lista
    function shuffleArray(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // Abre el modal con los detalles de una misión
    function openModal(l) {
        modalContent.innerHTML = `
            <h2>${l.name}</h2>
            <p style="color:#9fb4d6">${l.date_utc ? new Date(l.date_utc).toLocaleString() : 'Sin fecha'}</p>
            <img src="${window.getLaunchImage ? window.getLaunchImage(l) : window.PLACEHOLDER_IMG}" 
                 alt="${l.name}" style="width:100%;border-radius:6px;margin-top:10px">
            <p style="margin-top:10px">${l.details || 'Sin detalles disponibles.'}</p>
            <div style="margin-top:10px;display:flex;gap:8px">
                <button class="btn-mini" onclick="MostrarLanzamiento('${l.id}')">Ver más</button>
                <button class="btn-mini" onclick="toggleFavorito('${l.id}','${(l.name || '').replace(/'/g, "\\'")}')">❤ Favorito</button>
            </div>
        `;
        modal.style.display = 'flex';
    }
}

// Hace que la función esté disponible globalmente
window.Informacion = Informacion;