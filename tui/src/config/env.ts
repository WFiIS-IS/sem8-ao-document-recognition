import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  clientPrefix: 'PUBLIC_',
  server: {},
  client: {
    PUBLIC_API_URL: z.string(),
    PUBLIC_VERSION: z.string(),
    PUBLIC_APP_NAME: z.string()
  },
  runtimeEnv: import.meta.env
});
