import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/UserControllers';
import { PermitirPerfis, VerificarToken } from '../middlewares/Auth';

const router = Router();

router.post('/register', VerificarToken, PermitirPerfis('administracao'), registerUser);
router.post('/login', loginUser);

export default router;
