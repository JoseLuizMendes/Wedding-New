import { api } from './index';
import { RSVPRequest as ApiRSVPRequest, RSVPResponse as ApiRSVPResponse } from '@/types/api';

export interface RSVPRequest {
  nome_completo: string;
  contato: string;
  mensagem?: string;
}

export interface RSVPResponse {
  id: string;
  nome_completo: string;
  contato: string;
  mensagem?: string;
  created_at: string;
}

// Helper function to map frontend request to API request format
function mapToApiRequest(data: RSVPRequest): ApiRSVPRequest {
  return {
    nomeCompleto: data.nome_completo,
    contato: data.contato,
    mensagem: data.mensagem,
  };
}

// Helper function to map API response to frontend response format
function mapFromApiResponse(response: ApiRSVPResponse): RSVPResponse {
  return {
    id: String(response.id),
    nome_completo: response.name,
    contato: '', // Not returned by new API
    mensagem: response.message,
    created_at: response.confirmedAt,
  };
}

export const rsvpApi = {
  async confirmWedding(data: RSVPRequest): Promise<RSVPResponse> {
    const apiRequest = mapToApiRequest(data);
    const response = await api.post<ApiRSVPResponse>('/api/rsvp/casamento', apiRequest);
    return mapFromApiResponse(response);
  },

  async confirmBridalShower(data: RSVPRequest): Promise<RSVPResponse> {
    const apiRequest = mapToApiRequest(data);
    const response = await api.post<ApiRSVPResponse>('/api/rsvp/cha-panela', apiRequest);
    return mapFromApiResponse(response);
  },
};
