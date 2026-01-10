import products  from "../models/products";

const productsDAO = {};

productsDAO.getAll = async () => {
    const products = await products.find();
    return products;
};

productsDAO.getOne = async (codeBar) => {
    return await products.findOne({ codeBar: codeBar });
};

productsDAO.insertOne = async (productData) => {
    const newProduct = await products.create(productData);
    return newProduct;
};

productsDAO.updateOne = async (codeBar, productData) => {
    const updateProduct = await products.findOneAndUpdate({ codeBar: codeBar }, productData);
    return updateProduct;
};

productsDAO.deleteOne = async (codeBar) =>{
    const deleteProduct = await products.findOneAndDelete({codeBar:codeBar});
    return deleteProduct;

}

export default productsDAO