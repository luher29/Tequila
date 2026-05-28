import { model, Schema } from 'mongoose';

const productSchema = new Schema({
    codeBar: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    brand: String,
    price: Number,
    piecesPerBox: Number,
    stock: Number,
    image: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('product', productSchema);