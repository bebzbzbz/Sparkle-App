import MiniFeed from "../../components/MiniFeed/MiniFeed";
import PopUpSettings from "../../components/PopUpSettings/PopUpSettings";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";

const UserProfile = () => {
    return ( 
        <>
            <h1>UserProfile</h1>
            <ProfileInfo/>
            <MiniFeed/>
            <PopUpSettings/>
        </>
    );
}

export default UserProfile;