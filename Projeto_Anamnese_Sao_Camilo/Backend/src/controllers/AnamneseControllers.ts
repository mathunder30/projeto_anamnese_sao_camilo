import type { Request, Response, NextFunction } from 'express';
import Anamnese, { CreateAnamneseInput, UpdateAnamneseInput } from '../models/AnamneseModels';

interface AnamneseBody {
  prontuario_id: string;
  tipo_diabete?: string | null;
  tempo_diabetes?: string | null;
  hemoglobina_glicada?: number | null;
  retinopatia?: boolean;
  neuropatia?: boolean;
  nefropatia?: boolean;
  hipertenso?: boolean;
  cardiopatia?: boolean;
  cirurgia_mmii?: boolean;
  amputacao_previa?: boolean;
  uso_palmilha?: boolean;
  medicacoes?: string | null;
  calcado_mais_usado?: string | null;
  tabagista?: boolean;
  etilista?: boolean;
  frequencia_esporte?: string | null;
  observacoes?: string | null;
}

interface AnamneseParams {
  id?: string;
}

interface BuscarAnamneseQuery {
  prontuario_id?: string;
}

export async function cadastrarAnamnese(
  req: Request<unknown, unknown, AnamneseBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const { prontuario_id } = req.body;

    const dadosAnamnese: CreateAnamneseInput = {
      prontuario_id,
      tipo_diabete: req.body.tipo_diabete ?? null,
      tempo_diabetes: req.body.tempo_diabetes ?? null,
      hemoglobina_glicada: req.body.hemoglobina_glicada ?? null,
      retinopatia: req.body.retinopatia ?? false,
      neuropatia: req.body.neuropatia ?? false,
      nefropatia: req.body.nefropatia ?? false,
      hipertenso: req.body.hipertenso ?? false,
      cardiopatia: req.body.cardiopatia ?? false,
      cirurgia_mmii: req.body.cirurgia_mmii ?? false,
      amputacao_previa: req.body.amputacao_previa ?? false,
      uso_palmilha: req.body.uso_palmilha ?? false,
      medicacoes: req.body.medicacoes ?? null,
      calcado_mais_usado: req.body.calcado_mais_usado ?? null,
      tabagista: req.body.tabagista ?? false,
      etilista: req.body.etilista ?? false,
      frequencia_esporte: req.body.frequencia_esporte ?? null,
      observacoes: req.body.observacoes ?? null,
    };

    const anamnese = await Anamnese.criar(dadosAnamnese);

    return res.status(201).json({
      message: 'Anamnese cadastrada com sucesso.',
      anamnese,
    });
  } catch (error) {
    next(error);
  }
}

export async function buscarAnamneses(
  req: Request<unknown, unknown, unknown, BuscarAnamneseQuery>,
  res: Response,
  next: NextFunction
) {
  try {
    const { prontuario_id } = req.query;

    if (prontuario_id) {
      const anamnese = await Anamnese.buscarPorProntuario(prontuario_id);

      if (!anamnese) {
        return res.status(404).json({ message: 'Anamnese nao encontrada.' });
      }

      return res.status(200).json({ anamnese });
    }

    const anamneses = await Anamnese.buscarTodos();

    return res.status(200).json({ anamneses });
  } catch (error) {
    next(error);
  }
}

export async function buscarAnamnesePorId(
  req: Request<AnamneseParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Id da anamnese e obrigatorio.' });
    }

    const anamnese = await Anamnese.buscarPorId(id);

    if (!anamnese) {
      return res.status(404).json({ message: 'Anamnese nao encontrada.' });
    }

    return res.status(200).json({ anamnese });
  } catch (error) {
    next(error);
  }
}

export async function atualizarAnamnese(
  req: Request<AnamneseParams, unknown, Partial<AnamneseBody>>,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Id da anamnese e obrigatorio.' });
    }

    const updateData: UpdateAnamneseInput = {};

    if (req.body.tipo_diabete !== undefined) {
      updateData.tipo_diabete = req.body.tipo_diabete;
    }

    if (req.body.tempo_diabetes !== undefined) {
      updateData.tempo_diabetes = req.body.tempo_diabetes;
    }

    if (req.body.hemoglobina_glicada !== undefined) {
      updateData.hemoglobina_glicada = req.body.hemoglobina_glicada;
    }

    if (req.body.retinopatia !== undefined) {
      updateData.retinopatia = req.body.retinopatia;
    }

    if (req.body.neuropatia !== undefined) {
      updateData.neuropatia = req.body.neuropatia;
    }

    if (req.body.nefropatia !== undefined) {
      updateData.nefropatia = req.body.nefropatia;
    }

    if (req.body.hipertenso !== undefined) {
      updateData.hipertenso = req.body.hipertenso;
    }

    if (req.body.cardiopatia !== undefined) {
      updateData.cardiopatia = req.body.cardiopatia;
    }

    if (req.body.cirurgia_mmii !== undefined) {
      updateData.cirurgia_mmii = req.body.cirurgia_mmii;
    }

    if (req.body.amputacao_previa !== undefined) {
      updateData.amputacao_previa = req.body.amputacao_previa;
    }

    if (req.body.uso_palmilha !== undefined) {
      updateData.uso_palmilha = req.body.uso_palmilha;
    }

    if (req.body.medicacoes !== undefined) {
      updateData.medicacoes = req.body.medicacoes;
    }

    if (req.body.calcado_mais_usado !== undefined) {
      updateData.calcado_mais_usado = req.body.calcado_mais_usado;
    }

    if (req.body.tabagista !== undefined) {
      updateData.tabagista = req.body.tabagista;
    }

    if (req.body.etilista !== undefined) {
      updateData.etilista = req.body.etilista;
    }

    if (req.body.frequencia_esporte !== undefined) {
      updateData.frequencia_esporte = req.body.frequencia_esporte;
    }

    if (req.body.observacoes !== undefined) {
      updateData.observacoes = req.body.observacoes;
    }

    const anamnese = await Anamnese.atualizar(id, updateData);

    if (!anamnese) {
      return res.status(404).json({ message: 'Anamnese nao encontrada.' });
    }

    return res.status(200).json({
      message: 'Anamnese atualizada com sucesso.',
      anamnese,
    });
  } catch (error) {
    next(error);
  }
}

export async function deletarAnamnese(
  req: Request<AnamneseParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Id da anamnese e obrigatorio.' });
    }

    const deletada = await Anamnese.deletar(id);

    if (!deletada) {
      return res.status(404).json({ message: 'Anamnese nao encontrada.' });
    }

    return res.status(200).json({ message: 'Anamnese deletada com sucesso.' });
  } catch (error) {
    next(error);
  }
}
