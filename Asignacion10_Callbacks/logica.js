// SECCIÓN 1: TEMPORIZADOR
function esperarYMostrar(segundos, mensaje, callback) {
  setTimeout(function () {
    callback(mensaje);
  }, segundos * 1000);
}

function iniciarTemporizador() {
  const segundos = parseInt(document.getElementById("secs").value);
  const output = document.getElementById("out1");
  output.textContent = `Esperando ${segundos} segundos...`;

  esperarYMostrar(segundos, "El tiempo ha terminado", function (msg) {
    output.textContent = `Callback ejecutado: "${msg}"`;
  });
}

// SECCIÓN 2: OPERACIONES MATEMÁTICAS
function operacion(a, b, op, callback) {
  const resultados = {
    "+": a + b,
    "-": a - b,
    "*": a * b,
    "/": b !== 0 ? a / b : "Error: división por cero",
  };
  callback(resultados[op]);
}

function calcular() {
  const a = parseFloat(document.getElementById("numA").value);
  const b = parseFloat(document.getElementById("numB").value);
  const op = document.getElementById("opSel").value;
  const simbolos = { "+": "+", "-": "−", "*": "×", "/": "÷" };

  operacion(a, b, op, function (resultado) {
    document.getElementById("out2").textContent =
      `${a} ${simbolos[op]} ${b} = ${resultado}`;
  });
}

// SECCIÓN 3: PREPARACIÓN DE UNA RECETA
function cortarIngredientes(callback) {
  log("Cortando ingredientes...");
  setTimeout(function () {
    log("Ingredientes listos.");
    callback();
  }, 2000);
}

function cocinar(callback) {
  log("Cocinando...");
  setTimeout(function () {
    log("Cocción completa.");
    callback();
  }, 3000);
}

function servirPlato() {
  log("Plato servido");
}

function prepararReceta() {
  document.getElementById("out3").textContent = "";
  cortarIngredientes(function () {
    cocinar(servirPlato);
  });
}

function log(msg) {
  const out = document.getElementById("out3");
  out.textContent += (out.textContent ? "\n" : "") + msg;
}