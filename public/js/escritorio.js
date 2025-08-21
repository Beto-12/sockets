// public/js/escritorio.js
// Página: escritorio.html
// Usado por empleados para atender tickets.
// - Muestra el número de escritorio.
// - Muestra cuántos tickets hay pendientes.
// - Al hacer clic, atiende el siguiente.

// Referencias del HTML
const lblEscritorio = document.querySelector('h4 small'); // Número de escritorio
const btnAtender = document.querySelector('button');      // Botón de atender
const lblTicketsPendientes = document.getElementById('lblPendientes'); // Pendientes
const lblNuevoTicket = document.getElementById('lblNuevoTicket'); // Texto de ticket atendido

// Conexión al socket
const socket = io();

// Obtener el número de escritorio desde la URL (ej: ?escritorio=1)
const searchParams = new URLSearchParams(window.location.search);
if (!searchParams.has('escritorio')) {
    // Si no tiene escritorio, redirige
    window.location.href = 'index.html';
}
const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio; // Mostrar en pantalla

// Escuchar actualización de tickets pendientes
socket.on('tickets-pendientes', (pendientes) => {
    lblTicketsPendientes.innerText = pendientes;
});

// Evento: hacer clic en "Atender siguiente"
btnAtender.addEventListener('click', () => {
    // Pedimos al servidor que nos dé el siguiente ticket
    socket.emit('atender-ticket', { escritorio }, (ticket) => {
        if (!ticket) {
            // No hay más tickets
            lblNuevoTicket.innerText = 'No hay más tickets';
            return;
        }
        // Mostramos el ticket atendido
        lblNuevoTicket.innerText = `Ticket ${ticket.numero}`;
        // Reproducir sonido (opcional)
        new Audio('/audio/new-ticket.mp3').play();
    });
});