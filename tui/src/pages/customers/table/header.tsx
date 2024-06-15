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
import { CustomerCreateDialog } from '@/pages/customers/table/customerCreateDialog.tsx';
import { CustomerTableContext } from '@/pages/customers/table/context.ts';

export const CustomerTableHeader: React.FC = () => {
  const table = useContext(CustomerTableContext)!.table;

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

      <CustomerCreateDialog />
    </div>
  );
};
