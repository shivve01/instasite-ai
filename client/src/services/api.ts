import axios from 'axios';
import type { GenerationConfig, Project } from '../types';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 300_000, // 5 min for AI generation
});

export async function generateWebsite(config: GenerationConfig): Promise<Project> {
    const { data } = await api.post<Project>('/generate', config);
    return data;
}

export async function regenerateWebsite(
    projectId: string,
    modifiedPrompt?: string
): Promise<Project> {
    const { data } = await api.post<Project>('/regenerate', {
        projectId,
        modifiedPrompt,
    });
    return data;
}

export async function getProjects(): Promise<Project[]> {
    const { data } = await api.get<Project[]>('/projects');
    return data;
}

export async function getProject(id: string): Promise<Project> {
    const { data } = await api.get<Project>(`/projects/${id}`);
    return data;
}

export async function downloadProjectZip(id: string): Promise<Blob> {
    const { data } = await api.post(`/download/${id}`, null, {
        responseType: 'blob',
    });
    return data;
}

export default api;
