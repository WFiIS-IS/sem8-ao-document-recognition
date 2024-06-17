import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label.tsx';
import { useApiClient } from '@/api/useApiClient.ts';
import React, { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button.tsx';
import { Person } from '@/models/person.ts';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form.tsx';

const updatePersonFormSchema = z.object({
  face_vector: z
    .string({ message: 'You must select image/document with persons face' })
    .min(1, { message: 'You must select image/document with persons face' })
});

type UpdatePersonData = z.infer<typeof updatePersonFormSchema>;

export type FindPersonFormProps = {
  setFilteredPersons: (persons: Person[]) => void;
  closeDialog: () => void;
};

export function FindPersonForm({ setFilteredPersons }: FindPersonFormProps) {
  const client = useApiClient();
  const [analysingImage, setAnalysingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [persons, setPersons] = useState<Person[]>([]);

  const form = useForm<UpdatePersonData>({
    resolver: zodResolver(updatePersonFormSchema),
    defaultValues: {},
    disabled: analysingImage
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
          let response = await client.post('/person/analyze-document', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          const faceVector = response.data.face_vector;

          if (!faceVector) {
            toast({
              title: 'No face found',
              description: 'No face was found in the uploaded image. Please try again.'
            });
            return;
          }

          const data = {
            face_vector: faceVector
          };

          response = await client.post<Person[]>('/person/lookup', JSON.stringify(data), {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          const persons = response.data;

          form.setValue('face_vector', `[${faceVector}]`);
          setPersons(persons);
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

  const applyFilter = () => {
    setFilteredPersons(persons);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(applyFilter)} className="space-y-2">
        <FormField
          control={form.control}
          name="face_vector"
          render={() => (
            <FormItem>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="documentFile" className="flex-grow">
                  Document
                </Label>

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

        <div className="flex justify-end">
          <Button type="submit" className="mt-3" disabled={analysingImage}>
            Apply filter
          </Button>
        </div>
      </form>
    </Form>
  );
}
