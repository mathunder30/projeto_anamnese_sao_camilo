import { Response, Request } from 'express';
import User, { UserPerfil } from '../models/UserModels';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getRequiredEnv } from '../config/env';

const jwtSecret = getRequiredEnv('JWT_SECRET');

const validPerfis: UserPerfil[] = ['recepcionista', 'podologo', 'administracao'];

interface RegisterBody {
  nome?: string;
  email?: string;
  senha?: string;
  perfil?: UserPerfil;
}

interface LoginBody {
  email?: string;
  senha?: string;
}

export async function registerUser(req: Request<unknown, unknown, RegisterBody>, res: Response) {
  try {
    const { nome, email, senha, perfil } = req.body;

    if (!nome || !email || !senha || !perfil) {
      return res.status(400).json({ message: 'Nome, email, senha e perfil sao obrigatorios.' });
    }

    if (!validPerfis.includes(perfil)) {
      return res.status(400).json({ message: 'Perfil invalido.' });
    }

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
    console.error(error);
    return res.status(500).json({ message: 'Erro ao cadastrar usuario.' });
  }
}

export async function loginUser(req: Request<unknown, unknown, LoginBody>, res: Response) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: 'Email e senha sao obrigatorios.' });
    }

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
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
