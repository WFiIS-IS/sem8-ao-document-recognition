import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { DataTable } from '../shared/components/table/data-table';
import { SearchBar } from '../shared/components/SearchBar';
import { DotsVerticalIcon } from '@radix-ui/react-icons'; // Assuming you have an icon like this
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent
} from '@/components/ui/dropdown-menu';
import { usePersonsQuery } from '@/api/query/hooks/usePersonsQuery';
import { Skeleton } from '@/components/ui/skeleton';

const columns = [
  {
    accessorKey: 'first_name',
    header: 'First Name',
    cell: (info: any) => info.getValue()
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name',
    cell: (info: any) => info.getValue()
  },
  // {
  //   accessorKey: 'gender',
  //   header: 'Gender',
  //   cell: (info: any) => info.getValue()
  // },
  {
    accessorKey: 'pesel',
    header: 'PESEL',
    cell: (info: any) => info.getValue()
  },
  // {
  //   accessorKey: 'dateOfBirth',
  //   header: 'Date of Birth',
  //   cell: (info: any) => info.getValue()
  // },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }: any) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <DotsVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => console.log('Action 1', row.original)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => console.log('Action 2', row.original)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
];

function PersonTable(props: { data: any }) {
  return (
    <DataTable
      data={props.data}
      columns={columns}
      className="your-custom-classname"
      components={{}}
      defaultSorting={[{ id: 'pesel', desc: false }]}
    />
  );
}

export function Dashboard() {
  const { data, error } = usePersonsQuery();

  if (error)
    return <div className="text-destructive">Upps... Something went wrong: [{error.message}]</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex max-w-full flex-col flex-wrap items-stretch gap-4">
        <SearchBar onSearch={() => {}} />
        <Card className="flex max-w-[60rem] flex-grow flex-col gap-8">
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
