// sockets/controller.js
// Controlador de eventos de Socket.IO: maneja generación y atención de tickets, y emite estados a clientes

// Importamos el modelo de los tickets.

import Ticket from "../models/tickets.js";

let io = null   // Referencia global a la instancia de Socket.IO para emitir eventos a todos

const socketController = (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Enviar estado inicial al cliente que se conecta
    enviarUltimoTicket(socket);
    emitirEstadoPublico();    // Estado actual (pantalla pública)

    // Evento: cliente pide generar un nuevo ticket
    socket.on('siguiente-ticket', async (payload, callback) => {
        try {
            // Obtener último ticket generado para numeración secuencial
            const ultimo = await Ticket.findOne().sort({ numero: -1});
            const nuevoNumero = ultimo ? ultimo.numero + 1 : 1;

            // Crear y guardar nuevo ticket
            const nuevoTicket = new Ticket({ numero: nuevoNumero })
            await nuevoTicket.save();

            // Notificar a todos los clientes el nuevo estado y conteo de tickets pendientes
            emitirEstadoPublico();
            ioEmit('tickets-pendientes', await Ticket.countDocuments({ estado: 'pendiente' }));
            ioEmit('ticket-actual'); // Activar sonido en pantalla pública

            // Responder al cliente que generó el ticket con los datos del nuevo ticket
            callback(nuevoTicket);

        } catch (error) {
            console.log(error)
        }
    });

    // Evento: escritorio atiende el siguiente ticket pendiente
    socket.on('atender-ticket', async (data, callback) => {
        try {
            // Buscar primer ticket pendiente (orden ascendente)
            const ticket = await Ticket.findOne({ estado: 'pendiente' }).sort({ numero: 1 });

            if (!ticket) {
                callback(null);   // No hay tickets pendientes
                return;
            }

            // Actualizar ticket con escritorio que lo atiende y estado atendido
            ticket.escritorio = data.escritorio;
            ticket.estado = 'atendido';
            await ticket.save();

            // Notificar a todos los clientes el nuevo estado y tickets pendientes actualizados
            emitirEstadoPublico();
            ioEmit('tickets-pendientes', await Ticket.countDocuments({ estado: 'pendiente' }));

            // Enviar al escritorio el ticket que está atendiendo
            callback(ticket);
        } catch (error) {
            console.log(error);
        }
    });

    // Evento: desconexión de cliente
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    })
};

// Función que emite estado actual (último atendido y siguientes pendientes) a todos los clientes
const emitirEstadoPublico = async () => {
    const actual = await Ticket.findOne({ estado: 'atendido' }).sort({ createdAt: -1 });
    const siguientes = await Ticket.find({ estado: 'pendiente' }).sort({ numero: 1 }).limit(3);

    if (io) {
        io.emit('estado-actual', { actual, siguientes });
    }
};

// Función que envía al cliente conectado el número del último ticket generado
const enviarUltimoTicket = async (socket) => {
    const ultimo = await Ticket.findOne().sort({ numero: -1 })
    socket.emit('ultimo-ticket', ultimo ? ultimo.numero : 0);
}

// Función para emitir eventos a todos los clientes desde cualquier sitio del controlador
const ioEmit = (evento, data) => {
    if (io) io.emit(evento, data);
};

// Exportamos controlador y función para asignar la instancia global io desde server.js
export { socketController };
socketController.setIo = (socketIo) => { io = socketIo; };