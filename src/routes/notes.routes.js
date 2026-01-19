import { Router } from 'express';
import notesControllers from '../controllers/notes.controllers.js';

const router = Router();

router.get('/getAll', notesControllers.getAll);
router.get('/getOne/:numberNote', notesControllers.getOne);
router.post('/insertOne', notesControllers.insertOne);
router.put('/updateOne/:numberNote', notesControllers.updateOne);

export default router;