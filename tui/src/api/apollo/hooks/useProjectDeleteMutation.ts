import { gql, useMutation } from '@apollo/client';
import { useApolloClient } from '@/api/useApolloClient.tsx';
import { GET_PROJECTS } from '@/api/apollo/hooks/useProjects.ts';
import { GET_ACTIVITIES } from '@/api/apollo/hooks/useActivities.ts';
import { GET_CUSTOMERS } from '@/api/apollo/hooks/useCustomers.ts';
import { GET_RUNNING_ACTIVITIES } from '@/api/apollo/hooks/useActivitiesRunning.ts';

export const DELETE_PROJECT = gql`
  mutation deleteProject($id: UUID!) {
    deleteProject(id: $id) {
      id
    }
  }
`;

export function useProjectDeleteMutation() {
  const client = useApolloClient();

  return useMutation(DELETE_PROJECT, {
    client,
    refetchQueries: [
      {
        query: GET_ACTIVITIES
      },
      {
        query: GET_RUNNING_ACTIVITIES
      },
      {
        query: GET_PROJECTS
      },
      {
        query: GET_CUSTOMERS
      }
    ]
  });
}
