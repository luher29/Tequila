import entradasDAOs from "../DAOs/mermas.daos.js";

const entradasControllers = {};

// Obtener todas las entradas
entradasControllers.getAll = (req, res) => {
    entradasDAOs.getAll()
        .then((entradas) => {
            res.status(200).json({ success: true, data: entradas });
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: "Error al obtener entradas", error: err.message });
        });
};

// Registrar nueva entrada de mercancía
entradasControllers.insertOne = async (req, res) => {
    entradasDAOs.insertOne(req.body)
        .then((newEntrada) => {
            res.status(201).json({ success: true, message: "Entrada registrada y stock actualizado", data: newEntrada });
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: "Error al registrar entrada", error: error.message });
        });
};

// Obtener entradas por producto
entradasControllers.getByProduct = (req, res) => {
    entradasDAOs.getByProduct(req.params.productId)
        .then((entradas) => {
            res.status(200).json({ success: true, data: entradas });
        })
        .catch((err) => {
            res.status(500).json({ success: false, error: err.message });
        });
};

// Registrar merma (producto defectuoso)
entradasControllers.registerMerma = async (req, res) => {
    entradasDAOs.registerMerma(req.body)
        .then((newMerma) => {
            res.status(201).json({ success: true, message: "Merma registrada y stock actualizado", data: newMerma });
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: "Error al registrar merma", error: error.message });
        });
};

export default entradasControllers;
