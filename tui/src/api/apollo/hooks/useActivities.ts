import { gql, useQuery } from '@apollo/client';
import { useApolloClient } from '@/api/useApolloClient.tsx';
import { Activity } from '@/models/activity.ts';

export const GET_ACTIVITIES = gql`
  query activities {
    activities(filter: {}) {
      id
      start
      finish
      project {
        id
        name
        customer {
          id
          name
        }
      }
    }
  }
`;

export function useActivities() {
  const client = useApolloClient();

  return useQuery<{ activities: Activity[] }>(GET_ACTIVITIES, {
    client
  });
}
