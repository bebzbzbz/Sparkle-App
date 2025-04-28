
interface FeedImageProps {
  src: string;
  alt?: string;
  aspect?: "square" | "portrait" | "landscape";
  maxSize?: number; // px
  className?: string;
}

const FeedImage = ({ src, alt, aspect = "square", maxSize = 600, className = "" }: FeedImageProps) => {
  let aspectClass = "aspect-square";
  if (aspect === "portrait") aspectClass = "aspect-[4/5]";
  if (aspect === "landscape") aspectClass = "aspect-[16/9]";
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-auto object-cover rounded-3xl max-w-[${maxSize}px] max-h-[${maxSize}px] ${aspectClass} ${className}`}
      loading="lazy"
    />
  );
};

export default FeedImage; 