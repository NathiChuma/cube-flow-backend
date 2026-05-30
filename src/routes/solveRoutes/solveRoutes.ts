import { Router } from 'express';
import addSolve from './addSolve';
import getUserRecentSolves from './getUserRecentSolves';
import getAllSolves from './getAllSolves';
import deleteSolve from './deleteSolve';

const router = Router();

router.post('/addSolve', addSolve);
router.get('/getUserRecentSolves/:userId', getUserRecentSolves);
router.get('/getAllSolves', getAllSolves);
router.delete('/deleteSolve/:id', deleteSolve);

export default router;
