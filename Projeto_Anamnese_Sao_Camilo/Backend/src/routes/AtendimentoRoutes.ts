import { Router } from 'express';
import {
  atualizarAtendimento,
  buscarAtendimentoPorId,
  buscarAtendimentos,
  cadastrarAtendimento,
  deletarAtendimento,
} from '../controllers/AtendimentoControllers';
import { PermitirPerfis, VerificarToken } from '../middlewares/Auth';

const router = Router();

router.post('/register', VerificarToken, PermitirPerfis('podologo', 'administracao'), cadastrarAtendimento);
router.get('/', VerificarToken, PermitirPerfis('recepcionista', 'podologo', 'administracao'), buscarAtendimentos);
router.get('/:id', VerificarToken, PermitirPerfis('recepcionista', 'podologo', 'administracao'), buscarAtendimentoPorId);
router.put('/:id', VerificarToken, PermitirPerfis('podologo', 'administracao'), atualizarAtendimento);
router.delete('/:id', VerificarToken, PermitirPerfis('administracao'), deletarAtendimento);

export default router;
