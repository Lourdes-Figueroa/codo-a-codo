const oradorForm = document.getElementById("enviar");
function limpiarValueId(e) {
  return (document.getElementById(e).value = "");
}
function ValueId(e) {
  return document.getElementById(e).value;
}
const setLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
  return;
};
const getLocalStorage = (key) => {
  const oradores = localStorage.getItem(key);

  return oradores ? JSON.parse(oradores) : [];
};
async function nuevoOrador(e) {
  let orador = {
    nombre: ValueId("nombre"),
    apellido: ValueId("apellido"),
    email: ValueId("email"),
    tema: ValueId("tema"),
    tema_desarrollo: ValueId("tema_desarrollo"),
  };

  let option = {
    method: "POST",
    body: JSON.stringify(orador),
  };
  await fetch("http://localhost:8080/web-app/api/orador", option)
    .then((res) => (res.ok ? res.json() : Promise.reject))
    .then((data) => {
      console.log("data", data);

      limpiarValueId("nombre");
      limpiarValueId("apellido");
      limpiarValueId("email");
      limpiarValueId("tema");
      limpiarValueId("tema_desarrollo");
      const oradores = getLocalStorage("oradores");
      oradores.push(data);
      setLocalStorage("oradores", oradores);
      card();
    });
}
async function editarOrador(idOrador) {
  const oradores = getLocalStorage("oradores");

  const orador = oradores.find((e) => e.id == idOrador);

  document.getElementById(`nombreActualizar${idOrador}`).value = orador.nombre;
  document.getElementById(`apellidoActualizar${idOrador}`).value =
    orador.apellido;
  document.getElementById(`emailActualizar${idOrador}`).value = orador.email;
  document.getElementById(`temaActualizar${idOrador}`).value = orador.tema;
  document.getElementById(`tema_desarrolloActualizar${idOrador}`).value =
    orador.tema_desarrollo;
  setLocalStorage("orador", orador);
  return;
}
function traerValorDelId(key) {
  return document.getElementById(key).value;
}
async function finalizarEdicion() {
  const orador = getLocalStorage("orador");
  let nuevoOrador = {
    nombre: traerValorDelId(`nombreActualizar${orador.id}`),
    apellido: traerValorDelId(`apellidoActualizar${orador.id}`),
    email: traerValorDelId(`emailActualizar${orador.id}`),
    tema: traerValorDelId(`temaActualizar${orador.id}`),
    tema_desarrollo: traerValorDelId(`tema_desarrolloActualizar${orador.id}`),
  };

  if (
    nuevoOrador.nombre == orador.nombre &&
    nuevoOrador.apellido == orador.apellido &&
    nuevoOrador.email == orador.email &&
    nuevoOrador.tema == orador.tema &&
    nuevoOrador.tema_desarrollo == orador.tema_desarrollo
  ) {
    alert("no hubo modificaciones");
    return;
  }
  let option = {
    method: "PUT",
    body: JSON.stringify(nuevoOrador),
  };
  await fetch(
    `http://localhost:8080/web-app/api/orador?id=${orador.id}`,
    option
  )
    .then((res) => (res.ok ? res : Promise.reject(res)))
    .then(() => {
      let oradores = getLocalStorage("oradores");
      let orador = getLocalStorage("orador");
      let buscandoOrador = oradores.findIndex((e) => {
        return e.id == orador.id;
      });
      if (buscandoOrador == -1) {
        return;
      }
      oradores[buscandoOrador] = {
        id: orador.id,
        ...nuevoOrador,
        fecha_alta: orador.fecha_alta,
      };
      setLocalStorage("oradores", oradores);
      localStorage.removeItem("orador");
      document.getElementById(`btn-close${orador.id}`).click();
      card();
    })
    .catch((error) => console.log("error", error))
    .finally();
}
async function deleteOradorId(id) {
  let option = {
    method: "DELETE",
  };
  await fetch(`http://localhost:8080/web-app/api/orador?id=${id}`, option)
    .then((res) => (res.ok ? res : Promise.reject(res)))
    .then(() => {
      const oradores = getLocalStorage("oradores");

      const orador = oradores.find((e) => e.id == id);

      let array = oradores.filter((o) => {
        return o.id !== orador.id;
      });

      setLocalStorage("oradores", array);
      card();
      return;
    })
    .catch((error) => console.log("error", error))
    .finally();
}
oradorForm.addEventListener("click", nuevoOrador);
function img(num) {
  if (num % 2 === 0) {
    return "src/public/img/oradores/bill.jpg";
  } else {
    return "src/public/img/oradores/ada.jpeg";
  }
}
function card() {
  let data = getLocalStorage("oradores");
  let card = ``;
  data.forEach((e) => {
    card += `
        <div class="card orador${e.id}">
        <img class="card_img" src=${img(e.id)} alt="" />
        <div class="card_detalle">
            <h6>
                <span class="card_detalle_span_js">${e.tema}</span>
            </h6>
            <h5>${e.nombre} ${e.apellido}</h5>
            <p class="card_lorem">${e.tema_desarrollo}</p>
        </div>
            <div>
              <button onclick="deleteOradorId('${e.id}')" class="btn btn-danger">Borrar</button>
              ${modal(e)}
            </div>
        </div>
        `;
  });
  return (document.getElementById("cards").innerHTML = card);
}
async function oradoresPrint() {
  await fetch("http://localhost:8080/web-app/api/orador")
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((data) => {
      setLocalStorage("oradores", data);
      console.log("GET A LA DB");

      card();
    })
    .catch((error) => console.log("error", error));
}

const modal = (e) => {
  return `
  <button type="button" onclick='editarOrador(${e.id})'   class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal${e.id}">
    Editar
  </button>
  <!-- Modal -->
  <div class="modal fade" id="exampleModal${e.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
          <button type="button"  data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
        <section class="section_form_container">
        <div class="col-6">
        
            <div class="d-flex col-6">

                <div class=" col-12 ">
                    <input type="text" class="form-control" id="nombreActualizar${e.id}" name="nombre" placeholder="Nombre">
                </div>
                <div class=" col-12">
                    <input type="text" class="form-control" id="apellidoActualizar${e.id}" name="apellido" placeholder="Apellido">
                </div>
            </div>
            <div class="d-flex col-6">
                <div class=" col-12">
                    <input type="text" class="form-control" id="temaActualizar${e.id}" name="tema" placeholder="Tema">
                </div>
                <div class=" col-12">
                    <input type="email" class="form-control" id="emailActualizar${e.id}" name="email" placeholder="Email">
                </div>
            </div>
            <div class="mb-3">
                <label for="tema_desarrollo" class="form-label"></label>
                <textarea class="form-control" id="tema_desarrolloActualizar${e.id}" rows="3" placeholder="Sobre qué quieres hablar?"
                    name="tema_desarrollo"></textarea>
            </div>
        </div>
        </div>
    </section>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" id="btn-close${e.id}" data-bs-dismiss="modal">Close</button>
      <button type="button" onclick="finalizarEdicion()" class="btn btn-primary">Finalizar</button>
    </div>
        </div>
      </div>
    </div>
  </div>`;
};
oradoresPrint();
