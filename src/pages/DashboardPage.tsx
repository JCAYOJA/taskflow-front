import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskItem } from '@/components/tasks/TaskItem';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';

import {
  createTaskRequest,
  deleteTaskRequest,
  toggleTaskStatusRequest,
  updateTaskRequest,
  type Task,
} from '@/services/task.service';

import {
  CheckCircle2,
  CheckSquare,
  Clock,
  Folder,
  FolderPlus,
  Inbox,
  ListTodo,
  LogOut,
  Plus,
  Trash2,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const {
    projects,
    currentProject,
    loading: isProjectsLoading,
    error: projectError,
    fetchProjects,
    selectProject,
    createProject,
    removeProject,
  } = useProjects();

  // ============================
  // ESTADOS
  // ============================

  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  const [taskToEdit, setTaskToEdit] =
    useState<Task | null>(null);

  const [projectName, setProjectName] =
    useState('');

  const [projectDesc, setProjectDesc] =
    useState('');

  const [isCreatingProject, setIsCreatingProject] =
    useState(false);

  const [isDeletingProject, setIsDeletingProject] =
    useState<string | null>(null);

  // ============================
  // CARGAR PROYECTOS
  // ============================

  useEffect(() => {
    const loadProjects = async () => {
      try {
        await fetchProjects();
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar los proyectos'
        );
      }
    };

    void loadProjects();
  }, [fetchProjects]);

  // ============================
  // TAREAS DEL PROYECTO ACTUAL
  // ============================

  const activeTasks: Task[] =
    currentProject?.Tasks ?? [];

  const totalTasks = activeTasks.length;

  const completedTasks = activeTasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks =
    totalTasks - completedTasks;

  // ============================
  // CREAR PROYECTO
  // ============================

  const handleCreateProject = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const name = projectName.trim();
    const description = projectDesc.trim();

    if (!name) {
      toast.error(
        'El nombre del proyecto es obligatorio'
      );
      return;
    }

    if (isCreatingProject) return;

    try {
      setIsCreatingProject(true);

      await createProject({
        name,
        description,
      });

      setProjectName('');
      setProjectDesc('');

      toast.success(
        'Proyecto creado con éxito'
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Error al crear el proyecto'
      );
    } finally {
      setIsCreatingProject(false);
    }
  };

  // ============================
  // ELIMINAR PROYECTO
  // ============================

  const handleRemoveProject = async (
    projectId: string
  ) => {
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres eliminar este proyecto? También se perderán sus tareas.'
    );

    if (!confirmed) return;

    try {
      setIsDeletingProject(projectId);

      await removeProject(projectId);

      toast.success(
        'Proyecto eliminado correctamente'
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar el proyecto'
      );
    } finally {
      setIsDeletingProject(null);
    }
  };

  // ============================
  // SELECCIONAR PROYECTO
  // ============================

  const handleSelectProject = async (
    projectId: string
  ) => {
    try {
      await selectProject(projectId);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'No se pudo cargar el proyecto'
      );
    }
  };

  // ============================
  // CREAR TAREA
  // ============================

  const handleAddTask = async (taskData: {
    title: string;
    description: string;
  }) => {
    if (!currentProject) {
      toast.error(
        'Selecciona un proyecto primero'
      );
      return;
    }

    try {
      const response =
        await createTaskRequest(
          currentProject.id,
          taskData
        );

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(
        'Tarea agregada exitosamente'
      );

      // Recargar proyecto para obtener la nueva tarea
      await selectProject(currentProject.id);

      setIsCreateModalOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Error al agregar la tarea'
      );
    }
  };

  // ============================
  // EDITAR TAREA
  // ============================

  const handleEditTask = async (taskData: {
    title: string;
    description: string;
  }) => {
    if (!currentProject || !taskToEdit) {
      return;
    }

    try {
      const response =
        await updateTaskRequest(
          currentProject.id,
          taskToEdit.id,
          taskData
        );

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(
        'Tarea modificada exitosamente'
      );

      await selectProject(currentProject.id);

      setTaskToEdit(null);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Error al actualizar la tarea'
      );
    }
  };

  // ============================
  // CAMBIAR ESTADO DE TAREA
  // ============================

  const handleToggleTask = async (
    task: Task
  ) => {
    if (!currentProject) return;

    try {
      const response =
        await toggleTaskStatusRequest(
          currentProject.id,
          task.id,
          task.completed
        );

      if (response.error) {
        toast.error(response.error);
        return;
      }

      await selectProject(
        currentProject.id
      );

      toast.success(
        task.completed
          ? 'Tarea marcada como pendiente'
          : 'Tarea completada'
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Error al cambiar el estado'
      );
    }
  };

  // ============================
  // ELIMINAR TAREA
  // ============================

  const handleRemoveTask = async (
    taskId: string
  ) => {
    if (!currentProject) return;

    const confirmed = window.confirm(
      '¿Estás seguro de que quieres eliminar esta tarea?'
    );

    if (!confirmed) return;

    try {
      const response =
        await deleteTaskRequest(
          currentProject.id,
          taskId
        );

      if (response.error) {
        toast.error(response.error);
        return;
      }

      await selectProject(
        currentProject.id
      );

      toast.success(
        'Tarea eliminada correctamente'
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'No se pudo borrar la tarea'
      );
    }
  };

  // ============================
  // RENDER
  // ============================

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* ============================
          HEADER
      ============================ */}

      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          {/* LOGO */}

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md">
              <CheckSquare className="h-5 w-5" />
            </div>

            <span className="text-xl font-bold text-white">
              Task
              <span className="text-indigo-400">
                Flow
              </span>
            </span>
          </div>

          {/* USUARIO */}

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-200">
                {user?.name || 'Usuario'}
              </p>

              <p className="text-xs text-slate-400">
                {user?.email}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-1.5 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />

              <span className="hidden sm:inline">
                Cerrar Sesión
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* ============================
          CONTENIDO PRINCIPAL
      ============================ */}

      <div className="flex flex-1 overflow-hidden">
        {/* ============================
            SIDEBAR
        ============================ */}

        <aside className="hidden md:flex w-80 border-r border-slate-800 bg-slate-900/40 p-6 flex-col gap-6 overflow-y-auto">
          {/* CREAR PROYECTO */}

          <div>
            <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4 flex items-center gap-2">
              <Folder className="h-4 w-4 text-indigo-400" />

              Proyectos
            </h2>

            <form
              onSubmit={handleCreateProject}
              className="flex flex-col gap-2"
            >
              <input
                type="text"
                placeholder="Nombre del proyecto..."
                value={projectName}
                onChange={(e) =>
                  setProjectName(
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                required
              />

              <input
                type="text"
                placeholder="Descripción corta..."
                value={projectDesc}
                onChange={(e) =>
                  setProjectDesc(
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />

              <Button
                type="submit"
                size="sm"
                disabled={isCreatingProject}
                className="bg-indigo-600 hover:bg-indigo-500 text-white w-full gap-1 disabled:opacity-50"
              >
                <FolderPlus className="h-4 w-4" />

                {isCreatingProject
                  ? 'Creando...'
                  : 'Crear Proyecto'}
              </Button>
            </form>
          </div>

          {/* LISTA DE PROYECTOS */}

          <div className="flex flex-col gap-1.5 flex-1">
            {isProjectsLoading &&
            projects.length === 0 ? (
              <>
                <Skeleton className="h-10 w-full bg-slate-800" />
                <Skeleton className="h-10 w-full bg-slate-800" />
                <Skeleton className="h-10 w-full bg-slate-800" />
              </>
            ) : projects.length === 0 ? (
              <div className="text-center py-8">
                <Folder className="h-8 w-8 mx-auto text-slate-700 mb-2" />

                <p className="text-xs text-slate-500">
                  No hay proyectos activos.
                </p>
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() =>
                    void handleSelectProject(
                      project.id
                    )
                  }
                  className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${
                    currentProject?.id ===
                    project.id
                      ? 'bg-indigo-600/20 border border-indigo-500/50 text-white'
                      : 'hover:bg-slate-900 border border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex flex-col overflow-hidden pr-2">
                    <span className="font-medium text-sm truncate text-slate-200">
                      {project.name}
                    </span>

                    <span className="text-xs text-slate-500 truncate">
                      {project.description ||
                        'Sin descripción'}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={
                      isDeletingProject ===
                      project.id
                    }
                    onClick={(e) => {
                      e.stopPropagation();

                      void handleRemoveProject(
                        project.id
                      );
                    }}
                    className="opacity-0 group-hover:opacity-100 h-8 w-8 text-slate-500 hover:text-red-400 transition disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* ============================
            MAIN
        ============================ */}

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-slate-950/20">
          <div className="flex flex-col gap-6 max-w-5xl mx-auto">
            {/* TITULO */}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {currentProject
                    ? currentProject.name
                    : 'Selecciona un Proyecto'}
                </h1>

                <p className="text-sm text-slate-400 mt-1">
                  {currentProject?.description ||
                    'Gestiona tus tareas pendientes y objetivos.'}
                </p>
              </div>

              {currentProject && (
                <Button
                  onClick={() =>
                    setIsCreateModalOpen(true)
                  }
                  className="bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5 self-start sm:self-auto"
                >
                  <Plus className="h-4 w-4" />

                  Nueva Tarea
                </Button>
              )}
            </div>

            {/* ERROR DEL PROVIDER */}

            {projectError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {projectError}
              </div>
            )}

            {/* ============================
                SIN PROYECTO
            ============================ */}

            {!currentProject ? (
              <div className="min-h-[400px] flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/20">
                <Inbox className="h-12 w-12 text-slate-700 mb-4" />

                <h2 className="text-lg font-semibold text-slate-300">
                  Selecciona un proyecto
                </h2>

                <p className="text-sm text-slate-500 mt-1 text-center max-w-md">
                  Selecciona un proyecto del panel
                  izquierdo para comenzar a
                  administrar tus tareas.
                </p>
              </div>
            ) : (
              <>
                {/* ============================
                    ESTADISTICAS
                ============================ */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* TOTAL */}

                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-lg">
                      <ListTodo className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm text-slate-400 font-medium">
                        Tareas Totales
                      </p>

                      <p className="text-2xl font-bold text-white">
                        {totalTasks}
                      </p>
                    </div>
                  </div>

                  {/* COMPLETADAS */}

                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-lg">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm text-slate-400 font-medium">
                        Completadas
                      </p>

                      <p className="text-2xl font-bold text-white">
                        {completedTasks}
                      </p>
                    </div>
                  </div>

                  {/* PENDIENTES */}

                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-amber-600/10 text-amber-400 rounded-lg">
                      <Clock className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm text-slate-400 font-medium">
                        Pendientes
                      </p>

                      <p className="text-2xl font-bold text-white">
                        {pendingTasks}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ============================
                    PROGRESO
                ============================ */}

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">
                      Progreso
                    </span>

                    <span className="text-sm text-slate-400">
                      {totalTasks > 0
                        ? Math.round(
                            (completedTasks /
                              totalTasks) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                      style={{
                        width: `${
                          totalTasks > 0
                            ? (completedTasks /
                                totalTasks) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* ============================
                    LISTA DE TAREAS
                ============================ */}

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        Tareas
                      </h2>

                      <p className="text-sm text-slate-500">
                        Administra las tareas de este
                        proyecto.
                      </p>
                    </div>

                    {totalTasks > 0 && (
                      <span className="text-xs text-slate-500">
                        {completedTasks} de{' '}
                        {totalTasks} completadas
                      </span>
                    )}
                  </div>

                  {isProjectsLoading ? (
                    <div className="flex flex-col gap-3">
                      <Skeleton className="h-20 w-full bg-slate-900" />
                      <Skeleton className="h-20 w-full bg-slate-900" />
                      <Skeleton className="h-20 w-full bg-slate-900" />
                    </div>
                  ) : activeTasks.length ===
                    0 ? (
                    <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/20 p-10 text-center">
                      <ListTodo className="h-10 w-10 mx-auto text-slate-700 mb-3" />

                      <h3 className="font-medium text-slate-300">
                        No hay tareas
                      </h3>

                      <p className="text-sm text-slate-500 mt-1 mb-5">
                        Este proyecto todavía no
                        tiene tareas.
                      </p>

                      <Button
                        onClick={() =>
                          setIsCreateModalOpen(
                            true
                          )
                        }
                        className="bg-indigo-600 hover:bg-indigo-500 gap-1.5"
                      >
                        <Plus className="h-4 w-4" />

                        Crear primera tarea
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {activeTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onToggle={() =>
                            void handleToggleTask(
                              task
                            )
                          }
                          onEdit={() =>
                            setTaskToEdit(task)
                          }
                          onDelete={() =>
                            void handleRemoveTask(
                              task.id
                            )
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* ============================
          MODAL CREAR TAREA
      ============================ */}

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Nueva Tarea
                </h2>

                <p className="text-sm text-slate-500">
                  Agrega una tarea a tu proyecto.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  setIsCreateModalOpen(false)
                }
                className="text-slate-400 hover:text-white"
              >
                ✕
              </Button>
            </div>

            <div className="p-5">
              <TaskForm
                onSubmit={handleAddTask}
                onCancel={() =>
                  setIsCreateModalOpen(false)
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================
          MODAL EDITAR TAREA
      ============================ */}

      {taskToEdit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Editar Tarea
                </h2>

                <p className="text-sm text-slate-500">
                  Modifica la información de la tarea.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  setTaskToEdit(null)
                }
                className="text-slate-400 hover:text-white"
              >
                ✕
              </Button>
            </div>

            <div className="p-5">
              <TaskForm
                initialData={{
                  title: taskToEdit.title,
                  description:
                    taskToEdit.description ?? '',
                }}
                onSubmit={handleEditTask}
                onCancel={() =>
                  setTaskToEdit(null)
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
