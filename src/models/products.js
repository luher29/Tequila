import {model,Schema} from 'mongoose';

const productSchema = new Schema({
    codeBar: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    brand: String,
    price : Number,
    piecesPerBox: Number,
    stock: Number
},{
    timestamps: true,
    versionKey
});

export default model('product', productSchema);