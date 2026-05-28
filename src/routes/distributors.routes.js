import { Router } from 'express';
import distributorsControllers from '../controllers/distributors.controllers.js';

const router = Router();

// GET todos los distribuidores activos
router.get('/getAll', distributorsControllers.getAll);

router.post('/login', distributorsControllers.login);
router.post('/register', distributorsControllers.insertOne);

export default router;
