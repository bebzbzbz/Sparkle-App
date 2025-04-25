import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import MiniFeed from "../../components/MiniFeed/MiniFeed";
import PopUpSettings from "../../components/PopUpSettings/PopUpSettings";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";

const UserProfile = () => {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const navigate = useNavigate()

	const navToEdit = () => navigate("/profile/edit")

	const navToNewPost = () => navigate("/newpost")

	const handleSettingsClick = () => {
		setIsSettingsOpen(true);
	};

	const handleCloseSettings = () => {
		setIsSettingsOpen(false);
	};

	return (
		<>
			<Header
				headerTitle={"user_name"} imgLeft="logo"
				imgRight1="newpost"
				rightAction1={navToNewPost}
				imgRight2="edit"
				rightAction2={navToEdit}
				imgRight3="options"
				onImgRight3Click={handleSettingsClick} />
			<ProfileInfo />
			<MiniFeed />
			<PopUpSettings
				isOpen={isSettingsOpen}
				onClose={handleCloseSettings}
			/>
		</>
	);
}

export default UserProfile;
