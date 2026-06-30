import { Router } from 'express';
import {
  atualizarPaciente,
  buscarPacientePorId,
  buscarPacientes,
  cadastrarPaciente,
  deletarPaciente,
} from '../controllers/PacienteControllers';
import { PermitirPerfis, VerificarToken } from '../middlewares/Auth';
import { validate } from '../middlewares/Validate';
import { PacienteCadastroSchema, PacienteAtualizarSchema } from '../validators/PacienteValidator';

const router = Router();

router.post('/register', VerificarToken, PermitirPerfis('recepcionista', 'administracao'), validate(PacienteCadastroSchema), cadastrarPaciente);
router.get('/', VerificarToken, PermitirPerfis('recepcionista', 'podologo', 'administracao'), buscarPacientes);
router.get('/:id', VerificarToken, PermitirPerfis('recepcionista', 'podologo', 'administracao'), buscarPacientePorId);
router.put('/:id', VerificarToken, PermitirPerfis('recepcionista', 'administracao'), validate(PacienteAtualizarSchema), atualizarPaciente);
router.delete('/:id', VerificarToken, PermitirPerfis('administracao'), deletarPaciente);

export default router;
