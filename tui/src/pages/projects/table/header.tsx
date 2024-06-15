import * as React from 'react';
import { useContext } from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { ProjectTableContext } from '@/pages/projects/table/context.ts';
import { ProjectCreateDialog } from '@/pages/projects/table/projectCreateDialog.tsx';

export const ProjectTableHeader: React.FC = () => {
  const table = useContext(ProjectTableContext)!.table;

  return (
    <div className="flex justify-between py-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="">
            Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(value)}>
                  {column.columnDef.header as string}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>

      <ProjectCreateDialog />
    </div>
  );
};
