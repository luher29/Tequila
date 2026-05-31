import distributorsDAOs from "../DAOs/distributors.daos.js";

const distributorsControllers = {};

// Login
distributorsControllers.login = async (req, res) => {
    const { user, password } = req.body;
    
    distributorsDAOs.login(user, password)
        .then((distributor) => {
            if (distributor) {
                res.status(200).json({
                    success: true,
                    message: "Bienvenido al sistema",
                    data: {
                        id: distributor._id,
                        name: distributor.name,
                        user: distributor.user,
                        role: distributor.role
                    }
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: "Usuario o contraseña incorrectos"
                });
            }
        })
        .catch((err) => {
            res.status(500).json({ success: false, error: err.message });
        });
};

// Obtener todos los distribuidores activos
distributorsControllers.getAll = async (req, res) => {
    distributorsDAOs.getAll()
        .then((distributors) => {
            res.status(200).json({ success: true, data: distributors });
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: "Error al obtener distribuidores", error: err.message });
        });
};

// Obtener un distribuidor por ID
distributorsControllers.getOne = async (req, res) => {
    distributorsDAOs.getOne(req.params.id)
        .then((distributor) => {
            if (distributor) {
                res.status(200).json({ success: true, data: distributor });
            } else {
                res.status(404).json({ success: false, message: "Distribuidor no encontrado" });
            }
        })
        .catch((err) => {
            res.status(500).json({ success: false, error: err.message });
        });
};

// Registrar nuevo distribuidor
distributorsControllers.insertOne = async (req, res) => {
    distributorsDAOs.insertOne(req.body)
        .then((newDist) => {
            res.status(201).json({ success: true, message: "Distribuidor creado con éxito", data: newDist });
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: err.message });
        });
};

// Actualizar distribuidor
distributorsControllers.updateOne = async (req, res) => {
    distributorsDAOs.updateOne(req.params.id, req.body)
        .then((updatedDist) => {
            if (updatedDist) {
                res.status(200).json({ success: true, message: "Distribuidor actualizado", data: updatedDist });
            } else {
                res.status(404).json({ success: false, message: "Distribuidor no encontrado" });
            }
        })
        .catch((err) => {
            res.status(500).json({ success: false, error: err.message });
        });
};

// Eliminar distribuidor (soft delete)
distributorsControllers.deleteOne = async (req, res) => {
    distributorsDAOs.softDelete(req.params.id)
        .then((deletedDist) => {
            if (deletedDist) {
                res.status(200).json({ success: true, message: "Distribuidor desactivado del sistema", data: deletedDist });
            } else {
                res.status(404).json({ success: false, message: "Distribuidor no encontrado" });
            }
        })
        .catch((err) => {
            res.status(500).json({ success: false, error: err.message });
        });
};

// Consultar deuda de un distribuidor
distributorsControllers.getDebt = async (req, res) => {
    distributorsDAOs.getDebt(req.params.id)
        .then((debtInfo) => {
            res.status(200).json({ success: true, data: debtInfo });
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: "Error al consultar deuda", error: err.message });
        });
};

export default distributorsControllers;