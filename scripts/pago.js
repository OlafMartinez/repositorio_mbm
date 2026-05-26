// =============================================
// MÓDULO DE PAGO FINAL - CON ESTILOS DIRECTOS
// =============================================

document.addEventListener('DOMContentLoaded', function() {
  cargarResumenCarrito();
  cargarDatosEnvio();

  const formPago = document.getElementById('form-pago');
  if (formPago) {
    formPago.addEventListener('submit', function(e) {
      e.preventDefault();
      procesarPago();
    });
  }
});

function cargarResumenCarrito() {
  const lista = document.getElementById('lista-resumen');
  const totalSpan = document.getElementById('total');
  const contadorSpan = document.getElementById('contador-productos');
  if (!lista) return;

  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
  if (carrito.length === 0) {
    lista.innerHTML = '<li class="list-group-item text-center text-muted">No hay productos en tu carrito</li>';
    if (totalSpan) totalSpan.innerText = '$0.00';
    if (contadorSpan) contadorSpan.innerText = '0';
    return;
  }

  lista.innerHTML = '';
  let total = 0;

  carrito.forEach((producto, index) => {
    total += producto.precio;
    const imagenSrc = producto.imagen || 'https://via.placeholder.com/70?text=No+img';
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex align-items-center py-2';
    // 🔥 Estilo inline fijo para garantizar tamaño 70x70 y object-fit cover
    li.innerHTML = `
      <img src="${imagenSrc}" alt="${producto.nombre}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px; margin-right: 12px;">
      <div class="flex-grow-1 ms-2">
        <strong>${producto.nombre}</strong><br>
        <small>$${producto.precio.toLocaleString()} MXN</small>
      </div>
    `;
    lista.appendChild(li);
  });

  if (totalSpan) totalSpan.innerText = `$${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  if (contadorSpan) contadorSpan.innerText = carrito.length;
}

function cargarDatosEnvio() {
  const pedido = JSON.parse(localStorage.getItem('pedidoActual'));
  if (!pedido || !pedido.cliente) {
    window.location.href = '/pages/ubicacion-cliente.html';
    return;
  }

  const cliente = pedido.cliente;
  document.getElementById('envio-nombre').innerText = cliente.nombre || '—';
  document.getElementById('envio-direccion').innerText = cliente.direccion || '—';
  document.getElementById('envio-ciudad-cp').innerText = `${cliente.ciudad || '—'}, ${cliente.cp || '—'}`;
  document.getElementById('envio-telefono').innerText = cliente.telefono || '—';
  document.getElementById('envio-email').innerText = cliente.email || '—';
}

function procesarPago() {
  const cardName = document.getElementById('cardName').value.trim();
  const cardNumber = document.getElementById('cardNumber').value.trim();
  const cardExp = document.getElementById('cardExp').value.trim();
  const cardCvv = document.getElementById('cardCvv').value.trim();

  if (!cardName || !cardNumber || !cardExp || !cardCvv) {
    alert('❌ Por favor, completa todos los datos de pago.');
    return;
  }

  alert('✅ ¡Pago realizado con éxito! Tu pedido ha sido registrado.\nTe enviaremos un correo con los detalles.');

  localStorage.removeItem('carrito');
  localStorage.removeItem('pedidoActual');
  window.location.href = '/index.html';
}