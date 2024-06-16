import type { QueryFnParams } from '../types';
import { PersonCreateDto } from '@/api/dto/person-create-dto.ts';

export type CreatePersonArgs = {
  person: PersonCreateDto;
};

export async function createPersonMutation({
  client,
  person,
  signal
}: QueryFnParams<CreatePersonArgs>) {
  await client.post(`/person/`, person, { signal });
  return;
}
