import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  placeholder?: string;
  onError?: () => void;
  style?: React.CSSProperties;
}

const OptimizedImage = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  priority = false,
  placeholder = '/placeholder.svg',
  onError,
  style,
  ...props
}: OptimizedImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
  };

  const handleError = () => {
    setImageError(true);
    if (onError) onError();
  };

  return (
    <div className="relative overflow-hidden">
      {/* Placeholder/Loading state */}
      {!imageLoaded && !imageError && (
        <div 
          className={`bg-gray-200 animate-pulse ${className}`}
          style={style}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Actual image */}
      <img
        src={imageError ? placeholder : src}
        alt={alt}
        className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        loading={priority ? 'eager' : loading}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={handleLoad}
        onError={handleError}
        style={style}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;

