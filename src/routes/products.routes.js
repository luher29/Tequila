import { Router } from 'express';
import productsControllers from '../controllers/products.controllers.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// GET todas los productos
router.get('/', productsControllers.getAll);

// GET un producto por código de barras
router.get('/:codeBar', productsControllers.getOne);

// POST crear un nuevo producto
router.post('/', verifyToken, productsControllers.insertOne);

// PUT actualizar un producto por código de barras
router.put('/:codeBar', verifyToken, productsControllers.updateOne);

// DELETE eliminar un producto por código de barras
router.delete('/:codeBar', verifyToken, productsControllers.deleteOne);

export default router;
