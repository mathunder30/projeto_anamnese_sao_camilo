import { Router } from 'express';
import {
  atualizarPaciente,
  buscarPacientePorId,
  buscarPacientes,
  cadastrarPaciente,
  deletarPaciente,
} from '../controllers/PacienteControllers';
import { PermitirPerfis, VerificarToken } from '../middlewares/Auth';

const router = Router();

router.post('/register', VerificarToken, PermitirPerfis('recepcionista', 'administracao'), cadastrarPaciente);
router.get('/', VerificarToken, PermitirPerfis('recepcionista', 'podologo', 'administracao'), buscarPacientes);
router.get('/:id', VerificarToken, PermitirPerfis('recepcionista', 'podologo', 'administracao'), buscarPacientePorId);
router.put('/:id', VerificarToken, PermitirPerfis('recepcionista', 'administracao'), atualizarPaciente);
router.delete('/:id', VerificarToken, PermitirPerfis('administracao'), deletarPaciente);

export default router;
