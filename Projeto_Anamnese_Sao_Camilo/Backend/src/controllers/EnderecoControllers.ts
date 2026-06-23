import type { Request, Response } from 'express';
import Endereco, { CreateEnderecoInput, UpdateEnderecoInput } from '../models/EnderecoModels';

interface EnderecoBody {
  paciente_id?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string | null;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

interface EnderecoParams {
  id?: string;
}

interface BuscarEnderecosQuery {
  paciente_id?: string;
}

function isForeignKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_ROW_IS_REFERENCED_2')
  );
}

export async function cadastrarEndereco(
  req: Request<unknown, unknown, EnderecoBody>,
  res: Response,
) {
  try {
    const { paciente_id, logradouro, numero, bairro, cidade, estado, cep } = req.body;

    if (!paciente_id || !logradouro || !numero || !bairro || !cidade || !estado || !cep) {
      return res.status(400).json({
        message: 'Paciente, logradouro, numero, bairro, cidade, estado e CEP sao obrigatorios.',
      });
    }

    const dadosEndereco: CreateEnderecoInput = {
      paciente_id,
      logradouro,
      numero,
      complemento: req.body.complemento ?? null,
      bairro,
      cidade,
      estado: estado.toUpperCase(),
      cep,
    };

    const endereco = await Endereco.criar(dadosEndereco);

    return res.status(201).json({
      message: 'Endereco cadastrado com sucesso.',
      endereco,
    });
  } catch (error) {
    if (isForeignKeyError(error)) {
      return res.status(400).json({ message: 'Paciente nao encontrado.' });
    }

    console.error('Erro ao cadastrar endereco:', error);
    return res.status(500).json({ message: 'Erro ao cadastrar endereco.' });
  }
}

export async function buscarEnderecos(
  req: Request<unknown, unknown, unknown, BuscarEnderecosQuery>,
  res: Response,
) {
  try {
    const { paciente_id } = req.query;

    if (paciente_id) {
      const enderecos = await Endereco.buscarPorPaciente(paciente_id);
      return res.status(200).json({ enderecos });
    }

    const enderecos = await Endereco.buscarTodos();

    return res.status(200).json({ enderecos });
  } catch (error) {
    console.error('Erro ao buscar enderecos:', error);
    return res.status(500).json({ message: 'Erro ao buscar enderecos.' });
  }
}

export async function buscarEnderecoPorId(
  req: Request<EnderecoParams>,
  res: Response,
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Id do endereco e obrigatorio.' });
    }

    const endereco = await Endereco.buscarPorId(id);

    if (!endereco) {
      return res.status(404).json({ message: 'Endereco nao encontrado.' });
    }

    return res.status(200).json({ endereco });
  } catch (error) {
    console.error('Erro ao buscar endereco:', error);
    return res.status(500).json({ message: 'Erro ao buscar endereco.' });
  }
}

export async function atualizarEndereco(
  req: Request<EnderecoParams, unknown, EnderecoBody>,
  res: Response,
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Id do endereco e obrigatorio.' });
    }

    const updateData: UpdateEnderecoInput = {};

    if (req.body.logradouro !== undefined) {
      updateData.logradouro = req.body.logradouro;
    }

    if (req.body.numero !== undefined) {
      updateData.numero = req.body.numero;
    }

    if (req.body.complemento !== undefined) {
      updateData.complemento = req.body.complemento;
    }

    if (req.body.bairro !== undefined) {
      updateData.bairro = req.body.bairro;
    }

    if (req.body.cidade !== undefined) {
      updateData.cidade = req.body.cidade;
    }

    if (req.body.estado !== undefined) {
      updateData.estado = req.body.estado.toUpperCase();
    }

    if (req.body.cep !== undefined) {
      updateData.cep = req.body.cep;
    }

    const endereco = await Endereco.atualizar(id, updateData);

    if (!endereco) {
      return res.status(404).json({ message: 'Endereco nao encontrado.' });
    }

    return res.status(200).json({
      message: 'Endereco atualizado com sucesso.',
      endereco,
    });
  } catch (error) {
    console.error('Erro ao atualizar endereco:', error);
    return res.status(500).json({ message: 'Erro ao atualizar endereco.' });
  }
}

export async function deletarEndereco(
  req: Request<EnderecoParams>,
  res: Response,
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Id do endereco e obrigatorio.' });
    }

    const deletado = await Endereco.deletar(id);

    if (!deletado) {
      return res.status(404).json({ message: 'Endereco nao encontrado.' });
    }

    return res.status(200).json({ message: 'Endereco deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar endereco:', error);
    return res.status(500).json({ message: 'Erro ao deletar endereco.' });
  }
}
