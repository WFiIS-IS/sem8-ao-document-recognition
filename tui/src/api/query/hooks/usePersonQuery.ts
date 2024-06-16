import { useApiClient } from '@/api/useApiClient';
import { useQuery } from '@tanstack/react-query';
import { personQuery } from '../personQuery';

export function usePersonQuery(id: string) {
  const client = useApiClient();

  return useQuery({
    queryKey: ['person'],
    queryFn: ({ signal }) => personQuery({ client, signal, id })
  });
}
