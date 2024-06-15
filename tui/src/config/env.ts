import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  clientPrefix: 'PUBLIC_',
  server: {},
  client: {
    PUBLIC_APP_PREFIX: z.string().default(''),
    PUBLIC_API_URL: z.string(),
    PUBLIC_OIDC_AUTHORITY: z.string().url(),
    PUBLIC_OIDC_CLIENT_ID: z.string(),
    PUBLIC_OIDC_RESPONSE_TYPE: z.string(),
    PUBLIC_OIDC_SCOPE: z.string(),
    PUBLIC_OIDC_REDIRECT_URI: z.string().url(),
    PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI: z.string().url(),
    PUBLIC_OIDC_AUTOMATIC_SILENT_RENEW: z.coerce.boolean().default(true),
    PUBLIC_VERSION: z.string().default('0.0.0')
  },
  runtimeEnv: import.meta.env
});
