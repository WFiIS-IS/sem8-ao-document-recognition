import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonForm } from '@/shared/PersonForm';
import { useState } from 'react';

export function AddPerson() {
  const [_file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/png') {
        setFile(selectedFile);
        const url = URL.createObjectURL(selectedFile);
        setImageUrl(url);
      } else {
        alert('Incorrect format');
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
            <div>
              <label htmlFor="file" className="sr-only">
                Upload file
              </label>
              <input id="file" type="file" onChange={handleFileChange} />
            </div>
            {imageUrl && (
              <div className="flex items-center justify-center">
                <img src={imageUrl} alt="Uploaded" className="max-h-[70px]" />
              </div>
            )}

            <PersonForm />
          </CardContent>
          <CardFooter>
            <Button onClick={() => {}}>DONE</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
