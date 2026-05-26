// ==========================================
// MÓDULO DE FORMULARIO DE CLIENTE
// Desarrollado por luisdavid_dev
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('formCliente');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Capturar datos
    const cliente = {
      nombre: document.getElementById('nombre').value.trim(),
      email: document.getElementById('email').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      direccion: document.getElementById('direccion').value.trim(),
      ciudad: document.getElementById('ciudad').value.trim(),
      cp: document.getElementById('cp').value.trim(),
      metodoPago: document.getElementById('metodoPago').value
    };

    // Validar campos
    if (!cliente.nombre || !cliente.email || !cliente.telefono || !cliente.direccion || !cliente.ciudad || !cliente.cp || !cliente.metodoPago) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cliente.email)) {
      alert('Correo electrónico inválido.');
      return;
    }

    // Obtener carrito actual
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
      alert('No hay productos en tu carrito. Regresa a la tienda.');
      window.location.href = '/index.html';
      return;
    }

    // Calcular total
    const total = carrito.reduce((sum, p) => sum + p.precio, 0);

    // Crear objeto pedido
    const pedido = {
      cliente: cliente,
      productos: carrito,
      total: total,
      fecha: new Date().toISOString()
    };

    // Guardar en localStorage
    localStorage.setItem('pedidoActual', JSON.stringify(pedido));

    // Redirigir a la página de pago
    window.location.href = '/pages/pago.html';
  });
});