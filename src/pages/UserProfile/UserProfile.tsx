import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import MiniFeed from "../../components/MiniFeed/MiniFeed";
import PopUpSettings from "../../components/PopUpSettings/PopUpSettings";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import { useContext } from "react";
import { mainContext } from "../../context/MainProvider";

const UserProfile = () => {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const navigate = useNavigate()
	const {loggedInUser} = useContext(mainContext)

	const handleSettingsClick = () => {
		setIsSettingsOpen(true);
	};

	const handleCloseSettings = () => {
		setIsSettingsOpen(false);
	};

	return (
		<section className="flex flex-col gap-7">
			<Header 
				headerTitle={loggedInUser?.username || ""} imgLeft="logo" 
				imgRight1="newpost" 
				rightAction1={() => navigate("/newpost")} 
				imgRight2="edit"
				rightAction2={() => navigate("/profile/edit")}
				imgRight3="options"
				rightAction3={handleSettingsClick} />
			{loggedInUser && (
				<>
					<ProfileInfo 
					profile={loggedInUser}/>
					<MiniFeed 
					profile={loggedInUser}/>
				</>
			)}			
			<PopUpSettings
				isOpen={isSettingsOpen}
				onClose={handleCloseSettings}
			/>
		</section>
	);
}

export default UserProfile;
