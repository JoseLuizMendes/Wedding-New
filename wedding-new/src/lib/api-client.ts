interface RSVPData {
  nome_completo: string;
  contato: string;
  mensagem?: string;
}

interface ReserveGiftData {
  giftId: string;
  tipo: 'casamento' | 'cha-panela';
  name: string;
  phone: string;
}

interface GiftActionData {
  giftId: string;
  tipo: 'casamento' | 'cha-panela';
  code: string;
}

export const apiClient = {
  // RSVP endpoints
  async submitRSVPCasamento(data: RSVPData) {
    const response = await fetch('/api/rsvp/casamento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao enviar RSVP');
    }

    return response.json();
  },

  async submitRSVPChaPanela(data: RSVPData) {
    const response = await fetch('/api/rsvp/cha-panela', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao enviar RSVP');
    }

    return response.json();
  },

  // Gift endpoints
  async getGifts(tipo: 'casamento' | 'cha-panela') {
    try {
      const response = await fetch(`/api/gifts/${tipo}`);

      if (!response.ok) {
        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          throw new Error(error.error || 'Erro ao buscar presentes');
        } else {
          throw new Error('Erro ao buscar presentes - API não disponível');
        }
      }

      return response.json();
    } catch (error) {
      console.error('Erro ao buscar presentes:', error);
      return []; // Return empty array instead of throwing
    }
  },

  async reserveGift(data: ReserveGiftData) {
    const response = await fetch('/api/gifts/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao reservar presente');
    }

    return response.json();
  },

  async markGiftPurchased(data: GiftActionData) {
    const response = await fetch('/api/gifts/mark-purchased', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao marcar presente como comprado');
    }

    return response.json();
  },

  async cancelReservation(data: GiftActionData) {
    const response = await fetch('/api/gifts/cancel-reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao cancelar reserva');
    }

    return response.json();
  },
};