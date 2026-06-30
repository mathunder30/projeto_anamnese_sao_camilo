import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/UserControllers';
import { PermitirPerfis, VerificarToken } from '../middlewares/Auth';
import { validate } from '../middlewares/Validate';
import { UserRegisterSchema, UserLoginSchema } from '../validators/UserValidator';

const router = Router();

router.post('/register', VerificarToken, PermitirPerfis('administracao'), validate(UserRegisterSchema), registerUser);
router.post('/login', validate(UserLoginSchema), loginUser);

export default router;
