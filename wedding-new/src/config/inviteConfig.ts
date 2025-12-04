// Configurações do convite (UI only)
export const inviteConfig = {
  type: 'image' as 'image' | 'page', // Tipo de convite: 'image' (download de imagem) ou 'page' (página personalizada)
  behavior: {
    openIn: 'new-page' as 'new-page' | 'same-page', // Onde abrir o convite
  },
  casamento: {
    showInviteAfterRSVP: false, // Desabilitado até criar a página de convite
    successMessage: "Obrigado por confirmar sua presença! Mal podemos esperar para celebrar com você.",
    imagePath: '/images/convite-casamento.png', // Caminho da imagem do convite
    downloadFileName: 'Convite-Casamento-Jose-Marjorie.png', // Nome do arquivo ao baixar
  },
  "cha-panela": {
    showInviteAfterRSVP: false,
    successMessage: "🎉 Obrigado por confirmar presença no nosso chá de panela!",
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