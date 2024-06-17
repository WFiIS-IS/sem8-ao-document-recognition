import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { FindPersonForm } from './FindPersonForm';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Person } from '@/models/person.ts';

export type FindPersonFormProps = {
  setFilteredPersons: (persons: Person[]) => void;
};

export function FindPersonDialog({ setFilteredPersons }: FindPersonFormProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2 bg-background">
          Find Person <Search className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen gap-8 overflow-auto">
        <DialogHeader>
          <DialogTitle>Find Person</DialogTitle>
          <DialogDescription>Find person by the photo/document</DialogDescription>
        </DialogHeader>
        <FindPersonForm
          setFilteredPersons={setFilteredPersons}
          closeDialog={() => setDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
