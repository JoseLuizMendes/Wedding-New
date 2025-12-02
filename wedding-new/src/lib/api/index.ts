import { ApiError } from './errors';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const api = {
  baseUrl: API_BASE_URL,

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new ApiError(response);
    return response.json();
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new ApiError(response);
    return response.json();
  },
};
