import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { DataTable } from '../shared/components/table/data-table';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent
} from '@/components/ui/dropdown-menu';
import { usePersonsQuery } from '@/api/query/hooks/usePersonsQuery';
import { Skeleton } from '@/components/ui/skeleton';
import { Person } from '@/models/person.ts';
import { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<Person>[] = [
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
    accessorKey: 'pesel',
    header: 'PESEL',
    cell: ({ row }) => row.original.pesel
  },
  // {
  //   accessorKey: 'dateOfBirth',
  //   header: 'Date of Birth',
  //   cell: (info: any) => info.getValue()
  // },
  {
    id: 'actions',
    cell: () => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DotsHorizontalIcon className="hover:cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="hover:cursor-pointer">Edit</DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
];

function PersonTable(props: { data: Person[] }) {
  return (
    <DataTable
      data={props.data}
      columns={columns}
      defaultSorting={[{ id: 'pesel', desc: false }]}
    />
  );
}

export function Dashboard() {
  const { data, error } = usePersonsQuery();

  console.log(data);

  if (error)
    return <div className="text-destructive">Upps... Something went wrong: [{error.message}]</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex max-w-full flex-col flex-wrap items-stretch gap-4">
        <Card className="flex flex-grow flex-col gap-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Persons</CardTitle>
          </CardHeader>
          <CardContent>
            {(data && <PersonTable data={data} />) || (
              <Skeleton className="h-[20rem] w-full rounded-xl" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
