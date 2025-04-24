import MainButton from "../../components/MainButton/MainButton";
import MiniFeed from "../../components/MiniFeed/MiniFeed";
import PopUpSettings from "../../components/PopUpSettings/PopUpSettings";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";

const CommunityProfile = () => {
    return (  
        <>
            <h1>Community Profile</h1>
            <ProfileInfo/>
            <MainButton textContent="Follow"/>
            <MiniFeed/>
            <PopUpSettings/>
        </>
    );
}

export default CommunityProfile;