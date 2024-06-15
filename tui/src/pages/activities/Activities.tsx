import { ActivityTableBody } from '@/pages/activities/table/body.tsx';
import { ActivityTable } from '@/pages/activities/table/table.tsx';
import { ActivityTableHeader } from '@/pages/activities/table/header.tsx';
import { ActivityTableFooter } from '@/pages/activities/table/footer.tsx';

export function Activities() {
  return (
    <div className="w-full">
      <ActivityTable>
        <ActivityTableHeader />
        <ActivityTableBody />
        <ActivityTableFooter />
      </ActivityTable>
    </div>
  );
}
