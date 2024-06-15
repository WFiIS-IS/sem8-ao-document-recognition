import { gql, useMutation } from '@apollo/client';
import { useApolloClient } from '@/api/useApolloClient.tsx';
import { GET_ACTIVITIES } from '@/api/apollo/hooks/useActivities.ts';
import { GET_CUSTOMERS } from '@/api/apollo/hooks/useCustomers.ts';
import { GET_PROJECTS } from '@/api/apollo/hooks/useProjects.ts';
import { GET_RUNNING_ACTIVITIES } from '@/api/apollo/hooks/useActivitiesRunning.ts';

export const CREATE_ACTIVITY = gql`
  mutation createActivity($projectId: UUID!, $start: DateTime!, $finish: DateTime) {
    createActivity(activity: { projectId: $projectId, start: $start, finish: $finish }) {
      id
    }
  }
`;

export function useActivityCreateMutation() {
  const client = useApolloClient();

  return useMutation(CREATE_ACTIVITY, {
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
