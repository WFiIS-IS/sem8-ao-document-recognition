import * as React from 'react';
import { useContext } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { ProjectTableContext } from '@/pages/projects/table/context.ts';

export const ProjectTableFooter: React.FC = () => {
  const table = useContext(ProjectTableContext)!.table;

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        Total {table.getFilteredRowModel().rows.length} project(s).{' '}
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
};
