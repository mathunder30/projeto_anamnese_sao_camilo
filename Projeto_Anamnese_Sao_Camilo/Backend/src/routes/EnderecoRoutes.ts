import { Router } from 'express';
import {
  atualizarEndereco,
  buscarEnderecoPorId,
  buscarEnderecos,
  cadastrarEndereco,
  deletarEndereco,
} from '../controllers/EnderecoControllers';
import { PermitirPerfis, VerificarToken } from '../middlewares/Auth';

const router = Router();

router.post('/register', VerificarToken, PermitirPerfis('recepcionista', 'administracao'), cadastrarEndereco);
router.get('/', VerificarToken, PermitirPerfis('recepcionista', 'podologo', 'administracao'), buscarEnderecos);
router.get('/:id', VerificarToken, PermitirPerfis('recepcionista', 'podologo', 'administracao'), buscarEnderecoPorId);
router.put('/:id', VerificarToken, PermitirPerfis('recepcionista', 'administracao'), atualizarEndereco);
router.delete('/:id', VerificarToken, PermitirPerfis('administracao'), deletarEndereco);

export default router;
