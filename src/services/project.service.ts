import { apiFetch, type ApiResponse } from './api';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt?: string;
  Tasks?: any[];
}

// Exportamos las funciones individuales para mantener el estándar limpio de la plantilla
export async function getAllProjectsRequest(): Promise<ApiResponse<Project[]>> {
  return apiFetch<Project[]>('/projects');
}

export async function createProjectRequest(projectData: {
  name: string;
  description: string;
}): Promise<ApiResponse<Project>> {
  return apiFetch<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(projectData),
  });
}

export async function updateProjectRequest(
  id: string,
  projectData: { name: string; description: string }
): Promise<ApiResponse<Project>> {
  return apiFetch<Project>(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(projectData),
  });
}

export async function deleteProjectRequest(id: string): Promise<ApiResponse<null>> {
  return apiFetch<null>(`/projects/${id}`, {
    method: 'DELETE',
  });
}

export async function getProjectByIdRequest(id: string): Promise<ApiResponse<Project>> {
  return apiFetch<Project>(`/projects/${id}`);
}
