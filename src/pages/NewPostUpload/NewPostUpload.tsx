import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, mainContext } from "../../context/MainProvider";
import Header from "../../components/Header/Header";
import PopUpSettings from "../../components/PopUpSettings/PopUpSettings";

const NewPostUpload = () => {
    const [postMedia, setPostMedia] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
    const [caption, setCaption] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    
    // Social Media Sharing
    const [sharingOptions, setSharingOptions] = useState({
        facebook: false,
        twitter: false,
        instagram: false,
        tiktok: false,
        tumblr: false,
        bluesky: false
    });

    const { user, supabase } = useAuth();
    const { loggedInUser } = useContext(mainContext);
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Medien aus dem sessionStorage laden
    useEffect(() => {
        const savedMedia = sessionStorage.getItem("newPostMedia");
        const savedMediaType = sessionStorage.getItem("newPostMediaType") as 'image' | 'video' | null;
        
        if (!savedMedia || !savedMediaType) {
            // Kein Medium vorhanden - zurück zur Medienauswahl
            navigate("/newpost"); 
            return;
        }
        setPostMedia(savedMedia);
        setMediaType(savedMediaType);
    }, [navigate]);

    // Sharing-Optionen ändern
    const toggleSharingOption = (platform: keyof typeof sharingOptions) => {
        setSharingOptions(prev => ({
            ...prev,
            [platform]: !prev[platform]
        }));
    };

    // Post hochladen
    const handleUpload = async () => {
        if (!postMedia || !mediaType || !user || !supabase) {
            setError("Medien- oder Benutzerdaten fehlen. Bitte versuche es erneut.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Medium in Supabase Storage hochladen
            // Medium von Base64 zu Blob konvertieren
            const base64Data = postMedia.split(",")[1];
            // Determine MIME type from base64 string or mediaType state
            let mimeType = 'application/octet-stream'; // Default
            let fileExtension = '';
            if (mediaType === 'image') {
                // Simple check, more robust checking might be needed
                const match = postMedia.match(/data:(image\/\w+);base64,/);
                mimeType = match ? match[1] : 'image/jpeg'; 
                fileExtension = mimeType.split('/')[1] || 'jpg';
            } else if (mediaType === 'video') {
                const match = postMedia.match(/data:(video\/\w+);base64,/);
                mimeType = match ? match[1] : 'video/mp4';
                fileExtension = mimeType.split('/')[1] || 'mp4';
            }
            
            const blob = await fetch(`data:${mimeType};base64,${base64Data}`).then(res => res.blob());
            
            // Eindeutigen Dateinamen generieren
            const fileName = `${user.id}_${Date.now()}.${fileExtension}`;
            
            // Medium in Supabase Storage hochladen (im "post-bucket" Bucket)
            const { error: storageError } = await supabase.storage
                .from("post-bucket") // Corrected bucket name
                .upload(fileName, blob, { contentType: mimeType });
                
            if (storageError) {
                console.error("Storage Upload Error:", storageError); // Log the specific storage error
                throw storageError; // Re-throw the error
            }
            
            // URL des hochgeladenen Mediums
            const mediaUrl = `${supabase.storage.from("post-bucket").getPublicUrl(fileName).data.publicUrl}`; // Corrected bucket name
            
            // DEBUG: Log user ID before insert
            console.log("Attempting insert for user:", user?.id);
            if (!user?.id) {
                throw new Error("User ID is missing before insert attempt.");
            }
            
            // 2. Post-Eintrag in der Datenbank erstellen
            // ** Wichtig: Sicherstellen, dass die "posts" Tabelle die Spalten
            //    `post_media_url` (TEXT) und `media_type` (TEXT) hat! **
            const { error: insertError } = await supabase
                .from("posts")
                .insert([
                    {
                        user_id: user.id,
                        post_desc: caption,
                        post_media_url: mediaUrl, // Use the new column name
                        media_type: mediaType,    // Store the media type
                        location: location || null, 
                        social_sharing: sharingOptions
                    }
                ]);
                
            if (insertError) {
                console.error("DB Insert Error:", insertError);
                // Versuch, das hochgeladene Storage-Objekt zu löschen, wenn DB-Insert fehlschlägt
                await supabase.storage.from("post-bucket").remove([fileName]); // Corrected bucket name
                throw insertError; 
            }
            
            // Erfolg - Medien aus sessionStorage entfernen
            sessionStorage.removeItem("newPostMedia");
            sessionStorage.removeItem("newPostMediaType");
            
            setSuccess(true);
            
            // Nach kurzer Verzögerung zur Homepage navigieren
            setTimeout(() => {
                navigate("/home");
            }, 1500);
            
        } catch (err: any) {
            console.error("Fehler beim Upload:", err);
            setError(err.message || "Beim Hochladen ist ein Fehler aufgetreten.");
        } finally {
            setLoading(false);
        }
    };

    // Falls noch kein Medium geladen
    if (!postMedia) {
        return <div className="p-4">Lade...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header 
                headerTitle="Post erstellen" 
                imgLeft="arrow-back" 
                leftLinkDestination="home"
                iconsRight={[
                    { name: "options", onClick: () => setIsSettingsOpen(true), alt: "Optionen" }
                ]}
            />
            <PopUpSettings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            <main className="flex-1 p-4 flex flex-col gap-6 max-w-lg w-full mx-auto">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                        Dein Post wurde erfolgreich hochgeladen!
                    </div>
                )}
                <div className="flex mb-6 items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                            src={loggedInUser?.profile_image_url || "/svg/pic-empty.svg"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <textarea
                        placeholder="Bildbeschreibung..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="flex-1 h-16 p-2 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-main"
                        disabled={loading}
                    />
                    <div className="w-16 h-16 rounded-md overflow-hidden">
                        {mediaType === 'image' ? (
                            <img
                                src={postMedia}
                                alt="Post Preview"
                                className="w-full h-full object-cover"
                            />
                        ) : mediaType === 'video' ? (
                            <video
                                src={postMedia}
                                muted
                                className="w-full h-full object-cover"
                            />
                        ) : null}
                    </div>
                </div>
                <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-4">
                    <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Standort hinzufügen"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="flex-1 p-2 focus:outline-none"
                        disabled={loading}
                    />
                </div>
                <div className="mb-2">
                    <p className="text-gray-700 font-medium mb-3">Auch posten auf</p>
                    <div className="space-y-2">
                        {Object.keys(sharingOptions).map((platform) => (
                            <div key={platform} className="flex items-center justify-between">
                                <span className="text-gray-800 capitalize">{platform}</span>
                                <button
                                    onClick={() => toggleSharingOption(platform as keyof typeof sharingOptions)}
                                    className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                                        sharingOptions[platform as keyof typeof sharingOptions] ? "bg-main" : "bg-gray-200"
                                    }`}
                                    disabled={loading}
                                >
                                    <span
                                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                            sharingOptions[platform as keyof typeof sharingOptions] ? "translate-x-6" : "translate-x-1"
                                        }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="pt-0 mt-0">
                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className={`w-full py-3 rounded-md font-medium text-white ${
                            loading ? "bg-main/60" : "bg-main"
                        }`}
                    >
                        {loading ? "Hochladen..." : "Posten"}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default NewPostUpload;