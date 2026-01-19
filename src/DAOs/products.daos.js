import products from "../models/products.js";

const productsDAO = {};

// Obtener todos los productos
productsDAO.getAll = async () => {
    // Usamos 'allProducts' para no chocar con el nombre del modelo 'products'
    const allProducts = await products.find();
    return allProducts;
};

// Obtener un producto por su código de barras
productsDAO.getOne = async (codeBar) => {
    const productFound = await products.findOne({ codeBar: codeBar });
    return productFound;
};

// Insertar un nuevo producto
productsDAO.insertOne = async (productData) => {
    const newProduct = await products.create(productData);
    return newProduct;
};

// Actualizar un producto
productsDAO.updateOne = async (codeBar, productData) => {
    // findOneAndUpdate devuelve el objeto antes de ser actualizado por defecto
    const updatedProduct = await products.findOneAndUpdate(
        { codeBar: codeBar }, 
        productData,
        { new: true } // Esta opción hace que devuelva el objeto ya actualizado
    );
    return updatedProduct;
};

// Eliminar un producto
productsDAO.deleteOne = async (codeBar) => {
    const deletedProduct = await products.findOneAndDelete({ codeBar: codeBar });
    return deletedProduct;
};

export default productsDAO;