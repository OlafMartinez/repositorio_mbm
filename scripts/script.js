// ==========================================
// 1. ESTADO GLOBAL (Motor de Olaf)
// ==========================================
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ==========================================
// 2. INICIALIZACIÓN
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  navegacionFija();
  scrollNav();
  actualizarContador();
  actualizarCarritoUI(); 
});

// ==========================================
// 3. UI Y NAVEGACIÓN (Código de Javier)
// ==========================================
function navegacionFija() {
  const header = document.querySelector(".header");
  const productos = document.querySelector(".productos");
  if (!header || !productos) return; 

  document.addEventListener("scroll", function () {
    const datos = productos.getBoundingClientRect();
    if (datos.bottom < 1) {
      header.classList.add("fixed-top");
    } else {
      header.classList.remove("fixed-top");
    }
  });
}

function scrollNav() {
  const btnVerMas = document.querySelector('#boton-ver-mas');
  if (btnVerMas) {
    btnVerMas.addEventListener('click', () => {
      const seccionTienda = document.querySelector('.ver-productos');
      if (seccionTienda) {
        seccionTienda.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
}

// ==========================================
// 4. EVENTOS DE CLIC (Javier + Olaf)
// ==========================================
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-agregar')) {
    const nombre = e.target.getAttribute('data-nombre');
    const precio = parseFloat(e.target.getAttribute('data-precio'));
    const imagen = e.target.getAttribute('data-imagen');
    agregarAlCarrito(nombre, precio, imagen);

    const contadorBadge = document.getElementById("contador-badge");
    if (contadorBadge) {
      contadorBadge.classList.add("pop");
      setTimeout(() => contadorBadge.classList.remove("pop"), 300);
    }

    const offcanvasEl = document.getElementById('carritoMenu');
    if (offcanvasEl) {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl) || new bootstrap.Offcanvas(offcanvasEl);
      bsOffcanvas.show();
    }
  }

  if (e.target.classList.contains('btn-eliminar')) {
    const index = e.target.getAttribute('data-index');
    eliminar(index);
  }
});

// ==========================================
// 5. LÓGICA DE DATOS Y ALMACENAMIENTO
// ==========================================
function agregarAlCarrito(nombre, precio, imagen) {
  carrito.push({ nombre, precio, imagen });
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
  actualizarCarritoUI();
}

function eliminar(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
  actualizarCarritoUI();
  if (document.getElementById("lista")) mostrarCarrito();
}

function vaciarCarrito() {
  if (confirm("¿Vaciar todo el carrito?")) {
    localStorage.removeItem("carrito");
    carrito = [];
    actualizarContador();
    actualizarCarritoUI();
    if (document.getElementById("lista")) mostrarCarrito();
  }
}

// ==========================================
// 6. RENDERIZADO VISUAL (clases separadas)
//    Desarrollado por luisdavid_dev
// ==========================================

function actualizarContador() {
  const contadorBadge = document.getElementById("contador-badge");
  const contadorCheckout = document.getElementById("contador-productos");
  if (contadorBadge) contadorBadge.textContent = carrito.length;
  if (contadorCheckout) contadorCheckout.textContent = carrito.length;
}

// Renderiza el Offcanvas (carrito lateral) con clase .img-offcanvas
function actualizarCarritoUI() {
  const listaCarrito = document.querySelector('#lista-carrito');
  const totalElemento = document.querySelector('#carrito-total');
  if (!listaCarrito || !totalElemento) return;

  listaCarrito.innerHTML = '';
  if (carrito.length === 0) {
    listaCarrito.innerHTML = '<li class="list-group-item text-center text-muted">El carrito está vacío</li>';
    totalElemento.innerText = '$0.00';
    return;
  }

  let totalAcumulado = 0;
  carrito.forEach((producto, index) => {
    totalAcumulado += producto.precio;
    const imagenSrc = producto.imagen || 'https://via.placeholder.com/50?text=No+img';

    const item = document.createElement('li');
    item.className = 'list-group-item d-flex justify-content-between align-items-center';
    item.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${imagenSrc}" alt="${producto.nombre}" class="img-offcanvas">
        <div class="ms-2">
          <h6 class="my-0 fw-bold">${producto.nombre}</h6>
          <small class="text-muted">$${producto.precio.toLocaleString()} MXN</small>
        </div>
      </div>
      <button class="btn btn-outline-danger btn-sm btn-eliminar" data-index="${index}">&times;</button>
    `;
    listaCarrito.appendChild(item);
  });
  totalElemento.innerText = `$${totalAcumulado.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
}

// Renderiza la página de checkout (carrito.html) con clase .img-checkout
function mostrarCarrito() {
  const lista = document.getElementById("lista");
  const totalElemento = document.getElementById("total");
  if (!lista) return;

  carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  lista.innerHTML = "";
  let total = 0;

  carrito.forEach((producto, index) => {
    total += producto.precio;
    const imagenSrc = producto.imagen || 'https://via.placeholder.com/70?text=No+img';

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${imagenSrc}" alt="${producto.nombre}" class="img-checkout">
        <div class="ms-2">
          <strong>${producto.nombre}</strong><br>
          <small class="text-muted">$${producto.precio.toLocaleString()} MXN</small>
        </div>
      </div>
      <button class="btn btn-sm btn-danger" onclick="eliminar(${index})">✕</button>
    `;
    lista.appendChild(li);
  });

  if (totalElemento) totalElemento.textContent = `Total: $${total.toFixed(2)}`;
}

