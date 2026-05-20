// =====================================
// Sistema de Gestión de Tareas
// =====================================

// =====================================
// Helper para emular la consola en el HTML sin romper el console.log original
// =====================================
function logPlaya(msg) {
  console.log(msg); // Mantiene la impresión en la consola real del desarrollador
  const out = document.getElementById("consola-playa");
  out.textContent += (out.textContent.includes("//") ? "" : "\n") + msg;
}

function limpiarConsola() {
  document.getElementById("consola-playa").textContent = "";
}

// =====================================
// 1. Arreglo inicial de tareas
// =====================================
const tareas = [
  { nombre: "Ir a la playa", prioridad: 1, completada: false },
  { nombre: "Estudiar JS", prioridad: 2, completada: true },
  { nombre: "Ver películas", prioridad: 3, completada: false }
];

// =====================================
// 2. Funciones
// =====================================

/*
TODO 1:
Crear una función que recorra el arreglo de tareas
y muestre en consola:
- nombre de la tarea
- estado: "Completada" o "Pendiente"
*/
function mostrarTareas(lista) {
  logPlaya("--- Lista de Tareas ---");
  // Recorremos el arreglo con un forEach
  lista.forEach(tarea => {
    // Evaluamos el booleano para definir el estado en texto
    const estado = tarea.completada ? "Completada" : "Pendiente";
    logPlaya(`• ${tarea.nombre} - Estado: ${estado}`);
  });
}

/*
TODO 2:
Crear una función flecha que retorne
solo las tareas completadas.
Usar filter.
*/
const obtenerCompletadas = (lista) => {
  // Filtramos devolviendo solo los objetos donde completada sea true
  return lista.filter(tarea => tarea.completada);
};

/*
TODO 3:
Crear una función flecha que retorne
solo las tareas pendientes.
Usar filter.
*/
const obtenerPendientes = (lista) => {
  // Filtramos devolviendo solo los objetos donde completada sea false
  return lista.filter(tarea => !tarea.completada);
};

/*
TODO 4:
Crear una función flecha que retorne
solo los nombres de las tareas.
Usar map.
*/
const obtenerNombres = (lista) => {
  // Transformamos el arreglo original en un arreglo de puros strings (nombres)
  return lista.map(tarea => tarea.nombre);
};

/*
TODO 5:
Crear una función que retorne
el total de tareas.
*/
function contarTareas(lista) {
  // Retornamos la longitud del arreglo recibido
  return lista.length;
}

// =====================================
// 3. Objeto sistema
// =====================================

/*
TODO 6:
Completar los métodos usando this.tareas

- mostrarTareas: debe llamar a la función mostrarTareas
- mostrarCompletadas: debe usar obtenerCompletadas
- mostrarPendientes: debe usar obtenerPendientes
*/
const sistema = {
  tareas: tareas,

  mostrarTareas: function() {
    limpiarConsola();
    logPlaya("[Sistema Contexto: this]");
    // Pasamos el arreglo interno mediante this.tareas a la función global
    mostrarTareas(this.tareas);
  },

  mostrarCompletadas: function() {
    limpiarConsola();
    logPlaya("[Sistema Contexto: ths] - Completadas:");
    // Obtenemos el sub-arreglo y lo mandamos a mostrar
    const completadas = obtenerCompletadas(this.tareas);
    mostrarTareas(completadas);
  },

  mostrarPendientes: function() {
    limpiarConsola();
    logPlaya("[Sistema Contexto: this] - Pendientes:");
    // Obtenemos el sub-arreglo y lo mandamos a mostrar
    const pendientes = obtenerPendientes(this.tareas);
    mostrarTareas(pendientes);
  }
};

// =====================================
// 4. Condicionales
// =====================================

/*
TODO 7:

- Si el arreglo tareas está vacío:
  mostrar "No hay tareas"

- Si todas las tareas están completadas:
  mostrar "Todas las tareas completadas"
*/
function verificarEstadoArreglo() {
  limpiarConsola();
  logPlaya("--- Verificación de Condicionales ---");
  
  if (tareas.length === 0) {
    logPlaya("No hay tareas");
  } else if (tareas.every(tarea => tarea.completada)) {
    // .every comprueba si TODOS los elementos cumplen la condición
    logPlaya("Todas las tareas completadas");
  } else {
    logPlaya("Tienes tareas pendientes en la arena.");
  }
}

// =====================================
// 5. Switch
// =====================================

/*
TODO 8:

Usar la variable opcion para ejecutar:

1 -> mostrar todas las tareas
2 -> mostrar tareas completadas
3 -> mostrar tareas pendientes
default -> mostrar "Opción inválida"
*/
function ejecutarOpcion(opcion) {
  limpiarConsola();
  logPlaya(`--- Ejecutando Switch para opción: ${opcion} ---`);

  switch (opcion) {
    case 1:
      mostrarTareas(tareas);
      break;

    case 2:
      const completadas = obtenerCompletadas(tareas);
      mostrarTareas(completadas);
      break;

    case 3:
      const pendientes = obtenerPendientes(tareas);
      mostrarTareas(pendientes);
      break;

    default:
      logPlaya("Opción inválida");
  }
}

// =====================================
// 6. Pruebas / Funciones del Interfaz
// =====================================

/*
TODO 9:

Llamar funciones para comprobar que todo funciona correctamente.
Usar console.log donde sea necesario.
*/
function probarNombres() {
  limpiarConsola();
  logPlaya("--- Probando obtenerNombres (map) ---");
  const nombres = obtenerNombres(tareas);
  logPlaya(JSON.stringify(nombres));
}

function probarContar() {
  limpiarConsola();
  logPlaya("--- Probando contarTareas ---");
  const total = contarTareas(tareas);
  logPlaya(`Total de tareas registradas: ${total}`);
}

// Ejecución inicial automática en consola web tradicional al cargar la app
console.log("--- Pruebas de arranque Automático ---");
console.log("Total inicial:", contarTareas(tareas));
console.log("Nombres mapeados:", obtenerNombres(tareas));