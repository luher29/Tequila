import { model, Schema } from 'mongoose';

const noteSchema = new Schema({
    //* El numero de la nota de remisión
    numberNote: { 
        type: String, 
        required: true, 
        unique: true 
    },
    //* A cuenta de quién va la deuda (ej. Raybel)
    distributor: { 
        type: Schema.Types.ObjectId, 
        ref: 'distributor', 
        required: true 
    },
    //* Persona que recoge físicamente el producto (puede ser la misma que el distribuidor)
    pickedUpBy: { 
        type: String, 
        default: '' // Si está vacío, se asume que es el mismo distribuidor
    },
    departureDate: { type: Date, default: Date.now },
    
    //* Lo que el repartidor se lleva (Carga)
    departureProduct: [{
        producto: {
            type: Schema.Types.ObjectId, 
            ref: 'products'
        },
        box: Number,
        pieces: Number,
        total: Number // (Cajas * piezasPorCaja) + piezas
    }],

    //* Lo que el repartidor regresa (Devolución)
    devolucion: [{
        producto: { 
            type: Schema.Types.ObjectId, 
            ref: 'products' 
        },
        box: Number,
        pieces: Number,
        totalReturn: Number
    }],

    //* --- INFORMACIÓN FINANCIERA ---
    
    // Monto total de la nota (calculado automáticamente)
    totalAmount: { type: Number, default: 0 },

    // Estado de pago
    status: { 
        type: String, 
        enum: ['PENDIENTE', 'PAGADO', 'PARCIAL', 'CONCILIADO'], 
        default: 'PENDIENTE' 
    },

    // Método de pago
    paymentMethod: { 
        type: String, 
        enum: ['EFECTIVO', 'TRANSFERENCIA', 'MIXTO', 'PENDIENTE'], 
        default: 'PENDIENTE' 
    },

    // Desglose de pago (para pagos mixtos y parciales)
    cashAmount: { type: Number, default: 0 },       // Monto pagado en efectivo
    transferAmount: { type: Number, default: 0 },    // Monto pagado por transferencia
    totalPaid: { type: Number, default: 0 },         // Total pagado hasta ahora
    remainingBalance: { type: Number, default: 0 },  // Lo que falta por pagar

    // Historial de pagos (para liquidaciones parciales)
    paymentHistory: [{
        date: { type: Date, default: Date.now },
        amount: Number,
        method: { type: String, enum: ['EFECTIVO', 'TRANSFERENCIA'] },
        note: String // Nota opcional del pago
    }],

    paymentDate: { type: Date } // Fecha en que se liquida completamente
}, {
    timestamps: true,
    versionKey: false
});

export default model('note', noteSchema);