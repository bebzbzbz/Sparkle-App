import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/MainProvider';

const NewPostImg = () => {
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
    const [cameraActive, setCameraActive] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const { user } = useAuth();
    const navigate = useNavigate();

    // Kamera aktivieren
    const startCamera = async () => {
        try {
            setCameraActive(true);
            setSelectedMedia(null);
            setMediaType(null);
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error('Fehler beim Zugriff auf die Kamera:', err);
            setError('Kamera konnte nicht gestartet werden. Bitte erlaube den Zugriff auf die Kamera.');
            setCameraActive(false);
        }
    };

    // Kamera stoppen, wenn Komponente unmounted
    useEffect(() => {
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    // Foto aufnehmen
    const takePicture = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        // Canvas-Größe an Video anpassen
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Video-Frame auf Canvas zeichnen
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Canvas in Daten-URL umwandeln
        const imgUrl = canvas.toDataURL('image/jpeg');
        setSelectedMedia(imgUrl);
        setMediaType('image');
        
        // Kamera ausschalten
        if (video.srcObject) {
            const tracks = (video.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
        }
        setCameraActive(false);
    };

    // Datei-Upload (Bild oder Video)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setError(null);
        setCameraActive(false);

        const fileType = file.type.split('/')[0];

        if (fileType !== 'image' && fileType !== 'video') {
            setError('Bitte wähle ein Bild- oder Video-Format.');
            setSelectedMedia(null);
            setMediaType(null);
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setSelectedMedia(event.target.result as string);
                setMediaType(fileType as 'image' | 'video');
            }
        };
         reader.onerror = () => {
            setError("Fehler beim Lesen der Datei.");
            setSelectedMedia(null);
            setMediaType(null);
        };
        reader.readAsDataURL(file);
    };

    // Weiter zum nächsten Schritt
    const handleContinue = () => {
        if (!selectedMedia || !mediaType) {
            setError('Bitte wähle zuerst ein Bild oder Video aus oder mache ein Foto.');
            return;
        }
        
        // Medien-Daten und Typ im sessionStorage speichern
        sessionStorage.setItem('newPostMedia', selectedMedia);
        sessionStorage.setItem('newPostMediaType', mediaType);
        
        // Zur Upload-Seite navigieren
        navigate('/newpost/upload');
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 p-4 flex items-center">
                <button 
                    onClick={() => navigate(-1)} 
                    className="mr-4"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h1 className="text-xl font-semibold">New Post</h1>
            </header>

            {/* Hauptinhalt */}
            <main className="flex-1 p-4 flex flex-col">
                {/* Fehleranzeige */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                {/* Medien-Vorschau oder Kamera */}
                <div className="bg-gray-200 rounded-lg overflow-hidden aspect-square mb-4 flex items-center justify-center relative">
                    {cameraActive ? (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                    ) : selectedMedia ? (
                        mediaType === 'image' ? (
                             <img 
                                src={selectedMedia} 
                                alt="Ausgewähltes Bild" 
                                className="w-full h-full object-cover" 
                            />
                        ) : mediaType === 'video' ? (
                            <video 
                                src={selectedMedia} 
                                controls
                                className="w-full h-full object-cover" 
                            />
                        ) : null
                    ) : (
                        <div className="text-center p-4">
                            <p className="text-gray-500 mb-2">Kein Medium ausgewählt</p>
                        </div>
                    )}

                    {/* Unsichtbares Canvas für Foto-Aufnahme */}
                    <canvas ref={canvasRef} className="hidden" />
                </div>

                {/* Aktionsbutton (Kamera starten ODER Foto aufnehmen) */}
                <div className="my-4 flex justify-center">
                    {cameraActive ? (
                        <button
                            onClick={takePicture}
                            className="bg-red-500 text-white px-6 py-3 rounded-full flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                            </svg>
                            Take picture
                        </button>
                    ) : (
                        <button
                            onClick={startCamera}
                            className="bg-red-500 text-white px-6 py-3 rounded-full flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Take picture
                        </button>
                    )}
                </div>

                {/* Galerie-Upload (Bild oder Video) */}
                <div className="mt-2 mb-4 flex items-center justify-center">
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="flex items-center text-gray-700">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                {/* Benutzerinfos und Beschreibung (statisch für Mockup) */}
                {selectedMedia && (
                    <div className="mt-4 flex">
                        {/* Profilbild */}
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                            <img 
                                src={`https://supabase.storage/profiles/${user?.id}.jpg`} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Fallback bei Bild-Ladefehler
                                    const target = e.target as HTMLImageElement;
                                    target.src = "https://via.placeholder.com/40";
                                }}
                            />
                        </div>

                        {/* Beispiel-Text */}
                        <div className="flex-1">
                            <p className="text-sm text-gray-800">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                                do eiusmod tempor incididunt ut labore et dolore magna
                                aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing
                                elit, sed do eiusmod tempor
                            </p>
                            <p className="mt-2 text-sm text-gray-800">
                                #girl #girls #babygirl #girlpower #girlswhollift
                                #polishgirl #girlboss #girly #girlfriend #fitgirl
                                #birthdaygirl #instagirl #girlsnight #animegirl #mygirl
                            </p>
                        </div>

                        {/* Zweites Profilbild (rechts) */}
                        <div className="w-12 h-12 rounded-full overflow-hidden ml-3">
                            <img 
                                src="https://supabase.storage/profiles/anny_wilson.jpg" 
                                alt="Second profile" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Fallback bei Bild-Ladefehler
                                    const target = e.target as HTMLImageElement;
                                    target.src = "https://via.placeholder.com/40";
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* "Weiter"-Button (nur anzeigen, wenn ein Medium ausgewählt ist) */}
                {selectedMedia && mediaType && (
                    <div className="mt-6">
                        <button
                            onClick={handleContinue}
                            className="bg-red-500 text-white w-full py-3 rounded-md font-medium"
                        >
                            Continue
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default NewPostImg;