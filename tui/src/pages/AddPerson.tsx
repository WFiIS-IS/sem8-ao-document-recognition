import { useState, type ChangeEvent } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PersonForm, PersonFormData } from '@/shared/components/PersonForm';
import { useToast } from '@/components/ui/use-toast';
import { useApiClient } from '@/api/useApiClient';

export function AddPerson() {
  const client = useApiClient();

  const [_file, setFile] = useState<File | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const [personData, setPersonData] = useState<PersonFormData | undefined>(undefined);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/png') {
        setFile(selectedFile);
        const url = URL.createObjectURL(selectedFile);
        setImageUrl(url);
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
          const response = await client.post('/person/analyze-document', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          setPersonData(response.data);
        } catch (error) {
          console.error('Error uploading file:', error);
          toast({
            title: 'Upload failed',
            description: 'There was an error uploading the file. Please try again.'
          });
        }
      } else {
        toast({
          title: 'Incorrect format',
          description: 'Please select a valid image format'
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 pt-[10rem]">
      <div className="flex max-w-full gap-4">
        <Card className="flex max-w-[40rem] flex-grow flex-col gap-8">
          <CardHeader>
            <CardTitle className="text-xl">Add new Person</CardTitle>
          </CardHeader>
          <CardContent className="items-cetner flex flex-col gap-2">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="documentFile">Fill Information from document</Label>
              <Input
                id="documentFile"
                type="file"
                onChange={handleFileChange}
                className="max-w-max"
              />
            </div>
            {imageUrl && (
              <div className="my-2 flex items-center justify-center">
                <img src={imageUrl} alt="Uploaded" className="max-h-[70px]" />
              </div>
            )}
            <PersonForm
              personData={personData}
              buttonText="DONE"
              onSubmit={(values: PersonFormData) => {
                console.log(values);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
