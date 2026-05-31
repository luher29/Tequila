import { Router } from 'express';
import entradasControllers from '../controllers/mermas.controllers.js';

const router = Router();

router.get('/getAll', entradasControllers.getAll);
router.post('/register', entradasControllers.insertOne);
router.get('/byProduct/:productId', entradasControllers.getByProduct);

export default router;
