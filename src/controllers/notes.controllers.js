import notesDAOs from "../DAOs/notes.daos.js";

const notesControllers = {};

// Obtener todas las notas (Historial para el Administrador)
notesControllers.getAll = (req, res) => {
    notesDAOs.getAll()
        .then((notes) => {
            res.status(200).json({ 
                success: true, 
                data: notes 
            });
        })
        .catch((err) => {
            res.status(500).json({ 
                success: false, 
                message: "Error al obtener el historial de notas",
                error: err.message 
            });
        });
};

// Obtener una nota específica por su número
notesControllers.getOne = (req, res) => {
    notesDAOs.getOne(req.params.numberNote)
        .then((note) => {
            if (note) {
                res.status(200).json({ 
                    success: true, 
                    data: note 
                });
            } else {
                res.status(404).json({ 
                    success: false, 
                    message: "La nota de remisión no existe" 
                });
            }
        })
        .catch((err) => {
            res.status(500).json({ 
                success: false, 
                error: err.message 
            });
        });
};

// Crear una nota (Salida de mercancía y descuento de stock)
notesControllers.insertOne = async (req, res) => {
    notesDAOs.insertOne(req.body)
        .then((newNote) => {
            res.status(201).json({
                success: true,
                message: "Nota creada y stock actualizado correctamente",
                data: newNote
            });
        })
        .catch((error) => {
            res.status(500).json({ 
                success: false, 
                message: "Error al procesar la nota",
                error: error.message 
            });
        });
};

// Actualizar nota (Para registros de devolución o cambios de estado)
notesControllers.updateOne = async (req, res) => {
    notesDAOs.updateOne(req.params.numberNote, req.body)
        .then((updatedNote) => {
            if (updatedNote) {
                res.status(200).json({
                    success: true,
                    message: "Nota actualizada con éxito",
                    data: updatedNote
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "No se encontró la nota para actualizar"
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ 
                success: false, 
                message: "Error en la actualización de la nota",
                error: error.message 
            });
        });
};

// Eliminar una nota
notesControllers.deleteOne = async (req, res) => {
    notesDAOs.deleteOne(req.params.numberNote)
        .then((deletedNote) => {
            if (deletedNote) {
                res.status(200).json({
                    success: true,
                    message: "Nota eliminada del sistema",
                    data: deletedNote
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "La nota no pudo ser eliminada porque no existe"
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        });
};

export default notesControllers;