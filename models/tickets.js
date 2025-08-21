import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    numero: { type: Number, required: true, unique: true },
    escritorio: { type: String, default: null },
    estado: { type: String, enum: ['pendiente', 'atendido'], default: 'pendiente' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Ticket', ticketSchema)