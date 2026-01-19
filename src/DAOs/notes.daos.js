import notes from "../models/notes.js";
import products from "../models/products.js";

const notesDAOs = {};

// Obtener todas las notas con información detallada
notesDAOs.getAll = async () => {
    return await notes.find()
        .populate('distributor', 'name')
        .populate('departureProduct.producto', 'name price piecesPerBox');
};

// Obtener una sola nota
notesDAOs.getOne = async (numberNote) => {
    return await notes.findOne({ numberNote: numberNote })
        .populate('distributor', 'name')
        .populate('departureProduct.producto', 'name price piecesPerBox');
};

// INSERTAR NOTA CON LÓGICA DE CAJAS, PIEZAS Y VALIDACIÓN DE STOCK
notesDAOs.insertOne = async (noteData) => {
    // 1. Validamos cada producto antes de hacer cualquier cambio
    for (let item of noteData.departureProduct) {
        const productInfo = await products.findById(item.producto);
        
        if (!productInfo) {
            throw new Error(`Producto con ID ${item.producto} no encontrado`);
        }

        // 2. Calculamos el total de piezas según la configuración del producto
        // Fórmula: (Cajas * Piezas por caja) + Piezas sueltas
        const piecesFromBoxes = (item.box || 0) * (productInfo.piecesPerBox || 1);
        const totalToSubtract = piecesFromBoxes + (item.pieces || 0);

        // 3. VALIDACIÓN DE STOCK: ¿Tenemos suficiente?
        if (productInfo.stock < totalToSubtract) {
            throw new Error(
                `Stock insuficiente para ${productInfo.name}. ` +
                `Disponible: ${productInfo.stock}, Requerido: ${totalToSubtract}`
            );
        }

        // 4. Guardamos el cálculo en el objeto para el registro de la nota
        item.total = totalToSubtract;

        // 5. Actualizamos el stock en la base de datos
        await products.findByIdAndUpdate(item.producto, {
            $inc: { stock: -totalToSubtract }
        });
    }

    // 6. Si todos los productos pasaron la validación y se descontaron, creamos la nota
    const newNote = await notes.create(noteData);
    return newNote;
};

// Actualizar nota (Para devoluciones y conciliaciones futuras)
notesDAOs.updateOne = async (numberNote, updateData) => {
    const updatedNote = await notes.findOneAndUpdate(
        { numberNote: numberNote },
        updateData,
        { new: true }
    );
    return updatedNote;
};

// Eliminar nota
notesDAOs.deleteOne = async (numberNote) => {
    const deletedNote = await notes.findOneAndDelete({ numberNote: numberNote });
    
    // NOTA TÉCNICA: Si eliminas una nota, deberías considerar si devuelves 
    // el stock al almacén. Por ahora, solo eliminamos el registro.
    return deletedNote;
};

export default notesDAOs;