import { format } from 'date-fns';
import { useRef, useState } from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { DataTable } from '@/shared/components/table/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { usePersonsQuery } from '@/api/query/hooks/usePersonsQuery';
import { Skeleton } from '@/components/ui/skeleton';
import { Person } from '@/models/person';
import { useDeletePersonMutation } from '@/api/mutations/hooks/useDeletePersonMutation';
import { useToast } from '@/components/ui/use-toast';
import { AddPersonDialog } from '@/shared/components/AddPersonDialog';
import { EditPersonDialog } from '@/shared/components/EditPersonDialog';
import { Button } from '@/components/ui/button';
import { DeletePersonAlert } from '@/shared/components/DeletePersonAlert';

type TableMeta = {
  deletePerson: (pesel: string) => void;
};

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: 'pesel',
    header: 'PESEL',
    cell: ({ row }) => <div className="font-medium">{row.original.pesel}</div>
  },
  {
    accessorKey: 'first_name',
    header: 'First Name',
    cell: ({ row }) => row.original.first_name
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name',
    cell: ({ row }) => row.original.last_name
  },
  {
    accessorKey: 'date_of_birth',
    header: 'Date of Birth',
    cell: ({ row }) =>
      row.original.date_of_birth ? format(row.original.date_of_birth, 'dd/MM/yyyy') : '-'
  },
  {
    accessorKey: 'id_number',
    header: 'Id Number',
    cell: ({ row }) => row.original.id_number ?? '-'
  },
  {
    accessorKey: 'driving_license_number',
    header: 'Driving License Number',
    cell: ({ row }) => row.original.driving_license_number ?? '-'
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta;
      const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
      const focusRef = useRef<HTMLElement | null>(null);
      const [hasOpenDialog, setHasOpenDialog] = useState(false);
      const [dropdownOpen, setDropdownOpen] = useState(false);

      const handleDialogItemSelect = () => {
        focusRef.current = dropdownTriggerRef.current;
      };

      const handleDialogItemOpenChange = (open: boolean) => {
        setHasOpenDialog(open);
        if (!open) {
          setDropdownOpen(false);
        }
      };

      return (
        <div className="flex justify-end">
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" ref={dropdownTriggerRef}>
                <DotsHorizontalIcon className="hover:cursor-pointer" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              hidden={hasOpenDialog}
              onCloseAutoFocus={(event) => {
                event.preventDefault();
                if (focusRef.current) {
                  focusRef.current?.focus();
                  focusRef.current = null;
                }
              }}>
              <EditPersonDialog
                data={row.original}
                onOpenChange={handleDialogItemOpenChange}
                onSelect={handleDialogItemSelect}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </EditPersonDialog>
              <DeletePersonAlert
                onConfirm={() => meta.deletePerson(row.original.pesel)}
                onOpenChange={handleDialogItemOpenChange}
                onSelect={handleDialogItemSelect}>
                <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                <span className="text-red-600">Delete</span>
              </DeletePersonAlert>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
  }
];

function PersonTable({ data, meta }: { data: Person[]; meta: TableMeta }) {
  return (
    <DataTable
      data={data}
      meta={meta}
      columns={columns}
      defaultSorting={[{ id: 'pesel', desc: false }]}
    />
  );
}

export function Dashboard() {
  const { toast } = useToast();
  const { data, error } = usePersonsQuery();

  if (error)
    return <div className="text-destructive">Upps... Something went wrong: [{error.message}]</div>;

  const deletePersonMutation = useDeletePersonMutation({
    onSuccess: () => {
      toast({
        title: 'Person deleted',
        description: 'The person has been successfully deleted'
      });
    },
    onError: (error: string) => {
      toast({
        title: 'Failed to delete person',
        description: error,
        variant: 'destructive'
      });
    }
  });

  const deletePerson = (pesel: string) => {
    deletePersonMutation.mutate({ pesel });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex max-w-full flex-col flex-wrap items-stretch gap-4">
        <div className="flex justify-end">
          <AddPersonDialog />
        </div>

        <Card className="flex flex-grow flex-col gap-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Persons</CardTitle>
          </CardHeader>
          <CardContent>
            {(data && <PersonTable data={data} meta={{ deletePerson }} />) || (
              <Skeleton className="h-[20rem] w-full rounded-xl" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
