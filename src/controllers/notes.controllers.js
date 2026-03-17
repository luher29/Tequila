import notesDAOs from "../DAOs/notes.daos.js";
import Note from "../models/notes.js"; // Necesario para la consulta financiera

const notesControllers = {};

// --- FUNCIONES EXISTENTES ---

notesControllers.getAll = (req, res) => {
    notesDAOs.getAll()
        .then((notes) => {
            res.status(200).json({ success: true, data: notes });
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: "Error al obtener historial", error: err.message });
        });
};

notesControllers.getOne = (req, res) => {
    notesDAOs.getOne(req.params.numberNote)
        .then((note) => {
            if (note) res.status(200).json({ success: true, data: note });
            else res.status(404).json({ success: false, message: "La nota no existe" });
        })
        .catch((err) => res.status(500).json({ success: false, error: err.message }));
};

notesControllers.insertOne = async (req, res) => {
    notesDAOs.insertOne(req.body)
        .then((newNote) => {
            res.status(201).json({ success: true, message: "Nota creada y stock actualizado", data: newNote });
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: "Error al procesar la nota", error: error.message });
        });
};

// --- EL "CEREBRO" FINANCIERO (NUEVO) ---

notesControllers.getFinances = async (req, res) => {
    try {
        // Obtenemos todas las notas y traemos los datos del producto (especialmente el precio)
        const notes = await Note.find().populate('producto');
        let totalVentas = 0;

        notes.forEach(note => {
            if (note.producto) {
                // Cálculo: ((Cajas * Piezas por caja) + Piezas sueltas) * Precio del producto
                const totalPiezas = (note.boxes * (note.producto.piecesPerBox || 0)) + (note.pieces || 0);
                totalVentas += totalPiezas * (note.producto.price || 0);
            }
        });

        res.status(200).json({ 
            success: true, 
            totalVentas: totalVentas,
            totalNotas: notes.length 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error al calcular finanzas", 
            error: error.message 
        });
    }
};

// --- MANTENEMOS LAS DEMÁS FUNCIONES ---

notesControllers.updateOne = async (req, res) => {
    notesDAOs.updateOne(req.params.numberNote, req.body)
        .then((updatedNote) => {
            if (updatedNote) res.status(200).json({ success: true, data: updatedNote });
            else res.status(404).json({ success: false, message: "Nota no encontrada" });
        })
        .catch((error) => res.status(500).json({ success: false, error: error.message }));
};

notesControllers.deleteOne = async (req, res) => {
    notesDAOs.deleteOne(req.params.numberNote)
        .then((deletedNote) => {
            if (deletedNote) res.status(200).json({ success: true, data: deletedNote });
            else res.status(404).json({ success: false, message: "No existe la nota" });
        })
        .catch((error) => res.status(500).json({ success: false, error: error.message }));
};

export default notesControllers;