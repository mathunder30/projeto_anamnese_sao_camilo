import { randomUUID } from 'crypto';
import type { ResultSetHeader } from 'mysql2';
import { promisePool } from '../config/db';

interface IUser {
  id?: string;
  nome: string;
  email: string;
  senha_hash: string;
  perfil: 'recepcionista' | 'podologo' | 'administracao';
  ativo: boolean;
  criado_em?: Date;
  atualizado_em?: Date;
}

export default class User {
  static async UserRegister(user: IUser): Promise<IUser> {
    const id = user.id ?? randomUUID();
    const criadoEm = user.criado_em ?? new Date();
    const atualizadoEm = user.atualizado_em ?? new Date();

    await promisePool.execute<ResultSetHeader>(
      'INSERT INTO usuarios(id, nome, email, senha_hash, perfil, ativo, criado_em, atualizado_em) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, user.nome, user.email, user.senha_hash, user.perfil, user.ativo, criadoEm, atualizadoEm],
    );

    return {
      ...user,
      id,
      criado_em: criadoEm,
      atualizado_em: atualizadoEm,
    };
  }
}
