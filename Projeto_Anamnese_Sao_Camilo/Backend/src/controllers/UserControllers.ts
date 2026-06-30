import { Response, Request, NextFunction } from 'express';
import User, { UserPerfil } from '../models/UserModels';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getRequiredEnv } from '../config/env';

const jwtSecret = getRequiredEnv('JWT_SECRET');

interface RegisterBody {
  nome: string;
  email: string;
  senha: string;
  perfil: UserPerfil;
}

interface LoginBody {
  email: string;
  senha: string;
}

export async function registerUser(
  req: Request<unknown, unknown, RegisterBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const { nome, email, senha, perfil } = req.body;

    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return res.status(409).json({ message: 'Email ja cadastrado.' });
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    const user = await User.create({
      nome,
      email,
      senha_hash,
      perfil,
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        perfil: user.perfil,
      },
      jwtSecret,
      { expiresIn: '1d' },
    );

    return res.status(201).json({
      message: 'Usuario cadastrado com sucesso.',
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        ativo: user.ativo,
        criado_em: user.criado_em,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function loginUser(
  req: Request<unknown, unknown, LoginBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, senha } = req.body;

    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Email ou senha invalidos.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha_hash);

    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Email ou senha invalidos.' });
    }

    const { senha_hash: _, ...userSemSenha } = user;

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        perfil: user.perfil,
      },
      jwtSecret,
      { expiresIn: '1h' },
    );

    return res.status(200).json({ user: userSemSenha, token });
  } catch (error) {
    next(error);
  }
}
