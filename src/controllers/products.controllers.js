import productsDaos from "../DAOs/products.daos.js";

const productsControllers = {};

// Obtener todos los productos
productsControllers.getAll = (req, res) => {
    productsDaos.getAll()
        .then((products) => {
            res.status(200).json({ 
                success: true,
                data: products 
            }); 
        })
        .catch((err) => {
            res.status(500).json({ 
                success: false,
                message: "Error al obtener productos", 
                error: err 
            });
        });
};

// Obtener un solo producto por código de barras
productsControllers.getOne = (req, res) => {
    productsDaos.getOne(req.params.codeBar)
        .then((product) => {
            if (product != null) {
                res.status(200).json({
                    success: true,
                    data: product
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Producto no encontrado"
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: "Error al buscar el producto",
                error: err
            });
        });
};

// Insertar un nuevo producto
productsControllers.insertOne = async (req, res) => {
    productsDaos.insertOne(req.body)
        .then((newProduct) => {
            res.status(201).json({ 
                success: true,
                message: "Producto creado con éxito", 
                data: newProduct 
            });
        })
        .catch((error) => {
            res.status(500).json({ 
                success: false,
                message: "Error al guardar el producto",
                error: error.message 
            });
        });
};

// Actualizar un producto existente
productsControllers.updateOne = async (req, res) => {
    productsDaos.updateOne(req.params.codeBar, req.body)
        .then((updatedProduct) => {
            if (updatedProduct) {
                res.status(200).json({
                    success: true,
                    message: "Producto actualizado correctamente",
                    data: updatedProduct
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "No se pudo actualizar: Producto no encontrado"
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ 
                success: false,
                message: "Error en la actualización",
                error: error.message 
            });
        });
};

// Eliminar un producto
productsControllers.deleteOne = async (req, res) => {
    productsDaos.deleteOne(req.params.codeBar)
        .then((productDeleted) => {
            if (productDeleted) {
                res.status(200).json({
                    success: true,
                    message: "Producto eliminado con éxito",
                    data: productDeleted
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "No se pudo eliminar: Producto no encontrado"
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ 
                success: false,
                message: "Error al intentar eliminar el producto",
                error: error.message 
            });
        });
};

export default productsControllers;