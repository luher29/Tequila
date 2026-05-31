import notes from "../models/notes.js";
import products from "../models/products.js";

const notesDAOs = {};

// Obtener todas las notas con información detallada
notesDAOs.getAll = async () => {
    return await notes.find()
        .populate('distributor', 'name user telephone')
        .populate('departureProduct.producto', 'name brand price piecesPerBox')
        .populate('devolucion.producto', 'name brand price piecesPerBox')
        .sort({ createdAt: -1 });
};

// Obtener una sola nota
notesDAOs.getOne = async (numberNote) => {
    return await notes.findOne({ numberNote: numberNote })
        .populate('distributor', 'name user telephone')
        .populate('departureProduct.producto', 'name brand price piecesPerBox')
        .populate('devolucion.producto', 'name brand price piecesPerBox');
};

// Obtener notas por distribuidor (para filtrar deudas individuales)
notesDAOs.getByDistributor = async (distributorId) => {
    return await notes.find({ distributor: distributorId })
        .populate('distributor', 'name user telephone')
        .populate('departureProduct.producto', 'name brand price piecesPerBox')
        .sort({ createdAt: -1 });
};

// INSERTAR NOTA CON LÓGICA DE CAJAS, PIEZAS Y VALIDACIÓN DE STOCK
notesDAOs.insertOne = async (noteData) => {
    let totalAmount = 0;

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

        // 5. Calculamos el monto de este producto
        totalAmount += totalToSubtract * (productInfo.price || 0);

        // 6. Actualizamos el stock en la base de datos
        await products.findByIdAndUpdate(item.producto, {
            $inc: { stock: -totalToSubtract }
        });
    }

    // 7. Establecer el monto total y el balance pendiente
    noteData.totalAmount = totalAmount;
    noteData.remainingBalance = totalAmount;

    // 8. Si pickedUpBy está vacío, dejar vacío (el frontend mostrará el nombre del distribuidor)
    if (!noteData.pickedUpBy || noteData.pickedUpBy.trim() === '') {
        noteData.pickedUpBy = '';
    }

    // 9. Si todos los productos pasaron la validación y se descontaron, creamos la nota
    const newNote = await notes.create(noteData);
    return newNote;
};

// Registrar pago (parcial o total)
notesDAOs.payNote = async (numberNote, paymentData) => {
    const note = await notes.findOne({ numberNote });
    
    if (!note) {
        throw new Error("Nota no encontrada");
    }

    if (note.status === 'PAGADO' || note.status === 'CONCILIADO') {
        throw new Error("Esta nota ya fue liquidada");
    }

    const { cashAmount = 0, transferAmount = 0, noteText = '' } = paymentData;
    const paymentTotal = cashAmount + transferAmount;

    if (paymentTotal <= 0) {
        throw new Error("El monto del pago debe ser mayor a 0");
    }

    // Determinar método de pago de este abono
    let method = 'EFECTIVO';
    if (cashAmount > 0 && transferAmount > 0) {
        method = 'MIXTO';
    } else if (transferAmount > 0) {
        method = 'TRANSFERENCIA';
    }

    // Agregar al historial de pagos
    const paymentEntries = [];
    if (cashAmount > 0) {
        paymentEntries.push({
            date: new Date(),
            amount: cashAmount,
            method: 'EFECTIVO',
            note: noteText
        });
    }
    if (transferAmount > 0) {
        paymentEntries.push({
            date: new Date(),
            amount: transferAmount,
            method: 'TRANSFERENCIA',
            note: noteText
        });
    }

    // Actualizar montos acumulados
    const newCashTotal = (note.cashAmount || 0) + cashAmount;
    const newTransferTotal = (note.transferAmount || 0) + transferAmount;
    const newTotalPaid = (note.totalPaid || 0) + paymentTotal;
    const newRemaining = (note.totalAmount || 0) - newTotalPaid;

    // Determinar nuevo estado
    let newStatus = 'PARCIAL';
    let paymentDate = null;
    if (newRemaining <= 0) {
        newStatus = 'PAGADO';
        paymentDate = new Date();
    }

    // Determinar método de pago general de la nota
    let overallMethod = 'EFECTIVO';
    if (newCashTotal > 0 && newTransferTotal > 0) {
        overallMethod = 'MIXTO';
    } else if (newTransferTotal > 0) {
        overallMethod = 'TRANSFERENCIA';
    }

    const updatedNote = await notes.findOneAndUpdate(
        { numberNote },
        {
            $set: {
                cashAmount: newCashTotal,
                transferAmount: newTransferTotal,
                totalPaid: newTotalPaid,
                remainingBalance: Math.max(0, newRemaining),
                status: newStatus,
                paymentMethod: overallMethod,
                ...(paymentDate && { paymentDate })
            },
            $push: {
                paymentHistory: { $each: paymentEntries }
            }
        },
        { new: true }
    ).populate('distributor', 'name user')
     .populate('departureProduct.producto', 'name brand price');

    return updatedNote;
};

// Procesar devolución (devolver piezas al stock)
notesDAOs.processReturn = async (numberNote, returnData) => {
    const note = await notes.findOne({ numberNote });
    
    if (!note) {
        throw new Error("Nota no encontrada");
    }

    let totalReturnValue = 0;

    // Validar y procesar cada devolución
    for (let item of returnData.devolucion) {
        const productInfo = await products.findById(item.producto);
        
        if (!productInfo) {
            throw new Error(`Producto con ID ${item.producto} no encontrado`);
        }

        const piecesFromBoxes = (item.box || 0) * (productInfo.piecesPerBox || 1);
        const totalToReturn = piecesFromBoxes + (item.pieces || 0);
        item.totalReturn = totalToReturn;
        totalReturnValue += totalToReturn * (productInfo.price || 0);

        // Devolver piezas al stock
        await products.findByIdAndUpdate(item.producto, {
            $inc: { stock: totalToReturn }
        });
    }

    // Actualizar la nota con la devolución y ajustar montos
    const newTotalAmount = (note.totalAmount || 0) - totalReturnValue;
    const newRemaining = newTotalAmount - (note.totalPaid || 0);

    let newStatus = note.status;
    if (newRemaining <= 0 && note.totalPaid > 0) {
        newStatus = 'PAGADO';
    }

    const updatedNote = await notes.findOneAndUpdate(
        { numberNote },
        {
            $set: {
                totalAmount: Math.max(0, newTotalAmount),
                remainingBalance: Math.max(0, newRemaining),
                status: newStatus
            },
            $push: {
                devolucion: { $each: returnData.devolucion }
            }
        },
        { new: true }
    ).populate('distributor', 'name user')
     .populate('departureProduct.producto', 'name brand price')
     .populate('devolucion.producto', 'name brand price');

    return updatedNote;
};

// Actualizar nota (datos generales)
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
    
    // Si se elimina la nota, devolver el stock al almacén
    if (deletedNote && deletedNote.departureProduct) {
        for (let item of deletedNote.departureProduct) {
            await products.findByIdAndUpdate(item.producto, {
                $inc: { stock: item.total || 0 }
            });
        }
    }
    
    return deletedNote;
};

export default notesDAOs;