import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label.tsx';
import { useApiClient } from '@/api/useApiClient.ts';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/use-toast';

export type findPersonProps = {
  setFilter: (filters: string[]) => void;
};

export function FindPersonForm(props: findPersonProps) {
  const client = useApiClient();
  const [analysingImage, setAnalysingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

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
          const response = await client.post('/person/analyze-document', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          const faceVector = response.data.face_vector;

          const data = {
            face_vector: faceVector
          };
          console.log('1');
          const responsee = await client.post('/person/lookup', JSON.stringify(data), {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          props.setFilter(response.data.face_vector);
          console.log('g', responsee);
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

  return (
    <div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor="documentFile" className="flex-grow">
          Fill Information from document
        </Label>
        <Input id="documentFile" type="file" onChange={handleFileChange} className="flex-grow" />
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
    </div>
  );
}
