import { useQuery } from '@tanstack/react-query';
import { personsQuery } from '../personsQuery';
import { useApiClient } from '@/api/useApiClient';

export function usePersonsQuery() {
  const client = useApiClient();

  return useQuery({
    queryKey: ['persons'],
    queryFn: ({ signal }) => personsQuery({ client, signal })
  });
}
