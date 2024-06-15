import { gql, useQuery } from '@apollo/client';
import { useApolloClient } from '@/api/useApolloClient.tsx';
import { Customer } from '@/models/customer.ts';

export const GET_CUSTOMERS = gql`
  query customers {
    customers {
      id
      name
      activities {
        id
        start
        finish
      }
    }
  }
`;

export function useCustomers() {
  const client = useApolloClient();

  return useQuery<{ customers: Customer[] }>(GET_CUSTOMERS, {
    client
  });
}
