import { Router } from "express";
import productsControllers from "../controllers/products.controllers.js";

const router = Router();

router.get("/getAll", productsControllers.getAll);
router.get("/getOne/:id", productsControllers.getOne);
router.post("/register", productsControllers.insertOne); // Para el botón "+ NUEVO"
router.put("/updateStock/:id", productsControllers.updateStock); // Para el botón "SUMAR"
router.put("/update/:id", productsControllers.updateOne);
router.delete("/delete/:id", productsControllers.deleteOne);

export default router;