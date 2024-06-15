import { gql, useMutation } from '@apollo/client';
import { useApolloClient } from '@/api/useApolloClient.tsx';
import { GET_ACTIVITIES } from '@/api/apollo/hooks/useActivities.ts';
import { GET_CUSTOMERS } from '@/api/apollo/hooks/useCustomers.ts';
import { GET_PROJECTS } from '@/api/apollo/hooks/useProjects.ts';
import { GET_RUNNING_ACTIVITIES } from '@/api/apollo/hooks/useActivitiesRunning.ts';

export const UPDATE_ACTIVITY = gql`
  mutation updateActivity($id: UUID!, $start: DateTime!, $finish: DateTime!) {
    updateActivity(id: $id, activity: { start: $start, finish: $finish }) {
      id
    }
  }
`;

export function useActivityUpdateMutation() {
  const client = useApolloClient();

  return useMutation(UPDATE_ACTIVITY, {
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
