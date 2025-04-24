let infraccionesSeleccionadas = new Set();
let registros = [];

window.onload = function () {
  const guardado = localStorage.getItem('infracciones');
  if (guardado) {
    registros = JSON.parse(guardado);
  }
};

function toggleInfraccion(boton, nombre) {
  if (infraccionesSeleccionadas.has(nombre)) {
    infraccionesSeleccionadas.delete(nombre);
    boton.classList.remove('activo');
  } else {
    infraccionesSeleccionadas.add(nombre);
    boton.classList.add('activo');
  }
}

function registrar(vehiculo) {
  if (infraccionesSeleccionadas.size === 0) return;

  const fechaHora = obtenerFechaColombia();

  infraccionesSeleccionadas.forEach(infraccion => {
    const registro = {
      infraccion: infraccion,
      vehiculo: vehiculo,
      hora: fechaHora
    };
    registros.push(registro);
  });

  localStorage.setItem('infracciones', JSON.stringify(registros));

  // Limpiar selección
  infraccionesSeleccionadas.clear();
  document.querySelectorAll('.botones button').forEach(b => b.classList.remove('activo'));
}

function mostrarHistorial() {
  const historial = document.getElementById('historial');
  const lista = document.getElementById('lista');
  lista.innerHTML = '';

  registros.forEach((r, index) => {
    const div = document.createElement('div');
    div.classList.add('registro');
    div.textContent = `${index + 1}. ${r.infraccion} - ${r.vehiculo} - ${r.hora}`;
    lista.appendChild(div);
  });

  historial.style.display = 'block';
}

function descargarHistorial() {
  const blob = new Blob([JSON.stringify(registros, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'infracciones.json';
  a.click();
}

function obtenerFechaColombia() {
  const fecha = new Date();
  const opcionesFecha = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Bogota' };
  const opcionesHora = { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Bogota' };

  const fechaStr = fecha.toLocaleDateString('es-CO', opcionesFecha);
  const horaStr = fecha.toLocaleTimeString('es-CO', opcionesHora).toLowerCase();

  return `${fechaStr} - ${horaStr}`;
}
