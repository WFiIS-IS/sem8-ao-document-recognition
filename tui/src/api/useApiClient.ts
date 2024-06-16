import axios from 'axios';
import { useMemo } from 'react';

import { env } from '$env';

export function useApiClient() {
  return useMemo(() => {
    return axios.create({
      baseURL: env.PUBLIC_API_URL
    });
  }, []);
}
