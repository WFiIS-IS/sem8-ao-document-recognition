import { useApiClient } from '@/api/useApiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatePersonArgs, updatePersonMuation } from '../update-person';
import { AxiosError } from 'axios';

export type UpdatePersonMutationArgs = {
  onSuccess: () => void | Promise<void>;
  onError: (error: string) => void | Promise<void>;
};

export function useUpdatePersonMutation({ onSuccess, onError }: UpdatePersonMutationArgs) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: UpdatePersonArgs) => await updatePersonMuation({ client, ...args }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['persons'] });
      await onSuccess();
    },
    onError: async (error: AxiosError) => {
      if (error.response) {
        await onError(error.response.data as string);
      } else {
        await onError('Something went not okay :(');
      }
    }
  });
}
