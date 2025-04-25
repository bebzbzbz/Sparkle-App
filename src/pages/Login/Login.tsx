import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/MainProvider';

const Login = () => {
	const [loginIdentifier, setLoginIdentifier] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const { signInWithPassword, session } = useAuth();
	const navigate = useNavigate();

	// Überwache die Session-Änderungen
	useEffect(() => {
		if (session) {
			navigate('/home');
		}
	}, [session, navigate]);

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			const { error } = await signInWithPassword({ email: loginIdentifier, password });
			if (error) throw error;
		} catch (err: any) {
			setError(err.message || 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	// Hilfsfunktion zum Konvertieren von Benutzername zu E-Mail
	const convertUsernameToEmail = async (username: string) => {
		// Hier müsste die Logik implementiert werden, um den Benutzernamen in eine E-Mail umzuwandeln
		// Zum Beispiel durch Abfrage der Datenbank oder eines Benutzerprofils
		throw new Error('Anmeldung mit Benutzername noch nicht implementiert');
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="flex justify-center">
					<div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
						<svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
					</div>
				</div>

				<h1 className="text-3xl font-bold text-center text-gray-800">Anmelden</h1>

				{error && (
					<div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
						{error}
					</div>
				)}

				<form onSubmit={handleLogin} className="mt-8 space-y-6">
					<div>
						<input
							id="login-identifier"
							name="loginIdentifier"
							type="text"
							autoComplete="username"
							required
							className="block w-full px-3 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
							placeholder="E-Mail oder Benutzername"
							value={loginIdentifier}
							onChange={(e) => setLoginIdentifier(e.target.value)}
							disabled={loading}
						/>
					</div>

					<div>
						<input
							id="password"
							name="password"
							type="password"
							autoComplete="current-password"
							required
							className="block w-full px-3 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
							placeholder="Passwort"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={loading}
						/>
					</div>

					<div className="text-sm text-right">
						<a href="#" className="font-medium text-red-600 hover:text-red-500">
							Passwort vergessen?
						</a>
					</div>

					<div>
						<button
							type="submit"
							disabled={loading}
							className={`group relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
						>
							{loading ? (
								<svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
							) : (
								'Anmelden'
							)}
						</button>
					</div>
				</form>

				<div className="text-sm text-center">
					<p className="text-gray-600">
						Noch kein Account?
						<Link to="/signup" className="ml-1 font-medium text-red-600 hover:text-red-500">
							Registrieren
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Login;
