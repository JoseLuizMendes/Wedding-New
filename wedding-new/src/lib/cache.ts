import { unstable_cache } from 'next/cache';
import { apiClient } from './api-client';

/**
 * Cached function to fetch gifts by type
 * Revalidates every 30 minutes (1800 seconds)
 */
export const getGiftsCached = unstable_cache(
  async (tipo: 'casamento' | 'cha-panela') => {
    return apiClient.getGifts(tipo);
  },
  ['gifts'],
  {
    revalidate: 1800,
    tags: ['gifts'],
  }
);

/**
 * Event info type for cached data
 */
interface EventInfo {
  casamento: {
    date: string;
    location: string;
    time: string;
  };
  chaPanela: {
    date: string;
    location: string;
    time: string;
  };
}

/**
 * Cached function to fetch event information
 * Revalidates every 24 hours (86400 seconds)
 */
export const getEventInfoCached = unstable_cache(
  async (): Promise<EventInfo> => {
    // Return static event info - can be replaced with API call if needed
    return {
      casamento: {
        date: '2025-01-11',
        location: 'Local do Casamento',
        time: '17:00',
      },
      chaPanela: {
        date: '2024-12-07',
        location: 'Local do Chá de Panela',
        time: '15:00',
      },
    };
  },
  ['event-info'],
  {
    revalidate: 86400,
    tags: ['event'],
  }
);
