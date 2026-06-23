import { randomUUID } from 'crypto';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { promisePool } from '../config/db';

type DbValue = string | boolean | Date | null;

const dermatologicoColumns = [
  'id',
  'anamneses_id',
  'micose',
  'ressecamento',
  'maceracao',
  'disidrose',
  'hiperpigmentacao',
  'bromidrose',
  'hiperhidrose',
  'hiperqueratose',
  'fissuras',
  'calos',
  'verruga',
  'ulceracao',
  'outros',
  'criado_em',
  'atualizado_em',
].join(', ');

const unguealColumns = [
  'id',
  'anamnese_id',
  'onicogrifose_d',
  'onicogrifose_e',
  'onicocriptose_d',
  'onicocriptose_e',
  'onicomicose_d',
  'onicomicose_e',
  'formato_d',
  'formato_e',
  'outros',
  'criado_em',
  'atualizado_em',
].join(', ');

const vascularColumns = [
  'id',
  'anamnese_id',
  'coloracao_d',
  'coloracao_e',
  'temperatura_d',
  'temperatura_e',
  'edema_d',
  'edema_e',
  'pulso_dorsal_d',
  'pulso_dorsal_e',
  'pulso_tibial_d',
  'pulso_tibial_e',
  'varizes',
  'observacoes',
  'criado_em',
  'atualizado_em',
].join(', ');

const deformidadeColumns = [
  'id',
  'anamnese_id',
  'halux_valgo',
  'dedos_garra',
  'dedos_martelo',
  'proeminencia_ossea',
  'pe_plano_cavo_d',
  'pe_plano_cavo_e',
  'claudicacao',
  'palmilhas',
  'observacoes',
  'criado_em',
  'atualizado_em',
].join(', ');

export interface IExameDermatologico {
  id: string;
  anamneses_id: string;
  micose: boolean;
  ressecamento: boolean;
  maceracao: boolean;
  disidrose: boolean;
  hiperpigmentacao: boolean;
  bromidrose: boolean;
  hiperhidrose: boolean;
  hiperqueratose: boolean;
  fissuras: boolean;
  calos: boolean;
  verruga: boolean;
  ulceracao: boolean;
  outros: string | null;
  criado_em: Date;
  atualizado_em: Date;
}

export interface IAvaliacaoUngueal {
  id: string;
  anamnese_id: string;
  onicogrifose_d: boolean;
  onicogrifose_e: boolean;
  onicocriptose_d: boolean;
  onicocriptose_e: boolean;
  onicomicose_d: boolean;
  onicomicose_e: boolean;
  formato_d: string | null;
  formato_e: string | null;
  outros: string | null;
  criado_em: Date;
  atualizado_em: Date;
}

export interface IAvaliacaoVascular {
  id: string;
  anamnese_id: string;
  coloracao_d: string | null;
  coloracao_e: string | null;
  temperatura_d: string | null;
  temperatura_e: string | null;
  edema_d: boolean;
  edema_e: boolean;
  pulso_dorsal_d: string | null;
  pulso_dorsal_e: string | null;
  pulso_tibial_d: string | null;
  pulso_tibial_e: string | null;
  varizes: boolean;
  observacoes: string | null;
  criado_em: Date;
  atualizado_em: Date;
}

export interface IDeformidade {
  id: string;
  anamnese_id: string;
  halux_valgo: boolean;
  dedos_garra: boolean;
  dedos_martelo: boolean;
  proeminencia_ossea: boolean;
  pe_plano_cavo_d: string | null;
  pe_plano_cavo_e: string | null;
  claudicacao: boolean;
  palmilhas: boolean;
  observacoes: string | null;
  criado_em: Date;
  atualizado_em: Date;
}

export type CreateExameDermatologicoInput = Omit<IExameDermatologico, 'id' | 'criado_em' | 'atualizado_em'> &
  Partial<Pick<IExameDermatologico, 'id'>>;
export type UpdateExameDermatologicoInput = Partial<Omit<IExameDermatologico, 'id' | 'anamneses_id' | 'criado_em' | 'atualizado_em'>>;

export type CreateAvaliacaoUnguealInput = Omit<IAvaliacaoUngueal, 'id' | 'criado_em' | 'atualizado_em'> &
  Partial<Pick<IAvaliacaoUngueal, 'id'>>;
export type UpdateAvaliacaoUnguealInput = Partial<Omit<IAvaliacaoUngueal, 'id' | 'anamnese_id' | 'criado_em' | 'atualizado_em'>>;

export type CreateAvaliacaoVascularInput = Omit<IAvaliacaoVascular, 'id' | 'criado_em' | 'atualizado_em'> &
  Partial<Pick<IAvaliacaoVascular, 'id'>>;
export type UpdateAvaliacaoVascularInput = Partial<Omit<IAvaliacaoVascular, 'id' | 'anamnese_id' | 'criado_em' | 'atualizado_em'>>;

export type CreateDeformidadeInput = Omit<IDeformidade, 'id' | 'criado_em' | 'atualizado_em'> &
  Partial<Pick<IDeformidade, 'id'>>;
export type UpdateDeformidadeInput = Partial<Omit<IDeformidade, 'id' | 'anamnese_id' | 'criado_em' | 'atualizado_em'>>;

interface ExameDermatologicoRow extends IExameDermatologico, RowDataPacket {}
interface AvaliacaoUnguealRow extends IAvaliacaoUngueal, RowDataPacket {}
interface AvaliacaoVascularRow extends IAvaliacaoVascular, RowDataPacket {}
interface DeformidadeRow extends IDeformidade, RowDataPacket {}

function addCampo<T extends Record<string, unknown>>(
  input: T,
  campos: string[],
  valores: DbValue[],
  campo: keyof T & string,
) {
  if (input[campo] !== undefined) {
    campos.push(`${campo} = ?`);
    valores.push(input[campo] as DbValue);
  }
}

export class ExameDermatologico {
  static async criar(exame: CreateExameDermatologicoInput): Promise<IExameDermatologico> {
    const id = exame.id ?? randomUUID();
    const now = new Date();

    const [result] = await promisePool.execute<ResultSetHeader>(
      `INSERT INTO exames_dermatologicos(
        id, anamneses_id, micose, ressecamento, maceracao, disidrose,
        hiperpigmentacao, bromidrose, hiperhidrose, hiperqueratose,
        fissuras, calos, verruga, ulceracao, outros, criado_em, atualizado_em
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        exame.anamneses_id,
        exame.micose,
        exame.ressecamento,
        exame.maceracao,
        exame.disidrose,
        exame.hiperpigmentacao,
        exame.bromidrose,
        exame.hiperhidrose,
        exame.hiperqueratose,
        exame.fissuras,
        exame.calos,
        exame.verruga,
        exame.ulceracao,
        exame.outros,
        now,
        now,
      ],
    );

    if (result.affectedRows !== 1) {
      throw new Error('Exame dermatologico nao foi cadastrado.');
    }

    return { ...exame, id, criado_em: now, atualizado_em: now };
  }

  static async buscarTodos(): Promise<IExameDermatologico[]> {
    const [rows] = await promisePool.execute<ExameDermatologicoRow[]>(
      `SELECT ${dermatologicoColumns} FROM exames_dermatologicos ORDER BY criado_em DESC`,
    );

    return rows;
  }

  static async buscarPorId(id: string): Promise<IExameDermatologico | null> {
    const [rows] = await promisePool.execute<ExameDermatologicoRow[]>(
      `SELECT ${dermatologicoColumns} FROM exames_dermatologicos WHERE id = ? LIMIT 1`,
      [id],
    );

    return rows[0] ?? null;
  }

  static async buscarPorAnamnese(anamneseId: string): Promise<IExameDermatologico | null> {
    const [rows] = await promisePool.execute<ExameDermatologicoRow[]>(
      `SELECT ${dermatologicoColumns} FROM exames_dermatologicos WHERE anamneses_id = ? LIMIT 1`,
      [anamneseId],
    );

    return rows[0] ?? null;
  }

  static async atualizar(id: string, exame: UpdateExameDermatologicoInput): Promise<IExameDermatologico | null> {
    const campos: string[] = [];
    const valores: DbValue[] = [];

    for (const campo of [
      'micose',
      'ressecamento',
      'maceracao',
      'disidrose',
      'hiperpigmentacao',
      'bromidrose',
      'hiperhidrose',
      'hiperqueratose',
      'fissuras',
      'calos',
      'verruga',
      'ulceracao',
      'outros',
    ] as const) {
      addCampo(exame, campos, valores, campo);
    }

    if (campos.length === 0) {
      return ExameDermatologico.buscarPorId(id);
    }

    campos.push('atualizado_em = ?');
    valores.push(new Date(), id);

    const [result] = await promisePool.execute<ResultSetHeader>(
      `UPDATE exames_dermatologicos SET ${campos.join(', ')} WHERE id = ?`,
      valores,
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return ExameDermatologico.buscarPorId(id);
  }

  static async deletar(id: string): Promise<boolean> {
    const [result] = await promisePool.execute<ResultSetHeader>('DELETE FROM exames_dermatologicos WHERE id = ?', [id]);
    return result.affectedRows === 1;
  }
}

export class AvaliacaoUngueal {
  static async criar(avaliacao: CreateAvaliacaoUnguealInput): Promise<IAvaliacaoUngueal> {
    const id = avaliacao.id ?? randomUUID();
    const now = new Date();

    const [result] = await promisePool.execute<ResultSetHeader>(
      `INSERT INTO avaliacoes_ungueais(
        id, anamnese_id, onicogrifose_d, onicogrifose_e, onicocriptose_d,
        onicocriptose_e, onicomicose_d, onicomicose_e, formato_d,
        formato_e, outros, criado_em, atualizado_em
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        avaliacao.anamnese_id,
        avaliacao.onicogrifose_d,
        avaliacao.onicogrifose_e,
        avaliacao.onicocriptose_d,
        avaliacao.onicocriptose_e,
        avaliacao.onicomicose_d,
        avaliacao.onicomicose_e,
        avaliacao.formato_d,
        avaliacao.formato_e,
        avaliacao.outros,
        now,
        now,
      ],
    );

    if (result.affectedRows !== 1) {
      throw new Error('Avaliacao ungueal nao foi cadastrada.');
    }

    return { ...avaliacao, id, criado_em: now, atualizado_em: now };
  }

  static async buscarTodos(): Promise<IAvaliacaoUngueal[]> {
    const [rows] = await promisePool.execute<AvaliacaoUnguealRow[]>(
      `SELECT ${unguealColumns} FROM avaliacoes_ungueais ORDER BY criado_em DESC`,
    );

    return rows;
  }

  static async buscarPorId(id: string): Promise<IAvaliacaoUngueal | null> {
    const [rows] = await promisePool.execute<AvaliacaoUnguealRow[]>(
      `SELECT ${unguealColumns} FROM avaliacoes_ungueais WHERE id = ? LIMIT 1`,
      [id],
    );

    return rows[0] ?? null;
  }

  static async buscarPorAnamnese(anamneseId: string): Promise<IAvaliacaoUngueal | null> {
    const [rows] = await promisePool.execute<AvaliacaoUnguealRow[]>(
      `SELECT ${unguealColumns} FROM avaliacoes_ungueais WHERE anamnese_id = ? LIMIT 1`,
      [anamneseId],
    );

    return rows[0] ?? null;
  }

  static async atualizar(id: string, avaliacao: UpdateAvaliacaoUnguealInput): Promise<IAvaliacaoUngueal | null> {
    const campos: string[] = [];
    const valores: DbValue[] = [];

    for (const campo of [
      'onicogrifose_d',
      'onicogrifose_e',
      'onicocriptose_d',
      'onicocriptose_e',
      'onicomicose_d',
      'onicomicose_e',
      'formato_d',
      'formato_e',
      'outros',
    ] as const) {
      addCampo(avaliacao, campos, valores, campo);
    }

    if (campos.length === 0) {
      return AvaliacaoUngueal.buscarPorId(id);
    }

    campos.push('atualizado_em = ?');
    valores.push(new Date(), id);

    const [result] = await promisePool.execute<ResultSetHeader>(
      `UPDATE avaliacoes_ungueais SET ${campos.join(', ')} WHERE id = ?`,
      valores,
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return AvaliacaoUngueal.buscarPorId(id);
  }

  static async deletar(id: string): Promise<boolean> {
    const [result] = await promisePool.execute<ResultSetHeader>('DELETE FROM avaliacoes_ungueais WHERE id = ?', [id]);
    return result.affectedRows === 1;
  }
}

export class AvaliacaoVascular {
  static async criar(avaliacao: CreateAvaliacaoVascularInput): Promise<IAvaliacaoVascular> {
    const id = avaliacao.id ?? randomUUID();
    const now = new Date();

    const [result] = await promisePool.execute<ResultSetHeader>(
      `INSERT INTO avaliacoes_vasculares(
        id, anamnese_id, coloracao_d, coloracao_e, temperatura_d, temperatura_e,
        edema_d, edema_e, pulso_dorsal_d, pulso_dorsal_e, pulso_tibial_d,
        pulso_tibial_e, varizes, observacoes, criado_em, atualizado_em
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        avaliacao.anamnese_id,
        avaliacao.coloracao_d,
        avaliacao.coloracao_e,
        avaliacao.temperatura_d,
        avaliacao.temperatura_e,
        avaliacao.edema_d,
        avaliacao.edema_e,
        avaliacao.pulso_dorsal_d,
        avaliacao.pulso_dorsal_e,
        avaliacao.pulso_tibial_d,
        avaliacao.pulso_tibial_e,
        avaliacao.varizes,
        avaliacao.observacoes,
        now,
        now,
      ],
    );

    if (result.affectedRows !== 1) {
      throw new Error('Avaliacao vascular nao foi cadastrada.');
    }

    return { ...avaliacao, id, criado_em: now, atualizado_em: now };
  }

  static async buscarTodos(): Promise<IAvaliacaoVascular[]> {
    const [rows] = await promisePool.execute<AvaliacaoVascularRow[]>(
      `SELECT ${vascularColumns} FROM avaliacoes_vasculares ORDER BY criado_em DESC`,
    );

    return rows;
  }

  static async buscarPorId(id: string): Promise<IAvaliacaoVascular | null> {
    const [rows] = await promisePool.execute<AvaliacaoVascularRow[]>(
      `SELECT ${vascularColumns} FROM avaliacoes_vasculares WHERE id = ? LIMIT 1`,
      [id],
    );

    return rows[0] ?? null;
  }

  static async buscarPorAnamnese(anamneseId: string): Promise<IAvaliacaoVascular | null> {
    const [rows] = await promisePool.execute<AvaliacaoVascularRow[]>(
      `SELECT ${vascularColumns} FROM avaliacoes_vasculares WHERE anamnese_id = ? LIMIT 1`,
      [anamneseId],
    );

    return rows[0] ?? null;
  }

  static async atualizar(id: string, avaliacao: UpdateAvaliacaoVascularInput): Promise<IAvaliacaoVascular | null> {
    const campos: string[] = [];
    const valores: DbValue[] = [];

    for (const campo of [
      'coloracao_d',
      'coloracao_e',
      'temperatura_d',
      'temperatura_e',
      'edema_d',
      'edema_e',
      'pulso_dorsal_d',
      'pulso_dorsal_e',
      'pulso_tibial_d',
      'pulso_tibial_e',
      'varizes',
      'observacoes',
    ] as const) {
      addCampo(avaliacao, campos, valores, campo);
    }

    if (campos.length === 0) {
      return AvaliacaoVascular.buscarPorId(id);
    }

    campos.push('atualizado_em = ?');
    valores.push(new Date(), id);

    const [result] = await promisePool.execute<ResultSetHeader>(
      `UPDATE avaliacoes_vasculares SET ${campos.join(', ')} WHERE id = ?`,
      valores,
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return AvaliacaoVascular.buscarPorId(id);
  }

  static async deletar(id: string): Promise<boolean> {
    const [result] = await promisePool.execute<ResultSetHeader>('DELETE FROM avaliacoes_vasculares WHERE id = ?', [id]);
    return result.affectedRows === 1;
  }
}

export class Deformidade {
  static async criar(deformidade: CreateDeformidadeInput): Promise<IDeformidade> {
    const id = deformidade.id ?? randomUUID();
    const now = new Date();

    const [result] = await promisePool.execute<ResultSetHeader>(
      `INSERT INTO deformidades(
        id, anamnese_id, halux_valgo, dedos_garra, dedos_martelo,
        proeminencia_ossea, pe_plano_cavo_d, pe_plano_cavo_e,
        claudicacao, palmilhas, observacoes, criado_em, atualizado_em
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        deformidade.anamnese_id,
        deformidade.halux_valgo,
        deformidade.dedos_garra,
        deformidade.dedos_martelo,
        deformidade.proeminencia_ossea,
        deformidade.pe_plano_cavo_d,
        deformidade.pe_plano_cavo_e,
        deformidade.claudicacao,
        deformidade.palmilhas,
        deformidade.observacoes,
        now,
        now,
      ],
    );

    if (result.affectedRows !== 1) {
      throw new Error('Deformidade nao foi cadastrada.');
    }

    return { ...deformidade, id, criado_em: now, atualizado_em: now };
  }

  static async buscarTodos(): Promise<IDeformidade[]> {
    const [rows] = await promisePool.execute<DeformidadeRow[]>(
      `SELECT ${deformidadeColumns} FROM deformidades ORDER BY criado_em DESC`,
    );

    return rows;
  }

  static async buscarPorId(id: string): Promise<IDeformidade | null> {
    const [rows] = await promisePool.execute<DeformidadeRow[]>(
      `SELECT ${deformidadeColumns} FROM deformidades WHERE id = ? LIMIT 1`,
      [id],
    );

    return rows[0] ?? null;
  }

  static async buscarPorAnamnese(anamneseId: string): Promise<IDeformidade | null> {
    const [rows] = await promisePool.execute<DeformidadeRow[]>(
      `SELECT ${deformidadeColumns} FROM deformidades WHERE anamnese_id = ? LIMIT 1`,
      [anamneseId],
    );

    return rows[0] ?? null;
  }

  static async atualizar(id: string, deformidade: UpdateDeformidadeInput): Promise<IDeformidade | null> {
    const campos: string[] = [];
    const valores: DbValue[] = [];

    for (const campo of [
      'halux_valgo',
      'dedos_garra',
      'dedos_martelo',
      'proeminencia_ossea',
      'pe_plano_cavo_d',
      'pe_plano_cavo_e',
      'claudicacao',
      'palmilhas',
      'observacoes',
    ] as const) {
      addCampo(deformidade, campos, valores, campo);
    }

    if (campos.length === 0) {
      return Deformidade.buscarPorId(id);
    }

    campos.push('atualizado_em = ?');
    valores.push(new Date(), id);

    const [result] = await promisePool.execute<ResultSetHeader>(
      `UPDATE deformidades SET ${campos.join(', ')} WHERE id = ?`,
      valores,
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return Deformidade.buscarPorId(id);
  }

  static async deletar(id: string): Promise<boolean> {
    const [result] = await promisePool.execute<ResultSetHeader>('DELETE FROM deformidades WHERE id = ?', [id]);
    return result.affectedRows === 1;
  }
}
