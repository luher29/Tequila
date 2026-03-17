import Product from "../models/products.js"; // Asegúrate de que el nombre coincida

const productsDaos = {};

// Obtener todos los tequilas
productsDaos.getAll = async () => {
    return await Product.find();
};

// Obtener un solo tequila por su ID de MongoDB
productsDaos.getOne = async (id) => {
    return await Product.findById(id);
};

// Insertar un nuevo tequila (Solo para el Admin)
productsDaos.insertOne = async (productData) => {
    return await Product.create(productData);
};

// Actualizar un producto o el stock (Suma de piezas)
productsDaos.updateOne = async (id, updateData) => {
    // El tercer parámetro {new: true} devuelve el objeto ya actualizado
    return await Product.findByIdAndUpdate(id, updateData, { new: true });
};

// Eliminar un producto del catálogo
productsDaos.deleteOne = async (id) => {
    return await Product.findByIdAndDelete(id);
};

export default productsDaos;