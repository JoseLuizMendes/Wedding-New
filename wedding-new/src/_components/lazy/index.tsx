import dynamic from 'next/dynamic';
import { GiftListSkeleton } from '@/_components/gifts/GiftListSkeleton';
import { FormSkeleton } from '@/_components/ui/FormSkeleton';

/**
 * Lazy loaded GiftList component with skeleton loading state
 */
export const LazyGiftList = dynamic(
  () => import('@/_components/gifts/GiftList').then((mod) => ({ default: mod.GiftList })),
  {
    loading: () => <GiftListSkeleton />,
    ssr: true,
  }
);

/**
 * Lazy loaded RSVPForm component with skeleton loading state
 */
export const LazyRSVPForm = dynamic(
  () => import('@/_components/forms/RSVPForm').then((mod) => ({ default: mod.RSVPForm })),
  {
    loading: () => <FormSkeleton />,
    ssr: true,
  }
);

/**
 * Lazy loaded BackgroundMusic component (client-only, no SSR)
 */
export const LazyBgMusic = dynamic(
  () => import('@/_components/bg-music'),
  {
    ssr: false,
  }
);
