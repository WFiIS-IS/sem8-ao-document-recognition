import * as React from 'react';
import { Table } from '@tanstack/react-table';
import { Project } from '@/models/project.ts';

export const ProjectTableContext = React.createContext<{ table: Table<Project> } | undefined>(
  undefined
);
