import { CustomerTable } from '@/pages/customers/table/table.tsx';
import { CustomerTableHeader } from '@/pages/customers/table/header.tsx';
import { CustomerTableBody } from '@/pages/customers/table/body.tsx';
import { CustomerTableFooter } from '@/pages/customers/table/footer.tsx';

export const Customers = () => {
  return (
    <div className="w-full">
      <CustomerTable>
        <CustomerTableHeader />
        <CustomerTableBody />
        <CustomerTableFooter />
      </CustomerTable>
    </div>
  );
};
