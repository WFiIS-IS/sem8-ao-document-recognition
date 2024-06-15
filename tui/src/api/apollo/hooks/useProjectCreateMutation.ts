import { gql, useMutation } from '@apollo/client';
import { useApolloClient } from '@/api/useApolloClient.tsx';
import { GET_PROJECTS } from '@/api/apollo/hooks/useProjects.ts';

export const CREATE_PROJECT = gql`
  mutation createProject($name: String!, $customerId: UUID!) {
    createProject(project: { name: $name, customerId: $customerId }) {
      id
      name
    }
  }
`;

export function useProjectCreateMutation() {
  const client = useApolloClient();

  return useMutation(CREATE_PROJECT, {
    client,
    refetchQueries: [
      {
        query: GET_PROJECTS
      }
    ]
  });
}
