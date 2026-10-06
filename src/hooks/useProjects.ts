import { useContext } from 'react';
import { ProjectContext } from '@/context/ProjectProvider';

export const useProjects = () => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error(
      'useProjects debe usarse dentro de un ProjectProvider'
    );
  }

  return context;
};
