import { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80';

export function ImageWithFallback({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  alt = 'Estora luxury property',
  className = '',
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasFailed, setHasFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ minHeight: '100%', width: '100%' }}>
      {!loaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(110deg, #ece5d8 8%, #f5efe6 18%, #ece5d8 33%)',
            backgroundSize: '200% 100%',
            animation: '1.5s shine linear infinite',
          }}
          aria-hidden="true"
        />
      )}
      <img
        {...props}
        src={imgSrc}
        alt={alt}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'opacity 0.3s ease-in-out',
          opacity: loaded ? 1 : 0,
          ...props.style,
        }}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!hasFailed && imgSrc !== fallbackSrc) {
            setHasFailed(true);
            setImgSrc(fallbackSrc);
          } else {
            setLoaded(true);
          }
        }}
      />
    </div>
  );
}
