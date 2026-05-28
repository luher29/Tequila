import mongoose from "./database.js";
import distributors from "./models/distributors.js";

const createAdmin = async () => {
    try {
        const adminFound = await distributors.findOne({ user: "admin" });
        if (adminFound) {
            console.log("El administrador ya existe");
            process.exit(0);
        }

        const admin = new distributors({
            name: "Admin Principal",
            user: "admin",
            password: "admin123", // Para un sistema real se debe encriptar (bcrypt)
            telephone: "1234567890"
        });

        await admin.save();
        console.log("Usuario administrador creado exitosamente");
        process.exit(0);
    } catch (error) {
        console.error("Error al crear administrador:", error);
        process.exit(1);
    }
};

createAdmin();
