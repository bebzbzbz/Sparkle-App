import { Link } from "react-router-dom";
import MainButton from "../MainButton/MainButton";

const ProfilePreviewCard = () => {
    // bild und name sind klickbar zu profil ✔︎
    return (  
        <article className="px-10 w-full flex justify-between items-center">
            <Link to="/profile">
            <div className="flex items-center justify-center gap-5">
                <div className="h-10 w-10">
                    <img className="h-full object-fill" src="/public/svg/ProfilePlaceholder.png" alt="profilepicture placeholder" />
                </div>
                <div className="flex flex-col ">
                    <p className="font-bold">profile_name</p>
                    <p className=" text-[0.8rem] font-extralight opacity-70">proffession</p>
                </div>
            </div>
            </Link>
            
            {/* nur solange der mainbutton noch keine funktion hat, dann gerne löschen */}
        <p>button</p> 
            <MainButton/>
        </article>
        
            
            
        
    );
}

export default ProfilePreviewCard;