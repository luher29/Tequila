import distributors from "../models/distributors.js";
import notes from "../models/notes.js";

const distributorsDAOs = {};

// Crear un nuevo repartidor (Admin)
distributorsDAOs.insertOne = async (data) => {
    return await distributors.create(data);
};

// Buscar para el Login
distributorsDAOs.login = async (user, password) => {
    // Buscamos un usuario que coincida con el user Y password
    // Nota: En producción usaremos encriptación, por ahora es búsqueda directa
    return await distributors.findOne({ user: user, password: password, active: true });
};

// Obtener todos los distribuidores activos (sin admins)
distributorsDAOs.getAll = async () => {
    return await distributors.find({ active: true, role: { $ne: 'admin' } }, '-password');
};

// Obtener un solo distribuidor por ID
distributorsDAOs.getOne = async (id) => {
    return await distributors.findById(id, '-password');
};

// Actualizar datos de un distribuidor
distributorsDAOs.updateOne = async (id, updateData) => {
    return await distributors.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
};

// Soft delete: desactivar distribuidor (no se borra, solo se marca como inactivo)
distributorsDAOs.softDelete = async (id) => {
    return await distributors.findByIdAndUpdate(id, { active: false }, { new: true }).select('-password');
};

// Obtener deuda de un distribuidor específico
// Suma todas las notas pendientes/parciales de ese distribuidor
distributorsDAOs.getDebt = async (distributorId) => {
    const pendingNotes = await notes.find({ 
        distributor: distributorId, 
        status: { $in: ['PENDIENTE', 'PARCIAL'] } 
    })
    .populate('departureProduct.producto', 'name price')
    .sort({ createdAt: -1 });

    let totalDebt = 0;
    pendingNotes.forEach(note => {
        totalDebt += note.remainingBalance || note.totalAmount || 0;
    });

    return {
        distributor: distributorId,
        totalDebt,
        pendingNotes: pendingNotes.length,
        notes: pendingNotes
    };
};

export default distributorsDAOs;