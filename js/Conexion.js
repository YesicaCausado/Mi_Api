let lanzamientos = [];

async function conexionLista(filtrotipo) {
  if (filtrotipo === "ALL") {
    const res = await fetch('https://api.spacexdata.com/v4/launches');
    const data = await res.json(); 
    return data; 
  } else {
    const res = await fetch(`https://api.spacexdata.com/v4/launches/${filtrotipo}`);
    const data = await res.json(); 
    const lanzamientosTipo = [];
    for (let i = 0; i < data.lanzamientos.length; i++) {
      lanzamientosTipo.push(data.lanzamientos[i]);
    }
    return lanzamientosTipo; 
  }
}

async function General() {
  if (lanzamientos.length === 0) {
    lanzamientos = await conexionLista("ALL");
  }

  Home(); 
  console.log(lanzamientos[0].name); 
}

General();

  async function FiltroConexion(Elfiltro){
  document.getElementById("la-lista").innerHTML = "";
  lanzamientos = await conexionLista(Elfiltro);
  const listaHTML = GenerarLista(lanzamientos);
  document.getElementById("la-lista").innerHTML = listaHTML;
}
                              