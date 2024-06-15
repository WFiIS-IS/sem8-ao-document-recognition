import { gql, useQuery } from '@apollo/client';
import { useApolloClient } from '@/api/useApolloClient.tsx';
import { User } from '@/models/user.ts';

export const GET_USER = gql`
  query user {
    user {
      id
      username
    }
  }
`;

export function useUser() {
  const client = useApolloClient();

  return useQuery<{ user: User }>(GET_USER, {
    client
  });
}
