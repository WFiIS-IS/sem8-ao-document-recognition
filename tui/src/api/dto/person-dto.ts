import { z } from 'zod';

const stringToDate = z.string().pipe(z.coerce.date());

export const PersonDTO = z.object({
  first_name: z.string(),
  last_name: z.string(),
  pesel: z.string().regex(/^\d{11}$/),
  date_of_birth: z.string().pipe(stringToDate).nullable(),
  id_number: z.string().nullable(),
  driving_license_number: z.string().nullable()
});
