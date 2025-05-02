import { useEffect } from 'react';

interface SuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const SuccessModal = ({ isOpen, onClose }: SuccessModalProps) => {
	useEffect(() => {
		if (isOpen) {
			// Modal für 3 Sekunden anzeigen, dann schließen
			const timer = setTimeout(() => {
				onClose();
			}, 2000);

			return () => clearTimeout(timer);
		}
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"></div>
			<div
				className={`relative bg-green-100 text-green-700 p-6 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
					}`}
			>
				<div className="text-center">
					<h2 className="text-xl font-bold mb-2">Registration Successful!</h2>
					<p>You will be automatically logged in and redirected to the home page.</p>
					<div className="mt-4">
						<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SuccessModal;
