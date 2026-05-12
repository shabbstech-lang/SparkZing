import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Image as ImageIcon } from 'lucide-react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className, 
  fallback,
  ...props 
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // If the src is an emoji or a short placeholder string, we treat it differently
  const isEmoji = src.length <= 4;
  const isDataUrl = src.startsWith('data:');
  const isHttp = src.startsWith('http');

  if (isEmoji && !isDataUrl && !isHttp) {
    return (
      <div className={cn("flex items-center justify-center bg-slate-50", className)}>
        <span className="text-2xl">{src}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex items-center justify-center bg-slate-100 text-slate-400", className)}>
        {fallback || <ImageIcon className="w-6 h-6" />}
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-slate-100", className)}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-slate-200" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0"
        )}
        {...props}
      />
    </div>
  );
}
