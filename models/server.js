// models/server.js
// Clase principal que configura:
// - Express (servidor web)
// - HTTP (para Socket.IO)
// - Socket.IO (comunicación en tiempo real)
// - Middlewares (CORS, archivos estáticos)
// - Rutas (futuras)
// - Conexiones de sockets

import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { socketController } from '../sockets/controller.js';

// Necesario para usar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta raíz del proyecto: sube un nivel desde 'models'
const projectRoot = join(__dirname, '..'); // <- Así apunta a 'Sockets-Colas'

class Server {
    constructor() {
        this.app = express(); // Instancia de Express
        this.port = process.env.PORT || 3000; // Puerto del .env o 3000 por defecto
        this.server = http.createServer(this.app); // Servidor HTTP
        this.io = new SocketIOServer(this.server); // Socket.IO sobre el servidor HTTP

        // Configuración
        this.middlewares();
        this.routes();
        this.sockets();
    }

    // Middlewares: funciones que se ejecutan antes de las rutas
    middlewares() {
        this.app.use(cors()); // Permite peticiones desde otros dominios
        // Sirve archivos estáticos desde la carpeta 'public'
        this.app.use(express.static(join(projectRoot, 'public')));
        console.log('Carpeta pública:', join(projectRoot, 'public'));
    }

    // Rutas de la API (futuras)
    routes() {
        // Ejemplo futuro:
        // this.app.use('/api/auth', require('./routes/auth'));
    }

    // Configuración de Socket.IO
    sockets() {
        // Escucha cuando un cliente se conecta
        this.io.on('connection', (socket) => {
            console.log('Cliente conectado:', socket.id);

            // Ejecuta el controlador de sockets
            socketController(socket);

            // Conecta el controlador con io
            socketController.setIo(this.io);
        });
    }

    // Método para iniciar el servidor
    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en: http://localhost:' + this.port);
        });
    }
}

export { Server };