import { ComponentProps } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button.variants.ts';

export type DeletePersonAlertProps = {
  onConfirm: () => void;
} & Pick<ComponentProps<typeof AlertDialog>, 'open' | 'onOpenChange'>;

export function DeletePersonAlert({ onConfirm, ...props }: DeletePersonAlertProps) {
  return (
    <AlertDialog {...props}>
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
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
