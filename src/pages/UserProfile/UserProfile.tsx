import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import MiniFeed from "../../components/MiniFeed/MiniFeed";
import PopUpSettings from "../../components/PopUpSettings/PopUpSettings";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import { useContext } from "react";
import { mainContext } from "../../context/MainProvider";

const UserProfile = () => {
    const navigate = useNavigate()
    const {loggedInUser} = useContext(mainContext)

    // noch eine Funktion für das Pop-Up für die Einstellungen
    
    return ( 
        <section className="flex flex-col gap-7">
            <Header 
                headerTitle={"user_name"} imgLeft="logo" 
                imgRight1="newpost" 
                rightAction1={() => navigate("/profile/edit")} 
                imgRight2="edit"
                rightAction2={() => navigate("/newpost")}
                imgRight3="options"/>
            <ProfileInfo 
                profilePicUrl={loggedInUser?.profile_image_url || ""} 
                username={loggedInUser?.username || ""} 
                name={loggedInUser?.profile_name || ""}
                profession={loggedInUser?.profession || ""} 
                profile_desc={loggedInUser?.profile_desc || ""} 
                website={loggedInUser?.website || ""}/>
            <MiniFeed/>
            <PopUpSettings/>
        </section>
    );
}

export default UserProfile;