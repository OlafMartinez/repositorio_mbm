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
    localStorage.setItem('carritoDeportivo', JSON.stringify(carrito));
    
    actualizarCarritoUI();
}
// Función para borrar
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem('carritoDeportivo', JSON.stringify(carrito));
    
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

const carritoGuardado = localStorage.getItem('carritoDeportivo');
if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarCarritoUI();
}






