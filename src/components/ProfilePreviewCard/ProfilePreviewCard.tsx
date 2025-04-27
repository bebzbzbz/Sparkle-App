import { Link, useLocation } from "react-router-dom";
import MainButton from "../MainButton/MainButton";
import FeedImage from "../FeedImage/FeedImage";

interface ProfilePreviewCardProps {
    profileId: string,
    profilePicUrl: string,
    username: string
    profession: string
}

const ProfilePreviewCard = ({profileId, profilePicUrl, username, profession} : ProfilePreviewCardProps) => {
    // bild und name sind klickbar zu profil ✔︎
    const location = useLocation()

    return (  
        <article className="w-full flex justify-between items-center">
            <Link to={`/users/${profileId}`}>
                <div className="flex items-center gap-5">
                        <FeedImage 
                            src={profilePicUrl || "/svg/pic-empty.svg"} 
                            alt="profilepicture placeholder" 
                            aspect="square"
                            maxSize={80}
                            className="h-10 rounded-full transition ease-in-out hover:drop-shadow-xl hover:opacity-90" 
                        />
                    <div className="flex flex-col ">
                        <p className="font-bold transition ease-in-out hover:drop-shadow-xl hover:opacity-90">{username}</p>
                        <p className=" text-[0.8rem] font-extralight opacity-70">{profession}</p>
                    </div>
                </div>
            </Link>
            
            {location.pathname === "/home" ?
                <img src="/svg/options.svg"/>
            : <MainButton textContent="Follow" type="button" linkDestination={`/users/${profileId}`}/>
            }
        </article>
    );
}

export default ProfilePreviewCard;