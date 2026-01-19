import { Router } from 'express';
import productsControllers from '../controllers/products.controllers.js';

const router = Router();

// Definimos los "endpoints" para la App Móvil
router.get('/getAll', productsControllers.getAll);
router.get('/getOne/:codeBar', productsControllers.getOne);
router.post('/insertOne', productsControllers.insertOne);
router.put('/updateOne/:codeBar', productsControllers.updateOne);
router.delete('/deleteOne/:codeBar', productsControllers.deleteOne);

export default router;