import productsDaos from "../DAOs/products.daos.js";
const productsControllers = {};
productsControllers.getAll = (req, res) => {
    //Aqui le vamos a pedir los datos al DAO 
    //Aqui vamos a responder al cliente
    productsDaos.getAll()
        .then((products) => {res.json({ data: products })})
        .then(products => {
            res.json({ data: products })  
           //*res.render('index.ejs', { products: products })
        })
        .catch((err) => {
            res.status(500).json({
                message: "An error has ocurred",
                error: err
            });
        });
};

productsControllers.getOne = (req, res) => {
    productsDaos.getOne(req.params.codeBar)
        .then((products) => {
            if (products != null) {
                res.json({
                    data: {
                        "product": products
                    }
                })
            } else {
                res.status(404).json({
            data: {
                message: "Product not found "
            }
        })
    }
        })
        .catch((err) => {
            res.status(500).json({
                message: "An error has ocurred",
                error: err
            });
        });
};

productsControllers.insertOne = async (req, res) => {
    productsDaos.insertOne(req.body)
        .then((newProduct) => {
            res.redirect("/api/products/getAll");
        })
        .catch((error) => {
            res.status(500).json({ message: error.message })
        });
}

productsControllers.updateOne = async (req, res) => {
    productsDaos.updateOne(req.params.codeBar, req.body)
        .then((updateProduct) => {
            res.redirect("/api/products/getAll");
        })
        .catch((error) => {
            res.status(500).json({ message: error.message })
        });
}

productsControllers.deleteOne = async (req, res) => {
    productsDaos.deleteOne(req.params.codeBar)
        .then((productDeleted) => {
            if (productDeleted) {
                res.redirect("/api/products/getAll");
            } else {
                res.status(404).json({
                    message: "Product Not Found",
                    student_id: req.params.student_id
                })
            }

        })
        .catch((error) => {
            res.status(500).json({ message: error.message })
        });
}

export default productsControllers;