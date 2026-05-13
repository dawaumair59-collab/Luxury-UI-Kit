import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  shimmer?: boolean;
  aspectRatio?: string;
}

export function LazyImage({
  src,
  alt,
  fallback,
  shimmer = true,
  aspectRatio,
  className,
  style,
  ...props
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: "120px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const showSkeleton = shimmer && (!loaded || !inView);
  const imgSrc = error ? (fallback ?? "") : src;

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={{ aspectRatio, ...style }}
    >
      {showSkeleton && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ background: "rgba(212,175,55,0.06)" }}
        />
      )}
      {inView && imgSrc && (
        <img
          src={imgSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0"
          )}
          {...props}
        />
      )}
      {(!imgSrc || (error && !fallback)) && inView && (
        <div
          className="absolute inset-0 flex items-center justify-center text-xs"
          style={{ color: "rgba(212,175,55,0.2)", fontFamily: "'Inter', sans-serif" }}
        >
          ◈
        </div>
      )}
    </div>
  );
}
