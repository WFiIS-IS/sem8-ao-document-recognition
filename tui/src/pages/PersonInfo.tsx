import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
  } from '@/components/ui/card.tsx';
import { Person } from '@/models/person';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';

  export function PersonInfo() {

    const params = useParams();
    console.log(params);

    const [person, setPerson] = useState<Person>({
      first_name: "John",
      last_name: "Doe",
      pesel: "01240205770",
      date_of_birth: new Date("02-05-2001"),
      sex: "Male"
    })

    return (
      <div className="flex flex-col items-center pt-[10rem] gap-4">
        <div className="flex max-w-full gap-4">
          <Card className="flex max-w-[40rem] flex-grow flex-col gap-8">
            <CardHeader>
              <CardTitle className='text-xl'>
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-2 gap-x-8'>
              <Label className='font-bold'>First Name:</Label> {person.first_name}
              <Label className='font-bold'>Last Name:</Label> {person.last_name}
              <Label className='font-bold'>PESEL:</Label> {person.pesel}
              <Label className='font-bold'>Date of birth:</Label> {person.date_of_birth.toLocaleDateString()}
              <Label className='font-bold'>Sex:</Label> {person.sex}
            </CardContent>
            <CardFooter>
              <Button onClick={() => {}}>
                EDIT
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
