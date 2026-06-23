import { randomUUID } from 'crypto';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { promisePool } from '../config/db';

export interface IEndereco {
  id: string;
  paciente_id: string;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  criado_em: Date;
  atualizado_em: Date;
}

export type CreateEnderecoInput = Omit<IEndereco, 'id' | 'criado_em' | 'atualizado_em'> &
  Partial<Pick<IEndereco, 'id'>>;

export type UpdateEnderecoInput = Partial<
  Omit<IEndereco, 'id' | 'paciente_id' | 'criado_em' | 'atualizado_em'>
>;

interface EnderecoRow extends IEndereco, RowDataPacket {}

export default class Endereco {
  static async criar(endereco: CreateEnderecoInput): Promise<IEndereco> {
    const id = endereco.id ?? randomUUID();
    const now = new Date();

    const [result] = await promisePool.execute<ResultSetHeader>(
      `INSERT INTO enderecos(
        id, paciente_id, logradouro, numero, complemento, bairro,
        cidade, estado, cep, criado_em, atualizado_em
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        endereco.paciente_id,
        endereco.logradouro,
        endereco.numero,
        endereco.complemento,
        endereco.bairro,
        endereco.cidade,
        endereco.estado,
        endereco.cep,
        now,
        now,
      ],
    );

    if (result.affectedRows !== 1) {
      throw new Error('Endereco nao foi cadastrado.');
    }

    return {
      ...endereco,
      id,
      criado_em: now,
      atualizado_em: now,
    };
  }

  static async buscarTodos(): Promise<IEndereco[]> {
    const [rows] = await promisePool.execute<EnderecoRow[]>(
      `SELECT id, paciente_id, logradouro, numero, complemento, bairro,
        cidade, estado, cep, criado_em, atualizado_em
      FROM enderecos
      ORDER BY criado_em DESC`,
    );

    return rows;
  }

  static async buscarPorId(id: string): Promise<IEndereco | null> {
    const [rows] = await promisePool.execute<EnderecoRow[]>(
      `SELECT id, paciente_id, logradouro, numero, complemento, bairro,
        cidade, estado, cep, criado_em, atualizado_em
      FROM enderecos
      WHERE id = ?
      LIMIT 1`,
      [id],
    );

    return rows[0] ?? null;
  }

  static async buscarPorPaciente(paciente_id: string): Promise<IEndereco[]> {
    const [rows] = await promisePool.execute<EnderecoRow[]>(
      `SELECT id, paciente_id, logradouro, numero, complemento, bairro,
        cidade, estado, cep, criado_em, atualizado_em
      FROM enderecos
      WHERE paciente_id = ?
      ORDER BY criado_em DESC`,
      [paciente_id],
    );

    return rows;
  }

  static async atualizar(id: string, endereco: UpdateEnderecoInput): Promise<IEndereco | null> {
    const campos: string[] = [];
    const valores: Array<string | Date | null> = [];

    if (endereco.logradouro !== undefined) {
      campos.push('logradouro = ?');
      valores.push(endereco.logradouro);
    }

    if (endereco.numero !== undefined) {
      campos.push('numero = ?');
      valores.push(endereco.numero);
    }

    if (endereco.complemento !== undefined) {
      campos.push('complemento = ?');
      valores.push(endereco.complemento);
    }

    if (endereco.bairro !== undefined) {
      campos.push('bairro = ?');
      valores.push(endereco.bairro);
    }

    if (endereco.cidade !== undefined) {
      campos.push('cidade = ?');
      valores.push(endereco.cidade);
    }

    if (endereco.estado !== undefined) {
      campos.push('estado = ?');
      valores.push(endereco.estado);
    }

    if (endereco.cep !== undefined) {
      campos.push('cep = ?');
      valores.push(endereco.cep);
    }

    if (campos.length === 0) {
      return Endereco.buscarPorId(id);
    }

    campos.push('atualizado_em = ?');
    valores.push(new Date());
    valores.push(id);

    const [result] = await promisePool.execute<ResultSetHeader>(
      `UPDATE enderecos SET ${campos.join(', ')} WHERE id = ?`,
      valores,
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return Endereco.buscarPorId(id);
  }

  static async deletar(id: string): Promise<boolean> {
    const [result] = await promisePool.execute<ResultSetHeader>(
      'DELETE FROM enderecos WHERE id = ?',
      [id],
    );

    return result.affectedRows === 1;
  }
}
