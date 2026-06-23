import { randomUUID } from 'crypto';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { promisePool } from '../config/db';

export interface IAtendimento {
  id: string;
  prontuarios_id: string;
  podologo_id: string;
  diagnostico: string | null;
  conduta: string | null;
  evolucao: string | null;
  data_atendimento: Date;
  criado_em: Date;
  atualizado_em: Date;
}

export type CreateAtendimentoInput = Omit<IAtendimento, 'id' | 'criado_em' | 'atualizado_em'> &
  Partial<Pick<IAtendimento, 'id'>>;

export type UpdateAtendimentoInput = Partial<
  Omit<IAtendimento, 'id' | 'prontuarios_id' | 'podologo_id' | 'criado_em' | 'atualizado_em'>
>;

interface AtendimentoRow extends IAtendimento, RowDataPacket {}

export default class Atendimento {
  static async criar(atendimento: CreateAtendimentoInput): Promise<IAtendimento> {
    const id = atendimento.id ?? randomUUID();
    const now = new Date();

    const [result] = await promisePool.execute<ResultSetHeader>(
      `INSERT INTO atendimentos(
        id, prontuarios_id, podologo_id, diagnostico, conduta,
        evolucao, data_atendimento, criado_em, atualizado_em
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        atendimento.prontuarios_id,
        atendimento.podologo_id,
        atendimento.diagnostico,
        atendimento.conduta,
        atendimento.evolucao,
        atendimento.data_atendimento,
        now,
        now,
      ],
    );

    if (result.affectedRows !== 1) {
      throw new Error('Atendimento nao foi cadastrado.');
    }

    return {
      ...atendimento,
      id,
      criado_em: now,
      atualizado_em: now,
    };
  }

  static async buscarTodos(): Promise<IAtendimento[]> {
    const [rows] = await promisePool.execute<AtendimentoRow[]>(
      `SELECT id, prontuarios_id, podologo_id, diagnostico, conduta,
        evolucao, data_atendimento, criado_em, atualizado_em
      FROM atendimentos
      ORDER BY data_atendimento DESC`,
    );

    return rows;
  }

  static async buscarPorId(id: string): Promise<IAtendimento | null> {
    const [rows] = await promisePool.execute<AtendimentoRow[]>(
      `SELECT id, prontuarios_id, podologo_id, diagnostico, conduta,
        evolucao, data_atendimento, criado_em, atualizado_em
      FROM atendimentos
      WHERE id = ?
      LIMIT 1`,
      [id],
    );

    return rows[0] ?? null;
  }

  static async buscarPorProntuario(prontuarios_id: string): Promise<IAtendimento[]> {
    const [rows] = await promisePool.execute<AtendimentoRow[]>(
      `SELECT id, prontuarios_id, podologo_id, diagnostico, conduta,
        evolucao, data_atendimento, criado_em, atualizado_em
      FROM atendimentos
      WHERE prontuarios_id = ?
      ORDER BY data_atendimento DESC`,
      [prontuarios_id],
    );

    return rows;
  }

  static async buscarPorPodologo(podologo_id: string): Promise<IAtendimento[]> {
    const [rows] = await promisePool.execute<AtendimentoRow[]>(
      `SELECT id, prontuarios_id, podologo_id, diagnostico, conduta,
        evolucao, data_atendimento, criado_em, atualizado_em
      FROM atendimentos
      WHERE podologo_id = ?
      ORDER BY data_atendimento DESC`,
      [podologo_id],
    );

    return rows;
  }

  static async atualizar(id: string, atendimento: UpdateAtendimentoInput): Promise<IAtendimento | null> {
    const campos: string[] = [];
    const valores: Array<string | Date | null> = [];

    if (atendimento.diagnostico !== undefined) {
      campos.push('diagnostico = ?');
      valores.push(atendimento.diagnostico);
    }

    if (atendimento.conduta !== undefined) {
      campos.push('conduta = ?');
      valores.push(atendimento.conduta);
    }

    if (atendimento.evolucao !== undefined) {
      campos.push('evolucao = ?');
      valores.push(atendimento.evolucao);
    }

    if (atendimento.data_atendimento !== undefined) {
      campos.push('data_atendimento = ?');
      valores.push(atendimento.data_atendimento);
    }

    if (campos.length === 0) {
      return Atendimento.buscarPorId(id);
    }

    campos.push('atualizado_em = ?');
    valores.push(new Date());

    const [result] = await promisePool.execute<ResultSetHeader>(
      `UPDATE atendimentos SET ${campos.join(', ')} WHERE id = ?`,
      [...valores, id],
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return Atendimento.buscarPorId(id);
  }

  static async deletar(id: string): Promise<boolean> {
    const [result] = await promisePool.execute<ResultSetHeader>(
      'DELETE FROM atendimentos WHERE id = ?',
      [id],
    );

    return result.affectedRows === 1;
  }
}
