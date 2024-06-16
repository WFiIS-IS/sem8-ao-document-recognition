import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DropdownDialogItem
} from '@/components/ui/dialog';
import React, { ComponentProps, useState } from 'react';
import { EditPersonForm } from './EditPersonForm';
import { Person } from '@/models/person';

type EditPersonDialogProps = {
  children: React.ReactNode;
  data: Person;
} & Pick<ComponentProps<typeof DropdownDialogItem>, 'onSelect' | 'onOpenChange'>;

export function EditPersonDialog({
  children,
  data,
  onOpenChange,
  ...props
}: EditPersonDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    onOpenChange?.(open);
  };

  return (
    <DropdownDialogItem
      dropdownItem={children}
      dialogProps={{ open: dialogOpen }}
      onOpenChange={handleDialogOpenChange}
      {...props}>
      <DialogContent className="max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Person</DialogTitle>
          <DialogDescription>Edit personal information</DialogDescription>
        </DialogHeader>
        <EditPersonForm data={data} closeDialog={() => setDialogOpen(false)} />
      </DialogContent>
    </DropdownDialogItem>
  );
}
