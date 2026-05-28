import distributorsDAOs from "../DAOs/distributors.daos.js";
import jwt from "jsonwebtoken";

const distributorsControllers = {};

distributorsControllers.login = async (req, res) => {
    const { user, password } = req.body;
    
    distributorsDAOs.login(user, password)
        .then((distributor) => {
            if (distributor) {
                const token = jwt.sign({ id: distributor._id }, "tequila_secret_key", {
                    expiresIn: 86400 // 24 hours
                });

                res.status(200).json({
                    success: true,
                    message: "Bienvenido al sistema",
                    token: token,
                    data: {
                        id: distributor._id,
                        name: distributor.name,
                        user: distributor.user
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

distributorsControllers.insertOne = async (req, res) => {
    distributorsDAOs.insertOne(req.body)
        .then((newDist) => {
            res.status(201).json({ success: true, data: newDist });
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: err.message });
        });
};

distributorsControllers.getAll = (req, res) => {
    distributorsDAOs.getAll()
        .then((distributors) => {
            res.status(200).json(distributors);
        })
        .catch((err) => {
            res.status(500).json({ success: false, error: err.message });
        });
};

export default distributorsControllers;
