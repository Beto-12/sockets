// public/js/nuevo-ticket.js
// Página: nuevo-ticket.html
// Permite generar un nuevo ticket.
// - Al cargar, muestra el último ticket.
// - Al hacer clic, genera uno nuevo y lo muestra.

// Referencia al elemento que muestra el número
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear = document.querySelector('button'); // Botón de generar

// Conexión al servidor mediante Socket.IO
const socket = io();

// Cuando el cliente se conecta
socket.on('connect', () => {
    console.log('Conectado al servidor');
});

// Escucha cuando el servidor manda el último ticket generado
socket.on('ultimo-ticket', (ultimo) => {
    lblNuevoTicket.innerText = `Ticket ${ultimo}`;
});

// Evento: hacer clic en "Generar nuevo ticket"
btnCrear.addEventListener('click', () => {
    // Emitimos al servidor: queremos un nuevo ticket
    socket.emit('siguiente-ticket', null, (ticket) => {
        // El servidor responde con el nuevo número
        lblNuevoTicket.innerText = `Ticket ${ticket.numero}`;
    });
});