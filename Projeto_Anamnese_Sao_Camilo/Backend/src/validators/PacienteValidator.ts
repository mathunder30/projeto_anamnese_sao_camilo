import { z } from 'zod';

export const PacienteCadastroSchema = z.object({
  nome: z
    .string({ message: 'Nome é obrigatório.' })
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres.' }),
  data_nascimento: z
    .string({ message: 'Data de nascimento é obrigatória.' })
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Data de nascimento inválida.' }),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, { message: 'CPF inválido. Use o formato 000.000.000-00 ou apenas números.' })
    .nullable()
    .optional(),
  sexo: z.enum(['masculino', 'feminino', 'outro'], {
    message: 'Sexo inválido. Opções permitidas: masculino, feminino, outro.',
  }),
  rg: z.string().max(20, { message: 'RG deve ter no máximo 20 caracteres.' }).nullable().optional(),
  email: z
    .string()
    .email({ message: 'Formato de email inválido.' })
    .nullable()
    .optional()
    .or(z.literal('')),
  telefone: z.string().max(20, { message: 'Telefone deve ter no máximo 20 caracteres.' }).nullable().optional(),
  celular: z
    .string({ message: 'Celular é obrigatório.' })
    .min(10, { message: 'Celular deve ter no mínimo 10 dígitos.' })
    .max(20, { message: 'Celular deve ter no máximo 20 caracteres.' }),
  profissao: z.string().max(100, { message: 'Profissão deve ter no máximo 100 caracteres.' }).nullable().optional(),
  indicacao: z.string().max(100, { message: 'Indicação deve ter no máximo 100 caracteres.' }).nullable().optional(),
});

export const PacienteAtualizarSchema = PacienteCadastroSchema.partial();
