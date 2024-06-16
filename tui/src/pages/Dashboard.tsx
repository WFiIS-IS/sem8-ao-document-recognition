import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { DataTable } from '../shared/components/table/data-table';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { usePersonsQuery } from '@/api/query/hooks/usePersonsQuery';
import { Skeleton } from '@/components/ui/skeleton';
import { Person } from '@/models/person.ts';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useDeletePersonMutation } from '@/api/mutations/hooks/useDeletePersonMutation.ts';
import { useToast } from '@/components/ui/use-toast.ts';
import { AddPersonDialog } from '@/shared/components/AddPersonDialog';

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
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DotsHorizontalIcon className="hover:cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="hover:cursor-pointer">Edit</DropdownMenuItem>
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => meta.deletePerson(row.original.pesel)}>
                <span className="text-red-600">Delete</span>
              </DropdownMenuItem>
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
