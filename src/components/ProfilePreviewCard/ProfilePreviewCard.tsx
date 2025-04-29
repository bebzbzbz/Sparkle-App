import { Link, useLocation } from "react-router-dom";
import MainButton from "../MainButton/MainButton";
import IUser from "../../interfaces/IUser";

interface ProfilePreviewCardProps {
    profile: IUser,
    geoTag?: string | null;
}

const ProfilePreviewCard = ({profile, geoTag} : ProfilePreviewCardProps) => {
    // bild und name sind klickbar zu profil ✔︎
    const location = useLocation()
    const profilePage = location.pathname === "/profile"
    const communityProfilePage = location.pathname.includes("/users")

    return (  
        <article className="w-full flex justify-between items-center">
            {!profilePage && !communityProfilePage &&
            <Link to={`/users/${profile?.id}` || ""}>
                <div className="flex items-center gap-5">
                    <img 
                        className="h-10 aspect-square object-cover rounded-full transition ease-in-out hover:drop-shadow-xl hover:opacity-90" 
                        src={profile?.profile_image_url || "/svg/pic-empty.svg"} 
                        alt="profilepicture placeholder" />
                    <div className="flex flex-col">
                        <p className="font-bold transition ease-in-out hover:drop-shadow-xl hover:opacity-90">{profile?.username || ""}</p>
                        <p className=" text-[0.8rem] font-extralight opacity-70">{profile?.profession || ""}</p>
                    </div>
                </div>
            </Link>   
            }
            {geoTag && <span className={`flex ${profilePage ||communityProfilePage && "flex-row-reverse"} text-sm text-gray-500 gap-2 items-center`}>
                <p className="text-wrap">{geoTag}</p>
                <img src="/svg/geotag.svg" alt="GeoTag" className="h-4"/>
            </span>
}
            {location.pathname !== "/home" || profilePage || communityProfilePage && <MainButton textContent="Follow" type="button" linkDestination={`/users/${profile?.id}`}/>
            }
        </article>
    );
}

export default ProfilePreviewCard;