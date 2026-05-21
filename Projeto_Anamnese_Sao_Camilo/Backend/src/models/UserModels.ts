import { randomUUID } from 'crypto';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { promisePool } from '../config/db';

export type UserPerfil = 'recepcionista' | 'podologo' | 'administracao';

export interface IUser {
  id: string;
  nome: string;
  email: string;
  senha_hash: string;
  perfil: UserPerfil;
  ativo: boolean;
  criado_em: Date;
  atualizado_em: Date;
}

export type CreateUserInput = Omit<IUser, 'id' | 'ativo' | 'criado_em' | 'atualizado_em'> &
  Partial<Pick<IUser, 'id' | 'ativo'>>;

interface UserRow extends IUser, RowDataPacket {}

export default class User {
  static async create(user: CreateUserInput): Promise<IUser> {
    const id = user.id ?? randomUUID();
    const now = new Date();
    const ativo = user.ativo ?? true;

    const [result] = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO usuarios(id, nome, email, senha_hash, perfil, ativo, criado_em, atualizado_em) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, user.nome, user.email, user.senha_hash, user.perfil, ativo, now, now],
    );

    if (result.affectedRows !== 1) {
      throw new Error('Usuario nao foi cadastrado.');
    }

    return {
      ...user,
      id,
      ativo,
      criado_em: now,
      atualizado_em: now,
    };
  }

  static async UserRegister(user: CreateUserInput): Promise<IUser> {
    return User.create(user);
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    const [rows] = await promisePool.execute<UserRow[]>(
      'SELECT id, nome, email, senha_hash, perfil, ativo, criado_em, atualizado_em FROM usuarios WHERE email = ? LIMIT 1',
      [email],
    );

    return rows[0] ?? null;
  }
}
