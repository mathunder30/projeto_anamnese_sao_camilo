import { Router } from 'express';
import {
  atualizarPaciente,
  buscarPacientePorId,
  buscarPacientes,
  cadastrarPaciente,
  deletarPaciente,
} from '../controllers/PacienteControllers';
import { VerificarToken } from '../middlewares/Auth';

const router = Router();

router.post('/register', VerificarToken, cadastrarPaciente);
router.get('/', VerificarToken, buscarPacientes);
router.get('/:id', VerificarToken, buscarPacientePorId);
router.put('/:id', VerificarToken, atualizarPaciente);
router.delete('/:id', VerificarToken, deletarPaciente);

export default router;
