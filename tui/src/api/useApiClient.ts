import axios from 'axios';
import { useMemo } from 'react';

import { env } from '$env';

export function useApiClient() {
  return useMemo(() => {
    const client = axios.create({
      baseURL: env.PUBLIC_API_URL
    });
    return client;
  }, []);
}
