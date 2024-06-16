import type { QueryFnParams } from '../types';

export type DeletePersonArgs = {
  pesel: string;
};

export async function deletePersonMutation({
  client,
  signal,
  pesel
}: QueryFnParams<DeletePersonArgs>) {
  await client.delete(`/person/${pesel}/`, { signal });
  return;
}
