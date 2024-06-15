import * as React from 'react';
import { useState } from 'react';
import { useCustomers } from '@/api/apollo/hooks/useCustomers.ts';
import { useCustomerDeleteMutation } from '@/api/apollo/hooks/useCustomerDeleteMutation.ts';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { columns } from '@/pages/customers/table/columns.tsx';
import { CustomerTableContext } from '@/pages/customers/table/context.ts';

interface CustomerTableProps {
  children?: React.ReactNode;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({ children }: CustomerTableProps) => {
  const { data } = useCustomers();
  const [deleteCustomer] = useCustomerDeleteMutation();

  const tableData = React.useMemo(() => data?.customers ?? [], [data]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20
  });

  const onSubmitDeleteCustomer = (id: string) => {
    deleteCustomer({ variables: { id } }).then();
  };

  const reactTable = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    meta: {
      onSubmitDeleteCustomer
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    }
  });

  return (
    <CustomerTableContext.Provider value={{ table: reactTable }}>
      {children}
    </CustomerTableContext.Provider>
  );
};
