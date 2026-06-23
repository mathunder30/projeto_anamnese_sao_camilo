import type { Request, Response } from 'express';
import Atendimento, { CreateAtendimentoInput, UpdateAtendimentoInput } from '../models/AtendimentoModels';

interface AtendimentoBody {
  prontuarios_id?: string;
  diagnostico?: string | null;
  conduta?: string | null;
  evolucao?: string | null;
  data_atendimento?: string;
}

interface AtendimentoParams {
  id?: string;
}

interface BuscarAtendimentosQuery {
  prontuarios_id?: string;
  podologo_id?: string;
}

function isForeignKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_ROW_IS_REFERENCED_2')
  );
}

export async function cadastrarAtendimento(
  req: Request<unknown, unknown, AtendimentoBody>,
  res: Response,
) {
  try {
    const { prontuarios_id, data_atendimento } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Usuario nao autenticado.' });
    }

    if (!prontuarios_id || !data_atendimento) {
      return res.status(400).json({ message: 'Prontuario e data do atendimento sao obrigatorios.' });
    }

    const dataAtendimento = new Date(data_atendimento);

    if (Number.isNaN(dataAtendimento.getTime())) {
      return res.status(400).json({ message: 'Data do atendimento invalida.' });
    }

    const dadosAtendimento: CreateAtendimentoInput = {
      prontuarios_id,
      podologo_id: req.user.id,
      diagnostico: req.body.diagnostico ?? null,
      conduta: req.body.conduta ?? null,
      evolucao: req.body.evolucao ?? null,
      data_atendimento: dataAtendimento,
    };

    const atendimento = await Atendimento.criar(dadosAtendimento);

    return res.status(201).json({
      message: 'Atendimento cadastrado com sucesso.',
      atendimento,
    });
  } catch (error) {
    if (isForeignKeyError(error)) {
      return res.status(400).json({ message: 'Prontuario ou podologo nao encontrado.' });
    }

    console.error('Erro ao cadastrar atendimento:', error);
    return res.status(500).json({ message: 'Erro ao cadastrar atendimento.' });
  }
}

export async function buscarAtendimentos(
  req: Request<unknown, unknown, unknown, BuscarAtendimentosQuery>,
  res: Response,
) {
  try {
    const { prontuarios_id, podologo_id } = req.query;

    if (prontuarios_id) {
      const atendimentos = await Atendimento.buscarPorProntuario(prontuarios_id);
      return res.status(200).json({ atendimentos });
    }

    if (podologo_id) {
      const atendimentos = await Atendimento.buscarPorPodologo(podologo_id);
      return res.status(200).json({ atendimentos });
    }

    const atendimentos = await Atendimento.buscarTodos();

    return res.status(200).json({ atendimentos });
  } catch (error) {
    console.error('Erro ao buscar atendimentos:', error);
    return res.status(500).json({ message: 'Erro ao buscar atendimentos.' });
  }
}

export async function buscarAtendimentoPorId(
  req: Request<AtendimentoParams>,
  res: Response,
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Id do atendimento e obrigatorio.' });
    }

    const atendimento = await Atendimento.buscarPorId(id);

    if (!atendimento) {
      return res.status(404).json({ message: 'Atendimento nao encontrado.' });
    }

    return res.status(200).json({ atendimento });
  } catch (error) {
    console.error('Erro ao buscar atendimento:', error);
    return res.status(500).json({ message: 'Erro ao buscar atendimento.' });
  }
}

export async function atualizarAtendimento(
  req: Request<AtendimentoParams, unknown, AtendimentoBody>,
  res: Response,
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Id do atendimento e obrigatorio.' });
    }

    const updateData: UpdateAtendimentoInput = {};

    if (req.body.diagnostico !== undefined) {
      updateData.diagnostico = req.body.diagnostico;
    }

    if (req.body.conduta !== undefined) {
      updateData.conduta = req.body.conduta;
    }

    if (req.body.evolucao !== undefined) {
      updateData.evolucao = req.body.evolucao;
    }

    if (req.body.data_atendimento !== undefined) {
      const dataAtendimento = new Date(req.body.data_atendimento);

      if (Number.isNaN(dataAtendimento.getTime())) {
        return res.status(400).json({ message: 'Data do atendimento invalida.' });
      }

      updateData.data_atendimento = dataAtendimento;
    }

    const atendimento = await Atendimento.atualizar(id, updateData);

    if (!atendimento) {
      return res.status(404).json({ message: 'Atendimento nao encontrado.' });
    }

    return res.status(200).json({
      message: 'Atendimento atualizado com sucesso.',
      atendimento,
    });
  } catch (error) {
    console.error('Erro ao atualizar atendimento:', error);
    return res.status(500).json({ message: 'Erro ao atualizar atendimento.' });
  }
}

export async function deletarAtendimento(
  req: Request<AtendimentoParams>,
  res: Response,
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Id do atendimento e obrigatorio.' });
    }

    const deletado = await Atendimento.deletar(id);

    if (!deletado) {
      return res.status(404).json({ message: 'Atendimento nao encontrado.' });
    }

    return res.status(200).json({ message: 'Atendimento deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar atendimento:', error);
    return res.status(500).json({ message: 'Erro ao deletar atendimento.' });
  }
}
