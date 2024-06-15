import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { useAuth } from 'oidc-react';
import { useMemo } from 'react';
import { env } from '$env';
import { onError } from '@apollo/client/link/error';
import { useToast } from '@/components/ui/use-toast.ts';

const httpLink = new HttpLink({ uri: env.PUBLIC_API_URL + '/graphql' });

const cache = new InMemoryCache();

const authMiddleware = (authToken: string | null) =>
  new ApolloLink((operation, forward) => {
    if (authToken) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${authToken}`
        }
      });
    }

    return forward(operation);
  });

const useOnErrorLink = () => {
  const { toast } = useToast();

  return () =>
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        toast({
          title: 'GraphQL error occurred:',
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(graphQLErrors, null, 2)}</code>
            </pre>
          )
        });

        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        );
      }
      if (networkError) {
        toast({
          title: 'Network error occurred:',
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(networkError, null, 2)}</code>
            </pre>
          )
        });

        console.log(`[Network error]: ${networkError}`);
      }
    });
};

export const useApolloClient = () => {
  const auth = useAuth();
  const onError = useOnErrorLink();

  return useMemo(() => {
    const { access_token: accessToken = null } = auth.userData ?? {};

    return new ApolloClient({
      link: authMiddleware(accessToken).concat(onError()).concat(httpLink),
      cache,
      connectToDevTools: true
    });
  }, [auth.userData]);
};
