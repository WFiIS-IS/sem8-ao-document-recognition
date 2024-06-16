import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useApiClient } from '@/api/useApiClient';
import { deletePersonMutation } from '@/api/mutations/delete-person.ts';

export type DeletePersonMutationArgs = {
  onSuccess: () => void | Promise<void>;
  onError: (error: string) => void | Promise<void>;
};

export function useDeletePersonMutation({ onSuccess, onError }: DeletePersonMutationArgs) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pesel }: { pesel: string }) =>
      await deletePersonMutation({ client, pesel }),
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
