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
		{ title: 'About Sparkle & Team', icon: 'information', action: () => navigate("/about-sparkle") },
		{ title: 'Favorites', icon: 'heart', action: () => navigate("/favorites") }
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
							<img src={`/svg/${item.icon}.svg`} alt={item.title} className="w-6 h-6 mix-blend-exclusion" />
							<span className="text-[var(--bg-color)]">{item.title}</span>
						</button>
					))}

					{/* Dark Mode Toggle */}
					<button
						className="w-full flex items-center space-x-4 p-3 hover:bg-[var(--text-color)] rounded-lg transition-colors"
						onClick={() => setIsDark(!isDark)}
					>
						{
							isDark ? (
								<img src="/svg/sun.svg" alt="Sun" className="w-6 h-6 mix-blend-exclusion" />
							) : (
								<img src="/svg/moon.svg" alt="Moon" className="w-6 h-6 mix-blend-exclusion" />
							)
						}
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
