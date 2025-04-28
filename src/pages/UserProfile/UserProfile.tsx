import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import MiniFeed from "../../components/MiniFeed/MiniFeed";
import PopUpSettings from "../../components/PopUpSettings/PopUpSettings";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import { useContext } from "react";
import { mainContext } from "../../context/MainProvider";
import PostDetails from "../../components/PostDetails/PostDetails";

const UserProfile = () => {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const navigate = useNavigate()
	const {loggedInUser, openModal} = useContext(mainContext)

	const handleSettingsClick = () => {
		setIsSettingsOpen(true);
	};

	const handleCloseSettings = () => {
		setIsSettingsOpen(false);
	};

	return (
		<section className="flex flex-col gap-7">
			<Header 
				headerTitle={loggedInUser?.username || ""} 
				imgLeft="logo" 
				iconsRight={[
					{ name: "edit", onClick: () => navigate("/profile/edit"), alt: "Profil bearbeiten" },
					{ name: "options", onClick: handleSettingsClick, alt: "Einstellungen" }
				]}
			/>
			{loggedInUser && <>
				<ProfileInfo 
                profile={loggedInUser}/>
				<MiniFeed profile={loggedInUser}/>
				{/* modalfenster hier */}
			</>}
			{/* wenn openModal true ist, dann zeig das Modalfenster an */}
			{openModal && <PostDetails/>}

			<PopUpSettings
				isOpen={isSettingsOpen}
				onClose={handleCloseSettings}
			/>
		</section>
	);
}

export default UserProfile;
