import { Activity } from '@/models/activity.ts';

export type Customer = {
  id: string;
  name: string;
  activities: Activity[];
};
