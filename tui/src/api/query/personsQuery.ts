import { z } from 'zod';
import { PersonDTO } from '../dto/person-dto';
import { QueryFnParams } from '../types';

export async function personsQuery({ client, signal }: QueryFnParams) {
  const { data } = await client.get('/person/', { signal });
  return await z.array(PersonDTO).parseAsync(data);
}
