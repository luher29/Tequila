import { Router } from 'express';
import notesControllers from '../controllers/notes.controllers.js';

const router = Router();

router.get('/getAll', notesControllers.getAll);
router.get('/getOne/:numberNote', notesControllers.getOne);
router.get('/byDistributor/:distributorId', notesControllers.getByDistributor);
router.get('/finances', notesControllers.getFinances);
router.post('/insertOne', notesControllers.insertOne);
router.put('/updateOne/:numberNote', notesControllers.updateOne);
router.put('/pay/:numberNote', notesControllers.payNote);
router.put('/return/:numberNote', notesControllers.processReturn);
router.delete('/delete/:numberNote', notesControllers.deleteOne);

export default router;