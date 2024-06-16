import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import React from 'react';
import { EditPersonForm } from './EditPersonForm';
import { Person } from '@/models/person';

type Props = {
  children: React.ReactNode;
  data: Person;
};

export function EditPersonDialog({ children, data }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Person</DialogTitle>
          <DialogDescription>Edit personal information</DialogDescription>
        </DialogHeader>
        <EditPersonForm data={data} />
      </DialogContent>
    </Dialog>
  );
}
