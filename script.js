//Variable global que seria la respuesta de una BBDD o de una API

var productos = [
  {
    nombre: "Bolso",
    precio: 20,
    imagen: "https://source.unsplash.com/random/500x500/?handbag",
  },
  {
    nombre: "Zapatos",
    precio: 50,
    imagen: "https://source.unsplash.com/random/500x500/?shoes",
  },
  {
    nombre: "Camiseta",
    precio: 15,
    imagen: "https://source.unsplash.com/random/500x500/?t-shirt",
  },
  {
    nombre: "Vestido",
    precio: 30,
    imagen: "https://source.unsplash.com/random/500x500/?dress",
  },
  {
    nombre: "Vaqueros",
    precio: 20,
    imagen: "https://source.unsplash.com/random/500x500/?jeans",
  },
  {
    nombre: "Chándal",
    precio: 60,
    imagen: "https://source.unsplash.com/random/500x500/?tracksuit",
  },
  {
    nombre: "Anillos",
    precio: 20,
    imagen: "https://source.unsplash.com/random/500x500/?ring",
  },
  {
    nombre: "Cinturon",
    precio: 10,
    imagen: "https://source.unsplash.com/random/500x500/?belt",
  },
  {
    nombre: "Chaqueta",
    precio: 40,
    imagen: "https://source.unsplash.com/random/500x500/?jacket",
  },
];

// la clase Producto(que sólo instancia nuevos productos o artículos),

class Producto {
  static cod = 1;
  cod;
  cantidad;
  imagen;
  nombre;
  precio;

  constructor(nombre, precio, imagen) {
    this.cod = Producto.cod++;
    this.nombre = nombre;
    this.precio = precio;
    this.imagen = imagen;
  }
}

class Cesta {
  #arrayAñadidos = [];
  #arrayProductos = [];

  constructor(productos) {
    //paso el mismo array de productos que tiene la clase contProductos
    this.#arrayProductos = productos;

    //Cargamos los posibles datos guardados en local
    this.#cargarDatos();
  }

  insertarProducto(idbot, cantidad) {
    //Compruebo que el producto con el atributo data-idbot pasado por parametros no se haya introducido ya
    //Busco si el array de productos añadidos incluye ya el objeto producto devuelto por el arrayProductos[id-1]
    //Que es su indice en el array

    //FIND devuelve el objeto de array añadidos con el que coincide su codigo

    let find = this.#arrayAñadidos.find((e) => {
      return e.cod == this.#arrayProductos[idbot - 1].cod;
    });

    if (find != undefined) {
      //si el producto ya esta en la cesta cambia su propiedad CANTIDAD
      find.cantidad += Number(cantidad);
    } else {
      //Añade el producto ya que no esta en la cesta

      //Devuelve el codigo del producto a insertar
      //this.#arrayProductos[idbot - 1]["cod"]
      this.#arrayAñadidos.push({
        cod: this.#arrayProductos[idbot - 1].cod,
        cantidad: Number(cantidad),
      });
    }

    //renderizo la cesta
    this.#mostrarCesta();

    //Guardo los datos desps de insertarlo
    this.#guardarDatos();
  }

  #cargarDatos() {
    let datos = localStorage.getItem("datos");
    let productosAnteriores = JSON.parse(datos);
    if (productosAnteriores != null) {
      this.#arrayAñadidos = productosAnteriores;
      this.#mostrarCesta();
    }
  }

  #calcularTotales() {
    //Accedo a los subtotales mediante su clase
    let subtotales = document.getElementsByClassName("subtotales");
    //En esta variable guardo los subtotales con tipo Number
    let subtotalesNumber = [];
    //Recorro los subtotales cogiendo cada valor dentro de el td convirtiendolo
    //en un array de caracteres para eliminar el simbolo € y
    // añadirlo al array subtotalesNumber
    for (let i = 0; i < subtotales.length; i++) {
      let subtotal = subtotales[i].innerHTML.split("");
      subtotal.pop();
      subtotalesNumber.push(Number(subtotal.toString().replace(/,/g, "")));
    }

    let total = 0;

    subtotalesNumber.forEach((subtotal) => {
      total += subtotal;
    });
    document.getElementById("total").innerHTML = `Total: ${total} €`;
    document.getElementById("totalIva").innerHTML = `Total + IVA: ${
      total + (total * 21) / 100
    } €`;
  }

  #eventoBorrar(cod) {
    //accedo al boton borrar con su atributo personalizado data-idelim
    let botonBorrar = document.querySelector(`[data-idelim="${cod}"]`);

    //Creo el evento que se encargara de borrar cada elemento de la tabla
    botonBorrar.addEventListener("click", () => {
      //Borro el elemento tr que contiene todas las td con ese COD
      botonBorrar.parentNode.parentNode.remove();

      //Busco el cod que coincida en el array de los prod añadidos con el cod pasado por parametro
      let indice = this.#arrayAñadidos.findIndex((e) => {
        return e.cod == cod;
      });

      //borro del array segun el indice devuelto por la funcion anterior
      this.#arrayAñadidos.splice(indice, 1);

      //Calculo los totales nuevos al borrar el elemento
      this.#calcularTotales();

      //Guardo los datos en local despues del borrado del elemento
      this.#guardarDatos();
    });
  }

  #guardarDatos() {
    //Guardar datos en local
    let cadenaJSON = JSON.stringify(this.#arrayAñadidos);
    localStorage.setItem("datos", cadenaJSON);
    console.log(cadenaJSON);
  }

  #mostrarCesta() {
    // Guardo en una variable una referencia al contenedor de el cuerpo de la tabla
    let tbody = document.getElementById("cesta");

    //Borro su contenido anterior
    tbody.innerHTML = "";

    //Por cada elemento añadido creo dinamicamente el html
    this.#arrayAñadidos.forEach((element) => {
      //Creo un columna donde añadire los valores y la hago hija de el contenedor del cuerpo de la tabla
      let tr = document.createElement("tr");
      tbody.appendChild(tr);

      //Creo una celda para el codigo
      let tdcd = document.createElement("td");
      tdcd.innerHTML = element.cod;

      //Creo una celda para el nombre

      let tdn = document.createElement("td");
      tdn.innerHTML = this.#arrayProductos[element.cod - 1]["nombre"];

      //Creo una celda para la cantidad
      let tdc = document.createElement("td");
      tdc.innerHTML = element.cantidad;

      //Creo una celda para el precio
      let tdp = document.createElement("td");
      tdp.innerHTML = this.#arrayProductos[element.cod - 1].precio + "€";

      //Creo una celda para el subtotal
      let tds = document.createElement("td");
      tds.setAttribute("class", "subtotales");
      tds.innerHTML =
        this.#arrayProductos[element.cod - 1].precio * element.cantidad + "€";

      //Creo una celda para el boton borrar
      let tda = document.createElement("td");
      tda.innerHTML = `<button type="button" class="btn btn-danger" data-idelim="${element.cod}" id=>X</button>`;

      //Añado al elemento tr todos los creados anteriormente haciendolo sus hijos

      tr.appendChild(tdcd);
      tr.appendChild(tdn);
      tr.appendChild(tdc);
      tr.appendChild(tdp);
      tr.appendChild(tds);
      tr.appendChild(tda);

      //llamo a la funcion evento borrar que añadira un evento a cada boton para borrarlo
      this.#eventoBorrar(element.cod);

      //calculo los totales llamando al metodo
      this.#calcularTotales();
    });
  }
}

// la clase ContProductos(que va a instanciar un único objeto con las propiedades
// y métodos necesarios para renderizar los productos disponibles, podría contener
// métodos definidos como estáticos)
// A tener en cuenta, para renderizar los productos debe existir una array privado en la clase
// ContProductos que guarde todos los productos disponibles.
class ContProductos {
  #array = [];
  #cesta;

  constructor(productos) {
    //Del array de objetos pasado por parametros la instanciar creo objetos de la clase Producto

    //Por cada producto creo un objeto y lo añado al array
    productos.forEach((element) => {
      let nombre = element.nombre;
      let precio = element.precio;
      let imagen = element.imagen;

      this.#array.push(new Producto(nombre, precio, imagen));
    });

    //Creo un objeto cesta pasandole este arrayProductos y le doy valor a la propiedad #cesta
    this.#cesta = new Cesta(this.#array);

    //Renderizo los productos
    this.#mostrarProductos();
  }

  #mostrarProductos() {
    //Creo una variable con referencia al div contenedor de los productos
    let contProductos = document.getElementById("contProductos");

    //Por cada producto disponible genera dinamicamente su tarjeta para comprarlo
    this.#array.forEach((element) => {
      //Creo el div q contendra todo y lo hago hijo de el contenedor principal

      let div = document.createElement("div");
      div.setAttribute("class", "card");
      div.setAttribute("style", "width: 13rem;");
      contProductos.appendChild(div);

      //Creo la etiqueta img con sus respectivos atributos y  lo hago hijo del div
      let img = document.createElement("img");
      img.setAttribute("src", element.imagen);
      img.setAttribute("class", "card-img-top");
      div.appendChild(img);

      //Creo el elemento div_card_body con sus respectivos atributos y  lo hago hijo del div
      let div_card_body = document.createElement("div");
      div_card_body.setAttribute("class", "card-body");
      div_card_body.setAttribute(
        "style",
        "display:flex;flex-direction:column;text-align:center;"
      );
      div.appendChild(div_card_body);

      //Creo la etiqueta h5 con sus respectivos atributosy valores y  lo hago hijo del div_card_body

      let h5 = document.createElement("h5");
      h5.setAttribute("class", "card-title");
      h5.innerHTML = element.nombre;
      div_card_body.appendChild(h5);

      //Creo la etiqueta p con sus respectivos atributos y valores y  lo hago hijo del div_card_body

      let p = document.createElement("p");
      p.setAttribute("class", "card-text");
      p.innerHTML = element.precio + "€";
      div_card_body.appendChild(p);

      //Creo la etiqueta input con sus respectivos atributos(data-iduni) y  lo hago hijo del div_card_body

      let input = document.createElement("input");
      input.setAttribute("type", "number");
      input.setAttribute("data-iduni", element.cod);
      input.setAttribute("min", "1");
      input.setAttribute("value", "1");
      input.setAttribute("style", "width:70px;margin:0 auto;");
      div_card_body.appendChild(input);

      //Creo la etiqueta button con sus respectivos atributos(data-idbot) y  lo hago hijo del div_card_body

      let button = document.createElement("button");
      button.setAttribute("class", "btn btn-outline-dark");
      button.setAttribute("data-idbot", element.cod);
      button.innerHTML = "Comprar";
      div_card_body.appendChild(button);

      // Añado evento click para cuando se pulse boton comprar se añada a la cesta
      button.addEventListener(
        "click",
        ((e) => {
          //accedo al input para recoger el valor de su atributo data-iduni
          let cantidad = document.querySelector(
            `[data-iduni="${element.cod}"]`
          ).value;
          //accedo a el boton para recoger el valor de su atributo data-idbot
          let idbot =
            document.getElementsByTagName("button")[element.cod - 1].dataset
              .idbot;

          //Llamo a la funcion q inserta el producto usando la propiedad privda #cesta en la q instanciamos la clase Cesta
          //Mencionar el uso de bind para que entienda el this en concepto de objeto de la clase cesta y no como referencia al
          //elemento button
          this.#cesta.insertarProducto(idbot, cantidad);
        }).bind(this)
      );
    });
  }
}

//Cuando la ventana cargue lanzamos una instancia de la clase ContProductos
window.addEventListener("load", () => {
  let contproductos = new ContProductos(productos);
});
