import { QueryFnParams } from '../types';
import { PersonDTO } from '../dto/person-dto';

export async function personQuery({ client, signal, id }: QueryFnParams<{ id: string }>) {
  const { data } = await client.get(`/person/${id}/`, { signal });
  return await PersonDTO.parseAsync(data);
}
