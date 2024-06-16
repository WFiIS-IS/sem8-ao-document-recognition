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
import { PersonForm, personFormSchema } from './PersonForm';
import { z } from 'zod';

export function AddPersonDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          Add Person <PlusIcon className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Person</DialogTitle>
          <DialogDescription>Adds new person based on picture</DialogDescription>
        </DialogHeader>
        <PersonForm
          buttonText="DONE"
          onSubmit={(values: z.infer<typeof personFormSchema>) => {
            console.log(values);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
