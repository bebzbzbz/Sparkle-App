import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/MainProvider';
import SuccessModal from '../../components/SuccessModal/SuccessModal';

const SignUp = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const navigate = useNavigate();

	const { signUp, signInWithPassword } = useAuth();

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		setShowSuccessModal(false);

		try {
			// 1. Registrierung
			const result = await signUp({
				email,
				password,
				username
			});

			if (!result || result.error) {
				throw new Error(result?.error || 'Registration failed');
			}

			// 2. Registrierung erfolgreich - Modal anzeigen
			setShowSuccessModal(true);

			// 3. Automatische Anmeldung
			const signInResult = await signInWithPassword({
				email,
				password
			});

			if (signInResult?.error) {
				throw new Error(signInResult.error);
			}

		} catch (error: any) {
			console.error('Registration process error:', error);
			setError(error.message || 'Registration failed');
			setShowSuccessModal(false);
		} finally {
			setLoading(false);
		}
	};

	const handleModalClose = () => {
		setShowSuccessModal(false);
		navigate('/home');
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-light px-7 gap-6">
			<div className="relative flex items-center justify-center">
				<div className="h-30 text-main">
					<svg width="35" height="34" viewBox="0 0 35 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.398 1.36936C18.946 0.167986 20.7501 0.609407 20.6815 1.92809L20.2672 9.89533C20.2214 10.7767 21.113 11.4027 21.9264 11.0602L27.3101 8.79343C28.4459 8.31518 29.4757 9.65902 28.7184 10.6314L25.0488 15.3435C24.5623 15.9682 24.8058 16.8846 25.5381 17.1855L33.2776 20.3651C34.457 20.8497 34.1615 22.5969 32.8884 22.6667L25.8285 23.0536C24.9878 23.0997 24.4564 23.9766 24.8045 24.7432L27.9686 31.7097C28.5049 32.8903 27.0426 33.9613 26.0788 33.0939L19.1903 26.8942C18.7283 26.4784 18.0249 26.4856 17.5715 26.9107L11.2095 32.8751C10.3933 33.6402 9.06713 32.9666 9.2035 31.8563L10.1168 24.42C10.2013 23.7326 9.68625 23.1173 8.99472 23.0794L1.46516 22.6667C0.192041 22.5969 -0.103435 20.8497 1.07594 20.3651L8.87839 17.1596C9.59116 16.8668 9.84533 15.9864 9.3983 15.3587L3.51779 7.10208C2.77252 6.05567 3.97553 4.73017 5.08908 5.37081L13.0458 9.9484C13.6571 10.3001 14.4384 10.0495 14.7311 9.40785L18.398 1.36936Z" fill="currentColor"/></svg>
				</div>
				<h1 className="text-5xl absolute mt-1">sparkle</h1>
			</div>

			<form onSubmit={handleSignUp} className="space-y-4">
				<h1 className="text-4xl text-center">
					Register
				</h1>

				{error && (
					<div
						className="p-4 text-sm text-red-700 bg-red-100 rounded-lg"
						role="alert"
					>
						{error}
					</div>
				)}
				<input
					id="username"
					name="username"
					type="text"
					required
					className="border border-main focus:outline-none focus:ring-main focus:border-main"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					disabled={loading}
					minLength={3}
					maxLength={30}
				/>

				<input
					id="email"
					name="email"
					type="email"
					autoComplete="email"
					required
					className="border border-main focus:outline-none focus:ring-main focus:border-main"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={loading}
				/>

				<input
					id="password"
					name="password"
					type="password"
					autoComplete="new-password"
					required
					className="border border-main focus:outline-none focus:ring-main focus:border-main"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					disabled={loading}
					minLength={6}
				/>

				<button
					type="submit"
					disabled={loading}
					className={`flex justify-center w-full items-center h-12 py-3 font-medium text-white bg-main rounded-md hover:bg-main/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main ${loading ? "opacity-50 cursor-not-allowed" : ""
						}`}
					>
					{loading ? (
						<svg
							className="text-white animate-spin"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					) : (
						"Register"
					)}
				</button>
			</form>

			<p className="text-sm text-center">
				Already have an account?
				<Link
					to="/login"
					className="ml-1 font-medium text-main"
				>
					Login
				</Link>
			</p>

			<SuccessModal
				isOpen={showSuccessModal}
				onClose={handleModalClose}
			/>
		</div>
	);
};

export default SignUp;