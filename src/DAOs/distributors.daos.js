import distributors from "../models/distributors.js";

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

distributorsDAOs.getAll = async () => {
    return await distributors.find({ active: true }, '-password'); // No enviamos la contraseña
};

export default distributorsDAOs;