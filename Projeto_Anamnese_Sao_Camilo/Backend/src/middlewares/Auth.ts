import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { getRequiredEnv } from '../config/env';
import { UserPerfil } from '../models/UserModels';

const secret_key = getRequiredEnv("JWT_SECRET");

interface AuthTokenPayload extends JwtPayload {
    id: string;
    email: string;
    perfil: UserPerfil;
}

const validPerfis: UserPerfil[] = ['recepcionista', 'podologo', 'administracao'];

function isAuthTokenPayload(decoded: string | JwtPayload): decoded is AuthTokenPayload {
    return (
        typeof decoded !== 'string' &&
        typeof decoded.id === 'string' &&
        typeof decoded.email === 'string' &&
        validPerfis.includes(decoded.perfil)
    );
}

export const VerificarToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace(/^Bearer\s+/i, "");

    if (!token) {
        res.status(401).json({ message: "Acesso negado. Token nao fornecido" });
        return;
    }

    try {
        const decoded = jwt.verify(token, secret_key);

        if (!isAuthTokenPayload(decoded)) {
            res.status(401).json({ message: "Token invalido" });
            return;
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            perfil: decoded.perfil,
        };

        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalido" });
    }
};
