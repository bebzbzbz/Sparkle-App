import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/MainProvider";
import MainButton from "../MainButton/MainButton";

interface PopUpSettingsProps {
	isOpen: boolean;
	onClose: () => void;
}

const PopUpSettings = ({ isOpen, onClose }: PopUpSettingsProps) => {
	const navigate = useNavigate();
	const { signOut } = useAuth();

	const handleLogout = async () => {
		try {
			await signOut();
			navigate('/login');
		} catch (error) {
			console.error('Logout fehlgeschlagen:', error);
		}
	};

	const menuItems = [
		{ title: 'Settings', icon: 'settings' },
		{ title: 'Archive', icon: 'archive' },
		{ title: 'Your Activity', icon: 'activity' },
		{ title: 'QR Code', icon: 'qr-code' },
		{ title: 'Saved', icon: 'saved' },
		{ title: 'Close Friends', icon: 'friends' },
		{ title: 'Favorites', icon: 'heart' },
		{ title: 'Information Center', icon: 'information' }
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
				className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 transform transition-transform duration-300"
				style={{
					transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
					boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)'
				}}
			>
				{/* Handle */}
				<div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

				{/* Menu Items */}
				<div className="space-y-1 mb-8">
					{menuItems.map((item, index) => (
						<button
							key={index}
							className="w-full flex items-center space-x-4 p-3 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<img
								src={`/svg/${item.icon}.svg`}
								alt={item.title}
								className="w-6 h-6"
							/>
							<span className="text-gray-800">{item.title}</span>
						</button>
					))}
				</div>

				{/* Logout Button */}
				<div className="border-t border-gray-200 pt-4">
					<MainButton
						textContent="Logout"
						type="button"
						action={handleLogout}
					/>
				</div>
			</div>
		</>
	);
}

export default PopUpSettings;
