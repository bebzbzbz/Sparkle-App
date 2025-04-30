import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth, mainContext } from "../../context/MainProvider";
import Header from "../../components/Header/Header";
import PopUpSettings from "../../components/PopUpSettings/PopUpSettings";
import IPost from "../../interfaces/IPost";

const NewPost = () => {
  const [postMedia, setPostMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [searchParams] = useSearchParams();

  // Social Media Sharing
  const [sharingOptions, setSharingOptions] = useState({
    facebook: false,
    twitter: false,
    instagram: false,
    tiktok: false,
    tumblr: false,
    bluesky: false,
  });

  const { user, supabase } = useAuth();
  const { loggedInUser } = useContext(mainContext);
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Prüfe, ob wir im Bearbeitungsmodus sind
  useEffect(() => {
    const editMode = searchParams.get("edit") === "true";
    setIsEditing(editMode);

    if (editMode) {
      const storedPost = sessionStorage.getItem("editPost");
      if (storedPost) {
        const post: IPost = JSON.parse(storedPost);
        setEditPostId(post.id);
        setPostMedia(post.post_media_url);
        setMediaType(post.media_type as "image" | "video" | null);
        setCaption(post.post_desc || "");
        setLocation(post.location || "");
        setSharingOptions({
          facebook: false,
          twitter: false,
          instagram: false,
          tiktok: false,
          tumblr: false,
          bluesky: false,
          ...post.social_sharing,
        });
      }
    }
  }, [searchParams]);

  // Kamera aktivieren
  const startCamera = async () => {
    try {
      setCameraActive(true);
      setPostMedia(null);
      setMediaType(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Fehler beim Zugriff auf die Kamera:", err);
      setError(
        "Kamera konnte nicht gestartet werden. Bitte erlaube den Zugriff auf die Kamera."
      );
      setCameraActive(false);
    }
  };

  // Kamera stoppen, wenn Komponente unmounted
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Foto aufnehmen
  const takePicture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Canvas-Größe an Video anpassen
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Video-Frame auf Canvas zeichnen
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Canvas in Daten-URL umwandeln
    const imgUrl = canvas.toDataURL("image/jpeg");
    setPostMedia(imgUrl);
    setMediaType("image");

    // Kamera ausschalten
    if (video.srcObject) {
      const tracks = (video.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
    setCameraActive(false);
  };

  // Datei-Upload (Bild oder Video)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setCameraActive(false);

    const fileType = file.type.split("/")[0];

    if (fileType !== "image" && fileType !== "video") {
      setError("Bitte wähle ein Bild- oder Video-Format.");
      setPostMedia(null);
      setMediaType(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPostMedia(event.target.result as string);
        setMediaType(fileType as "image" | "video");
      }
    };
    reader.onerror = () => {
      setError("Fehler beim Lesen der Datei.");
      setPostMedia(null);
      setMediaType(null);
    };
    reader.readAsDataURL(file);
  };

  // Post hochladen oder aktualisieren
  const handleUpload = async () => {
    if (!postMedia || !mediaType || !user || !supabase) {
      setError("Medien- oder Benutzerdaten fehlen. Bitte versuche es erneut.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let mediaUrl = postMedia;

      // Nur hochladen, wenn es sich um eine neue Datei handelt
      if (postMedia.startsWith("data:")) {
        const base64Data = postMedia.split(",")[1];
        let mimeType = "application/octet-stream";
        let fileExtension = "";
        if (mediaType === "image") {
          const match = postMedia.match(/data:(image\/\w+);base64,/);
          mimeType = match ? match[1] : "image/jpeg";
          fileExtension = mimeType.split("/")[1] || "jpg";
        } else if (mediaType === "video") {
          const match = postMedia.match(/data:(video\/\w+);base64,/);
          mimeType = match ? match[1] : "video/mp4";
          fileExtension = mimeType.split("/")[1] || "mp4";
        }

        const blob = await fetch(`data:${mimeType};base64,${base64Data}`).then(
          (res) => res.blob()
        );
        const fileName = `${user.id}_${Date.now()}.${fileExtension}`;

        const { error: storageError } = await supabase.storage
          .from("post-bucket")
          .upload(fileName, blob, { contentType: mimeType });

        if (storageError) {
          console.error("Storage Upload Error:", storageError);
          throw storageError;
        }

        mediaUrl = `${
          supabase.storage.from("post-bucket").getPublicUrl(fileName).data
            .publicUrl
        }`;
      }

      if (!user?.id) {
        throw new Error("User ID is missing before insert attempt.");
      }

      if (isEditing && editPostId) {
        // Update existing post
        const { error: updateError } = await supabase
          .from("posts")
          .update({
            post_desc: caption,
            post_media_url: mediaUrl,
            media_type: mediaType,
            location: location || null,
            social_sharing: sharingOptions,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editPostId);

        if (updateError) {
          throw updateError;
        }
      } else {
        // Create new post
        const { error: insertError } = await supabase.from("posts").insert([
          {
            user_id: user.id,
            post_desc: caption,
            post_media_url: mediaUrl,
            media_type: mediaType,
            location: location || null,
            social_sharing: sharingOptions,
          },
        ]);

        if (insertError) {
          throw insertError;
        }
      }

      setSuccess(true);
      sessionStorage.removeItem("editPost");

      // Navigiere zur Home-Seite und lade sie neu
      window.location.href = "/home";
    } catch (err: any) {
      console.error("Fehler beim Upload:", err);
      setError(err.message || "Beim Hochladen ist ein Fehler aufgetreten.");
    } finally {
      setLoading(false);
    }
  };

  // Sharing-Optionen ändern
  const toggleSharingOption = (platform: keyof typeof sharingOptions) => {
    setSharingOptions((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header
        headerTitle={isEditing ? "Post bearbeiten" : "Post erstellen"}
        imgLeft="arrow-back"
        leftAction={() => navigate(-1)}
        iconsRight={[
          {
            name: "options",
            onClick: () => setIsSettingsOpen(true),
            alt: "Optionen",
          },
        ]}
      />
      <PopUpSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
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
        <div className="flex justify-center">
          <div className="bg-gray-100 max-h-[300px] max-w-[300px] rounded-xl overflow-hidden aspect-square flex items-center justify-center relative">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : postMedia ? (
              mediaType === "image" ? (
                <img
                  src={postMedia}
                  alt="Ausgewähltes Bild"
                  className="w-full h-full object-cover"
                />
              ) : mediaType === "video" ? (
                <video
                  src={postMedia}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : null
            ) : (
              <div className="text-center p-4 text-gray-400">
                Kein Medium ausgewählt
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
        <div className="flex gap-2 justify-center">
          {cameraActive ? (
            <button
              onClick={takePicture}
              className="bg-main text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
              </svg>
              Foto aufnehmen
            </button>
          ) : (
            <button
              onClick={startCamera}
              className="bg-main text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          )}
          <label
            htmlFor="file-upload"
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-semibold flex items-center gap-2 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <input
              id="file-upload"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        {
          <>
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
            </div>
            <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-4">
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
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
                  <div
                    key={platform}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-800 capitalize">{platform}</span>
                    <button
                      onClick={() =>
                        toggleSharingOption(
                          platform as keyof typeof sharingOptions
                        )
                      }
                      className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                        sharingOptions[platform as keyof typeof sharingOptions]
                          ? "bg-main"
                          : "bg-gray-200"
                      }`}
                      disabled={loading}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          sharingOptions[
                            platform as keyof typeof sharingOptions
                          ]
                            ? "translate-x-6"
                            : "translate-x-1"
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
                {loading
                  ? "Wird gespeichert..."
                  : isEditing
                  ? "edit"
                  : "post it"}
              </button>
            </div>
          </>
        }
      </main>
    </div>
  );
};

export default NewPost;
