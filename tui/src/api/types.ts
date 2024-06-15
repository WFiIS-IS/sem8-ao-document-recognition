import type { AxiosInstance, GenericAbortSignal } from 'axios';

export type QueryFnParams<ExtraData = object> = {
  client: AxiosInstance;
  signal?: GenericAbortSignal;
} & ExtraData;
