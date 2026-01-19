import { Router } from 'express';
import distributorsControllers from '../controllers/distributors.controllers.js';

const router = Router();

router.post('/login', distributorsControllers.login);
router.post('/register', distributorsControllers.insertOne);

export default router;