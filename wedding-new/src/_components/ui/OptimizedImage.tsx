"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface OptimizedImageProps extends Omit<ImageProps, 'placeholder'> {
  /** Image quality (1-100), default is 85 */
  quality?: number;
  /** Use blur placeholder for local images */
  useBlurPlaceholder?: boolean;
  /** Custom blur data URL for remote images */
  blurDataURL?: string;
  /** Fallback component to show on error */
  fallback?: React.ReactNode;
}

/**
 * Optimized image component with automatic WebP/AVIF conversion,
 * responsive sizing, and blur placeholder support.
 */
export const OptimizedImage = ({
  src,
  alt,
  quality = 85,
  useBlurPlaceholder = false,
  blurDataURL,
  sizes,
  priority = false,
  fallback,
  className,
  ...props
}: OptimizedImageProps) => {
  const [hasError, setHasError] = useState(false);

  // Default responsive sizes if not provided
  const defaultSizes = sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  // Determine placeholder props
  const placeholderProps = useBlurPlaceholder || blurDataURL
    ? {
        placeholder: "blur" as const,
        ...(blurDataURL && { blurDataURL }),
      }
    : {};

  return (
    <Image
      src={src}
      alt={alt}
      quality={quality}
      sizes={defaultSizes}
      priority={priority}
      className={className}
      onError={() => setHasError(true)}
      {...placeholderProps}
      {...props}
    />
  );
};

export default OptimizedImage;
