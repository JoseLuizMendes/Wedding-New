/**
 * Utilitários para gerenciamento de convites
 */

import { inviteConfig, getEventImageConfig } from '@/config/inviteConfig';

/**
 * Formata o nome do convidado
 * - Primeira letra de cada palavra em maiúscula
 * - Resto em minúscula
 * Exemplo: "JOÃO SILVA" -> "João Silva"
 */
export const formatGuestName = (name: string): string => {
  if (!name) return '';
  
  return name
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (word.length === 0) return '';
      // Primeira letra maiúscula + resto minúsculo
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

/**
 * Abre o convite (imagem ou página) baseado na configuração
 * @param guestName Nome do convidado (opcional)
 * @param eventType Tipo do evento ('casamento' ou 'cha-panela')
 */
export const openAndDownloadInvite = (
  guestName?: string,
  eventType: 'casamento' | 'cha-panela' = 'casamento'
) => {
  const { type, behavior } = inviteConfig;

  if (behavior.openIn === 'new-page') {
    let inviteUrl = '';

    if (type === 'image') {
      // Convite tipo IMAGEM - pega config específica do evento
      const eventImageConfig = getEventImageConfig(eventType);
      inviteUrl = `/convite-download?type=image&eventType=${eventType}&image=${encodeURIComponent(eventImageConfig.imagePath)}&filename=${encodeURIComponent(eventImageConfig.downloadFileName)}`;
    } else if (type === 'page') {
      // Convite tipo PÁGINA - passa eventType e nome do convidado
      const formattedName = guestName ? formatGuestName(guestName) : '';
      inviteUrl = `/convite-download?type=page&eventType=${eventType}&guestName=${encodeURIComponent(formattedName)}`;
    }

    window.open(inviteUrl, '_blank', 'noopener,noreferrer');
  }
};

/**
 * Download direto do convite de imagem (fallback ou uso manual)
 * @param eventType Tipo do evento
 */
export const downloadInvite = async (
  eventType: 'casamento' | 'cha-panela' = 'casamento'
) => {
  const eventImageConfig = getEventImageConfig(eventType);

  try {
    const response = await fetch(eventImageConfig.imagePath);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = eventImageConfig.downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao baixar convite:', error);
    // Fallback: abre em nova aba
    window.open(eventImageConfig.imagePath, '_blank');
  }
};

/**
 * Verifica se a imagem do convite existe
 * @param eventType Tipo do evento
 */
export const checkInviteExists = async (
  eventType: 'casamento' | 'cha-panela' = 'casamento'
): Promise<boolean> => {
  try {
    const eventImageConfig = getEventImageConfig(eventType);
    const response = await fetch(eventImageConfig.imagePath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};
