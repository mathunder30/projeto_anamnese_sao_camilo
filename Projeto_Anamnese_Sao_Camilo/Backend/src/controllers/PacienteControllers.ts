import type { Request, Response, NextFunction } from 'express';
import Paciente, {
  CreatePacienteInput,
  SexoPaciente,
  UpdatePacienteInput,
} from '../models/PacienteModels';

interface PacienteBody {
  num_prontuario?: string;
  nome: string;
  data_nascimento: string;
  cpf?: string | null;
  sexo: SexoPaciente;
  rg?: string | null;
  email?: string | null;
  telefone?: string | null;
  celular: string;
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

export async function cadastrarPaciente(
  req: Request<unknown, unknown, PacienteBody>,
  res: Response,
  next: NextFunction
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

    const dataNascimento = new Date(data_nascimento);

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
    next(error);
  }
}

export async function buscarPacientes(
  req: Request<unknown, unknown, unknown, BuscarPacientesQuery>,
  res: Response,
  next: NextFunction
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
    next(error);
  }
}

export async function buscarPacientePorId(
  req: Request<PacienteParams>,
  res: Response,
  next: NextFunction
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
    next(error);
  }
}

export async function atualizarPaciente(
  req: Request<PacienteParams, unknown, Partial<PacienteBody>>,
  res: Response,
  next: NextFunction
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
      updateData.data_nascimento = new Date(req.body.data_nascimento);
    }

    if (req.body.cpf !== undefined) {
      updateData.cpf = req.body.cpf;
    }

    if (req.body.sexo !== undefined) {
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
    next(error);
  }
}

export async function deletarPaciente(
  req: Request<PacienteParams>,
  res: Response,
  next: NextFunction
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
    next(error);
  }
}
