import { model, Schema } from 'mongoose';

const entradaSchema = new Schema({
    // Producto que se surtió
    producto: { 
        type: Schema.Types.ObjectId, 
        ref: 'products', 
        required: true 
    },
    // Cantidad de piezas que entraron
    quantity: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    // Cajas recibidas (opcional, para referencia)
    boxes: { type: Number, default: 0 },
    // Fecha en que trajeron la mercancía
    supplyDate: { 
        type: Date, 
        required: true,
        default: Date.now 
    },
    // Proveedor o referencia
    supplier: { type: String, default: '' },
    // Nota adicional
    description: { type: String, default: '' },
    // Quién registró la entrada
    registeredBy: { type: String, default: 'Admin' }
}, {
    timestamps: true,
    versionKey: false
});

export default model('entrada', entradaSchema);
