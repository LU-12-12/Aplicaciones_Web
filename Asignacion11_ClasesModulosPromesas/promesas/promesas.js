//proceso asíncrono
function procesarPedido(producto, exito = true) {
  return new Promise((resolve, reject) => {
    console.log(`  Procesando pedido de: ${producto}...`);

    setTimeout(() => {
      if (exito) {
        resolve({
          producto,
          estado: "aprobado",
          tiempo: "2 segundos",
        });
      } else {
        reject(new Error(`No hay stock de: ${producto}`));
      }
    }, 500);
  });
}

console.log("=== PROMESAS (.then / .catch) ===\n");

procesarPedido("Laptop")
  .then((resultado) => {
    console.log("Pedido exitoso:", resultado);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });

procesarPedido("Televisor", false)
  .then((resultado) => {
    console.log("Pedido exitoso:", resultado);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });

async function realizarCompra(producto, exito = true) {
  console.log(`\n  Iniciando compra de: ${producto}`);
  try {
    const resultado = await procesarPedido(producto, exito);
    console.log("Compra completada:", resultado);
    return resultado;
  } catch (error) {
    console.error("Compra fallida:", error.message);
    return null;
  }
}

async function main() {
  console.log("\n=== ASYNC / AWAIT ===\n");
  await realizarCompra("Teclado", true);
  await realizarCompra("Monitor", false);
  console.log("\n✔ Todas las operaciones finalizaron.");
}

main();
