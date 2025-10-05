
function GenerarLista(lanzamientos) {
    var listalanz = "";
    for (let i = 0; i < lanzamientos.length; i++) {
        const lanzamiento = lanzamientos[i];
        const id = lanzamiento.id || i;
        const nombre = lanzamiento.name || "Sin nombre";
        const imagen = (lanzamiento.links && lanzamiento.links.patch && lanzamiento.links.patch.small) ? lanzamiento.links.patch.small : "https://via.placeholder.com/100x100?text=No+Image";
        listalanz += `
            <div class="un-lanzamiento" onclick="Detalle('${id}')">
                <p>${i + 1} - ${nombre}</p>
                <img src="${imagen}" width="auto" height="60" loading="lazy" alt="${nombre}">
            </div>
        `;
    }
    return listalanz;
}

function Home() {

    const tipos = ["success", "failure", "upcoming", "all"];

    // Crear buscador
    const buscador = document.createElement("input");
    buscador.classList.add("c-buscador");
    buscador.type = "text";
    buscador.placeholder = "Buscar lanzamiento...";

    // Crear filtro de botones
    const contenedorFiltro = document.createElement("div");
    contenedorFiltro.classList.add("c-contenedor-filtro");



    for (let i = 0; i < tipos.length; i++) {
        const btn = document.createElement("button");
        btn.textContent = tipos[i];
        btn.addEventListener("click", () => {
            FiltroConexion(tipos[i]);
        });
        contenedorFiltro.appendChild(btn);
    }

    // Crear lista inicial
    const contenedorLista = document.createElement("div");
    contenedorLista.classList.add("c-contenedor-lista");
    contenedorLista.id = "la-lista";
    contenedorLista.innerHTML = GenerarLista(lanzamientos);

    // Evento buscador
    buscador.addEventListener("input", (e) => {
        const valor = e.target.value;
        if (valor.length >= 3) {
            const filtrados = lanzamientos.filter(l => l.name && l.name.toLowerCase().includes(valor.toLowerCase()));
            contenedorLista.innerHTML = GenerarLista(filtrados);
        } else {
            contenedorLista.innerHTML = GenerarLista(lanzamientos);
        }
    });

    // Agregar elementos al root
    const root = document.getElementById("root");
    root.innerHTML = "";
    root.appendChild(buscador);
    root.appendChild(contenedorFiltro);
    root.appendChild(contenedorLista);
}