// Categorías según año de nacimiento
const categorias = {
  "U-17": [2008, 2009],
  "U-15": [2010, 2011],
  "U-13": [2012, 2013],
  "U-11": [2014, 2015],
  "U-9": [2016, 2017],
  "U-7": [2018, 2019],
};

const formJugador = document.getElementById("formJugador");
const mensaje = document.getElementById("mensaje");

const formLogin = document.getElementById("formLogin");
const mensajeLogin = document.getElementById("mensajeLogin");

const zonaProfesor = document.getElementById("zonaProfesor");
const listaJugadores = document.getElementById("listaJugadores");
const salirProfesorBtn = document.getElementById("salirProfesor");

const REGISTROS_KEY = "registrosJugadores";
const PASSWORD_PROFESOR = "ADSANTAANA123"; // Cambia esta contraseña

// Obtener registros almacenados en localStorage
function obtenerRegistros() {
  const registros = localStorage.getItem(REGISTROS_KEY);
  return registros ? JSON.parse(registros) : [];
}

// Guardar registros en localStorage
function guardarRegistros(registros) {
  localStorage.setItem(REGISTROS_KEY, JSON.stringify(registros));
}

// Obtener categoría por año
function obtenerCategoria(ano) {
  for (const [cat, años] of Object.entries(categorias)) {
    if (años.includes(ano)) return cat;
  }
  return null;
}

// Validar que no se repitan nombres + apellidos (insensible a mayúsculas)
function existeJugador(nombre, apellido, registros) {
  return registros.some(
    (j) =>
      j.nombre.toLowerCase() === nombre.toLowerCase() &&
      j.apellido.toLowerCase() === apellido.toLowerCase()
  );
}

// Mostrar listado en la zona del profesor
function mostrarListado() {
  const registros = obtenerRegistros();
  listaJugadores.innerHTML = "";

  // Agrupar por categoría
  const agrupado = {};
  for (const cat of Object.keys(categorias)) {
    agrupado[cat] = [];
  }
  for (const jugador of registros) {
    if (agrupado[jugador.categoria]) {
      agrupado[jugador.categoria].push(jugador);
    }
  }

  // Crear secciones por categoría
  for (const [cat, jugadores] of Object.entries(agrupado)) {
    const divCat = document.createElement("div");
    divCat.classList.add("categoria");

    const h3 = document.createElement("h3");
    h3.textContent = cat;
    divCat.appendChild(h3);

    if (jugadores.length === 0) {
      const p = document.createElement("p");
      p.textContent = "No hay jugadores en esta categoría.";
      divCat.appendChild(p);
    } else {
      const ul = document.createElement("ul");
      ul.classList.add("lista-nombres");

      jugadores.forEach((jugador, index) => {
        const li = document.createElement("li");
        li.textContent = `${jugador.nombre} ${jugador.apellido} (Año: ${jugador.anoNacimiento})`;

        const btnBorrar = document.createElement("button");
        btnBorrar.textContent = "Eliminar";
        btnBorrar.classList.add("borrar-btn");
        btnBorrar.addEventListener("click", () => {
          eliminarJugador(jugador);
        });

        li.appendChild(btnBorrar);
        ul.appendChild(li);
      });

      divCat.appendChild(ul);
    }

    listaJugadores.appendChild(divCat);
  }
}

// Eliminar jugador
function eliminarJugador(jugador) {
  if (
    confirm(
      `¿Estás seguro que quieres eliminar a ${jugador.nombre} ${jugador.apellido}?`
    )
  ) {
    let registros = obtenerRegistros();
    registros = registros.filter(
      (j) =>
        !(
          j.nombre === jugador.nombre &&
          j.apellido === jugador.apellido &&
          j.anoNacimiento === jugador.anoNacimiento
        )
    );
    guardarRegistros(registros);
    mostrarListado();
  }
}

// Manejo del formulario de registro
formJugador.addEventListener("submit", (e) => {
  e.preventDefault();
  mensaje.textContent = "";

  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const anoNacimiento = parseInt(
    document.getElementById("anoNacimiento").value.trim()
  );

  if (!nombre || !apellido || !anoNacimiento) {
    mensaje.textContent = "Por favor completa todos los campos.";
    return;
  }

  const categoria = obtenerCategoria(anoNacimiento);

  if (!categoria) {
    mensaje.textContent =
      "El año de nacimiento no corresponde a ninguna categoría.";
    return;
  }

  const registros = obtenerRegistros();

  if (existeJugador(nombre, apellido, registros)) {
    mensaje.textContent = "Este jugador ya está registrado.";
    return;
  }

  // Guardar jugador
  registros.push({ nombre, apellido, anoNacimiento, categoria });
  guardarRegistros(registros);

  mensaje.style.color = "green";
  mensaje.textContent = `Jugador registrado en categoría ${categoria}.`;

  formJugador.reset();
});

// Manejo del login profesor
formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  mensajeLogin.textContent = "";

  const password = document.getElementById("passwordProfesor").value;

  if (password === PASSWORD_PROFESOR) {
    // Mostrar zona profesor y ocultar formularios
    zonaProfesor.classList.remove("oculto");
    document.getElementById("registro").classList.add("oculto");
    document.getElementById("loginProfesor").classList.add("oculto");
    mostrarListado();
  } else {
    mensajeLogin.textContent = "Contraseña incorrecta.";
  }
});

// Botón salir profesor
salirProfesorBtn.addEventListener("click", () => {
  zonaProfesor.classList.add("oculto");
  document.getElementById("registro").classList.remove("oculto");
  document.getElementById("loginProfesor").classList.remove("oculto");
  mensajeLogin.textContent = "";
  formLogin.reset();
});