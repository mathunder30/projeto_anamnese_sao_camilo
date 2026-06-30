import { Router } from 'express';
import {
  atualizarAnamnese,
  buscarAnamnesePorId,
  buscarAnamneses,
  cadastrarAnamnese,
  deletarAnamnese,
} from '../controllers/AnamneseControllers';
import { PermitirPerfis, VerificarToken } from '../middlewares/Auth';
import { validate } from '../middlewares/Validate';
import { AnamneseCadastroSchema, AnamneseAtualizarSchema } from '../validators/AnamneseValidator';

const router = Router();

router.post('/register', VerificarToken, PermitirPerfis('podologo', 'administracao'), validate(AnamneseCadastroSchema), cadastrarAnamnese);
router.get('/', VerificarToken, PermitirPerfis('recepcionista', 'podologo', 'administracao'), buscarAnamneses);
router.get('/:id', VerificarToken, PermitirPerfis('recepcionista', 'podologo', 'administracao'), buscarAnamnesePorId);
router.put('/:id', VerificarToken, PermitirPerfis('podologo', 'administracao'), validate(AnamneseAtualizarSchema), atualizarAnamnese);
router.delete('/:id', VerificarToken, PermitirPerfis('administracao'), deletarAnamnese);

export default router;
