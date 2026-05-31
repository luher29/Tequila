import notesDAOs from "../DAOs/notes.daos.js";
import Note from "../models/notes.js";

const notesControllers = {};

// Obtener todas las notas
notesControllers.getAll = (req, res) => {
    notesDAOs.getAll()
        .then((notes) => {
            res.status(200).json({ success: true, data: notes });
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: "Error al obtener historial", error: err.message });
        });
};

// Obtener una nota por número
notesControllers.getOne = (req, res) => {
    notesDAOs.getOne(req.params.numberNote)
        .then((note) => {
            if (note) res.status(200).json({ success: true, data: note });
            else res.status(404).json({ success: false, message: "La nota no existe" });
        })
        .catch((err) => res.status(500).json({ success: false, error: err.message }));
};

// Obtener notas por distribuidor
notesControllers.getByDistributor = (req, res) => {
    notesDAOs.getByDistributor(req.params.distributorId)
        .then((notes) => {
            res.status(200).json({ success: true, data: notes });
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: "Error al filtrar notas", error: err.message });
        });
};

// Crear nueva nota
notesControllers.insertOne = async (req, res) => {
    notesDAOs.insertOne(req.body)
        .then((newNote) => {
            res.status(201).json({ success: true, message: "Nota creada y stock actualizado", data: newNote });
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: "Error al procesar la nota", error: error.message });
        });
};

// Registrar pago en una nota
notesControllers.payNote = async (req, res) => {
    notesDAOs.payNote(req.params.numberNote, req.body)
        .then((updatedNote) => {
            const msg = updatedNote.status === 'PAGADO' 
                ? "Nota liquidada completamente" 
                : "Abono registrado correctamente";
            res.status(200).json({ success: true, message: msg, data: updatedNote });
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: "Error al registrar pago", error: error.message });
        });
};

// Procesar devolución
notesControllers.processReturn = async (req, res) => {
    notesDAOs.processReturn(req.params.numberNote, req.body)
        .then((updatedNote) => {
            res.status(200).json({ success: true, message: "Devolución procesada y stock restaurado", data: updatedNote });
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: "Error al procesar devolución", error: error.message });
        });
};

// Resumen financiero general
notesControllers.getFinances = async (req, res) => {
    try {
        const allNotes = await Note.find()
            .populate('departureProduct.producto', 'name price piecesPerBox');

        let totalVentas = 0;
        let totalCobrado = 0;
        let totalPendiente = 0;
        let notasPendientes = 0;
        let notasPagadas = 0;

        allNotes.forEach(note => {
            totalVentas += note.totalAmount || 0;
            totalCobrado += note.totalPaid || 0;
            totalPendiente += note.remainingBalance || 0;
            
            if (note.status === 'PENDIENTE' || note.status === 'PARCIAL') {
                notasPendientes++;
            } else if (note.status === 'PAGADO' || note.status === 'CONCILIADO') {
                notasPagadas++;
            }
        });

        res.status(200).json({ 
            success: true, 
            data: {
                totalVentas,
                totalCobrado,
                totalPendiente,
                notasPendientes,
                notasPagadas,
                totalNotas: allNotes.length
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error al calcular finanzas", 
            error: error.message 
        });
    }
};

// Actualizar nota
notesControllers.updateOne = async (req, res) => {
    notesDAOs.updateOne(req.params.numberNote, req.body)
        .then((updatedNote) => {
            if (updatedNote) res.status(200).json({ success: true, data: updatedNote });
            else res.status(404).json({ success: false, message: "Nota no encontrada" });
        })
        .catch((error) => res.status(500).json({ success: false, error: error.message }));
};

// Eliminar nota (y restaurar stock)
notesControllers.deleteOne = async (req, res) => {
    notesDAOs.deleteOne(req.params.numberNote)
        .then((deletedNote) => {
            if (deletedNote) res.status(200).json({ success: true, message: "Nota eliminada y stock restaurado", data: deletedNote });
            else res.status(404).json({ success: false, message: "No existe la nota" });
        })
        .catch((error) => res.status(500).json({ success: false, error: error.message }));
};

export default notesControllers;