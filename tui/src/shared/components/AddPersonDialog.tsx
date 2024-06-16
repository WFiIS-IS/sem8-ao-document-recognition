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
import { PersonForm, PersonFormData } from './PersonForm';

export function AddPersonDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-primary text-primary-foreground">
          Add Person <PlusIcon className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen gap-8 overflow-auto">
        <DialogHeader>
          <DialogTitle>Add Person</DialogTitle>
          <DialogDescription>Adds new person based on picture</DialogDescription>
        </DialogHeader>
        <PersonForm
          buttonText="Create"
          onSubmit={(values: PersonFormData) => {
            console.log(values);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
