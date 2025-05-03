import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/MainProvider";
import Header from "../../components/Header/Header";
import PopUpSettings from "../../components/PopUpSettings/PopUpSettings";
import IPost from "../../interfaces/IPost";
import Compressor from "compressorjs";

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
  // const { loggedInUser } = useContext(mainContext);
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
        "Camera launch failed. Please allow camera access."
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

    if (fileType === "image") {
      new Compressor(file, {
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1920,
        success(result) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setPostMedia(event.target.result as string);
              setMediaType("image");
            }
          };
          reader.onerror = () => {
            setError("Fehler beim Lesen der Datei.");
            setPostMedia(null);
            setMediaType(null);
          };
          reader.readAsDataURL(result);
        },
        error(err) {
          console.error("Fehler bei der Komprimierung:", err);
          setError("Fehler bei der Bildkomprimierung.");
          setPostMedia(null);
          setMediaType(null);
        },
      });
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPostMedia(event.target.result as string);
          setMediaType("video");
        }
      };
      reader.onerror = () => {
        setError("Fehler beim Lesen der Datei.");
        setPostMedia(null);
        setMediaType(null);
      };
      reader.readAsDataURL(file);
    }
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
      window.location.href = "/profile";
    } catch (err: any) {
      console.error("Fehler beim Upload:", err);
      setError(err.message || "Beim Hochladen ist ein Fehler aufgetreten.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header
        headerTitle={isEditing ? "Edit Post" : "Create Post"}
        imgLeft={<svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1L1.24808 6.16795C0.654343 6.56377 0.654342 7.43623 1.24808 7.83205L9 13" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>}
        leftAction={() => navigate(-1)}
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
            Posted successfully!
          </div>
        )}
        <div className="flex justify-center">
          <div className="bg-gray-100 w-full rounded-xl overflow-hidden aspect-square flex items-center justify-center relative">
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
                Choose a medium
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
            <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="13" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M2 13.3636C2 10.2994 2 8.76721 2.74902 7.6666C3.07328 7.19014 3.48995 6.78104 3.97524 6.46268C4.69555 5.99013 5.59733 5.82123 6.978 5.76086C7.63685 5.76086 8.20412 5.27068 8.33333 4.63636C8.52715 3.68489 9.37805 3 10.3663 3H13.6337C14.6219 3 15.4728 3.68489 15.6667 4.63636C15.7959 5.27068 16.3631 5.76086 17.022 5.76086C18.4027 5.82123 19.3044 5.99013 20.0248 6.46268C20.51 6.78104 20.9267 7.19014 21.251 7.6666C22 8.76721 22 10.2994 22 13.3636C22 16.4279 22 17.9601 21.251 19.0607C20.9267 19.5371 20.51 19.9462 20.0248 20.2646C18.9038 21 17.3433 21 14.2222 21H9.77778C6.65675 21 5.09624 21 3.97524 20.2646C3.48995 19.9462 3.07328 19.5371 2.74902 19.0607C2.53746 18.7498 2.38566 18.4045 2.27673 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M19 10H18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              Take a photo
            </button>
          ) : (
            <button
              onClick={startCamera}
              className="bg-main text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2"
            >
              <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="13" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M2 13.3636C2 10.2994 2 8.76721 2.74902 7.6666C3.07328 7.19014 3.48995 6.78104 3.97524 6.46268C4.69555 5.99013 5.59733 5.82123 6.978 5.76086C7.63685 5.76086 8.20412 5.27068 8.33333 4.63636C8.52715 3.68489 9.37805 3 10.3663 3H13.6337C14.6219 3 15.4728 3.68489 15.6667 4.63636C15.7959 5.27068 16.3631 5.76086 17.022 5.76086C18.4027 5.82123 19.3044 5.99013 20.0248 6.46268C20.51 6.78104 20.9267 7.19014 21.251 7.6666C22 8.76721 22 10.2994 22 13.3636C22 16.4279 22 17.9601 21.251 19.0607C20.9267 19.5371 20.51 19.9462 20.0248 20.2646C18.9038 21 17.3433 21 14.2222 21H9.77778C6.65675 21 5.09624 21 3.97524 20.2646C3.48995 19.9462 3.07328 19.5371 2.74902 19.0607C2.53746 18.7498 2.38566 18.4045 2.27673 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M19 10H18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
          )}
          <label
            htmlFor="file-upload"
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-semibold flex items-center gap-2 cursor-pointer"
          >
            <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.1935 16.793C20.8437 19.2739 20.6689 20.5143 19.7717 21.2572C18.8745 22 17.5512 22 14.9046 22H9.09536C6.44881 22 5.12553 22 4.22834 21.2572C3.33115 20.5143 3.15626 19.2739 2.80648 16.793L2.38351 13.793C1.93748 10.6294 1.71447 9.04765 2.66232 8.02383C3.61017 7 5.29758 7 8.67239 7H15.3276C18.7024 7 20.3898 7 21.3377 8.02383C22.0865 8.83268 22.1045 9.98979 21.8592 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M19.5617 7C19.7904 5.69523 18.7863 4.5 17.4617 4.5H6.53788C5.21323 4.5 4.20922 5.69523 4.43784 7" stroke="currentColor" stroke-width="1.5"/><path d="M17.4999 4.5C17.5283 4.24092 17.5425 4.11135 17.5427 4.00435C17.545 2.98072 16.7739 2.12064 15.7561 2.01142C15.6497 2 15.5194 2 15.2588 2H8.74099C8.48035 2 8.35002 2 8.24362 2.01142C7.22584 2.12064 6.45481 2.98072 6.45704 4.00434C6.45727 4.11135 6.47146 4.2409 6.49983 4.5" stroke="currentColor" stroke-width="1.5"/><circle cx="16.5" cy="11.5" r="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M19.9999 20L17.1157 17.8514C16.1856 17.1586 14.8004 17.0896 13.7766 17.6851L13.5098 17.8403C12.7984 18.2542 11.8304 18.1848 11.2156 17.6758L7.37738 14.4989C6.6113 13.8648 5.38245 13.8309 4.5671 14.4214L3.24316 15.3803" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
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
              <textarea
                placeholder="Share your thoughts..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="flex-1 h-16 p-2 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-main"
                disabled={loading}
              />
            </div>
            <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-2">
            <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4.71053C6.78024 5.42105 8.38755 7.36316 8.57481 9.44737C8.70011 10.8421 9.39473 12.0496 10.5 12.631C10.9386 12.8618 11.4419 12.9939 12 13C12.7549 13.0082 13.5183 12.4629 13.5164 11.708C13.5158 11.4745 13.4773 11.2358 13.417 11.0163C13.3331 10.7108 13.3257 10.3595 13.5 10C14.1099 8.74254 15.3094 8.40477 16.2599 7.72186C16.6814 7.41898 17.0659 7.09947 17.2355 6.84211C17.7037 6.13158 18.1718 4.71053 17.9377 4" stroke="currentColor" stroke-width="1.5"/><path d="M22 13C21.6706 13.931 21.4375 16.375 17.7182 16.4138C17.7182 16.4138 16.9248 16.4138 16 16.6339M13.4365 18.2759C12.646 19.7655 13.1071 21.3793 13.4365 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7 20.6622C8.47087 21.513 10.1786 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              <input
                type="text"
                placeholder="Add a location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 p-2 focus:outline-none"
                disabled={loading}
              />
            </div>
            {/* <div className="mb-2">
              <p className="text-gray-700 font-medium mb-3">Also share on</p>
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
            </div> */}
            <div className="pt-0 mt-0">
              <button
                onClick={handleUpload}
                disabled={loading}
                className={`w-full py-3 rounded-md font-medium text-white ${
                  loading ? "bg-main/60" : "bg-main"
                }`}
              >
                {loading ? "Saving..." : isEditing ? "Edit" : "Post"}
              </button>
            </div>
          </>
        }
      </main>
    </div>
  );
};

export default NewPost;
