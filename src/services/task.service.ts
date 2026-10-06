import { apiFetch, type ApiResponse } from './api';

// 1. Modelo de datos de una Tarea (Se exporta el tipo Task requerido por DashboardPage)
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  projectId: string;
  createdAt?: string;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
}

/**
 * Obtener todas las tareas de un proyecto específico con paginación
 * Endpoint: GET /tasks/:projectId
 */
export async function getTasksRequest(projectId: string, page = 1, limit = 10): Promise<ApiResponse<Task[]>> {
  return apiFetch<Task[]>(`/tasks/${projectId}?page=${page}&limit=${limit}`);
}

/**
 * Crear una nueva tarea vinculada a un proyecto
 * Endpoint: POST /tasks/:projectId
 */
export async function createTaskRequest(
  projectId: string,
  taskData: CreateTaskDTO
): Promise<ApiResponse<Task>> {
  return apiFetch<Task>(`/tasks/${projectId}`, {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
}

/**
 * Actualizar título y/o descripción de una tarea existente
 * Endpoint: PATCH /tasks/:projectId (El backend pide id en el body)
 */
export async function updateTaskRequest(
  projectId: string,
  taskId: string,
  taskData: CreateTaskDTO
): Promise<ApiResponse<Task>> {
  return apiFetch<Task>(`/tasks/${projectId}`, {
    method: 'PATCH',
    body: JSON.stringify({ id: taskId, ...taskData }),
  });
}

/**
 * Cambiar el estado de la tarea alternando según su estado actual
 * Endpoints: PATCH /tasks/:projectId/complete o /tasks/:projectId/pending
 */
export async function toggleTaskStatusRequest(
  projectId: string,
  taskId: string,
  isCompleted: boolean
): Promise<ApiResponse<Task>> {
  const action = isCompleted ? 'pending' : 'complete';
  return apiFetch<Task>(`/tasks/${projectId}/${action}`, {
    method: 'PATCH',
    body: JSON.stringify({ id: taskId }),
  });
}

/**
 * Eliminar una tarea permanentemente enviando el id en el body
 * Endpoint: DELETE /tasks/:projectId
 */
export async function deleteTaskRequest(
  projectId: string,
  taskId: string
): Promise<ApiResponse<null>> {
  return apiFetch<null>(`/tasks/${projectId}`, {
    method: 'DELETE',
    body: JSON.stringify({ id: taskId }),
  });
}
