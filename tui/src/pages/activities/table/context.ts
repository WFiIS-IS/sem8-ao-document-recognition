import * as React from 'react';
import { Table } from '@tanstack/react-table';
import { Activity } from '@/models/activity.ts';

export const ActivityTableContext = React.createContext<{ table: Table<Activity> } | undefined>(
  undefined
);
