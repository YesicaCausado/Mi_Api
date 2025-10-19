// Función que genera el HTML para mostrar cada lanzamiento en pantalla
function GenerarLista(lanzamientos) {
    let listalanz = "";
    for (let i = 0; i < lanzamientos.length; i++) {
        const lanzamiento = lanzamientos[i];
        const id = lanzamiento.id || i; // Usa el id del lanzamiento o el índice si no hay id
        const nombre = lanzamiento.name || "Sin nombre"; // Si no tiene nombre, muestra "Sin nombre"
        const imagen = window.getLaunchImage ? window.getLaunchImage(lanzamiento) : window.PLACEHOLDER_IMG; // Usa imagen personalizada o una por defecto

        // Agrega el HTML de cada lanzamiento con su nombre e imagen
        listalanz += `
        <div class="un-lanzamiento" onclick="MostrarLanzamiento('${id}')">
            <p>${i + 1} - ${nombre}</p>
            <img src="${imagen}" width="auto" height="60" loading="lazy" alt="${nombre}">
        </div>`;
    }
    return listalanz;
}

// Función principal que arma la vista de inicio
async function Home() {
    // Si existe la función para cargar lanzamientos, la ejecuta
    if (typeof cargarLanzamientos === 'function') {
        await cargarLanzamientos();
    }

    const tipos = ["success", "failure", "upcoming", "all"]; // Tipos de filtros disponibles

    // Crea el campo de búsqueda
    const buscador = document.createElement("input");
    buscador.classList.add("c-buscador");
    buscador.type = "text";
    buscador.placeholder = "Buscar lanzamiento...";

    // Crea el contenedor para los botones de filtro
    const contenedorFiltro = document.createElement("div");
    contenedorFiltro.classList.add("c-contenedor-filtro");

    // Crea cada botón de filtro y le asigna su comportamiento
    tipos.forEach(tipo => {
        const btn = document.createElement("button");
        btn.textContent = tipo;
        btn.dataset.tipo = tipo;
        btn.addEventListener("click", async (ev) => {
            // Marca el botón como activo y desactiva los demás
            contenedorFiltro.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            ev.currentTarget.classList.add('active');
            await FiltroConexion(tipo); // Aplica el filtro
        });
        contenedorFiltro.appendChild(btn);
    });

    // Crea el contenedor donde se mostrará la lista de lanzamientos
    const contenedorLista = document.createElement("div");
    contenedorLista.classList.add("c-contenedor-lista");
    contenedorLista.id = "la-lista";

    // Obtiene la lista inicial de lanzamientos
    let listaInicial = (typeof lanzamientos !== 'undefined' && Array.isArray(lanzamientos)) ? lanzamientos : [];
    if ((!listaInicial || listaInicial.length === 0) && typeof conexionLista === 'function') {
        listaInicial = await conexionLista('all'); // Si no hay datos, los pide al servidor
    }

    // Filtra los lanzamientos que no tienen imagen
    if (window.hasLaunchImage) listaInicial = listaInicial.filter(l => hasLaunchImage(l));

    // Muestra la lista en pantalla
    contenedorLista.innerHTML = GenerarLista(listaInicial);

    // Función para evitar que se busque en cada tecla (espera un poco antes de buscar)
    function debounce(fn, wait = 250) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    // Función que maneja la búsqueda por nombre
    const manejarBusqueda = debounce((e) => {
        const valor = e.target.value.toLowerCase();
        const filtrados = valor.length >= 3
            ? lanzamientos.filter(l => l.name?.toLowerCase().includes(valor))
            : lanzamientos;
        const listaFinal = window.hasLaunchImage ? filtrados.filter(l => hasLaunchImage(l)) : filtrados;
        contenedorLista.innerHTML = GenerarLista(listaFinal); // Muestra los resultados filtrados
    }, 300);

    // Escucha cuando el usuario escribe en el buscador
    buscador.addEventListener("input", manejarBusqueda);

    // Limpia el contenido anterior y agrega los elementos al contenedor principal
    const root = document.getElementById("root");
    root.innerHTML = "";
    root.appendChild(buscador);
    root.appendChild(contenedorFiltro);
    root.appendChild(contenedorLista);
}