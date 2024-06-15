import { Activity } from '@/models/activity.ts';
import { Customer } from '@/models/customer.ts';

export type Project = {
  id: string;
  name: string;
  activities: Activity[];
  customer: Customer;
};
