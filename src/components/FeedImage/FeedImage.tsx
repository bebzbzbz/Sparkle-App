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

        <div 
        onClick={() => closeModal()} 
        className=" mix-blend-difference rounded-xl cursor-pointer opacity-80 h-8 z-30 absolute top-5 right-5 transition ease-in-out hover:animate-pulse hover:bg-white/20">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.7931 9.19397L9.20245 14.7846" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14.7999 14.792L9.19989 9.19202" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M1.20834 12.0002C1.20834 20.0933 3.90684 22.7918 12 22.7918C20.0932 22.7918 22.7917 20.0933 22.7917 12.0002C22.7917 3.907 20.0932 1.2085 12 1.2085C3.90684 1.2085 1.20834 3.907 1.20834 12.0002Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
      
        </div>
        {/* overlay für img */}
        <div 
        className="absolute inset-0 bg-gradient-to-t from-light to-transparent top-100 rounded-b-xl">
        </div>
      
        <img
          src={src}
          alt={alt}
          className={`object-cover h-full w-full rounded-4xl max-w-[${maxSize}px] max-h-[${maxSize}px] ${aspectClass} ${className}`}
          loading="lazy" 
          />
      
       
        <div className="w-full px-5 absolute left-0 bottom-4 flex items-center justify-between">
          {geoTag &&
          <div className="flex gap-1 items-center">
            <div className="h-5">
              <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4.71053C6.78024 5.42105 8.38755 7.36316 8.57481 9.44737C8.70011 10.8421 9.39473 12.0496 10.5 12.631C10.9386 12.8618 11.4419 12.9939 12 13C12.7549 13.0082 13.5183 12.4629 13.5164 11.708C13.5158 11.4745 13.4773 11.2358 13.417 11.0163C13.3331 10.7108 13.3257 10.3595 13.5 10C14.1099 8.74254 15.3094 8.40477 16.2599 7.72186C16.6814 7.41898 17.0659 7.09947 17.2355 6.84211C17.7037 6.13158 18.1718 4.71053 17.9377 4" stroke="currentColor" stroke-width="1.5"/><path d="M22 13C21.6706 13.931 21.4375 16.375 17.7182 16.4138C17.7182 16.4138 16.9248 16.4138 16 16.6339M13.4365 18.2759C12.646 19.7655 13.1071 21.3793 13.4365 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7 20.6622C8.47087 21.513 10.1786 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </div>
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