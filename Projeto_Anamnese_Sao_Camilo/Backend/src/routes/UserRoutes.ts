import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/UserControllers';
import { VerificarToken } from '../middlewares/Auth';

const router = Router();

router.post('/register', VerificarToken, registerUser);
router.post('/login', loginUser);

export default router;
