import { gql, useMutation } from '@apollo/client';
import { useApolloClient } from '@/api/useApolloClient.tsx';
import { GET_CUSTOMERS } from '@/api/apollo/hooks/useCustomers.ts';

export const CREATE_CUSTOMER = gql`
  mutation createCustomer($name: String!) {
    createCustomer(customer: { name: $name }) {
      id
      name
    }
  }
`;

export function useCustomerCreateMutation() {
  const client = useApolloClient();

  return useMutation(CREATE_CUSTOMER, {
    client,
    refetchQueries: [
      {
        query: GET_CUSTOMERS
      }
    ]
  });
}
