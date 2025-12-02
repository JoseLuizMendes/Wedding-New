import { api } from './index';

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

export const rsvpApi = {
  async confirmWedding(data: RSVPRequest): Promise<RSVPResponse> {
    return api.post('/api/rsvp/casamento', data);
  },

  async confirmBridalShower(data: RSVPRequest): Promise<RSVPResponse> {
    return api.post('/api/rsvp/cha-panela', data);
  },
};
