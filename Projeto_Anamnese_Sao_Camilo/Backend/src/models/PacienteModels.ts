import { randomUUID } from 'crypto';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { promisePool } from '../config/db';

export type SexoPaciente = 'masculino' | 'feminino' | 'outro';

export interface IPaciente {
  id: string;
  num_prontuario: string;
  nome: string;
  data_nascimento: Date;
  cpf: string | null;
  sexo: SexoPaciente;
  rg: string | null;
  email: string | null;
  telefone: string | null;
  celular: string;
  profissao: string | null;
  indicacao: string | null;
  ativo: boolean;
  criado_em: Date;
  atualizado_em: Date;
}

export type CreatePacienteInput = Omit<IPaciente, 'id' | 'ativo' | 'criado_em' | 'atualizado_em'> &
  Partial<Pick<IPaciente, 'id' | 'ativo'>>;

export type UpdatePacienteInput = Partial<
  Omit<IPaciente, 'id' | 'criado_em' | 'atualizado_em'>
>;

interface PacienteRow extends IPaciente, RowDataPacket {}

export default class Paciente {
  static async CadastroPaciente(paciente: CreatePacienteInput): Promise<IPaciente> {
    const id = paciente.id ?? randomUUID();
    const now = new Date();
    const ativo = paciente.ativo ?? true;

    const [result] = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO pacientes(id, num_prontuario, nome, data_nascimento, cpf, sexo, rg, email, telefone, celular, profissao, indicacao, ativo, criado_em, atualizado_em) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        paciente.num_prontuario,
        paciente.nome,
        paciente.data_nascimento,
        paciente.cpf,
        paciente.sexo,
        paciente.rg,
        paciente.email,
        paciente.telefone,
        paciente.celular,
        paciente.profissao,
        paciente.indicacao,
        ativo,
        now,
        now,
      ],
    );

    if (result.affectedRows !== 1) {
      throw new Error('Paciente nao foi cadastrado.');
    }

    return {
      ...paciente,
      id,
      ativo,
      criado_em: now,
      atualizado_em: now,
    };
  }

  static async RegistroPaciente(paciente: CreatePacienteInput): Promise<IPaciente> {
    return Paciente.CadastroPaciente(paciente);
  }

  static async buscarTodos(): Promise<IPaciente[]> {
    const [rows] = await promisePool.execute<PacienteRow[]>(
      'SELECT id, num_prontuario, nome, data_nascimento, cpf, sexo, rg, email, telefone, celular, profissao, indicacao, ativo, criado_em, atualizado_em FROM pacientes WHERE ativo = 1 ORDER BY nome',
    );

    return rows;
  }

  static async buscarPorId(id: string): Promise<IPaciente | null> {
    const [rows] = await promisePool.execute<PacienteRow[]>(
      'SELECT id, num_prontuario, nome, data_nascimento, cpf, sexo, rg, email, telefone, celular, profissao, indicacao, ativo, criado_em, atualizado_em FROM pacientes WHERE id = ? LIMIT 1',
      [id],
    );

    return rows[0] ?? null;
  }

  static async buscarPorProntuario(num_prontuario: string): Promise<IPaciente | null> {
    const [rows] = await promisePool.execute<PacienteRow[]>(
      'SELECT id, num_prontuario, nome, data_nascimento, cpf, sexo, rg, email, telefone, celular, profissao, indicacao, ativo, criado_em, atualizado_em FROM pacientes WHERE num_prontuario = ? LIMIT 1',
      [num_prontuario],
    );

    return rows[0] ?? null;
  }

  static async atualizar(id: string, paciente: UpdatePacienteInput): Promise<IPaciente | null> {
    const campos: string[] = [];
    const valores: Array<string | Date | boolean | null> = [];

    if (paciente.num_prontuario !== undefined) {
      campos.push('num_prontuario = ?');
      valores.push(paciente.num_prontuario);
    }

    if (paciente.nome !== undefined) {
      campos.push('nome = ?');
      valores.push(paciente.nome);
    }

    if (paciente.data_nascimento !== undefined) {
      campos.push('data_nascimento = ?');
      valores.push(paciente.data_nascimento);
    }

    if (paciente.cpf !== undefined) {
      campos.push('cpf = ?');
      valores.push(paciente.cpf);
    }

    if (paciente.sexo !== undefined) {
      campos.push('sexo = ?');
      valores.push(paciente.sexo);
    }

    if (paciente.rg !== undefined) {
      campos.push('rg = ?');
      valores.push(paciente.rg);
    }

    if (paciente.email !== undefined) {
      campos.push('email = ?');
      valores.push(paciente.email);
    }

    if (paciente.telefone !== undefined) {
      campos.push('telefone = ?');
      valores.push(paciente.telefone);
    }

    if (paciente.celular !== undefined) {
      campos.push('celular = ?');
      valores.push(paciente.celular);
    }

    if (paciente.profissao !== undefined) {
      campos.push('profissao = ?');
      valores.push(paciente.profissao);
    }

    if (paciente.indicacao !== undefined) {
      campos.push('indicacao = ?');
      valores.push(paciente.indicacao);
    }

    if (paciente.ativo !== undefined) {
      campos.push('ativo = ?');
      valores.push(paciente.ativo);
    }

    if (campos.length === 0) {
      return Paciente.buscarPorId(id);
    }

    campos.push('atualizado_em = ?');
    valores.push(new Date());
    valores.push(id);

    const [result] = await promisePool.execute<ResultSetHeader>(
      `UPDATE pacientes SET ${campos.join(', ')} WHERE id = ?`,
      valores,
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return Paciente.buscarPorId(id);
  }

  static async deletar(id: string): Promise<boolean> {
    const [result] = await promisePool.execute<ResultSetHeader>(
      'UPDATE pacientes SET ativo = 0, atualizado_em = ? WHERE id = ? AND ativo = 1',
      [new Date(), id],
    );

    return result.affectedRows === 1;
  }
}
