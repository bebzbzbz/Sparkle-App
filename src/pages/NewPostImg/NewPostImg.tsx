import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/MainProvider';
import Header from "../../components/Header/Header";
import PopUpSettings from "../../components/PopUpSettings/PopUpSettings";

const NewPostImg = () => {
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
    const [cameraActive, setCameraActive] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    // const { user } = useAuth();
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
        <div className="flex flex-col min-h-screen bg-white">
            <Header 
                headerTitle="Neuer Post" 
                imgLeft="arrow-back" 
                leftAction={() => navigate(-1)}
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
                <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square flex items-center justify-center relative">
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
                        <div className="text-center p-4 text-gray-400">Kein Medium ausgewählt</div>
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                </div>
                <div className="flex gap-2 justify-center">
                    {cameraActive ? (
                        <button
                            onClick={takePicture}
                            className="bg-main text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                            </svg>
                            Foto aufnehmen
                        </button>
                    ) : (
                        <button
                            onClick={startCamera}
                            className="bg-main text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Kamera starten
                        </button>
                    )}
                    <label htmlFor="file-upload" className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-semibold flex items-center gap-2 cursor-pointer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Aus Datei wählen
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>
                {selectedMedia && mediaType && (
                    <button
                        onClick={handleContinue}
                        className="bg-main text-white w-full py-3 rounded-md font-medium mt-4"
                    >
                        Weiter
                    </button>
                )}
            </main>
        </div>
    );
}

export default NewPostImg;