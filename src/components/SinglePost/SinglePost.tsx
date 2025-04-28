import { useEffect, useState } from "react";
import { useAuth } from "../../context/MainProvider";
import supabase from "../../utils/supabase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import FeedImage from "../FeedImage/FeedImage";
import IPost from "../../interfaces/IPost";
import ProfilePreviewCard from "../ProfilePreviewCard/ProfilePreviewCard";
import IUser from "../../interfaces/IUser";
dayjs.extend(relativeTime);

interface IPostProps {
  post: IPost;
}

const SinglePost = ({ post }: IPostProps) => {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(0);
  const [likedByMe, setLikedByMe] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const [showAllComments, setShowAllComments] = useState(false);
  const [allComments, setAllComments] = useState<any[]>([]);
  // const [commentInput, setCommentInput] = useState("");
  // const [commentLoading, setCommentLoading] = useState(false);
  // Hilfsfunktion: Usernamen zu user_id cachen
  const [userCache, setUserCache] = useState<{ [key: string]: string }>({});

  // Likes und Like-Status laden
  const fetchLikes = async () => {
    const { count } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", post.id);
    setLikesCount(count || 0);
    if (user) {
      const { data: likeData } = await supabase
        .from("likes")
        .select("id")
        .eq("post_id", post.id)
        .eq("user_id", user.id)
        .maybeSingle();
      setLikedByMe(!!likeData);
    }
  };

  // Kommentare laden
  const fetchComments = async () => {
    const { count } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("post_id", post.id);
    setCommentsCount(count || 0);
    const { data: commentData } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", post.id)
      .order("created_at", { ascending: false })
      .limit(2);
    const enriched = await enrichCommentsWithUsernames(commentData || []);
    setComments(enriched);
  };

  // Alle Kommentare für Modal laden
  const fetchAllComments = async () => {
    const { data: all } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", post.id)
      .order("created_at", { ascending: false });
    const enriched = await enrichCommentsWithUsernames(all || []);
    setAllComments(enriched);
  };

  // User-Infos laden
  const fetchUserInfo = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", post.user_id)
      .single();
    setUserInfo(data);
  };

  useEffect(() => {
    fetchLikes();
    fetchComments();
    fetchUserInfo();
    // eslint-disable-next-line
  }, [post.id]);

  const handleLike = async () => {
    if (!user) return;
    if (likedByMe) {
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("likes")
        .insert({ post_id: post.id, user_id: user.id });
    }
    fetchLikes();
  };

  const handleShowAllComments = async () => {
    await fetchAllComments();
    setShowAllComments(true);
  };

  const handleCloseModal = () => {
    setShowAllComments(false);
  };

  const handleEdit = () => {
    // Navigiere zur Edit-Seite oder öffne ein Edit-Modal
    // Beispiel: navigate(`/editpost/${post.id}`)
  };
  const handleDelete = async () => {
    // Lösche den Post aus der Datenbank
    await supabase.from("posts").delete().eq("id", post.id);
    // Optional: Seite neu laden oder Post aus dem State entfernen
  };

  // Kommentar absenden
  // const handleCommentSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!user || !commentInput.trim()) return;
  //   setCommentLoading(true);
  //   try {
  //     await supabase.from("comments").insert({
  //       post_id: post.id,
  //       user_id: user.id,
  //       text_content: commentInput.trim(),
  //       created_at: new Date().toISOString(),
  //       updated_at: new Date().toISOString(),
  //     });
  //     setCommentInput("");
  //     fetchComments();
  //     if (showAllComments) fetchAllComments();
  //   } catch (err) {
  //     // Fehlerbehandlung (optional)
  //   } finally {
  //     setCommentLoading(false);
  //   }
  // };

  // Hilfsfunktion: Usernamen zu user_id cachen
  const getUsername = async (userId: string) => {
    if (userCache[userId]) return userCache[userId];
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", userId)
      .single();
    if (data?.username) {
      setUserCache((prev) => ({ ...prev, [userId]: data.username }));
      return data.username;
    }
    return userId;
  };

  // Kommentare mit Usernamen anreichern
  const enrichCommentsWithUsernames = async (comments: any[]) => {
    const enriched = await Promise.all(
      comments.map(async (c) => {
        let username = userCache[c.user_id];
        if (!username) {
          username = await getUsername(c.user_id);
        }
        return { ...c, username };
      })
    );
    return enriched;
  };

  return (
    <article className="flex flex-col gap-4">
      {userInfo && (
        <ProfilePreviewCard profile={userInfo} geoTag={post.location} />
      )}
      <div>
        {post.media_type === "image" ? (
          <FeedImage
            src={post.post_media_url}
            alt={post.post_desc}
            aspect="square"
            maxSize={1200}
          />
        ) : post.media_type === "video" ? (
          <video
            className="h-full w-full object-cover rounded-4xl aspect-square mb-2 transition ease-in-out hover:opacity-80 hover:drop-shadow-xl cursor-pointer"
            src={post.post_media_url}
            controls
          />
        ) : null}
      </div>

      {post.post_desc && <p>{post.post_desc}</p>}

      {user && user.id === post.user_id && (
        <div className="flex gap-3">
          <button
            onClick={handleEdit}
            className="text-xs text-blue-500 hover:underline"
          >
            Bearbeiten
          </button>
          <button
            onClick={handleDelete}
            className="text-xs text-red-500 hover:underline"
          >
            Löschen
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className="cursor-pointer h-6 w-6 transition ease-in-out hover:drop-shadow-xl"
            >
              <img
                className="h-full object-fill"
                src={likedByMe ? "/svg/heart-filled.svg" : "/svg/heart.svg"}
                alt="heart emoji"
              />
            </button>
            <p>{likesCount}</p>
          </div>

          <div className="flex items-center gap-2">
            <img
              className="h-6 object-fill"
              src="/svg/comment.svg"
              alt="speechbubble"
            />
            <p>{commentsCount}</p>
          </div>

          <img src="/svg/message.svg" alt="" />
        </div>
        <span className="text-xs text-gray-500 ml-2">
          {dayjs(post.created_at).fromNow()}
        </span>
      </div>
      {/* Kommentar-Vorschau */}
      {/* {comments.length > 0 && (
          <div className="mt-2 text-sm text-gray-700">
            {comments.map((c) => (
              <div key={c.id} className="mb-1">
                <span className="font-semibold">
                  {c.username || c.user_id}:
                </span>{" "}
                {c.text_content}
              </div>
            ))}
            {commentsCount > 2 && (
              <button
                onClick={handleShowAllComments}
                className="text-xs text-blue-500 hover:underline mt-1"
              >
                Alle Kommentare anzeigen
              </button>
            )}
          </div>
        )} */}
      {/* Modal für alle Kommentare */}
      {/* {showAllComments && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                ✕
              </button>
              <h2 className="text-lg font-semibold mb-4">Alle Kommentare</h2>
              <div className="max-h-64 overflow-y-auto">
                {allComments.length === 0 && (
                  <p className="text-gray-500">Noch keine Kommentare.</p>
                )}
                {allComments.map((c) => (
                  <div key={c.id} className="mb-2 border-b pb-1">
                    <span className="font-semibold">
                      {c.username || c.user_id}:
                    </span>{" "}
                    {c.text_content}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )} */}
      {/* Kommentar-Formular */}
      {/* {user && (
          <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Kommentieren..."
              className="flex-1 border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none"
              disabled={commentLoading}
            />
            <button
              type="submit"
              disabled={commentLoading || !commentInput.trim()}
              className="bg-main text-white px-3 py-1 rounded-md text-sm font-semibold disabled:opacity-50"
            >
              Posten
            </button>
          </form>
        )} */}
      {/* </div> */}
    </article>
  );
};

export default SinglePost;
