import { Router } from 'express';
import signup from './signup';
import signin from './signin';
import forgotPassword from './forgotPassword';
import resetPassword from './resetPassword';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);

export default router;
