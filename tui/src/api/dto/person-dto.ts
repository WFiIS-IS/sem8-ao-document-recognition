import { z } from 'zod';

export const PersonDTO = z.object({
  first_name: z.string(),
  last_name: z.string(),
  pesel: z.string().length(11),
  date_of_birth: z.date().nullable(),
  sex: z.enum(['Male', 'Female'])
});
