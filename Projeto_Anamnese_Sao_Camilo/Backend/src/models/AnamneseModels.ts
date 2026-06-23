import { randomUUID } from 'crypto';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { promisePool } from '../config/db';

export interface IAnamnese {
  id: string;
  prontuario_id: string;
  tipo_diabete: string | null;
  tempo_diabetes: string | null;
  hemoglobina_glicada: number | null;
  retinopatia: boolean;
  neuropatia: boolean;
  nefropatia: boolean;
  hipertenso: boolean;
  cardiopatia: boolean;
  cirurgia_mmii: boolean;
  amputacao_previa: boolean;
  uso_palmilha: boolean;
  medicacoes: string | null;
  calcado_mais_usado: string | null;
  tabagista: boolean;
  etilista: boolean;
  frequencia_esporte: string | null;
  observacoes: string | null;
  criado_em: Date;
  atualizado_em: Date;
}

export type CreateAnamneseInput = Omit<
  IAnamnese,
  'id' | 'criado_em' | 'atualizado_em'
> &
  Partial<Pick<IAnamnese, 'id'>>;

export type UpdateAnamneseInput = Partial<
  Omit<IAnamnese, 'id' | 'prontuario_id' | 'criado_em' | 'atualizado_em'>
>;

interface AnamneseRow extends IAnamnese, RowDataPacket {}

export default class Anamnese {
  static async criar(anamnese: CreateAnamneseInput): Promise<IAnamnese> {
    const id = anamnese.id ?? randomUUID();
    const now = new Date();

    const [result] = await promisePool.execute<ResultSetHeader>(
      `INSERT INTO anamneses(
        id, prontuario_id, tipo_diabete, tempo_diabetes, hemoglobina_glicada,
        retinopatia, neuropatia, nefropatia, hipertenso, cardiopatia,
        cirurgia_mmii, amputacao_previa, uso_palmilha, medicacoes,
        calcado_mais_usado, tabagista, etilista, frequencia_esporte,
        observacoes, criado_em, atualizado_em
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        anamnese.prontuario_id,
        anamnese.tipo_diabete,
        anamnese.tempo_diabetes,
        anamnese.hemoglobina_glicada,
        anamnese.retinopatia,
        anamnese.neuropatia,
        anamnese.nefropatia,
        anamnese.hipertenso,
        anamnese.cardiopatia,
        anamnese.cirurgia_mmii,
        anamnese.amputacao_previa,
        anamnese.uso_palmilha,
        anamnese.medicacoes,
        anamnese.calcado_mais_usado,
        anamnese.tabagista,
        anamnese.etilista,
        anamnese.frequencia_esporte,
        anamnese.observacoes,
        now,
        now,
      ],
    );

    if (result.affectedRows !== 1) {
      throw new Error('Anamnese nao foi cadastrada.');
    }

    return {
      ...anamnese,
      id,
      criado_em: now,
      atualizado_em: now,
    };
  }

  static async buscarTodos(): Promise<IAnamnese[]> {
    const [rows] = await promisePool.execute<AnamneseRow[]>(
      `SELECT id, prontuario_id, tipo_diabete, tempo_diabetes, hemoglobina_glicada,
        retinopatia, neuropatia, nefropatia, hipertenso, cardiopatia,
        cirurgia_mmii, amputacao_previa, uso_palmilha, medicacoes,
        calcado_mais_usado, tabagista, etilista, frequencia_esporte,
        observacoes, criado_em, atualizado_em
      FROM anamneses
      ORDER BY criado_em DESC`,
    );

    return rows;
  }

  static async buscarPorId(id: string): Promise<IAnamnese | null> {
    const [rows] = await promisePool.execute<AnamneseRow[]>(
      `SELECT id, prontuario_id, tipo_diabete, tempo_diabetes, hemoglobina_glicada,
        retinopatia, neuropatia, nefropatia, hipertenso, cardiopatia,
        cirurgia_mmii, amputacao_previa, uso_palmilha, medicacoes,
        calcado_mais_usado, tabagista, etilista, frequencia_esporte,
        observacoes, criado_em, atualizado_em
      FROM anamneses
      WHERE id = ?
      LIMIT 1`,
      [id],
    );

    return rows[0] ?? null;
  }

  static async buscarPorProntuario(prontuario_id: string): Promise<IAnamnese | null> {
    const [rows] = await promisePool.execute<AnamneseRow[]>(
      `SELECT id, prontuario_id, tipo_diabete, tempo_diabetes, hemoglobina_glicada,
        retinopatia, neuropatia, nefropatia, hipertenso, cardiopatia,
        cirurgia_mmii, amputacao_previa, uso_palmilha, medicacoes,
        calcado_mais_usado, tabagista, etilista, frequencia_esporte,
        observacoes, criado_em, atualizado_em
      FROM anamneses
      WHERE prontuario_id = ?
      LIMIT 1`,
      [prontuario_id],
    );

    return rows[0] ?? null;
  }

  static async atualizar(id: string, anamnese: UpdateAnamneseInput): Promise<IAnamnese | null> {
    const campos: string[] = [];
    const valores: Array<string | number | boolean | Date | null> = [];

    if (anamnese.tipo_diabete !== undefined) {
      campos.push('tipo_diabete = ?');
      valores.push(anamnese.tipo_diabete);
    }

    if (anamnese.tempo_diabetes !== undefined) {
      campos.push('tempo_diabetes = ?');
      valores.push(anamnese.tempo_diabetes);
    }

    if (anamnese.hemoglobina_glicada !== undefined) {
      campos.push('hemoglobina_glicada = ?');
      valores.push(anamnese.hemoglobina_glicada);
    }

    if (anamnese.retinopatia !== undefined) {
      campos.push('retinopatia = ?');
      valores.push(anamnese.retinopatia);
    }

    if (anamnese.neuropatia !== undefined) {
      campos.push('neuropatia = ?');
      valores.push(anamnese.neuropatia);
    }

    if (anamnese.nefropatia !== undefined) {
      campos.push('nefropatia = ?');
      valores.push(anamnese.nefropatia);
    }

    if (anamnese.hipertenso !== undefined) {
      campos.push('hipertenso = ?');
      valores.push(anamnese.hipertenso);
    }

    if (anamnese.cardiopatia !== undefined) {
      campos.push('cardiopatia = ?');
      valores.push(anamnese.cardiopatia);
    }

    if (anamnese.cirurgia_mmii !== undefined) {
      campos.push('cirurgia_mmii = ?');
      valores.push(anamnese.cirurgia_mmii);
    }

    if (anamnese.amputacao_previa !== undefined) {
      campos.push('amputacao_previa = ?');
      valores.push(anamnese.amputacao_previa);
    }

    if (anamnese.uso_palmilha !== undefined) {
      campos.push('uso_palmilha = ?');
      valores.push(anamnese.uso_palmilha);
    }

    if (anamnese.medicacoes !== undefined) {
      campos.push('medicacoes = ?');
      valores.push(anamnese.medicacoes);
    }

    if (anamnese.calcado_mais_usado !== undefined) {
      campos.push('calcado_mais_usado = ?');
      valores.push(anamnese.calcado_mais_usado);
    }

    if (anamnese.tabagista !== undefined) {
      campos.push('tabagista = ?');
      valores.push(anamnese.tabagista);
    }

    if (anamnese.etilista !== undefined) {
      campos.push('etilista = ?');
      valores.push(anamnese.etilista);
    }

    if (anamnese.frequencia_esporte !== undefined) {
      campos.push('frequencia_esporte = ?');
      valores.push(anamnese.frequencia_esporte);
    }

    if (anamnese.observacoes !== undefined) {
      campos.push('observacoes = ?');
      valores.push(anamnese.observacoes);
    }

    if (campos.length === 0) {
      return Anamnese.buscarPorId(id);
    }

    campos.push('atualizado_em = ?');
    valores.push(new Date());
    valores.push(id);

    const [result] = await promisePool.execute<ResultSetHeader>(
      `UPDATE anamneses SET ${campos.join(', ')} WHERE id = ?`,
      valores,
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return Anamnese.buscarPorId(id);
  }

  static async deletar(id: string): Promise<boolean> {
    const [result] = await promisePool.execute<ResultSetHeader>(
      'DELETE FROM anamneses WHERE id = ?',
      [id],
    );

    return result.affectedRows === 1;
  }
}
