// App.js
// Archivo principal que inicia el servidor.
// 1. Carga las variables de entorno.
// 2. Importa la clase Server.
// 3. Crea una instancia y la inicia.

import 'dotenv/config'; // Carga el archivo .env (ej: PORT=3000)
import { Server } from './models/server.js'; // Importa la clase del servidor
import mongoose from 'mongoose';

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a MongoDB');
        
        // Crea una nueva instancia del servidor
        const server = new Server();

        // Inicia el servidor y escucha en el puerto definido
        server.listen();
    } catch (error) {
        console.error('Error al conectar con MongoDB', error.message);
    }
};

startServer();