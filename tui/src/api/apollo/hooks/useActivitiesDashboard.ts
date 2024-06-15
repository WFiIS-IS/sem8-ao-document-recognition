import { gql, useQuery } from '@apollo/client';
import { useApolloClient } from '@/api/useApolloClient.tsx';
import { Activity } from '@/models/activity.ts';

export const GET_ACTIVITIES_DASHBOARD = gql`
  query activitiesForDashboard($startNotBefore: DateTime, $startBefore: DateTime) {
    activities(filter: { startNotBefore: $startNotBefore, startBefore: $startBefore }) {
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

export function useActivitiesDashboard(startNotBefore: Date, startBefore: Date) {
  const client = useApolloClient();

  return useQuery<{ activities: Activity[] }>(GET_ACTIVITIES_DASHBOARD, {
    client,
    variables: { startNotBefore, startBefore }
  });
}
