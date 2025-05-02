import { createContext, useState, useEffect, useContext } from "react";
import { Session, User } from '@supabase/supabase-js';
import supabase from '../utils/supabase';
import IUser from "../interfaces/IUser";

interface SignUpParams {
	email: string;
	password: string;
	username: string;
	options?: any;
}

// Typdefinition für den Context-Wert
interface AuthContextType {
	supabase: typeof supabase;
	session: Session | null;
	user: User | null;
	setUser: (user: User | null) => void; // Hinzugefügt
	loading: boolean;
	signInWithPassword: (credentials: { email: string; password: string }) => Promise<any>;
	signUp: (credentials: { email: string; password: string; username: string; options?: any }) => Promise<any>;
	signOut: () => Promise<any>;
	allSearchedProfiles: IUser[] | null,
	setAllSearchedProfiles: (allSearchedProfiles: IUser[] | null) => void,
	loggedInUser: IUser | null,
	setLoggedInUser: (loggedInUser: IUser | null) => void,
	openModal: boolean,
	setOpenModal: (openModal: boolean) => void,
	modalId: string,
	setModalId: (modalId: string) => void,
}

// Context erstellen mit einem initialen Defaultwert
export const mainContext = createContext<AuthContextType>({
	supabase,
	session: null,
	user: null,
	setUser: () => { },
	loading: true,
	signInWithPassword: async () => { },
	signUp: async () => { },
	signOut: async () => { },
	allSearchedProfiles: null,
	setAllSearchedProfiles: () => { },
	loggedInUser: null,
	setLoggedInUser: () => { },
	openModal: false,
	setOpenModal: () => { },
	modalId: "",
	setModalId: () => { },
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
	const [openModal, setOpenModal] = useState<boolean>(false)
	const [modalId, setModalId] = useState<string>("")

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

	// User-Profil laden, wenn Session existiert
	useEffect(() => {
		const fetchProfile = async () => {
			try {
				if (session?.user) {
					const { data, error } = await supabase
						.from('profiles')
						.select('*')
						.eq('id', session.user.id)
						.maybeSingle();

					if (error) {
						console.error('Error fetching profile:', error);
						return;
					}

					if (data) {
						setLoggedInUser(data);
					}
				}
			} catch (error) {
				console.error('Error in fetchProfile:', error);
			}
		};

		fetchProfile();
	}, [session]);

	// --- Authentifizierungsfunktionen ---

	const signInWithPassword = async (credentials: { email: string; password: string }) => {
		try {
			// Prüfen ob die Eingabe eine E-Mail-Adresse ist
			const isEmail = credentials.email.includes('@');
			let loginEmail = credentials.email;

			// Wenn es kein E-Mail ist, hole die E-Mail-Adresse anhand des Benutzernamens
			if (!isEmail) {
				const { data: profile, error: profileError } = await supabase
					.from('profiles')
					.select('email')
					.ilike('username', credentials.email)
					.single();

				if (profileError || !profile) {
					return {
						data: null,
						error: 'Benutzername oder E-Mail-Adresse nicht gefunden'
					};
				}

				loginEmail = profile.email;
			}

			// Login mit der E-Mail durchführen
			const { data, error } = await supabase.auth.signInWithPassword({
				email: loginEmail,
				password: credentials.password
			});

			if (error) {
				console.error('SignIn Error:', error);
				return {
					data: null,
					error: 'Ungültige Anmeldedaten'
				};
			}

			// Profildaten laden
			if (data.user) {
				const { data: profileData } = await supabase
					.from('profiles')
					.select('*')
					.eq('id', data.user.id)
					.single();

				if (profileData) {
					setLoggedInUser(profileData);
				}
			}

			return { data, error: null };
		} catch (error: any) {
			console.error('Error signing in:', error);
			return {
				data: null,
				error: 'Ein Fehler ist bei der Anmeldung aufgetreten'
			};
		}
	};

	const signUp = async ({ email, password, username }: SignUpParams) => {
		try {
			// 1. Prüfen ob E-Mail oder Username bereits existieren
			const { data: existingProfiles, error: checkError } = await supabase
				.from('profiles')
				.select('email, username')
				.or(`email.ilike.${email},username.ilike.${username}`);

			if (checkError) {
				console.error('Error checking existing profiles:', checkError);
				return { data: null, error: checkError.message };
			}

			if (existingProfiles && existingProfiles.length > 0) {
				// Prüfen ob die exakte Kombination existiert
				const exactMatch = existingProfiles.find(
					profile =>
						profile.email?.toLowerCase() === email.toLowerCase() &&
						profile.username?.toLowerCase() === username.toLowerCase()
				);

				if (exactMatch) {
					return {
						data: null,
						error: 'This username with this email address is already registered'
					};
				}

				// Prüfen ob die E-Mail bereits existiert
				const emailExists = existingProfiles.some(
					profile => profile.email?.toLowerCase() === email.toLowerCase()
				);
				if (emailExists) {
					return {
						data: null,
						error: 'This email address is already in use'
					};
				}

				// Prüfen ob der Username bereits existiert
				const usernameExists = existingProfiles.some(
					profile => profile.username?.toLowerCase() === username.toLowerCase()
				);
				if (usernameExists) {
					return {
						data: null,
						error: 'This username is already in use'
					};
				}
			}

			// 2. Benutzer in Auth erstellen
			const { data: authData, error: signUpError } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						username,
						email
					}
				}
			});

			if (signUpError) {
				console.error('Auth signup error:', signUpError);
				return { data: null, error: signUpError.message };
			}

			if (!authData?.user) {
				return { data: null, error: 'No user data returned' };
			}

			// 3. Profil erstellen mit upsert
			const { error: profileError } = await supabase
				.from('profiles')
				.upsert({
					id: authData.user.id,
					username,
					email,
					updated_at: new Date().toISOString(),
					created_at: new Date().toISOString()
				}, {
					onConflict: 'id',
					ignoreDuplicates: false
				});

			if (profileError) {
				console.error('Profile creation error:', profileError);
				// Bei Fehler den Auth-User löschen
				const { error: deleteError } = await supabase.auth.admin.deleteUser(authData.user.id);
				if (deleteError) {
					console.error('Error deleting auth user after profile creation failed:', deleteError);
				}
				return { data: null, error: 'An error occurred during profile creation' };
			}

			// 4. Erfolgreich registriert
			return { data: authData, error: null };

		} catch (error: any) {
			console.error('Error signing up:', error);
			return {
				data: null,
				error: error.message || 'An error occurred during registration'
			};
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

	const [allSearchedProfiles, setAllSearchedProfiles] = useState<IUser[] | null>(null)
	const [loggedInUser, setLoggedInUser] = useState<IUser | null>(null)

	// Wert für den Context Provider
	const value = {
		supabase,
		session,
		user,
		setUser,
		loading,
		signInWithPassword,
		signUp,
		signOut,
		allSearchedProfiles,
		setAllSearchedProfiles,
		loggedInUser,
		setLoggedInUser,
		setModalId,
		modalId,
		setOpenModal,
		openModal
	};

	return (
		<mainContext.Provider value={value}>
			{!loading && children}
		</mainContext.Provider>
	);
}

export default MainProvider;
