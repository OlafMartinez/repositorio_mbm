// ==========================================
// MÓDULO DE GESTIÓN DEL CARRITO PARA CHECKOUT
// Autor: luisdavid_dev
// ==========================================

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

document.addEventListener("DOMContentLoaded", function () {
  mostrarCarrito();
  actualizarContador();
});

function mostrarCarrito() {
  const lista = document.getElementById("lista");
  const totalElemento = document.getElementById("total");
  if (!lista) return;

  carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  lista.innerHTML = "";

  if (carrito.length === 0) {
    lista.innerHTML = '<li class="list-group-item text-center text-muted">✨ No hay productos en tu carrito</li>';
    if (totalElemento) totalElemento.innerText = "$0.00";
    actualizarContador();
    actualizarBotonContinuar();
    return;
  }

  let total = 0;
  carrito.forEach((producto, index) => {
    total += producto.precio;
    const imagenSrc = producto.imagen || "https://via.placeholder.com/70?text=No+img";
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center py-3";
    li.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${imagenSrc}" alt="${producto.nombre}" class="img-checkout">
        <div class="ms-2">
          <strong class="d-block">${producto.nombre}</strong>
          <small class="text-muted">$${producto.precio.toLocaleString()} MXN</small>
        </div>
      </div>
      <button class="btn btn-outline-danger btn-sm" onclick="eliminarProducto(${index})">✕</button>
    `;
    lista.appendChild(li);
  });

  if (totalElemento) {
    totalElemento.innerText = `$${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
  }
  actualizarContador();
  actualizarBotonContinuar();
}

function actualizarBotonContinuar() {
  const btnContinuar = document.querySelector('.btn-success');
  if (!btnContinuar) return;
  if (carrito.length === 0) {
    btnContinuar.disabled = true;
    btnContinuar.title = 'Agrega productos para continuar';
    btnContinuar.style.opacity = '0.6';
    btnContinuar.style.cursor = 'not-allowed';
  } else {
    btnContinuar.disabled = false;
    btnContinuar.title = '';
    btnContinuar.style.opacity = '';
    btnContinuar.style.cursor = '';
  }
}

function eliminarProducto(index) {
  let carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
  carritoActual.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carritoActual));
  carrito = carritoActual;
  mostrarCarrito();
  actualizarContador();
}

function eliminar(index) {
  eliminarProducto(index);
}

function vaciarCarrito() {
  if (confirm("¿Eliminar todos los productos del carrito?")) {
    localStorage.removeItem("carrito");
    carrito = [];
    mostrarCarrito();
    actualizarContador();
  }
}

function actualizarContador() {
  const contadorCheckout = document.getElementById("contador-productos");
  const contadorBadge = document.getElementById("contador-badge");
  const cantidad = carrito.length;
  if (contadorCheckout) contadorCheckout.textContent = cantidad;
  if (contadorBadge) contadorBadge.textContent = cantidad;
}

function continuarPago() {
  const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
  if (carritoActual.length === 0) {
    alert('⚠️ Tu carrito está vacío. Agrega productos antes de continuar.');
    return false;
  }
  window.location.href = '/pages/ubicacion-cliente.html';
}