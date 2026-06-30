import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function ErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Erro de validação nos dados enviados.',
      errors: err.issues.map((e) => ({
        campo: e.path.join('.'),
        mensagem: e.message,
      })),
    });
    return;
  }

  // Database duplicate entry error
  if (err.code === 'ER_DUP_ENTRY') {
    res.status(409).json({
      message: 'Erro de duplicidade: O registro já existe ou possui conflito com dados cadastrados.',
      details: err.sqlMessage || err.message,
    });
    return;
  }

  // Database foreign key failure
  if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_ROW_IS_REFERENCED_2') {
    res.status(400).json({
      message: 'Erro de integridade referencial: Um registro vinculado não foi encontrado ou possui dependências.',
      details: err.sqlMessage || err.message,
    });
    return;
  }

  console.error('Erro não tratado pelo Express:', err);
  res.status(500).json({
    message: 'Ocorreu um erro interno no servidor.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}
