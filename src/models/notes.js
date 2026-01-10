import { model, Schema } from 'mongoose';

const noteSchema = new Schema({
    //* El numero de la nota de remisión
    numberNote: { 
        type: String, 
        required: true, 
        unique: true 
    },
    //* A cuenta de ej Raybel
    distributor: { 
        type: Schema.Types.ObjectId, 
        ref: 'driver', 
        required: true 
    },
    departureDate: { type: Date, default: Date.now },
    
    //* Lo que el repartidor se lleva (Carga)
    departureProduct: [{
        producto: {
        type: Schema.Types.ObjectId, 
        ref: 'product' 
    },
        box: Number,
        pieces: Number,
        total: Number // (Cajas * piezasPorCaja) + piezas
    }],

    //* Lo que el repartidor regresa (Devolución)
    devolucion: [{
        producto: { 
            type: Schema.Types.ObjectId, 
            ref: 'product' 
        },
        box: Number,
        pieces: Number,
        totalReturn: Number
    }],

    status: { 
        type: String, 
        enum: ['PENDIENTE', 'PAGADO', 'CONCILIADO'], 
        default: 'PENDIENTE' 
    },
    payRecived: { type: Number, default: 0 }
}, {
    timestamps: true,
    versionKey: false
});

export default model('note', noteSchema);