import { Project } from '@/models/project.ts';

export type Activity = {
  id: string;
  start: Date;
  finish: Date;

  project: Project;
};
