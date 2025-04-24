import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import MiniFeed from "../../components/MiniFeed/MiniFeed";
import PopUpSettings from "../../components/PopUpSettings/PopUpSettings";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";

const UserProfile = () => {
    const navigate = useNavigate()
    

    const navToEdit = () => {
        navigate(`/profile/edit`)
    }

    const navToNewPost = () => {
        navigate(`/newpost`)
    }

    // noch eine Funktion für das Pop-Up für die Einstellungen
    
    return ( 
        <>
            <Header 
            headerTitle={"user_name"} imgLeft="logo" 
            imgRight1="newpost" 
            rightAction1={() => navToNewPost} 
            imgRight2="edit"
            rightAction2={() => navToEdit}
            imgRight3="options"/>
            <ProfileInfo/>
            <MiniFeed/>
            <PopUpSettings/>
        </>
    );
}

export default UserProfile;