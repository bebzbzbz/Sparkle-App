import Header from "../../components/Header/Header";
import MiniFeed from "../../components/MiniFeed/MiniFeed";
import PopUpSettings from "../../components/PopUpSettings/PopUpSettings";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";

const UserProfile = () => {
    return ( 
        <>
        {/* hier fehlen noch zwei andere bilder rechts */}
            <Header headerTitle={"user_name"} imgLeft="logo" imgRight="options"/>
            <ProfileInfo/>
            <MiniFeed/>
            <PopUpSettings/>
        </>
    );
}

export default UserProfile;