import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  getTasksRequest,
  createTaskRequest,
  updateTaskRequest,
  toggleTaskStatusRequest,
  deleteTaskRequest,
  type Task,
  type CreateTaskDTO,
} from '@/services/task.service';

/**
 * Custom Hook para gestionar el estado y operaciones CRUD de las tareas
 * vinculado dinámicamente al ciclo de vida de un proyecto activo.
 */
export function useTasks(projectId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sincronizar y recargar las tareas de este proyecto específico
  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTasksRequest(projectId);
      setTasks(response.data || []);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error al cargar las tareas';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // Carga inicial automatizada al montar el hook o cambiar de proyecto
  useEffect(() => {
    let ignore = false;

    if (projectId) {
      setIsLoading(true);
      getTasksRequest(projectId)
        .then((response) => {
          if (!ignore) {
            setTasks(response.data || []);
            setError(null);
          }
        })
        .catch((err) => {
          if (!ignore) {
            setError(err instanceof Error ? err.message : 'Error de carga');
          }
        })
        .finally(() => {
          if (!ignore) setIsLoading(false);
        });
    } else {
      setTasks([]);
    }

    return () => {
      ignore = true;
    };
  }, [projectId]);

  // Crear tarea (POST) vinculada al proyecto activo
  const addTask = async (data: CreateTaskDTO) => {
    if (!projectId) return;
    try {
      const response = await createTaskRequest(projectId, data);
      setTasks((prev) => [...prev, response.data]);
      toast.success('Tarea creada con éxito');
      return response.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al crear la tarea';
      toast.error(msg);
      throw err;
    }
  };

  // Alternar estado (PATCH) usando el endpoint real unificado
  const toggleTask = async (task: Task) => {
    if (!projectId) return;
    try {
      const response = await toggleTaskStatusRequest(projectId, task.id, task.completed);
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? response.data : t))
      );
      if (response.data.completed) {
        toast.success('¡Tarea completada!');
      } else {
        toast.info('Tarea marcada como pendiente');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al cambiar estado';
      toast.error(msg);
    }
  };

  // Editar tarea (PATCH) enviando el id en el body según tu backend
  const editTask = async (taskId: string, data: CreateTaskDTO) => {
    if (!projectId) return;
    try {
      const response = await updateTaskRequest(projectId, taskId, data);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? response.data : t))
      );
      toast.success('Tarea actualizada correctamente');
      return response.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar tarea';
      toast.error(msg);
      throw err;
    }
  };

  // Eliminar tarea (DELETE) enviando el id en el body según tu backend
  const removeTask = async (taskId: string) => {
    if (!projectId) return;
    try {
      await deleteTaskRequest(projectId, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast.success('Tarea eliminada del sistema');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar tarea';
      toast.error(msg);
      throw err;
    }
  };

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    addTask,
    toggleTask,
    editTask,
    removeTask,
  };
}
