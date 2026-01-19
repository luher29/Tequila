import distributorsDAOs from "../DAOs/distributors.daos.js";

const distributorsControllers = {};

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

export default distributorsControllers;