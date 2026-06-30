import { z } from 'zod';

export const AnamneseCadastroSchema = z.object({
  prontuario_id: z
    .string({ message: 'ID do prontuário é obrigatório.' })
    .uuid({ message: 'ID do prontuário deve ser um UUID válido.' }),
  tipo_diabete: z.string().max(50, { message: 'Tipo de diabetes deve ter no máximo 50 caracteres.' }).nullable().optional(),
  tempo_diabetes: z.string().max(50, { message: 'Tempo de diabetes deve ter no máximo 50 caracteres.' }).nullable().optional(),
  hemoglobina_glicada: z.number({ message: 'Hemoglobina glicada deve ser um número.' }).nullable().optional(),
  retinopatia: z.boolean().optional(),
  neuropatia: z.boolean().optional(),
  nefropatia: z.boolean().optional(),
  hipertenso: z.boolean().optional(),
  cardiopatia: z.boolean().optional(),
  cirurgia_mmii: z.boolean().optional(),
  amputacao_previa: z.boolean().optional(),
  uso_palmilha: z.boolean().optional(),
  medicacoes: z.string().nullable().optional(),
  calcado_mais_usado: z.string().max(50, { message: 'Calçado mais usado deve ter no máximo 50 caracteres.' }).nullable().optional(),
  tabagista: z.boolean().optional(),
  etilista: z.boolean().optional(),
  frequencia_esporte: z.string().max(50, { message: 'Frequência de esporte deve ter no máximo 50 caracteres.' }).nullable().optional(),
  observacoes: z.string().nullable().optional(),
});

export const AnamneseAtualizarSchema = AnamneseCadastroSchema.partial().omit({ prontuario_id: true });
