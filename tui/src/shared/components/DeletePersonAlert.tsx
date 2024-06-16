import { ComponentProps, ReactNode, useState } from 'react';

import {
  AlertDialogDropdownItem,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button.variants.ts';

export type DeletePersonAlertProps = {
  children: ReactNode;
  onConfirm: () => void;
} & Pick<ComponentProps<typeof AlertDialogDropdownItem>, 'onSelect' | 'onOpenChange'>;

export function DeletePersonAlert({ children, onConfirm, onOpenChange }: DeletePersonAlertProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    onOpenChange?.(open);
  };

  return (
    <AlertDialogDropdownItem
      dropdownItem={children}
      dialogProps={{ open: dialogOpen }}
      onOpenChange={handleDialogOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this person?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the person from the database
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            onClick={onConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogDropdownItem>
  );
}
