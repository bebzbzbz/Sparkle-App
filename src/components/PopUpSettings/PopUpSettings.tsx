import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/MainProvider";
import MainButton from "../MainButton/MainButton";
import useDarkMode from "../../hooks/useDarkMode";

interface PopUpSettingsProps {
	isOpen: boolean;
	onClose: () => void;
}

const PopUpSettings = ({ isOpen, onClose }: PopUpSettingsProps) => {
	const navigate = useNavigate();
	const { signOut } = useAuth();
	const [isDark, setIsDark] = useDarkMode();

	const handleLogout = async () => {
		try {
			await signOut();
			navigate('/login');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	const menuItems = [
		{ 
			title: 'About Sparkle & Team', 
			icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M22.7919 11.9998C22.7919 20.093 20.0934 22.7915 12.0002 22.7915C3.90707 22.7915 1.20857 20.093 1.20857 11.9998C1.20857 3.90667 3.90707 1.20817 12.0002 1.20817C20.0934 1.20817 22.7919 3.90667 22.7919 11.9998Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.0002 16.5442V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.0052 7.91667H11.9947" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>, 
			action: () => navigate("/about-sparkle") },
		{ 
			title: 'Favorites',
			icon: <svg width="16" height="27" viewBox="0 0 16 27" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.06576 2.88946C7.11781 2.46976 7.72616 2.46976 7.77822 2.88946L8.40984 7.98196C8.62141 9.68775 9.73144 11.1491 11.318 11.8105L13.8064 12.8479C14.1009 12.9706 14.1009 13.3878 13.8064 13.5105L11.318 14.5479C9.73144 15.2093 8.62141 16.6706 8.40984 18.3764L7.77822 23.4689C7.72616 23.8886 7.11781 23.8886 7.06576 23.4689L6.43414 18.3764C6.22257 16.6706 5.11254 15.2093 3.52602 14.5479L1.03757 13.5105C0.743116 13.3878 0.743116 12.9706 1.03757 12.8479L3.52602 11.8105C5.11254 11.1491 6.22257 9.68775 6.43414 7.98196L7.06576 2.88946Z" fill="currentColor"/><path d="M12.5686 16.4671C12.6007 16.1841 13.0119 16.1841 13.0441 16.4671L13.2839 18.5766C13.3314 18.9944 13.5947 19.3566 13.9775 19.5306L15.3187 20.1406C15.5056 20.2256 15.5056 20.4912 15.3187 20.5762L13.9775 21.1862C13.5947 21.3602 13.3314 21.7224 13.2839 22.1402L13.0441 24.2497C13.0119 24.5327 12.6007 24.5327 12.5686 24.2497L12.3287 22.1402C12.2812 21.7224 12.0179 21.3602 11.6352 21.1862L10.294 20.5762C10.107 20.4912 10.107 20.2256 10.294 20.1406L11.6352 19.5306C12.0179 19.3566 12.2812 18.9944 12.3287 18.5766L12.5686 16.4671Z" fill="currentColor"/></svg>, 
			action: () => navigate("/favorites") }
	];

	if (!isOpen) return null;

	return (
		<>
			{/* Overlay */}
			<div
				className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
				onClick={onClose}
			/>

			{/* Popup */}
			<div
				className="fixed bottom-0 left-0 right-0 rounded-t-3xl p-6 z-50 transform transition-transform duration-300"
				style={{
					color: 'var(--text-color)',
					backgroundColor: 'var(--popup-bg)',
					transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
					boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)'
				}}
			>
				{/* Handle */}
				<div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

				{/* Menu Items */}
				<div className="space-y-1 mb-5">
					{menuItems.map((item) => (
						<button
							key={crypto.randomUUID()}
							className="w-full flex items-center space-x-4 p-3 bg-[--bg-color] hover:bg-[var(--text-color)] hover:text-[var(--text-color)] rounded-lg transition-colors cursor-pointer"
							onClick={item.action}
						>
							<div className="h-6">
								{item.icon}
							</div>
							<span className="text-[var(--bg-color)]">{item.title}</span>
						</button>
					))}

					{/* Dark Mode Toggle */}
					<button
						className="w-full flex items-center space-x-4 p-3 hover:bg-[var(--text-color)] rounded-lg transition-colors"
						onClick={() => setIsDark(!isDark)}
					>
						<div className="h-6">
						{
							isDark ? (
								<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 21V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M22 12L21 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M3 12L2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M19.0708 4.92969L18.678 5.32252" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5.32178 18.6777L4.92894 19.0706" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M19.0708 19.0703L18.678 18.6775" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5.32178 5.32227L4.92894 4.92943" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6.34141 10C6.12031 10.6256 6 11.2987 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C11.2987 6 10.6256 6.12031 10 6.34141" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
							) : (
								<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.9001 2.30719C19.7392 1.8976 19.1616 1.8976 19.0007 2.30719L18.5703 3.40247C18.5212 3.52752 18.4226 3.62651 18.298 3.67583L17.2067 4.1078C16.7986 4.26934 16.7986 4.849 17.2067 5.01054L18.298 5.44252C18.4226 5.49184 18.5212 5.59082 18.5703 5.71587L19.0007 6.81115C19.1616 7.22074 19.7392 7.22074 19.9001 6.81116L20.3305 5.71587C20.3796 5.59082 20.4782 5.49184 20.6028 5.44252L21.6941 5.01054C22.1022 4.849 22.1022 4.26934 21.6941 4.1078L20.6028 3.67583C20.4782 3.62651 20.3796 3.52752 20.3305 3.40247L19.9001 2.30719Z" stroke="currentColor"/><path d="M16.0328 8.12967C15.8718 7.72009 15.2943 7.72009 15.1333 8.12967L14.9764 8.52902C14.9273 8.65407 14.8287 8.75305 14.7041 8.80237L14.3062 8.95987C13.8981 9.12141 13.8981 9.70107 14.3062 9.86261L14.7041 10.0201C14.8287 10.0694 14.9273 10.1684 14.9764 10.2935L15.1333 10.6928C15.2943 11.1024 15.8718 11.1024 16.0328 10.6928L16.1897 10.2935C16.2388 10.1684 16.3374 10.0694 16.462 10.0201L16.8599 9.86261C17.268 9.70107 17.268 9.12141 16.8599 8.95987L16.462 8.80237C16.3374 8.75305 16.2388 8.65407 16.1897 8.52902L16.0328 8.12967Z" stroke="currentColor"/><path d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085V2.29085L12.1432 2.93276ZM7.37554 20.013C7.017 19.8056 6.5582 19.9281 6.3508 20.2866C6.14339 20.6452 6.26591 21.104 6.62446 21.3114L7.37554 20.013ZM2.68862 17.3755C2.89602 17.7341 3.35482 17.8566 3.71337 17.6492C4.07191 17.4418 4.19443 16.983 3.98703 16.6245L2.68862 17.3755ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467L11.7553 2.29085C9.65609 3.5593 8.25 5.86509 8.25 8.5H9.75ZM12 2.75C11.9115 2.75 11.8077 2.71008 11.7324 2.63168C11.6686 2.56527 11.6538 2.50244 11.6503 2.47703C11.6461 2.44587 11.6482 2.35557 11.7553 2.29085L12.531 3.57467C13.0342 3.27065 13.196 2.71398 13.1368 2.27627C13.0754 1.82126 12.7166 1.25 12 1.25V2.75ZM21.7092 12.2447C21.6444 12.3518 21.5541 12.3539 21.523 12.3497C21.4976 12.3462 21.4347 12.3314 21.3683 12.2676C21.2899 12.1923 21.25 12.0885 21.25 12H22.75C22.75 11.2834 22.1787 10.9246 21.7237 10.8632C21.286 10.804 20.7293 10.9658 20.4253 11.469L21.7092 12.2447ZM12 21.25C10.3139 21.25 8.73533 20.7996 7.37554 20.013L6.62446 21.3114C8.2064 22.2265 10.0432 22.75 12 22.75V21.25ZM3.98703 16.6245C3.20043 15.2647 2.75 13.6861 2.75 12H1.25C1.25 13.9568 1.77351 15.7936 2.68862 17.3755L3.98703 16.6245Z" fill="currentColor"/></svg>
							)
						}
						</div>
						<span className="text-[var(--bg-color)]">
							{isDark ? "Light Mode" : "Dark Mode"}
						</span>
					</button>
				</div>

				{/* Logout Button */}
				<div className="border-t border-gray-200 pt-4">
					<MainButton
						textContent="Logout"
						type="button"
						onClick={handleLogout}
					/>
				</div>
			</div>
		</>
	);
};

export default PopUpSettings;
