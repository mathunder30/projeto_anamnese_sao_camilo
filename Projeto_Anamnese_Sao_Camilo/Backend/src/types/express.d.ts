import { UserPerfil } from '../models/UserModels';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        perfil: UserPerfil;
      };
    }
  }
}

export {};
