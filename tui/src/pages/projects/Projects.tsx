import { ProjectTableHeader } from '@/pages/projects/table/header.tsx';
import { ProjectTableBody } from '@/pages/projects/table/body.tsx';
import { ProjectTableFooter } from '@/pages/projects/table/footer.tsx';
import { ProjectTable } from '@/pages/projects/table/table.tsx';

export const Projects = () => {
  return (
    <div className="w-full">
      <ProjectTable>
        <ProjectTableHeader />
        <ProjectTableBody />
        <ProjectTableFooter />
      </ProjectTable>
    </div>
  );
};
