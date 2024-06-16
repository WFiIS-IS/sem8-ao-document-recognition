import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast.ts';
import { Label } from '@/components/ui/label.tsx';
import { useApiClient } from '@/api/useApiClient.ts';
import { Spinner } from '@/components/ui/spinner.tsx';
import { useCreatePersonMutation } from '@/api/mutations/hooks/useCreatePersonMutation.ts';
import { PersonCreateDto } from '@/api/dto/person-create-dto.ts';

const personFormSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  pesel: z.string().regex(/^\d{11}$/, { message: 'should contain 11 numbers' }),
  date_of_birth: z.date().optional(),
  id_number: z.string().optional(),
  driving_license_number: z.string().optional(),
  face_vector: z.string().min(1, { message: 'You must select image/document with persons face' })
});

export type PersonFormData = z.infer<typeof personFormSchema>;

export type PersonFormProps = {
  closeDialog: () => void;
};

export function PersonForm({ closeDialog }: PersonFormProps) {
  const { toast } = useToast();
  const client = useApiClient();

  const [analysingImage, setAnalysingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const form = useForm<PersonFormData>({
    resolver: zodResolver(personFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      pesel: '',
      date_of_birth: undefined,
      id_number: '',
      driving_license_number: ''
    },
    disabled: analysingImage
  });

  const createPersonMutation = useCreatePersonMutation({
    onSuccess: () => {
      toast({
        title: 'Person created',
        description: 'The person has been successfully created'
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: 'Failed to create person',
        description:
          'There was an error creating the person. Check if the person does not exist already.',
        variant: 'destructive'
      });
    }
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/png') {
        const url = URL.createObjectURL(selectedFile);

        setImageUrl(url);
        setAnalysingImage(true);

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
          const response = await client.post<PersonFormData>('/person/analyze-document', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          const person = response.data;

          person.pesel ??= '';
          person.first_name ??= '';
          person.last_name ??= '';
          person.date_of_birth = person.date_of_birth ? new Date(person.date_of_birth) : undefined;
          person.id_number ??= '';
          person.driving_license_number ??= '';
          person.face_vector = person?.face_vector ? `[${person.face_vector.toString()}]` : '';

          form.reset(person);
        } catch (error) {
          console.error('Error uploading file:', error);
          toast({
            title: 'Upload failed',
            description: 'There was an error uploading the file. Please try again.'
          });
        } finally {
          console.log('setting');
          setAnalysingImage(false);
        }
      } else {
        toast({
          title: `Incorrect format ${selectedFile.type}`,
          description: 'Please select a valid image format: jpeg or png'
        });
      }
    }
  };

  const createPerson = () => {
    const values = form.getValues();

    const person: PersonCreateDto = {
      first_name: values.first_name,
      last_name: values.last_name,
      pesel: values.pesel,
      date_of_birth: values.date_of_birth
        ? format(new Date(values.date_of_birth), 'yyyy-MM-dd')
        : null,
      id_number: values.id_number ? values.id_number : null,
      driving_license_number: values.driving_license_number ? values.driving_license_number : null,
      face_vector: values.face_vector
    };

    console.log(person);

    createPersonMutation.mutate(person);

    closeDialog();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(createPerson)} className="space-y-2">
        <FormField
          control={form.control}
          name="face_vector"
          render={() => (
            <FormItem>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="documentFile" className="flex-grow">
                  Fill information from document
                </Label>
                <span className="text-sm text-muted-foreground">
                  at least image with persons face
                </span>
                <Input
                  id="documentFile"
                  type="file"
                  onChange={handleFileChange}
                  className="flex-grow"
                />
              </div>
              {imageUrl && (
                <div className="my-2 flex items-center justify-center">
                  <img src={imageUrl} alt="Uploaded" className="max-h-[70px]" />
                </div>
              )}
              {analysingImage && (
                <div className="flex gap-2">
                  <span className="text-sm text-muted-foreground">Analysing image...</span>
                  <Spinner size="small" />
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pesel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PESEL</FormLabel>
              <FormControl>
                <Input placeholder="00000000000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_of_birth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      disabled={field.disabled}
                      variant={'outline'}
                      className={cn(
                        'pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}>
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick your date of birth</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={field.value}
                    onSelect={field.onChange}
                    fromYear={1900}
                    toYear={2050}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="id_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="driving_license_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Driving License Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" className="mt-3">
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
}
