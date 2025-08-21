// public/js/publico.js
// Página: publico.html
// Pantalla pública que muestra:
// - El ticket actual (grande)
// - Los siguientes 3 tickets
// - Suena cuando cambia el ticket

// Referencias del HTML
const lblTicket1 = document.getElementById('lblTicket1');       // Ticket actual
const lblEscritorio1 = document.getElementById('lblEscritorio1'); // Escritorio actual

// Arreglo con los elementos de los siguientes tickets
const others = [
    [document.getElementById('lblTicket2'), document.getElementById('lblEscritorio2')],
    [document.getElementById('lblTicket3'), document.getElementById('lblEscritorio3')],
    [document.getElementById('lblTicket4'), document.getElementById('lblEscritorio4')]
];

// Conexión al servidor
const socket = io();

// Escuchar cuando el servidor manda el estado actual
socket.on('estado-actual', (payload) => {
    console.log('Recibido en publico:', payload)
    const { actual, siguientes } = payload;

    // Mostrar el ticket actual
    if (actual) {
        lblTicket1.innerText = `Ticket ${actual.numero}`;
        lblEscritorio1.innerText = actual.escritorio ? `Escritorio ${actual.escritorio}` : '...';
    } else {
        lblTicket1.innerText = 'No hay nadie';
        lblEscritorio1.innerText = '...';
    }

    // Mostrar los siguientes 3 tickets
    for (let i = 0; i < 3; i++) {
        const [lblT, lblE] = others[i]; // Etiquetas de ticket y escritorio
        const t = siguientes[i];        // Ticket correspondiente

        if (t) {
            lblT.innerText = `Ticket ${t.numero}`;
            lblE.innerText = t.escritorio ? `Escritorio ${t.escritorio}` : '...';
        } else {
            lblT.innerText = 'No hay ticket';
            lblE.innerText = '...';
        }
    }
});

// Escuchar cuando se atiende un nuevo ticket (para sonido)
/* socket.on('ticket-actual', () => {
    // Reproducir sonido (opcional)
    new Audio('/audio/new-ticket.mp3').play();
}); */