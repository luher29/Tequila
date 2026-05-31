import { Router } from 'express';
import distributorsControllers from '../controllers/distributors.controllers.js';

const router = Router();

router.post('/login', distributorsControllers.login);
router.post('/register', distributorsControllers.insertOne);
router.get('/getAll', distributorsControllers.getAll);
router.get('/getOne/:id', distributorsControllers.getOne);
router.get('/debt/:id', distributorsControllers.getDebt);
router.put('/update/:id', distributorsControllers.updateOne);
router.delete('/delete/:id', distributorsControllers.deleteOne);

export default router;