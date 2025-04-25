import { createContext, useState, useEffect, useContext } from "react";
import { Session, User } from '@supabase/supabase-js';
import supabase from '../utils/supabase';

// Typdefinition für den Context-Wert
interface AuthContextType {
	supabase: typeof supabase;
	session: Session | null;
	user: User | null;
	loading: boolean;
	signInWithPassword: (credentials: { email: string; password: string }) => Promise<any>;
	signUp: (credentials: { email: string; password: string; username: string; options?: any }) => Promise<any>;
	signOut: () => Promise<any>;
}

// Context erstellen mit einem initialen Defaultwert
export const mainContext = createContext<AuthContextType>({
	supabase,
	session: null,
	user: null,
	loading: true,
	signInWithPassword: async () => { },
	signUp: async () => { },
	signOut: async () => { },
});

// Hilfsfunktion zum Abrufen des Contexts
export const useAuth = () => {
	const context = useContext(mainContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

const MainProvider = ({ children }: { children: React.ReactNode }) => {
	const [session, setSession] = useState<Session | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	// Aktuelle Session abrufen und auf Änderungen hören
	useEffect(() => {
		// Aktuelle Session abrufen
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);
		});

		// Auf Auth-Änderungen hören
		const { data: { subscription } } = supabase.auth.onAuthStateChange(
			async (_event, session) => {
				setSession(session);
				setUser(session?.user ?? null);
				setLoading(false);
			}
		);

		// Listener beim Unmount bereinigen
		return () => {
			subscription.unsubscribe();
		};
	}, []);

	// --- Authentifizierungsfunktionen ---

	const signInWithPassword = async (credentials: { email: string; password: string }) => {
		setLoading(true);
		try {
			// Prüfen, ob es sich um eine E-Mail-Adresse handelt
			const isEmail = credentials.email.includes('@');

			if (isEmail) {
				const { error } = await supabase.auth.signInWithPassword(credentials);
				if (error) throw error;
			} else {
				// Wenn es kein E-Mail ist, handelt es sich um einen Benutzernamen
				// Hole die E-Mail-Adresse aus der profiles-Tabelle
				const { data: profile, error: profileError } = await supabase
					.from('profiles')
					.select('email')
					.eq('username', credentials.email)
					.single();

				if (profileError || !profile) {
					throw new Error('Benutzername nicht gefunden');
				}

				// Führe die Anmeldung mit der gefundenen E-Mail durch
				const { error: signInError } = await supabase.auth.signInWithPassword({
					email: profile.email,
					password: credentials.password
				});

				if (signInError) throw signInError;
			}
		} catch (error) {
			console.error("Error signing in:", error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const signUp = async (credentials: { email: string; password: string; username: string; options?: any }) => {
		setLoading(true);
		try {
			// 1. Benutzer in auth.users registrieren
			const { data, error } = await supabase.auth.signUp({
				email: credentials.email,
				password: credentials.password,
				options: {
					...credentials.options,
					emailRedirectTo: `${window.location.origin}/login`,
					data: {
						username: credentials.username
					}
				}
			});

			if (error) throw error;

			// 2. Warte auf die erfolgreiche Erstellung des Benutzers
			if (data.user) {
				// 3. Profil in der profiles-Tabelle erstellen
				const { error: profileError } = await supabase
					.from('profiles')
					.insert([
						{
							id: data.user.id,
							username: credentials.username,
							email: credentials.email,
							updated_at: new Date().toISOString()
						}
					]);

				if (profileError) {
					// Wenn das Profil nicht erstellt werden kann, lösche den Benutzer
					await supabase.auth.admin.deleteUser(data.user.id);
					throw profileError;
				}
			} else {
				throw new Error('Benutzer konnte nicht erstellt werden');
			}
		} catch (error) {
			console.error("Error signing up:", error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const signOut = async () => {
		setLoading(true);
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch (error) {
			console.error("Error signing out:", error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	// Wert für den Context Provider
	const value = {
		supabase,
		session,
		user,
		loading,
		signInWithPassword,
		signUp,
		signOut,
	};

	return (
		<mainContext.Provider value={value}>
			{!loading && children}
		</mainContext.Provider>
	);
}

export default MainProvider;
