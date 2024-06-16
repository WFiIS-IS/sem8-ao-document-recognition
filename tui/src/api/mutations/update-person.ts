import { format } from 'date-fns';
import { QueryFnParams } from '../types';

export type UpdatePersonArgs = {
  pesel: string;
  first_name: string;
  last_name: string;
  date_of_birth?: Date;
  id_number?: string;
  driving_license_number?: string;
};

export async function updatePersonMuation({
  client,
  signal,
  pesel,
  date_of_birth,
  ...data
}: QueryFnParams<UpdatePersonArgs>) {
  const parsed_date_of_birth = (date_of_birth && format(date_of_birth, 'yyy-MM-dd')) || null;
  await client.patch(
    `/person/${pesel}/`,
    { ...data, date_of_birth: parsed_date_of_birth },
    { signal }
  );
}
