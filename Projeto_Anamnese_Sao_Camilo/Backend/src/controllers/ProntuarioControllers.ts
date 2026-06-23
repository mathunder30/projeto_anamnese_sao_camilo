import type { Request, Response } from 'express';
import Prontuario, { CreateProntuarioInput, UpdateProntuarioInput } from '../models/ProntuarioModels';

interface ProntuarioBody {
  paciente_id?: string;
  data_consulta?: string;
  ativo?: boolean;
}

interface ProntuarioParams {
  id?: string;
}

interface BuscarProntuariosQuery {
  paciente_id?: string;
  criado_por?: string;
}

function isForeignKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_ROW_IS_REFERENCED_2')
  );
}

export async function cadastrarProntuario(
  req: Request<unknown, unknown, ProntuarioBody>,
  res: Response,
) {
  try {
    const { paciente_id, data_consulta } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Usuario nao autenticado.' });
    }

    if (!paciente_id || !data_consulta) {
      return res.status(400).json({ message: 'Paciente e data da consulta sao obrigatorios.' });
    }

    const dataConsulta = new Date(data_consulta);

    if (Number.isNaN(dataConsulta.getTime())) {
      return res.status(400).json({ message: 'Data da consulta invalida.' });
    }

    const dadosProntuario: CreateProntuarioInput = {
      paciente_id,
      criado_por: req.user.id,
      data_consulta: dataConsulta,
    };

    const prontuario = await Prontuario.criar(dadosProntuario);

    return res.status(201).json({
      message: 'Prontuario cadastrado com sucesso.',
      prontuario,
    });
  } catch (error) {
    if (isForeignKeyError(error)) {
      return res.status(400).json({ message: 'Paciente ou usuario criador nao encontrado.' });
    }

    console.error('Erro ao cadastrar prontuario:', error);
    return res.status(500).json({ message: 'Erro ao cadastrar prontuario.' });
  }
}

export async function buscarProntuarios(
  req: Request<unknown, unknown, unknown, BuscarProntuariosQuery>,
  res: Response,
) {
  try {
    const { paciente_id, criado_por } = req.query;

    if (paciente_id) {
      const prontuarios = await Prontuario.buscarPorPaciente(paciente_id);
      return res.status(200).json({ prontuarios });
    }

    if (criado_por) {
      const prontuarios = await Prontuario.buscarPorCriador(criado_por);
      return res.status(200).json({ prontuarios });
    }

    const prontuarios = await Prontuario.buscarTodos();

    return res.status(200).json({ prontuarios });
  } catch (error) {
    console.error('Erro ao buscar prontuarios:', error);
    return res.status(500).json({ message: 'Erro ao buscar prontuarios.' });
  }
}

export async function buscarProntuarioPorId(
  req: Request<ProntuarioParams>,
  res: Response,
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Id do prontuario e obrigatorio.' });
    }

    const prontuario = await Prontuario.buscarPorId(id);

    if (!prontuario) {
      return res.status(404).json({ message: 'Prontuario nao encontrado.' });
    }

    return res.status(200).json({ prontuario });
  } catch (error) {
    console.error('Erro ao buscar prontuario:', error);
    return res.status(500).json({ message: 'Erro ao buscar prontuario.' });
  }
}

export async function atualizarProntuario(
  req: Request<ProntuarioParams, unknown, ProntuarioBody>,
  res: Response,
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Id do prontuario e obrigatorio.' });
    }

    const updateData: UpdateProntuarioInput = {};

    if (req.body.data_consulta !== undefined) {
      const dataConsulta = new Date(req.body.data_consulta);

      if (Number.isNaN(dataConsulta.getTime())) {
        return res.status(400).json({ message: 'Data da consulta invalida.' });
      }

      updateData.data_consulta = dataConsulta;
    }

    if (req.body.ativo !== undefined) {
      updateData.ativo = req.body.ativo;
    }

    const prontuario = await Prontuario.atualizar(id, updateData);

    if (!prontuario) {
      return res.status(404).json({ message: 'Prontuario nao encontrado.' });
    }

    return res.status(200).json({
      message: 'Prontuario atualizado com sucesso.',
      prontuario,
    });
  } catch (error) {
    console.error('Erro ao atualizar prontuario:', error);
    return res.status(500).json({ message: 'Erro ao atualizar prontuario.' });
  }
}

export async function deletarProntuario(
  req: Request<ProntuarioParams>,
  res: Response,
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Id do prontuario e obrigatorio.' });
    }

    const deletado = await Prontuario.deletar(id);

    if (!deletado) {
      return res.status(404).json({ message: 'Prontuario nao encontrado.' });
    }

    return res.status(200).json({ message: 'Prontuario deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar prontuario:', error);
    return res.status(500).json({ message: 'Erro ao deletar prontuario.' });
  }
}
