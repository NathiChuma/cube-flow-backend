import { Router } from 'express';
import getUserStats from './getUserStats';
import getUserAnalysis from './getUserAnalysis';
import getPlatformStats from './getPlatformStats';

const router = Router();

router.get('/getUserStats/:userId', getUserStats);
router.post('/getUserAnalysis', getUserAnalysis);
router.get('/getPlatformStats', getPlatformStats);

export default router;
