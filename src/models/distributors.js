import { model, Schema } from 'mongoose';

const distributorSchema = new Schema({
    name: {
        type: String, 
        required: true 
    },
    user: { 
        type: String, 
        required: true, 
        unique: true 
    }, // Su ID de acceso
    password: { 
        type: String, 
        required: true 
    }, // Contraseña encriptada después
    telephone: String,
    active: { 
        type: Boolean, 
        default: true 
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('distributor', distributorSchema);