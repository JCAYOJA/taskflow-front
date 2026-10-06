import React, {
  createContext,
  useCallback,
  useState,
} from 'react';

import {
  getAllProjectsRequest,
  createProjectRequest,
  deleteProjectRequest,
  getProjectByIdRequest,
  type Project,
} from '../services/project.service';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;

  fetchProjects: () => Promise<void>;
  selectProject: (id: string) => Promise<void>;

  createProject: (data: {
    name: string;
    description: string;
  }) => Promise<void>;

  removeProject: (id: string) => Promise<void>;
}

// IMPORTANTE: exportamos el contexto para usarlo desde useProjects.ts
export const ProjectContext = createContext<
  ProjectContextType | undefined
>(undefined);

export const ProjectProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] =
    useState<Project | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtener todos los proyectos
   */
  const fetchProjects = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllProjectsRequest();

      if (response.error) {
        throw new Error(response.error);
      }

      setProjects(response.data ?? []);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al cargar la lista de proyectos';

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Seleccionar y cargar un proyecto específico
   */
  const selectProject = useCallback(
    async (id: string): Promise<void> => {
      if (!id) {
        const message = 'ID de proyecto inválido';

        setError(message);
        throw new Error(message);
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getProjectByIdRequest(id);

        if (response.error) {
          throw new Error(response.error);
        }

        setCurrentProject(response.data ?? null);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'No se pudo cargar el detalle del proyecto';

        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Crear un nuevo proyecto
   */
  const createProject = useCallback(
    async (data: {
      name: string;
      description: string;
    }): Promise<void> => {
      const name = data.name.trim();
      const description = data.description.trim();

      if (!name) {
        const message =
          'El nombre del proyecto es obligatorio';

        setError(message);
        throw new Error(message);
      }

      setLoading(true);
      setError(null);

      try {
        const response = await createProjectRequest({
          name,
          description,
        });

        if (response.error) {
          throw new Error(response.error);
        }

        /*
         * Actualizamos la lista de proyectos.
         */
        const projectsResponse =
          await getAllProjectsRequest();

        if (projectsResponse.error) {
          throw new Error(projectsResponse.error);
        }

        const updatedProjects =
          projectsResponse.data ?? [];

        setProjects(updatedProjects);

        /*
         * Si el backend devuelve el proyecto creado,
         * lo seleccionamos automáticamente.
         */
        if (response.data?.id) {
          const projectResponse =
            await getProjectByIdRequest(
              response.data.id
            );

          if (projectResponse.error) {
            throw new Error(
              projectResponse.error
            );
          }

          setCurrentProject(
            projectResponse.data ?? null
          );
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'No se pudo crear el proyecto';

        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Eliminar un proyecto
   */
  const removeProject = useCallback(
    async (id: string): Promise<void> => {
      if (!id) {
        const message =
          'ID de proyecto inválido';

        setError(message);
        throw new Error(message);
      }

      setLoading(true);
      setError(null);

      try {
        const response =
          await deleteProjectRequest(id);

        if (response.error) {
          throw new Error(response.error);
        }

        /*
         * Si eliminamos el proyecto actual,
         * limpiamos la selección.
         */
        setCurrentProject((current) => {
          if (current?.id === id) {
            return null;
          }

          return current;
        });

        /*
         * Actualizamos la lista de proyectos.
         */
        const projectsResponse =
          await getAllProjectsRequest();

        if (projectsResponse.error) {
          throw new Error(
            projectsResponse.error
          );
        }

        const updatedProjects =
          projectsResponse.data ?? [];

        setProjects(updatedProjects);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'No se pudo eliminar el proyecto';

        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const contextValue: ProjectContextType = {
    projects,
    currentProject,
    loading,
    error,
    fetchProjects,
    selectProject,
    createProject,
    removeProject,
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};
