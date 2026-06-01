import Entrada from "../models/mermas.js";
import Product from "../models/products.js";

const entradasDAOs = {};

// Obtener todas las entradas de mercancía
entradasDAOs.getAll = async () => {
    return await Entrada.find()
        .populate('producto', 'name brand price piecesPerBox')
        .sort({ supplyDate: -1 });
};

// Registrar una entrada (sumando al stock)
entradasDAOs.insertOne = async (entradaData) => {
    const productInfo = await Product.findById(entradaData.producto);
    
    if (!productInfo) {
        throw new Error("Producto no encontrado");
    }

    // Si vienen cajas, calcular piezas totales
    let totalPieces = entradaData.quantity || 0;
    if (entradaData.boxes && entradaData.boxes > 0) {
        totalPieces = (entradaData.boxes * (productInfo.piecesPerBox || 1)) + (entradaData.quantity || 0);
    }

    // Guardar la cantidad real calculada
    entradaData.quantity = totalPieces;

    // SUMAR al stock
    await Product.findByIdAndUpdate(entradaData.producto, {
        $inc: { stock: totalPieces }
    });

    // Crear el registro de entrada
    return await Entrada.create(entradaData);
};

// Obtener entradas por producto (historial de surtido de un producto)
entradasDAOs.getByProduct = async (productId) => {
    return await Entrada.find({ producto: productId })
        .populate('producto', 'name brand price piecesPerBox')
        .sort({ supplyDate: -1 });
};

// Registrar merma (piezas defectuosas — resta del stock)
entradasDAOs.registerMerma = async (mermaData) => {
    const productInfo = await Product.findById(mermaData.producto);
    if (!productInfo) throw new Error("Producto no encontrado");

    let totalPieces = mermaData.quantity || 0;
    if (mermaData.boxes && mermaData.boxes > 0) {
        totalPieces = (mermaData.boxes * (productInfo.piecesPerBox || 1)) + (mermaData.quantity || 0);
    }

    if (totalPieces > productInfo.stock) {
        throw new Error(`Stock insuficiente. Stock actual: ${productInfo.stock}, intentas retirar: ${totalPieces}`);
    }

    mermaData.quantity = totalPieces;
    mermaData.type = 'merma';

    // RESTAR del stock
    await Product.findByIdAndUpdate(mermaData.producto, {
        $inc: { stock: -totalPieces }
    });

    return await Entrada.create(mermaData);
};

export default entradasDAOs;
