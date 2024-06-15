import { Card, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { DataTable } from '../shared/components/table/data-table';
import { SearchBar } from '../shared/components/SearchBar';
import { DotsVerticalIcon } from '@radix-ui/react-icons'; // Assuming you have an icon like this
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent
} from '@/components/ui/dropdown-menu';

const mockData = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    gender: 'M',
    pesel: '99010112345',
    dateOfBirth: '1999-01-01'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    gender: 'F',
    pesel: '95020223456',
    dateOfBirth: '1995-02-02'
  },
  {
    id: 3,
    firstName: 'Jim',
    lastName: 'Beam',
    gender: 'M',
    pesel: '92030334567',
    dateOfBirth: '1992-03-03'
  }
];

const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (info: any) => info.getValue()
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: (info: any) => info.getValue()
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    cell: (info: any) => info.getValue()
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: (info: any) => info.getValue()
  },
  {
    accessorKey: 'pesel',
    header: 'PESEL',
    cell: (info: any) => info.getValue()
  },
  {
    accessorKey: 'dateOfBirth',
    header: 'Date of Birth',
    cell: (info: any) => info.getValue()
  },
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
export function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex max-w-full flex-wrap gap-4">
        <SearchBar onSearch={() => {}} />
        <Card className="flex max-w-[40rem] flex-grow flex-col gap-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Documents</CardTitle>
            <DataTable
              data={mockData}
              columns={columns}
              className="your-custom-classname"
              components={{}}
              defaultSorting={[{ id: 'id', desc: false }]}
            />
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
