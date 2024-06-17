import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { FindPersonForm, findPersonProps } from './FindPersonForm';

export function FindPersonDialog(props: findPersonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2 bg-primary text-primary-foreground">
          Find Person <PlusIcon className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Find Person</DialogTitle>
          <DialogDescription>Find person with picture</DialogDescription>
        </DialogHeader>
        <FindPersonForm {...props} />
      </DialogContent>
    </Dialog>
  );
}
