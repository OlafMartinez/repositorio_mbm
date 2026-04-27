
document.addEventListener("DOMContentLoaded", function () {

  navegacionFija();

  scrollNav();
});

function navegacionFija() {
  const header = document.querySelector(".header");
  const productos = document.querySelector(".productos");

  document.addEventListener("scroll", function () {
    const datos = productos.getBoundingClientRect();

    // Si el bottom es menor a 0, significa que la sección ya se fue hacia arriba
    if (datos.bottom < 1) {
      header.classList.add("fixed-top");
      
    } else {
      header.classList.remove("fixed-top");

    }
  });
}

function scrollNav() {
// 1. Buscamos el botón por su ID
const btnVerMas = document.querySelector('#boton-ver-mas');

if (btnVerMas) {
    btnVerMas.addEventListener('click', () => {
        // 2. Buscamos la sección por su NUEVA clase única
        const seccionTienda = document.querySelector('.ver-productos');

        if (seccionTienda) {
            // 3. El desplazamiento suave
            seccionTienda.scrollIntoView({
                behavior: 'smooth',
                block: 'start' // Alinea el inicio de la sección al tope de la pantalla
            });
        }
    });
}
}



// Arreglo para guardar los productos
let carrito = [];

// Capturamos elementos del DOM
const listaCarrito = document.querySelector('#lista-carrito');
const totalElemento = document.querySelector('#carrito-total');
const contadorBadge = document.querySelector('#contador-badge');

// Evento para escuchar clics en toda la página
document.addEventListener('click', (e) => {
    // Verificamos si el clic fue en un botón de agregar
    if (e.target.classList.contains('btn-agregar')) {
        const nombre = e.target.getAttribute('data-nombre');
        const precio = parseFloat(e.target.getAttribute('data-precio'));

        agregarAlCarrito(nombre, precio);
        
        // Abrir el carrito automáticamente (Opcional)
        const bsOffcanvas = new bootstrap.Offcanvas(document.getElementById('carritoMenu'));
        bsOffcanvas.show();
    }

    // Para ELIMINAR
    if (e.target.classList.contains('btn-eliminar')) {
        const index = e.target.getAttribute('data-index');
        eliminarDelCarrito(index);
    }
});

function agregarAlCarrito(nombre, precio) {
    // Añadimos el objeto al arreglo
    carrito.push({ nombre, precio });
    actualizarCarritoUI();
}

// Función para borrar
function eliminarDelCarrito(index) {
    // .splice elimina un elemento del arreglo en la posición indicada
    carrito.splice(index, 1); 
    
    // Volvemos a dibujar todo para que se vea el cambio
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    // 1. Limpiamos la lista visual para que no se dupliquen los productos
    listaCarrito.innerHTML = '';
    
    // 2. Si no hay nada, mostramos el mensaje de "vacío"
    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<li class="list-group-item text-center text-muted">El carrito está vacío</li>';
    }

    let totalAcumulado = 0;

    // 3. Recorremos el arreglo 'carrito' usando el index para saber la posición de cada producto
    carrito.forEach((producto, index) => {
        totalAcumulado += producto.precio;
        
        const item = document.createElement('li');
        // Agregamos clases de Bootstrap para que se vea ordenado y responsivo
        item.className = 'list-group-item d-flex justify-content-between align-items-center animate__animated animate__fadeIn';
        
        // 4. Insertamos el contenido: Nombre, Precio y el BOTÓN DE ELIMINAR
        // Usamos data-index="${index}" para que el botón sepa a qué producto "matar"
        item.innerHTML = `
            <div class="me-auto">
                <h6 class="my-0 fw-bold">${producto.nombre}</h6>
                <small class="text-muted">$${producto.precio.toLocaleString()} MXN</small>
            </div>
            <button class="btn btn-outline-danger btn-sm btn-eliminar" data-index="${index}">
                &times;
            </button>
        `;
        
        // 5. Metemos el elemento a la lista del HTML
        listaCarrito.appendChild(item);
    });

    // 6. Actualizamos el total con formato de moneda (comas y puntos)
    totalElemento.innerText = `$${totalAcumulado.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
    
    // 7. Actualizamos el globito rojo del Navbar con la cantidad de productos
    contadorBadge.innerText = carrito.length;
}