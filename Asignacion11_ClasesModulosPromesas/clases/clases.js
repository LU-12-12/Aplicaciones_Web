class Animal {
  constructor(nombre = "Sin nombre", especie = "Desconocida", edad = 0) {
    this.nombre = nombre;
    this.especie = especie;
    this.edad = edad;
    this.#energia = 100;
  }

  #energia;

  //método público
  presentarse() {
    return `Soy ${this.nombre}, un(a) ${this.especie} de ${this.edad} año(s).`;
  }

  comer(alimento) {
    this.#recuperarEnergia(20);
    return `${this.nombre} comió ${alimento}. Energía: ${this.#energia}`;
  }

  //Método privado
  #recuperarEnergia(cantidad) {
    this.#energia = Math.min(100, this.#energia + cantidad);
  }

  obtenerEnergia() {
    return this.#energia;
  }
}

class Perro extends Animal {
  constructor(nombre = "Sin nombre", edad = 0, raza = "Mestizo") {
    super(nombre, "Perro", edad);
    this.raza = raza;
    this.trucos = [];
  }

  aprender(truco) {
    this.trucos.push(truco);
    return `${this.nombre} aprendió el truco: "${truco}"`;
  }

  mostrarTrucos() {
    if (this.trucos.length === 0) {
      return `${this.nombre} no sabe ningún truco todavía.`;
    }
    return `${this.nombre} sabe: ${this.trucos.join(", ")}`;
  }

  ladrar() {
    return `${this.nombre} dice: ¡Guau guau!`;
  }
}

//Instancias
console.log("=== CLASES Y OBJETOS ===\n");

const animalGenerico = new Animal();
console.log("-- Animal con constructor vacío --");
console.log(animalGenerico.presentarse());

const gato = new Animal("Michi", "Gato", 3);
console.log("\n-- Animal con parámetros --");
console.log(gato.presentarse());
console.log(gato.comer("atún"));

const perroSinNombre = new Perro();
console.log("\n-- Perro con constructor vacío --");
console.log(perroSinNombre.presentarse());
console.log(perroSinNombre.ladrar());
console.log(perroSinNombre.mostrarTrucos());

const rex = new Perro("Rex", 4, "Pastor Alemán");
console.log("\n-- Perro con parámetros --");
console.log(rex.presentarse());
console.log(rex.ladrar());
console.log(rex.aprender("sentarse"));
console.log(rex.aprender("dar la pata"));
console.log(rex.mostrarTrucos());
console.log(rex.comer("croquetas"));

export { Animal, Perro };
