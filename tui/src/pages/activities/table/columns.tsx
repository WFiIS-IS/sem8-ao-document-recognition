import { ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { Button } from '@/components/ui/button.tsx';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Activity } from '@/models/activity.ts';
import { format } from 'date-fns';
import { formatDuration } from '@/lib/utils.ts';
import { Badge } from '@/components/ui/badge.tsx';

type TableMeta = {
  onSubmitDeleteActivity: (id: string) => void;
};

export const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => <div className="capitalize">{format(row.original.start, 'dd/MM/yy')}</div>
  },
  {
    accessorKey: 'start',
    header: 'Begin',
    cell: ({ row }) => <div className="capitalize">{format(row.original.start, 'HH:mm')}</div>
  },
  {
    accessorKey: 'finish',
    header: 'End',
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.finish ? format(row.original.finish, 'HH:mm') : '-'}
      </div>
    )
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => <div className="capitalize">{formatDuration(row.original)}</div>
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
    cell: ({ row }) => <div className="capitalize">{row.original.project.customer.name}</div>
  },
  {
    accessorKey: 'project',
    header: 'Project',
    cell: ({ row }) => <div className="capitalize">{row.original.project.name}</div>
  },
  {
    id: 'type',
    header: 'Type',
    enableHiding: true,
    cell: ({ row }) => {
      return (
        <Badge className="text-xs" variant={row.original.finish ? 'secondary' : 'outline'}>
          {row.original.finish ? 'Completed' : 'Active'}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="ml-auto h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem disabled>View report</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => meta.onSubmitDeleteActivity(row.original.id)}>
                <span className="text-red-600">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
  }
];
