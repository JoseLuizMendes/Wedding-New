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
    const response = await fetch(`/api/gifts/${tipo}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao buscar presentes');
    }

    return response.json();
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

// Configurações do convite
export const inviteConfig = {
  type: 'image' as 'image' | 'page', // Tipo de convite: 'image' (download de imagem) ou 'page' (página personalizada)
  behavior: {
    openIn: 'new-page' as 'new-page' | 'same-page', // Onde abrir o convite
  },
  casamento: {
    showInviteAfterRSVP: true,
    successMessage: "Obrigado por confirmar presença! Seu convite está sendo preparado...",
    imagePath: '/images/convite-casamento.png', // Caminho da imagem do convite
    downloadFileName: 'Convite-Casamento-Jose-Marjorie.png', // Nome do arquivo ao baixar
  },
  "cha-panela": {
    showInviteAfterRSVP: false,
    successMessage: "Obrigado por confirmar presença no chá de panela!",
    imagePath: '/images/convite-cha-panela.png', // Caminho da imagem do convite
    downloadFileName: 'Convite-Cha-Panela-Jose-Marjorie.png', // Nome do arquivo ao baixar
  },
};

export function shouldShowInviteAfterRSVP(tipo: "casamento" | "cha-panela"): boolean {
  return inviteConfig[tipo].showInviteAfterRSVP;
}

export function getSuccessMessage(tipo: "casamento" | "cha-panela"): string {
  return inviteConfig[tipo].successMessage;
}

export function getEventImageConfig(eventType: 'casamento' | 'cha-panela') {
  return {
    imagePath: inviteConfig[eventType].imagePath,
    downloadFileName: inviteConfig[eventType].downloadFileName,
  };
}