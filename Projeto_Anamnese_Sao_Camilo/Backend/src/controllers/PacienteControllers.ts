import type { Request, Response } from 'express';
import Paciente, {
  CreatePacienteInput,
  SexoPaciente,
  UpdatePacienteInput,
} from '../models/PacienteModels';

const sexosValidos: SexoPaciente[] = ['masculino', 'feminino', 'outro'];

interface PacienteBody {
  num_prontuario?: string;
  nome?: string;
  data_nascimento?: string;
  cpf?: string | null;
  sexo?: SexoPaciente;
  rg?: string | null;
  email?: string | null;
  telefone?: string | null;
  celular?: string;
  profissao?: string | null;
  indicacao?: string | null;
}

interface PacienteParams {
  id?: string;
}

interface BuscarPacientesQuery {
  nome?: string;
  cpf?: string;
  prontuario?: string;
}

function isDuplicateEntryError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'ER_DUP_ENTRY'
  );
}

export async function cadastrarPaciente(
  req: Request<unknown, unknown, PacienteBody>,
  res: Response,
) {
  try {
    const {
      nome,
      data_nascimento,
      cpf,
      sexo,
      rg,
      email,
      telefone,
      celular,
      profissao,
      indicacao,
    } = req.body;

    if (!nome || !data_nascimento || !sexo || !celular) {
      return res.status(400).json({
        message: 'Nome, data de nascimento, sexo e celular sao obrigatorios.',
      });
    }

    if (!sexosValidos.includes(sexo)) {
      return res.status(400).json({ message: 'Sexo invalido.' });
    }

    const dataNascimento = new Date(data_nascimento);

    if (Number.isNaN(dataNascimento.getTime())) {
      return res.status(400).json({ message: 'Data de nascimento invalida.' });
    }

    const dadosPaciente: CreatePacienteInput = {
      nome,
      data_nascimento: dataNascimento,
      cpf: cpf ?? null,
      sexo,
      rg: rg ?? null,
      email: email ?? null,
      telefone: telefone ?? null,
      celular,
      profissao: profissao ?? null,
      indicacao: indicacao ?? null,
    };

    const paciente = await Paciente.CadastroPaciente(dadosPaciente);

    return res.status(201).json({
      message: 'Paciente cadastrado com sucesso.',
      paciente,
    });
  } catch (error) {
    if (isDuplicateEntryError(error)) {
      return res.status(409).json({ message: 'CPF ja cadastrado.' });
    }

    console.error('Erro ao cadastrar paciente:', error);
    return res.status(500).json({ message: 'Erro ao cadastrar paciente.' });
  }
}

export async function buscarPacientes(
  req: Request<unknown, unknown, unknown, BuscarPacientesQuery>,
  res: Response,
) {
  try {
    const { nome, cpf, prontuario } = req.query;

    if (prontuario) {
      const paciente = await Paciente.buscarPorProntuario(prontuario);

      if (!paciente) {
        return res.status(404).json({ message: 'Paciente nao encontrado.' });
      }

      return res.status(200).json({ paciente });
    }

    if (cpf) {
      const paciente = await Paciente.buscarPorCpf(cpf);

      if (!paciente) {
        return res.status(404).json({ message: 'Paciente nao encontrado.' });
      }

      return res.status(200).json({ paciente });
    }

    if (nome) {
      const pacientes = await Paciente.buscarPorNome(nome);

      return res.status(200).json({ pacientes });
    }

    const pacientes = await Paciente.buscarTodos();

    return res.status(200).json({ pacientes });
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error);
    return res.status(500).json({ message: 'Erro ao buscar pacientes.' });
  }
}

export async function buscarPacientePorId(
  req: Request<PacienteParams>,
  res: Response,
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Id do paciente e obrigatorio.' });
    }

    const paciente = await Paciente.buscarPorId(id);

    if (!paciente) {
      return res.status(404).json({ message: 'Paciente nao encontrado.' });
    }

    return res.status(200).json({ paciente });
  } catch (error) {
    console.error('Erro ao buscar paciente:', error);
    return res.status(500).json({ message: 'Erro ao buscar paciente.' });
  }
}

export async function atualizarPaciente(
  req: Request<PacienteParams, unknown, PacienteBody>,
  res: Response,
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Id do paciente e obrigatorio.' });
    }

    const updateData: UpdatePacienteInput = {};

    if (req.body.num_prontuario !== undefined) {
      updateData.num_prontuario = req.body.num_prontuario;
    }

    if (req.body.nome !== undefined) {
      updateData.nome = req.body.nome;
    }

    if (req.body.data_nascimento !== undefined) {
      const dataNascimento = new Date(req.body.data_nascimento);

      if (Number.isNaN(dataNascimento.getTime())) {
        return res.status(400).json({ message: 'Data de nascimento invalida.' });
      }

      updateData.data_nascimento = dataNascimento;
    }

    if (req.body.cpf !== undefined) {
      updateData.cpf = req.body.cpf;
    }

    if (req.body.sexo !== undefined) {
      if (!sexosValidos.includes(req.body.sexo)) {
        return res.status(400).json({ message: 'Sexo invalido.' });
      }

      updateData.sexo = req.body.sexo;
    }

    if (req.body.rg !== undefined) {
      updateData.rg = req.body.rg;
    }

    if (req.body.email !== undefined) {
      updateData.email = req.body.email;
    }

    if (req.body.telefone !== undefined) {
      updateData.telefone = req.body.telefone;
    }

    if (req.body.celular !== undefined) {
      updateData.celular = req.body.celular;
    }

    if (req.body.profissao !== undefined) {
      updateData.profissao = req.body.profissao;
    }

    if (req.body.indicacao !== undefined) {
      updateData.indicacao = req.body.indicacao;
    }

    const paciente = await Paciente.atualizar(id, updateData);

    if (!paciente) {
      return res.status(404).json({ message: 'Paciente nao encontrado.' });
    }

    return res.status(200).json({
      message: 'Paciente atualizado com sucesso.',
      paciente,
    });
  } catch (error) {
    if (isDuplicateEntryError(error)) {
      return res.status(409).json({ message: 'Prontuario ou CPF ja cadastrado.' });
    }

    console.error('Erro ao atualizar paciente:', error);
    return res.status(500).json({ message: 'Erro ao atualizar paciente.' });
  }
}

export async function deletarPaciente(
  req: Request<PacienteParams>,
  res: Response,
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Id do paciente e obrigatorio.' });
    }

    const deletado = await Paciente.deletar(id);

    if (!deletado) {
      return res.status(404).json({ message: 'Paciente nao encontrado.' });
    }

    return res.status(200).json({ message: 'Paciente deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar paciente:', error);
    return res.status(500).json({ message: 'Erro ao deletar paciente.' });
  }
}
