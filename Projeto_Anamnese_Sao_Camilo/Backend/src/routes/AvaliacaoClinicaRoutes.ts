import { Router } from 'express';
import {
  atualizarAvaliacaoUngueal,
  atualizarAvaliacaoVascular,
  atualizarDeformidade,
  atualizarExameDermatologico,
  buscarAvaliacaoUnguealPorId,
  buscarAvaliacaoVascularPorId,
  buscarAvaliacoesUngueais,
  buscarAvaliacoesVasculares,
  buscarDeformidadePorId,
  buscarDeformidades,
  buscarExameDermatologicoPorId,
  buscarExamesDermatologicos,
  cadastrarAvaliacaoUngueal,
  cadastrarAvaliacaoVascular,
  cadastrarDeformidade,
  cadastrarExameDermatologico,
  deletarAvaliacaoUngueal,
  deletarAvaliacaoVascular,
  deletarDeformidade,
  deletarExameDermatologico,
} from '../controllers/AvaliacaoClinicaControllers';
import { PermitirPerfis, VerificarToken } from '../middlewares/Auth';

const router = Router();
const podeLer = PermitirPerfis('recepcionista', 'podologo', 'administracao');
const podeEditar = PermitirPerfis('podologo', 'administracao');
const apenasAdmin = PermitirPerfis('administracao');

router.post('/dermatologicos/register', VerificarToken, podeEditar, cadastrarExameDermatologico);
router.get('/dermatologicos', VerificarToken, podeLer, buscarExamesDermatologicos);
router.get('/dermatologicos/:id', VerificarToken, podeLer, buscarExameDermatologicoPorId);
router.put('/dermatologicos/:id', VerificarToken, podeEditar, atualizarExameDermatologico);
router.delete('/dermatologicos/:id', VerificarToken, apenasAdmin, deletarExameDermatologico);

router.post('/ungueais/register', VerificarToken, podeEditar, cadastrarAvaliacaoUngueal);
router.get('/ungueais', VerificarToken, podeLer, buscarAvaliacoesUngueais);
router.get('/ungueais/:id', VerificarToken, podeLer, buscarAvaliacaoUnguealPorId);
router.put('/ungueais/:id', VerificarToken, podeEditar, atualizarAvaliacaoUngueal);
router.delete('/ungueais/:id', VerificarToken, apenasAdmin, deletarAvaliacaoUngueal);

router.post('/vasculares/register', VerificarToken, podeEditar, cadastrarAvaliacaoVascular);
router.get('/vasculares', VerificarToken, podeLer, buscarAvaliacoesVasculares);
router.get('/vasculares/:id', VerificarToken, podeLer, buscarAvaliacaoVascularPorId);
router.put('/vasculares/:id', VerificarToken, podeEditar, atualizarAvaliacaoVascular);
router.delete('/vasculares/:id', VerificarToken, apenasAdmin, deletarAvaliacaoVascular);

router.post('/deformidades/register', VerificarToken, podeEditar, cadastrarDeformidade);
router.get('/deformidades', VerificarToken, podeLer, buscarDeformidades);
router.get('/deformidades/:id', VerificarToken, podeLer, buscarDeformidadePorId);
router.put('/deformidades/:id', VerificarToken, podeEditar, atualizarDeformidade);
router.delete('/deformidades/:id', VerificarToken, apenasAdmin, deletarDeformidade);

export default router;
