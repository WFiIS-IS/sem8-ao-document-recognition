import { z } from 'zod';

export const PersonDTO = z.object({
  first_name: z.string(),
  last_name: z.string(),
  pesel: z.string().regex(/^\d{11}$/),
  date_of_birth: z.date().nullable(),
  id_number: z.string().nullable(),
  driving_license_number: z.string().nullable()
});
