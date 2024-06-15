import * as React from 'react';
import { Table } from '@tanstack/react-table';
import { Customer } from '@/models/customer.ts';

export const CustomerTableContext = React.createContext<{ table: Table<Customer> } | undefined>(
  undefined
);
