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
import { ProjectTableContext } from '@/pages/projects/table/context.ts';
import { useProjects } from '@/api/apollo/hooks/useProjects.ts';
import { useProjectDeleteMutation } from '@/api/apollo/hooks/useProjectDeleteMutation.ts';
import { columns } from '@/pages/projects/table/columns.tsx';

interface ProjectTableProps {
  children?: React.ReactNode;
}

export const ProjectTable = ({ children }: ProjectTableProps) => {
  const { data } = useProjects();
  const [deleteProject] = useProjectDeleteMutation();

  const tableData = React.useMemo(() => data?.projects ?? [], [data]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20
  });

  const onSubmitDeleteProject = (id: string) => {
    deleteProject({ variables: { id } }).then();
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
      onSubmitDeleteProject
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
    <ProjectTableContext.Provider value={{ table: reactTable }}>
      {children}
    </ProjectTableContext.Provider>
  );
};
