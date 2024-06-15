import { env } from '$env';

export const oidcConfig = {
  authority: env.PUBLIC_OIDC_AUTHORITY,
  clientId: env.PUBLIC_OIDC_CLIENT_ID,
  responseType: env.PUBLIC_OIDC_RESPONSE_TYPE,
  scope: env.PUBLIC_OIDC_SCOPE,
  redirectUri: env.PUBLIC_OIDC_REDIRECT_URI,
  postLogoutRedirectUri: env.PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI,
  automaticSilentRenew: env.PUBLIC_OIDC_AUTOMATIC_SILENT_RENEW
};
