import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useFileUpload } from "@/hooks/useFileUpload";
import { PersonForm } from "@/shared/PersonForm";

export function AddPerson() {

    return (
        <div className="flex flex-col items-center pt-[10rem] gap-4">
        <div className="flex max-w-full gap-4">
          <Card className="flex max-w-[40rem] flex-grow flex-col gap-8">
            <CardHeader>
              <CardTitle className='text-xl'>
                Add new Person
              </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-2 items-cetner'>
              <Button onClick={() => {}} className="max-w-max" variant={"ghost"}>File Upload</Button>
              <PersonForm />
            </CardContent>
            <CardFooter>
              <Button onClick={() => {}}>
                DONE
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
}
