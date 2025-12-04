import { ApiError } from './errors';

// For Next.js internal API routes, we don't need a base URL
// External API calls would use process.env.NEXT_PUBLIC_API_URL
const API_BASE_URL = '';

export const api = {
  baseUrl: API_BASE_URL,

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new ApiError(response);
    return response.json();
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      let errorMessage: string | undefined;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message;
      } catch {
        // Se não conseguir parsear, usa undefined
      }
      throw new ApiError(response, errorMessage);
    }
    
    return response.json();
  },
};
