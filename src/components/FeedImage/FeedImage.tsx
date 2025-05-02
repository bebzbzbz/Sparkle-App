import { useContext } from "react";
import { mainContext } from "../../context/MainProvider";

interface FeedImageProps {
  src: string;
  alt?: string;
  aspect?: "square" | "portrait" | "landscape";
  maxSize?: number; // px
  className?: string;
  geoTag?: string | null;
  time?: string;
}

const FeedImage = ({ src, alt, aspect = "square", maxSize = 600, className = "", geoTag, time }: FeedImageProps) => {
  let aspectClass = "aspect-square";
  if (aspect === "portrait") aspectClass = "aspect-[4/5]";
  if (aspect === "landscape") aspectClass = "aspect-[16/9]";

  const {openModal,setOpenModal} = useContext(mainContext)

  // um das Modalfenster wieder zu schließen
  const closeModal = () => {
    setOpenModal(false)
}
  // wenn das Modalfenster offen ist, wird dieses Styling angezeigt
  if(!!openModal) {
    return (
      <div className="relative h-[60vh] w-full">
        <img onClick={() => closeModal()} className="cursor-pointer opacity-80 h-8 z-30 absolute top-5 right-5 transition ease-initial" src="/svg/cancel.svg" alt="x symbole" />
        <img
          src={src}
          alt={alt}
          className={`object-cover h-full w-full rounded-4xl max-w-[${maxSize}px] max-h-[${maxSize}px] ${aspectClass} ${className}`}
          loading="lazy"
        />
        <div className="w-full px-5 absolute left-0 bottom-4 flex items-center justify-between">
          {geoTag &&
          <div className="flex gap-1 items-center">
            <img className="h-5" src="/public/svg/geotag.svg" alt="logo of a geotag" />
            <p>{geoTag}</p>
          </div> }
          <p>{time}</p>
        </div>
      
      </div>
    );
  }

  // wenn nicht geöffnet (wie im home), dann wird dieses Styling angezeigt
  if(!openModal) {
    return (
      <img
        src={src}
        alt={alt}
        className={`w-full h-auto object-cover rounded-3xl max-w-[${maxSize}px] max-h-[${maxSize}px] ${aspectClass} ${className}`}
        loading="lazy"
      />
    );
  }
};

export default FeedImage; 