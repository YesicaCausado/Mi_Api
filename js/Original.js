
async function Original(){
    const root = document.getElementById('root');
    if(!root) return;

    // Muestra el diseño principal con botones y tarjeta vacía
    root.innerHTML = `
        <section class="original-hero">
            <div class="orig-left">
                <h1>SpaceX Explorer</h1>
                <p class="tag">Explora lanzamientos, descubre historia y marca tus favoritos.</p>
                <div class="orig-actions">
                    <button id="btn-ultimo" class="btn primary">Último lanzamiento</button>
                    <button id="btn-aleatorio" class="btn">Lanzamiento aleatorio</button>
                </div>
            </div>
            <div class="orig-right">
                <div id="orig-card" class="orig-card">
                    <p class="muted">Selecciona una acción para ver detalles</p>
                </div>
            </div>
        </section>
    `;

    // Agrega estilos básicos para que se vea bien
    const style = document.createElement('style');
    style.textContent = `
        .original-hero{display:flex;gap:20px;align-items:center;padding:24px;background:linear-gradient(135deg,#0f172a,#03203c);color:#fff;border-radius:8px}
        .orig-left{flex:1}
        .orig-right{width:420px}
        .orig-card{background:rgba(255,255,255,0.06);padding:16px;border-radius:8px;min-height:180px}
        .orig-actions .btn{margin-right:8px;padding:10px 14px;border-radius:6px;border:none;cursor:pointer}
        .btn.primary{background:#ff6b01;color:#fff}
        .btn{background:rgba(255,255,255,0.08);color:#fff}
        .tag{color:#cfe8ff;opacity:0.9}
        .orig-card h3{margin:0 0 8px}
        .muted{color:rgba(255,255,255,0.6)}
    `;
    document.head.appendChild(style);

    // Botones para ver el último o un lanzamiento aleatorio
    const btnUltimo = document.getElementById('btn-ultimo');
    const btnAleatorio = document.getElementById('btn-aleatorio');

    // Muestra el último lanzamiento disponible con imagen
    btnUltimo.addEventListener('click', async () => {
        let lista = await conexionLista('all');
        if(!lista || lista.length === 0) return showOrigMessage('No hay lanzamientos disponibles');
        if (window.hasLaunchImage) lista = lista.filter(l => hasLaunchImage(l));
        if (!lista || lista.length === 0) return showOrigMessage('No hay lanzamientos con imágenes');
        const ultimo = lista[lista.length - 1];
        renderOrigCard(ultimo);
    });

    // Muestra un lanzamiento aleatorio con imagen
    btnAleatorio.addEventListener('click', async () => {
        let lista = await conexionLista('all');
        if(!lista || lista.length === 0) return showOrigMessage('No hay lanzamientos disponibles');
        if (window.hasLaunchImage) lista = lista.filter(l => hasLaunchImage(l));
        if (!lista || lista.length === 0) return showOrigMessage('No hay lanzamientos con imágenes');
        const rand = lista[Math.floor(Math.random() * lista.length)];
        renderOrigCard(rand);
    });

    // Muestra un mensaje en la tarjeta si no hay datos
    function showOrigMessage(msg){
        const card = document.getElementById('orig-card');
        if(card) card.innerHTML = `<p class="muted">${msg}</p>`;
    }

    // Muestra los datos del lanzamiento en la tarjeta
    function renderOrigCard(data){
        const card = document.getElementById('orig-card');
        if(!card) return;
        const imagen = window.getLaunchImage ? window.getLaunchImage(data) : (data.links?.patch?.small || window.PLACEHOLDER_IMG);
        card.innerHTML = `
            <img src="${imagen}" alt="${data.name}" style="width:100%;border-radius:6px;margin-bottom:12px">
            <h3>${data.name}</h3>
            <p class="muted">Fecha: ${data.date_utc ? new Date(data.date_utc).toLocaleString() : 'Desconocida'}</p>
            <p>${(data.details && data.details.length > 200) ? data.details.substring(0, 200) + '...' : (data.details || 'Sin detalles')}</p>
            <div style="margin-top:12px;display:flex;gap:8px">
                <button class="btn primary" onclick="MostrarLanzamiento('${data.id}')">Ver detalle completo</button>
                <button class="btn" onclick="toggleFavorito('${data.id}','${(data.name || '').replace(/'/g,"\\'")}')">${isFavoritoLocal(data.id) ? 'Quitar favorito' : 'Agregar favorito'}</button>
            </div>
        `;
    }

    // Verifica si el lanzamiento ya está en favoritos
    function isFavoritoLocal(id){
        const favs = JSON.parse(localStorage.getItem('favoritos')) || [];
        return favs.some(f => f.id === id);
    }
}

// Hace que la función Original esté disponible globalmente
window.Original = Original;