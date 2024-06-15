import { gql, useQuery } from '@apollo/client';
import { useApolloClient } from '@/api/useApolloClient.tsx';
import { Customer } from '@/models/customer.ts';

export const GET_CUSTOMER_LIST = gql`
  query customersList {
    customers {
      id
      name
    }
  }
`;

export function useCustomersForDropdown() {
  const client = useApolloClient();

  return useQuery<{ customers: Customer[] }>(GET_CUSTOMER_LIST, {
    client
  });
}
