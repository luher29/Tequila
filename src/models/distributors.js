import { model, Schema } from 'mongoose';

const distributorSchema = new Schema({
    name: { type: String, required: true },
    user: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // NUEVO: Esto define si es jefe o empleado
    role: { 
        type: String, 
        default: 'repartidor', 
        enum: ['admin', 'repartidor'] 
    },
    telephone: String,
    active: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});

export default model('distributor', distributorSchema);