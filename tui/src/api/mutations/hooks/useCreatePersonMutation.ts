import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useApiClient } from '@/api/useApiClient';
import { createPersonMutation } from '@/api/mutations/create-person.ts';
import { PersonCreateDto } from '@/api/dto/person-create-dto.ts';

export type CreatePersonMutationArgs = {
  onSuccess: () => void | Promise<void>;
  onError: (error: string) => void | Promise<void>;
};

export function useCreatePersonMutation({ onSuccess, onError }: CreatePersonMutationArgs) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (person: PersonCreateDto) => await createPersonMutation({ client, person }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['persons'] });
      await onSuccess();
    },
    onError: async (error: AxiosError) => {
      if (error.response) {
        await onError(error.response.data as string);
      } else {
        await onError('Something went wrong');
      }
    }
  });
}
