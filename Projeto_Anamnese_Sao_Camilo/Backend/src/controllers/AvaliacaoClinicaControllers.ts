import type { Request, Response } from 'express';
import {
  AvaliacaoUngueal,
  AvaliacaoVascular,
  CreateAvaliacaoUnguealInput,
  CreateAvaliacaoVascularInput,
  CreateDeformidadeInput,
  CreateExameDermatologicoInput,
  Deformidade,
  ExameDermatologico,
  UpdateAvaliacaoUnguealInput,
  UpdateAvaliacaoVascularInput,
  UpdateDeformidadeInput,
  UpdateExameDermatologicoInput,
} from '../models/AvaliacaoClinicaModels';

interface AvaliacaoParams {
  id?: string;
}

interface AvaliacaoQuery {
  anamnese_id?: string;
}

type DermatologicoBody = Partial<CreateExameDermatologicoInput>;

type UnguealBody = Partial<CreateAvaliacaoUnguealInput>;
type VascularBody = Partial<CreateAvaliacaoVascularInput>;
type DeformidadeBody = Partial<CreateDeformidadeInput>;

function isDuplicateEntryError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'ER_DUP_ENTRY'
  );
}

function isForeignKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_ROW_IS_REFERENCED_2')
  );
}

function getIdParam(req: Request<AvaliacaoParams>, res: Response): string | null {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: 'Id da avaliacao e obrigatorio.' });
    return null;
  }

  return id;
}

function getAnamneseId(query: AvaliacaoQuery): string | undefined {
  return query.anamnese_id;
}

function handleCreateError(error: unknown, res: Response, entityName: string) {
  if (isDuplicateEntryError(error)) {
    return res.status(409).json({ message: `Esta anamnese ja possui ${entityName} cadastrada.` });
  }

  if (isForeignKeyError(error)) {
    return res.status(400).json({ message: 'Anamnese nao encontrada.' });
  }

  console.error(`Erro ao cadastrar ${entityName}:`, error);
  return res.status(500).json({ message: `Erro ao cadastrar ${entityName}.` });
}

export async function cadastrarExameDermatologico(
  req: Request<unknown, unknown, DermatologicoBody>,
  res: Response,
) {
  try {
    const { anamnese_id } = req.body;

    if (!anamnese_id) {
      return res.status(400).json({ message: 'Anamnese e obrigatoria.' });
    }

    const exame: CreateExameDermatologicoInput = {
      anamnese_id,
      micose: req.body.micose ?? false,
      ressecamento: req.body.ressecamento ?? false,
      maceracao: req.body.maceracao ?? false,
      disidrose: req.body.disidrose ?? false,
      hiperpigmentacao: req.body.hiperpigmentacao ?? false,
      bromidrose: req.body.bromidrose ?? false,
      hiperhidrose: req.body.hiperhidrose ?? false,
      hiperqueratose: req.body.hiperqueratose ?? false,
      fissuras: req.body.fissuras ?? false,
      calos: req.body.calos ?? false,
      verruga: req.body.verruga ?? false,
      ulceracao: req.body.ulceracao ?? false,
      outros: req.body.outros ?? null,
    };

    const exameCriado = await ExameDermatologico.criar(exame);

    return res.status(201).json({ message: 'Exame dermatologico cadastrado com sucesso.', exame: exameCriado });
  } catch (error) {
    return handleCreateError(error, res, 'exame dermatologico');
  }
}

export async function buscarExamesDermatologicos(
  req: Request<unknown, unknown, unknown, AvaliacaoQuery>,
  res: Response,
) {
  try {
    const anamneseId = getAnamneseId(req.query);

    if (anamneseId) {
      const exame = await ExameDermatologico.buscarPorAnamnese(anamneseId);

      if (!exame) {
        return res.status(404).json({ message: 'Exame dermatologico nao encontrado.' });
      }

      return res.status(200).json({ exame });
    }

    const exames = await ExameDermatologico.buscarTodos();
    return res.status(200).json({ exames });
  } catch (error) {
    console.error('Erro ao buscar exames dermatologicos:', error);
    return res.status(500).json({ message: 'Erro ao buscar exames dermatologicos.' });
  }
}

export async function buscarExameDermatologicoPorId(req: Request<AvaliacaoParams>, res: Response) {
  try {
    const id = getIdParam(req, res);

    if (!id) {
      return;
    }

    const exame = await ExameDermatologico.buscarPorId(id);

    if (!exame) {
      return res.status(404).json({ message: 'Exame dermatologico nao encontrado.' });
    }

    return res.status(200).json({ exame });
  } catch (error) {
    console.error('Erro ao buscar exame dermatologico:', error);
    return res.status(500).json({ message: 'Erro ao buscar exame dermatologico.' });
  }
}

export async function atualizarExameDermatologico(
  req: Request<AvaliacaoParams, unknown, UpdateExameDermatologicoInput>,
  res: Response,
) {
  try {
    const id = getIdParam(req, res);

    if (!id) {
      return;
    }

    const exame = await ExameDermatologico.atualizar(id, req.body);

    if (!exame) {
      return res.status(404).json({ message: 'Exame dermatologico nao encontrado.' });
    }

    return res.status(200).json({ message: 'Exame dermatologico atualizado com sucesso.', exame });
  } catch (error) {
    console.error('Erro ao atualizar exame dermatologico:', error);
    return res.status(500).json({ message: 'Erro ao atualizar exame dermatologico.' });
  }
}

export async function deletarExameDermatologico(req: Request<AvaliacaoParams>, res: Response) {
  try {
    const id = getIdParam(req, res);

    if (!id) {
      return;
    }

    const deletado = await ExameDermatologico.deletar(id);

    if (!deletado) {
      return res.status(404).json({ message: 'Exame dermatologico nao encontrado.' });
    }

    return res.status(200).json({ message: 'Exame dermatologico deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar exame dermatologico:', error);
    return res.status(500).json({ message: 'Erro ao deletar exame dermatologico.' });
  }
}

export async function cadastrarAvaliacaoUngueal(
  req: Request<unknown, unknown, UnguealBody>,
  res: Response,
) {
  try {
    const { anamnese_id } = req.body;

    if (!anamnese_id) {
      return res.status(400).json({ message: 'Anamnese e obrigatoria.' });
    }

    const avaliacao: CreateAvaliacaoUnguealInput = {
      anamnese_id,
      onicogrifose_d: req.body.onicogrifose_d ?? false,
      onicogrifose_e: req.body.onicogrifose_e ?? false,
      onicocriptose_d: req.body.onicocriptose_d ?? false,
      onicocriptose_e: req.body.onicocriptose_e ?? false,
      onicomicose_d: req.body.onicomicose_d ?? false,
      onicomicose_e: req.body.onicomicose_e ?? false,
      formato_d: req.body.formato_d ?? null,
      formato_e: req.body.formato_e ?? null,
      outros: req.body.outros ?? null,
    };

    const avaliacaoCriada = await AvaliacaoUngueal.criar(avaliacao);

    return res.status(201).json({ message: 'Avaliacao ungueal cadastrada com sucesso.', avaliacao: avaliacaoCriada });
  } catch (error) {
    return handleCreateError(error, res, 'avaliacao ungueal');
  }
}

export async function buscarAvaliacoesUngueais(
  req: Request<unknown, unknown, unknown, AvaliacaoQuery>,
  res: Response,
) {
  try {
    const anamneseId = getAnamneseId(req.query);

    if (anamneseId) {
      const avaliacao = await AvaliacaoUngueal.buscarPorAnamnese(anamneseId);

      if (!avaliacao) {
        return res.status(404).json({ message: 'Avaliacao ungueal nao encontrada.' });
      }

      return res.status(200).json({ avaliacao });
    }

    const avaliacoes = await AvaliacaoUngueal.buscarTodos();
    return res.status(200).json({ avaliacoes });
  } catch (error) {
    console.error('Erro ao buscar avaliacoes ungueais:', error);
    return res.status(500).json({ message: 'Erro ao buscar avaliacoes ungueais.' });
  }
}

export async function buscarAvaliacaoUnguealPorId(req: Request<AvaliacaoParams>, res: Response) {
  try {
    const id = getIdParam(req, res);

    if (!id) {
      return;
    }

    const avaliacao = await AvaliacaoUngueal.buscarPorId(id);

    if (!avaliacao) {
      return res.status(404).json({ message: 'Avaliacao ungueal nao encontrada.' });
    }

    return res.status(200).json({ avaliacao });
  } catch (error) {
    console.error('Erro ao buscar avaliacao ungueal:', error);
    return res.status(500).json({ message: 'Erro ao buscar avaliacao ungueal.' });
  }
}

export async function atualizarAvaliacaoUngueal(
  req: Request<AvaliacaoParams, unknown, UpdateAvaliacaoUnguealInput>,
  res: Response,
) {
  try {
    const id = getIdParam(req, res);

    if (!id) {
      return;
    }

    const avaliacao = await AvaliacaoUngueal.atualizar(id, req.body);

    if (!avaliacao) {
      return res.status(404).json({ message: 'Avaliacao ungueal nao encontrada.' });
    }

    return res.status(200).json({ message: 'Avaliacao ungueal atualizada com sucesso.', avaliacao });
  } catch (error) {
    console.error('Erro ao atualizar avaliacao ungueal:', error);
    return res.status(500).json({ message: 'Erro ao atualizar avaliacao ungueal.' });
  }
}

export async function deletarAvaliacaoUngueal(req: Request<AvaliacaoParams>, res: Response) {
  try {
    const id = getIdParam(req, res);

    if (!id) {
      return;
    }

    const deletado = await AvaliacaoUngueal.deletar(id);

    if (!deletado) {
      return res.status(404).json({ message: 'Avaliacao ungueal nao encontrada.' });
    }

    return res.status(200).json({ message: 'Avaliacao ungueal deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar avaliacao ungueal:', error);
    return res.status(500).json({ message: 'Erro ao deletar avaliacao ungueal.' });
  }
}

export async function cadastrarAvaliacaoVascular(
  req: Request<unknown, unknown, VascularBody>,
  res: Response,
) {
  try {
    const { anamnese_id } = req.body;

    if (!anamnese_id) {
      return res.status(400).json({ message: 'Anamnese e obrigatoria.' });
    }

    const avaliacao: CreateAvaliacaoVascularInput = {
      anamnese_id,
      coloracao_d: req.body.coloracao_d ?? null,
      coloracao_e: req.body.coloracao_e ?? null,
      temperatura_d: req.body.temperatura_d ?? null,
      temperatura_e: req.body.temperatura_e ?? null,
      edema_d: req.body.edema_d ?? false,
      edema_e: req.body.edema_e ?? false,
      pulso_dorsal_d: req.body.pulso_dorsal_d ?? null,
      pulso_dorsal_e: req.body.pulso_dorsal_e ?? null,
      pulso_tibial_d: req.body.pulso_tibial_d ?? null,
      pulso_tibial_e: req.body.pulso_tibial_e ?? null,
      varizes: req.body.varizes ?? false,
      observacoes: req.body.observacoes ?? null,
    };

    const avaliacaoCriada = await AvaliacaoVascular.criar(avaliacao);

    return res.status(201).json({ message: 'Avaliacao vascular cadastrada com sucesso.', avaliacao: avaliacaoCriada });
  } catch (error) {
    return handleCreateError(error, res, 'avaliacao vascular');
  }
}

export async function buscarAvaliacoesVasculares(
  req: Request<unknown, unknown, unknown, AvaliacaoQuery>,
  res: Response,
) {
  try {
    const anamneseId = getAnamneseId(req.query);

    if (anamneseId) {
      const avaliacao = await AvaliacaoVascular.buscarPorAnamnese(anamneseId);

      if (!avaliacao) {
        return res.status(404).json({ message: 'Avaliacao vascular nao encontrada.' });
      }

      return res.status(200).json({ avaliacao });
    }

    const avaliacoes = await AvaliacaoVascular.buscarTodos();
    return res.status(200).json({ avaliacoes });
  } catch (error) {
    console.error('Erro ao buscar avaliacoes vasculares:', error);
    return res.status(500).json({ message: 'Erro ao buscar avaliacoes vasculares.' });
  }
}

export async function buscarAvaliacaoVascularPorId(req: Request<AvaliacaoParams>, res: Response) {
  try {
    const id = getIdParam(req, res);

    if (!id) {
      return;
    }

    const avaliacao = await AvaliacaoVascular.buscarPorId(id);

    if (!avaliacao) {
      return res.status(404).json({ message: 'Avaliacao vascular nao encontrada.' });
    }

    return res.status(200).json({ avaliacao });
  } catch (error) {
    console.error('Erro ao buscar avaliacao vascular:', error);
    return res.status(500).json({ message: 'Erro ao buscar avaliacao vascular.' });
  }
}

export async function atualizarAvaliacaoVascular(
  req: Request<AvaliacaoParams, unknown, UpdateAvaliacaoVascularInput>,
  res: Response,
) {
  try {
    const id = getIdParam(req, res);

    if (!id) {
      return;
    }

    const avaliacao = await AvaliacaoVascular.atualizar(id, req.body);

    if (!avaliacao) {
      return res.status(404).json({ message: 'Avaliacao vascular nao encontrada.' });
    }

    return res.status(200).json({ message: 'Avaliacao vascular atualizada com sucesso.', avaliacao });
  } catch (error) {
    console.error('Erro ao atualizar avaliacao vascular:', error);
    return res.status(500).json({ message: 'Erro ao atualizar avaliacao vascular.' });
  }
}

export async function deletarAvaliacaoVascular(req: Request<AvaliacaoParams>, res: Response) {
  try {
    const id = getIdParam(req, res);

    if (!id) {
      return;
    }

    const deletado = await AvaliacaoVascular.deletar(id);

    if (!deletado) {
      return res.status(404).json({ message: 'Avaliacao vascular nao encontrada.' });
    }

    return res.status(200).json({ message: 'Avaliacao vascular deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar avaliacao vascular:', error);
    return res.status(500).json({ message: 'Erro ao deletar avaliacao vascular.' });
  }
}

export async function cadastrarDeformidade(
  req: Request<unknown, unknown, DeformidadeBody>,
  res: Response,
) {
  try {
    const { anamnese_id } = req.body;

    if (!anamnese_id) {
      return res.status(400).json({ message: 'Anamnese e obrigatoria.' });
    }

    const deformidade: CreateDeformidadeInput = {
      anamnese_id,
      halux_valgo: req.body.halux_valgo ?? false,
      dedos_garra: req.body.dedos_garra ?? false,
      dedos_martelo: req.body.dedos_martelo ?? false,
      proeminencia_ossea: req.body.proeminencia_ossea ?? false,
      pe_plano_cavo_d: req.body.pe_plano_cavo_d ?? null,
      pe_plano_cavo_e: req.body.pe_plano_cavo_e ?? null,
      claudicacao: req.body.claudicacao ?? false,
      palmilhas: req.body.palmilhas ?? false,
      observacoes: req.body.observacoes ?? null,
    };

    const deformidadeCriada = await Deformidade.criar(deformidade);

    return res.status(201).json({ message: 'Deformidade cadastrada com sucesso.', deformidade: deformidadeCriada });
  } catch (error) {
    return handleCreateError(error, res, 'deformidade');
  }
}

export async function buscarDeformidades(
  req: Request<unknown, unknown, unknown, AvaliacaoQuery>,
  res: Response,
) {
  try {
    const anamneseId = getAnamneseId(req.query);

    if (anamneseId) {
      const deformidade = await Deformidade.buscarPorAnamnese(anamneseId);

      if (!deformidade) {
        return res.status(404).json({ message: 'Deformidade nao encontrada.' });
      }

      return res.status(200).json({ deformidade });
    }

    const deformidades = await Deformidade.buscarTodos();
    return res.status(200).json({ deformidades });
  } catch (error) {
    console.error('Erro ao buscar deformidades:', error);
    return res.status(500).json({ message: 'Erro ao buscar deformidades.' });
  }
}

export async function buscarDeformidadePorId(req: Request<AvaliacaoParams>, res: Response) {
  try {
    const id = getIdParam(req, res);

    if (!id) {
      return;
    }

    const deformidade = await Deformidade.buscarPorId(id);

    if (!deformidade) {
      return res.status(404).json({ message: 'Deformidade nao encontrada.' });
    }

    return res.status(200).json({ deformidade });
  } catch (error) {
    console.error('Erro ao buscar deformidade:', error);
    return res.status(500).json({ message: 'Erro ao buscar deformidade.' });
  }
}

export async function atualizarDeformidade(
  req: Request<AvaliacaoParams, unknown, UpdateDeformidadeInput>,
  res: Response,
) {
  try {
    const id = getIdParam(req, res);

    if (!id) {
      return;
    }

    const deformidade = await Deformidade.atualizar(id, req.body);

    if (!deformidade) {
      return res.status(404).json({ message: 'Deformidade nao encontrada.' });
    }

    return res.status(200).json({ message: 'Deformidade atualizada com sucesso.', deformidade });
  } catch (error) {
    console.error('Erro ao atualizar deformidade:', error);
    return res.status(500).json({ message: 'Erro ao atualizar deformidade.' });
  }
}

export async function deletarDeformidade(req: Request<AvaliacaoParams>, res: Response) {
  try {
    const id = getIdParam(req, res);

    if (!id) {
      return;
    }

    const deletado = await Deformidade.deletar(id);

    if (!deletado) {
      return res.status(404).json({ message: 'Deformidade nao encontrada.' });
    }

    return res.status(200).json({ message: 'Deformidade deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar deformidade:', error);
    return res.status(500).json({ message: 'Erro ao deletar deformidade.' });
  }
}
