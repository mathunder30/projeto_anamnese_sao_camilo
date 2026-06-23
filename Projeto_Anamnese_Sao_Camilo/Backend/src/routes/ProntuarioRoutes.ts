import { Router } from 'express';
import {
  atualizarProntuario,
  buscarProntuarioPorId,
  buscarProntuarios,
  cadastrarProntuario,
  deletarProntuario,
} from '../controllers/ProntuarioControllers';
import { PermitirPerfis, VerificarToken } from '../middlewares/Auth';

const router = Router();

router.post('/register', VerificarToken, PermitirPerfis('recepcionista', 'podologo', 'administracao'), cadastrarProntuario);
router.get('/', VerificarToken, PermitirPerfis('recepcionista', 'podologo', 'administracao'), buscarProntuarios);
router.get('/:id', VerificarToken, PermitirPerfis('recepcionista', 'podologo', 'administracao'), buscarProntuarioPorId);
router.put('/:id', VerificarToken, PermitirPerfis('podologo', 'administracao'), atualizarProntuario);
router.delete('/:id', VerificarToken, PermitirPerfis('administracao'), deletarProntuario);

export default router;
