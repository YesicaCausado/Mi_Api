async function Lanzamientos(h) {
    const root = document.getElementById("root");
    const res = await fetch(`https://api.spacexdata.com/v4/launches/${h}`);
    const data = await res.json();
    console.log(data);
    root.innerHTML = `
        <h2>${data.name}</h2>
        <img src="${data.links?.patch?.small || 'https://via.placeholder.com/100x100?text=No+Image'}" alt="${data.name}">
        <p><strong>Fecha:</strong> ${data.date_utc ? new Date(data.date_utc).toLocaleString() : 'Sin fecha'}</p>
        <p><strong>Detalles:</strong> ${data.details || 'Sin detalles disponibles.'}</p>
        <p><strong>Éxito:</strong> ${data.success === true ? 'Sí' : (data.success === false ? 'No' : 'Desconocido')}</p>
    `;
}

// Helper que se llama desde los items de la lista (onclick)
function Detalle(id) {
    // Si el id es numérico y el arreglo lanzamientos existe, buscar ID real
    Lanzamientos(id);
}

window.Detalle = Detalle;