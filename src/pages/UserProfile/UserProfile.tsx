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
				imgLeft={
					<svg width="35" height="34" viewBox="0 0 35 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.398 1.36936C18.946 0.167986 20.7501 0.609407 20.6815 1.92809L20.2672 9.89533C20.2214 10.7767 21.113 11.4027 21.9264 11.0602L27.3101 8.79343C28.4459 8.31518 29.4757 9.65902 28.7184 10.6314L25.0488 15.3435C24.5623 15.9682 24.8058 16.8846 25.5381 17.1855L33.2776 20.3651C34.457 20.8497 34.1615 22.5969 32.8884 22.6667L25.8285 23.0536C24.9878 23.0997 24.4564 23.9766 24.8045 24.7432L27.9686 31.7097C28.5049 32.8903 27.0426 33.9613 26.0788 33.0939L19.1903 26.8942C18.7283 26.4784 18.0249 26.4856 17.5715 26.9107L11.2095 32.8751C10.3933 33.6402 9.06713 32.9666 9.2035 31.8563L10.1168 24.42C10.2013 23.7326 9.68625 23.1173 8.99472 23.0794L1.46516 22.6667C0.192041 22.5969 -0.103435 20.8497 1.07594 20.3651L8.87839 17.1596C9.59116 16.8668 9.84533 15.9864 9.3983 15.3587L3.51779 7.10208C2.77252 6.05567 3.97553 4.73017 5.08908 5.37081L13.0458 9.9484C13.6571 10.3001 14.4384 10.0495 14.7311 9.40785L18.398 1.36936Z" fill="currentColor"/></svg>
				} 
				iconsRight={[
					{ name: <svg width="21" height="26" viewBox="0 0 21 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.08093 24.9537H5.86706M20.2254 24.9537H10.6532" stroke="currentColor" stroke-width="1.55549" stroke-linecap="round"/><path d="M12.9124 3.01288L13.7996 2.12564C15.2695 0.65563 17.6529 0.65563 19.123 2.12564C20.5929 3.59566 20.5929 5.97902 19.123 7.44903L18.2357 8.33627M12.9124 3.01288C12.9124 3.01288 13.0232 4.89824 14.6868 6.56181C16.3504 8.22537 18.2357 8.33627 18.2357 8.33627M12.9124 3.01288L4.75556 11.1696C4.20308 11.722 3.92684 11.9983 3.68928 12.303C3.40904 12.6622 3.16877 13.0509 2.97273 13.4623C2.80656 13.8109 2.68302 14.1816 2.43595 14.9229L1.38898 18.0638M18.2357 8.33627L14.1574 12.4146M1.38898 18.0638L1.13306 18.8315C1.01146 19.1963 1.1064 19.5984 1.37827 19.8703C1.65016 20.1422 2.0523 20.2372 2.41707 20.1155L3.18484 19.8597M1.38898 18.0638L3.18484 19.8597M10.079 16.493C9.52653 17.0455 9.25026 17.3217 8.94562 17.5593C8.58642 17.8395 8.19761 18.0798 7.78628 18.2758C7.43758 18.442 7.06697 18.5656 6.32574 18.8126L3.18484 19.8597" stroke="currentColor" stroke-width="1.55549" stroke-linecap="round"/></svg>
						, 
						onClick: () => navigate("/profile/edit") },
					{ name: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_4808_3665)"><path d="M15.1649 10.9963H15.1742" stroke="currentColor" stroke-width="1.7948" stroke-linecap="round" stroke-linejoin="round" /><path d="M10.9675 10.9963H10.9769" stroke="currentColor" stroke-width="1.7948" stroke-linecap="round" stroke-linejoin="round" /><path d="M6.77014 10.9963H6.7795" stroke="currentColor" stroke-width="1.7948" stroke-linecap="round" stroke-linejoin="round" /><path d="M2.74896 16.1882C0.0015253 11.539 1.54316 5.54292 6.19229 2.79549C10.8414 0.0480528 16.8375 1.58968 19.585 6.23882C22.3324 10.888 20.7908 16.8841 16.1416 19.6315C13.7323 21.0553 10.9612 21.3272 8.46799 20.6117" stroke="currentColor" stroke-width="1.19653" stroke-linecap="round" /></g><defs><clipPath id="clip0_4808_3665"><rect width="21.5376" height="21.5376" fill="white" transform="translate(0.271667 0.213867)" /></clipPath></defs></svg>, 
						onClick: handleSettingsClick }
				]}
			/>
			{loggedInUser && <>
				<ProfileInfo 
                profile={loggedInUser}/>
				<MiniFeed profileId={loggedInUser.id}/>
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
