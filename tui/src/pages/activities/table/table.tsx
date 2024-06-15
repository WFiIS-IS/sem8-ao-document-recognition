import * as React from 'react';
import { useState } from 'react';
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
import { ActivityTableContext } from '@/pages/activities/table/context.ts';
import { useActivities } from '@/api/apollo/hooks/useActivities.ts';
import { useActivityDeleteMutation } from '@/api/apollo/hooks/useActivityDeleteMutation.ts';
import { columns } from '@/pages/activities/table/columns.tsx';

interface ProjectTableProps {
  children?: React.ReactNode;
}

export const ActivityTable = ({ children }: ProjectTableProps) => {
  const { data } = useActivities();
  const [deleteActivity] = useActivityDeleteMutation();

  const tableData = React.useMemo(() => {
    if (data) {
      return [...data.activities].sort(
        (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
      );
    }

    return [];
  }, [data]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20
  });

  const onSubmitDeleteActivity = (id: string) => {
    deleteActivity({ variables: { id } }).then();
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
      onSubmitDeleteActivity
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
    <ActivityTableContext.Provider value={{ table: reactTable }}>
      {children}
    </ActivityTableContext.Provider>
  );
};
