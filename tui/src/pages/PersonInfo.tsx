import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Person } from '@/models/person';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';

export function PersonInfo() {
  const params = useParams();
  console.log(params);

  const [person, _setPerson] = useState<Person>({
    first_name: 'John',
    last_name: 'Doe',
    pesel: '01240205770'
  });

  return (
    <div className="flex flex-col items-center gap-4 pt-[10rem]">
      <div className="flex max-w-full gap-4">
        <Card className="flex max-w-[40rem] flex-grow flex-col gap-8">
          <CardHeader>
            <CardTitle className="text-xl">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 place-items-baseline gap-x-8">
            <Label className="font-bold">First Name:</Label> {person.first_name}
            <Label className="font-bold">Last Name:</Label> {person.last_name}
            <Label className="font-bold">PESEL:</Label> {person.pesel}
          </CardContent>
          <CardFooter>
            <Button onClick={() => {}}>EDIT</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
