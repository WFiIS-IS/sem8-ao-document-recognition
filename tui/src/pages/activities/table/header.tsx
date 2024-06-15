import * as React from 'react';
import { useContext } from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ChevronDownIcon, PlusIcon } from '@radix-ui/react-icons';
import { ActivityTableContext } from '@/pages/activities/table/context.ts';
import { ActivityCreateDialog } from '@/pages/activities/table/activityCreateDialog.tsx';

export const ActivityTableHeader: React.FC = () => {
  const table = useContext(ActivityTableContext)!.table;

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

      <ActivityCreateDialog>
        <Button variant="outline">
          Create <PlusIcon className="ml-2 h-4 w-4" />
        </Button>
      </ActivityCreateDialog>
    </div>
  );
};
