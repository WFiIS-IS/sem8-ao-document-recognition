import { gql, useQuery } from '@apollo/client';
import { useApolloClient } from '@/api/useApolloClient.tsx';
import { Customer } from '@/models/customer.ts';
import { Project } from '@/models/project.ts';

export const GET_CUSTOMERS = gql`
  query customersAndProjects {
    customers {
      id
      name
    }
    projects {
      id
      name
      customer {
        id
      }
    }
  }
`;

export function useCustomersAndProjectsForDropdown() {
  const client = useApolloClient();

  return useQuery<{ customers: Customer[]; projects: Project[] }>(GET_CUSTOMERS, {
    client
  });
}
