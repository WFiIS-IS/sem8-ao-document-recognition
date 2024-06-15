import { gql, useQuery } from '@apollo/client';
import { useApolloClient } from '@/api/useApolloClient.tsx';
import { Activity } from '@/models/activity.ts';

export const GET_RUNNING_ACTIVITIES = gql`
  query activities {
    activities(filter: { activityType: RUNNING }) {
      id
      start
      finish
    }
  }
`;

export function useRunningActivities() {
  const client = useApolloClient();

  return useQuery<{ activities: Activity[] }>(GET_RUNNING_ACTIVITIES, {
    client
  });
}
