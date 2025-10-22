import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  sizes?: string;
  style?: React.CSSProperties;
  onError?: () => void;
  onLoad?: () => void;
}

const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  loading = 'lazy',
  decoding = 'async',
  sizes,
  style,
  onError,
  onLoad
}: OptimizedImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  // Fallback to placeholder if image fails to load
  const imageSrc = imageError ? '/placeholder.svg' : src;

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      width={width}
      height={height}
      loading={priority ? 'eager' : loading}
      decoding={decoding}
      sizes={sizes}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
      // SEO attributes
      itemProp="image"
      role="img"
      aria-label={alt}
    />
  );
};

export default OptimizedImage;