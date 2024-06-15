import { gql, useQuery } from '@apollo/client';
import { useApolloClient } from '@/api/useApolloClient.tsx';
import { Project } from '@/models/project.ts';

export const GET_PROJECTS = gql`
  query projects {
    projects {
      id
      name
      activities {
        id
        start
        finish
      }
      customer {
        id
        name
      }
    }
  }
`;

export function useProjects() {
  const client = useApolloClient();

  return useQuery<{ projects: Project[] }>(GET_PROJECTS, {
    client
  });
}
