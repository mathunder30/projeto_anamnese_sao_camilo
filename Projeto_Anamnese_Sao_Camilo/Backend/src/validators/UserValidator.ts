import { z } from 'zod';

export const UserRegisterSchema = z.object({
  nome: z
    .string({ message: 'Nome é obrigatório.' })
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres.' }),
  email: z
    .string({ message: 'Email é obrigatório.' })
    .email({ message: 'Formato de email inválido.' })
    .max(150, { message: 'O email deve ter no máximo 150 caracteres.' }),
  senha: z
    .string({ message: 'Senha é obrigatória.' })
    .min(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
    .regex(/[A-Z]/, { message: 'A senha deve conter pelo menos uma letra maiúscula.' })
    .regex(/[a-z]/, { message: 'A senha deve conter pelo menos uma letra minúscula.' })
    .regex(/\d/, { message: 'A senha deve conter pelo menos um número.' })
    .regex(/[@$!%*?&]/, { message: 'A senha deve conter pelo menos um caractere especial (@$!%*?&).' }),
  perfil: z.enum(['recepcionista', 'podologo', 'administracao'], {
    message: 'Perfil inválido. Perfis permitidos: recepcionista, podologo, administracao.',
  }),
});

export const UserLoginSchema = z.object({
  email: z
    .string({ message: 'Email é obrigatório.' })
    .email({ message: 'Formato de email inválido.' }),
  senha: z
    .string({ message: 'Senha é obrigatória.' })
    .min(1, { message: 'Senha é obrigatória.' }),
});
