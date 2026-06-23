import { randomUUID } from 'crypto';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { promisePool } from '../config/db';

export interface IProntuario {
  id: string;
  paciente_id: string;
  criado_por: string;
  data_consulta: Date;
  ativo: boolean;
  criado_em: Date;
  atualizado_em: Date;
}

export type CreateProntuarioInput = Omit<
  IProntuario,
  'id' | 'ativo' | 'criado_em' | 'atualizado_em'
> &
  Partial<Pick<IProntuario, 'id' | 'ativo'>>;

export type UpdateProntuarioInput = Partial<
  Omit<IProntuario, 'id' | 'paciente_id' | 'criado_por' | 'criado_em' | 'atualizado_em'>
>;

interface ProntuarioRow extends IProntuario, RowDataPacket {}

export default class Prontuario {
  static async criar(prontuario: CreateProntuarioInput): Promise<IProntuario> {
    const id = prontuario.id ?? randomUUID();
    const ativo = prontuario.ativo ?? true;
    const now = new Date();

    const [result] = await promisePool.execute<ResultSetHeader>(
      `INSERT INTO prontuarios(
        id, paciente_id, criado_por, data_consulta, ativo, criado_em, atualizado_em
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        prontuario.paciente_id,
        prontuario.criado_por,
        prontuario.data_consulta,
        ativo,
        now,
        now,
      ],
    );

    if (result.affectedRows !== 1) {
      throw new Error('Prontuario nao foi cadastrado.');
    }

    return {
      ...prontuario,
      id,
      ativo,
      criado_em: now,
      atualizado_em: now,
    };
  }

  static async buscarTodos(): Promise<IProntuario[]> {
    const [rows] = await promisePool.execute<ProntuarioRow[]>(
      `SELECT id, paciente_id, criado_por, data_consulta, ativo, criado_em, atualizado_em
      FROM prontuarios
      WHERE ativo = 1
      ORDER BY data_consulta DESC`,
    );

    return rows;
  }

  static async buscarPorId(id: string): Promise<IProntuario | null> {
    const [rows] = await promisePool.execute<ProntuarioRow[]>(
      `SELECT id, paciente_id, criado_por, data_consulta, ativo, criado_em, atualizado_em
      FROM prontuarios
      WHERE id = ?
      LIMIT 1`,
      [id],
    );

    return rows[0] ?? null;
  }

  static async buscarPorPaciente(paciente_id: string): Promise<IProntuario[]> {
    const [rows] = await promisePool.execute<ProntuarioRow[]>(
      `SELECT id, paciente_id, criado_por, data_consulta, ativo, criado_em, atualizado_em
      FROM prontuarios
      WHERE paciente_id = ? AND ativo = 1
      ORDER BY data_consulta DESC`,
      [paciente_id],
    );

    return rows;
  }

  static async buscarPorCriador(criado_por: string): Promise<IProntuario[]> {
    const [rows] = await promisePool.execute<ProntuarioRow[]>(
      `SELECT id, paciente_id, criado_por, data_consulta, ativo, criado_em, atualizado_em
      FROM prontuarios
      WHERE criado_por = ? AND ativo = 1
      ORDER BY data_consulta DESC`,
      [criado_por],
    );

    return rows;
  }

  static async atualizar(id: string, prontuario: UpdateProntuarioInput): Promise<IProntuario | null> {
    const campos: string[] = [];
    const valores: Array<Date | boolean> = [];

    if (prontuario.data_consulta !== undefined) {
      campos.push('data_consulta = ?');
      valores.push(prontuario.data_consulta);
    }

    if (prontuario.ativo !== undefined) {
      campos.push('ativo = ?');
      valores.push(prontuario.ativo);
    }

    if (campos.length === 0) {
      return Prontuario.buscarPorId(id);
    }

    campos.push('atualizado_em = ?');
    valores.push(new Date());

    const [result] = await promisePool.execute<ResultSetHeader>(
      `UPDATE prontuarios SET ${campos.join(', ')} WHERE id = ?`,
      [...valores, id],
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return Prontuario.buscarPorId(id);
  }

  static async deletar(id: string): Promise<boolean> {
    const [result] = await promisePool.execute<ResultSetHeader>(
      'UPDATE prontuarios SET ativo = 0, atualizado_em = ? WHERE id = ? AND ativo = 1',
      [new Date(), id],
    );

    return result.affectedRows === 1;
  }
}
