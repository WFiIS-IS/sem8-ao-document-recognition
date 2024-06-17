import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { ComponentProps } from 'react';
import { EditPersonForm } from './EditPersonForm';
import { Person } from '@/models/person';

type EditPersonDialogProps = {
  data: Person;
} & Pick<ComponentProps<typeof Dialog>, 'open' | 'onOpenChange'>;

export function EditPersonDialog({ data, onOpenChange, ...props }: EditPersonDialogProps) {
  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open);
  };

  return (
    <Dialog onOpenChange={onOpenChange} {...props}>
      <DialogContent className="max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Person</DialogTitle>
          <DialogDescription>Edit personal information</DialogDescription>
        </DialogHeader>
        <EditPersonForm data={data} closeDialog={() => handleOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
