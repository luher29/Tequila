import Product from "../models/products.js";

const productsDAO = {};

productsDAO.getAll = async () => {
    return await Product.find();
};

productsDAO.getOne = async (codeBar) => {
    return await Product.findOne({ codeBar: codeBar });
};

productsDAO.insertOne = async (productData) => {
    const newProduct = await Product.create(productData);
    return newProduct;
};

productsDAO.updateOne = async (codeBar, productData) => {
    const updateProduct = await Product.findOneAndUpdate(
        { codeBar: codeBar },
        productData,
        { new: true }
    );
    return updateProduct;
};

productsDAO.deleteOne = async (codeBar) => {
    const deleteProduct = await Product.findOneAndDelete({ codeBar: codeBar });
    return deleteProduct;
};

export default productsDAO;