import { createContext, useState, useEffect, useContext } from "react";
import { Session, User, createClient, SupabaseClient } from '@supabase/supabase-js';

// Typdefinition für den Context-Wert
interface AuthContextType {
  supabase: SupabaseClient | null;
  session: Session | null;
  user: User | null;
  loading: boolean;
  signInWithPassword: (credentials: { email: string; password: string }) => Promise<any>; // Typisierung verbessern, wenn Rückgabetyp bekannt
  signUp: (credentials: { email: string; password: string; options?: any }) => Promise<any>; // Typisierung verbessern
  signOut: () => Promise<any>;
}

// Context erstellen mit einem initialen Defaultwert
export const mainContext = createContext<AuthContextType>({
  supabase: null,
  session: null,
  user: null,
  loading: true,
  signInWithPassword: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

// Hilfsfunktion zum Abrufen des Contexts
export const useAuth = () => {
    const context = useContext(mainContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};


const MainProvider = ({children} : {children:React.ReactNode}) => {
    const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Supabase Client initialisieren
    useEffect(() => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error("Supabase URL or Anon Key is missing in .env file");
            setLoading(false);
            return;
        }

        const client = createClient(supabaseUrl, supabaseAnonKey);
        setSupabase(client);

        // Aktuelle Session abrufen
        client.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        });

        // Auf Auth-Änderungen hören
        const { data: authListener } = client.auth.onAuthStateChange(
          async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false); // Ladezustand aktualisieren, wenn sich der Auth-Status ändert
          }
        );

        // Listener beim Unmount bereinigen
        return () => {
          authListener?.subscription.unsubscribe();
        };
      }, []);


    // --- Authentifizierungsfunktionen ---

    const signInWithPassword = async (credentials: { email: string; password: string }) => {
        if (!supabase) throw new Error("Supabase client not initialized");
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword(credentials);
            if (error) throw error;
            // Session wird durch den onAuthStateChange Listener aktualisiert
        } catch (error) {
            console.error("Error signing in:", error);
            // Fehlerbehandlung hinzufügen (z.B. State für Fehlermeldung)
            throw error; // Fehler weitergeben, damit UI reagieren kann
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (credentials: { email: string; password: string; options?: any }) => {
        if (!supabase) throw new Error("Supabase client not initialized");
        setLoading(true);
        try {
            // Füge Optionen hinzu, z.B. Metadaten für den Benutzernamen
            const signupOptions = {
                ...credentials.options,
                // Beispiel: Falls ein Benutzername übergeben wird
                // data: { username: credentials.options?.username }
            };
            const { error } = await supabase.auth.signUp({
                email: credentials.email,
                password: credentials.password,
                options: signupOptions,
             });
            if (error) throw error;
            // Benutzer wird durch den onAuthStateChange Listener aktualisiert
            // Ggf. Erfolgsmeldung für E-Mail-Bestätigung anzeigen
        } catch (error) {
            console.error("Error signing up:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        if (!supabase) throw new Error("Supabase client not initialized");
        setLoading(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            // Session/User werden durch den onAuthStateChange Listener auf null gesetzt
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
            {!loading && children} {/* Kinder erst rendern, wenn Initialisierung abgeschlossen */}
        </mainContext.Provider>
    );
}

export default MainProvider;