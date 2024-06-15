import {
  Card,
  CardHeader,
  CardTitle
} from '@/components/ui/card.tsx';

export function Dashboard() {

  return (
    <div className="flex flex-col gap-4">
      <div className="flex max-w-full flex-wrap gap-4">
        <Card className="flex max-w-[40rem] flex-grow flex-col gap-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Documents</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
