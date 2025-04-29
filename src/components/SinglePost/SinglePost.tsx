import { useEffect, useState } from "react";
import { useAuth } from "../../context/MainProvider";
import supabase from "../../utils/supabase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import FeedImage from "../FeedImage/FeedImage";
import IPost from "../../interfaces/IPost";
import ProfilePreviewCard from "../ProfilePreviewCard/ProfilePreviewCard";
import IUser from "../../interfaces/IUser";
import CommentsModal from "../CommentsModal/CommentsModal";
import IComment from "../../interfaces/IComment";
dayjs.extend(relativeTime);

interface IPostProps {
  post: IPost;
}

const SinglePost = ({ post }: IPostProps) => {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(0);
  const [likedByMe, setLikedByMe] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [comments, setComments] = useState<IComment[]>([]);
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
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
        .select("*")
        .eq("post_id", post.id)
        .eq("user_id", user.id)
        .single();
      setLikedByMe(!!likeData);
    }
  };

  // Kommentaranzahl laden
  const fetchCommentsCount = async () => {    
    const { count } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("post_id", post.id);
    setCommentsCount(count || 0);
  };

  // Alle Kommentare für Modal laden
  const fetchComments = async () => {
    const { data: commentData } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", post.id)
      .order("created_at", { ascending: false })
      .limit(2);
      if(commentData) {
        const enriched = await enrichCommentsWithUsernames(commentData || []);
        setComments(enriched);
      }
  }

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
    fetchCommentsCount();
    fetchUserInfo();
  }, [post.id]);

  useEffect(() => {
    if(!!showCommentModal){
      fetchComments();
    }
  }, [showCommentModal]);

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
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentInput.trim()) return;
    setCommentLoading(true);
    try {
      await supabase.from("comments").insert({
        post_id: post.id,
        user_id: user.id,
        text_content: commentInput.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      setCommentInput("");
      fetchComments();
      if (showCommentModal) fetchComments();
    } catch (err) {
      // Fehlerbehandlung (optional)
    } finally {
      setCommentLoading(false);
    }
  };

  // Hilfsfunktion: Usernamen zu user_id cachen
  const getCommenterData = async (userId: string) => {
    if (userCache[userId]) return userCache[userId];
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) {
      setUserCache((prev) => ({ ...prev, [userId]: data.username, "profileImg": data.profile_image_url || "" }));
      console.log(data.data)
      return data;
    }
    return userId;
  };

  console.log(userCache)

  // Kommentare mit Usernamen anreichern
  const enrichCommentsWithUsernames = async (comments: any[]) => {
    const enriched = await Promise.all(
      comments.map(async (c) => {
        let username = userCache[c.user_id];
        if (!username) {
          username = await getCommenterData(c.user_id);
        }
        return { ...c, username };
      })
    );
    return enriched;
  };

  return (
    <article className="flex flex-col gap-4">
      {userInfo && <ProfilePreviewCard profile={userInfo} geoTag={post.location}/>}
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

      {post.post_desc &&
        <p>{post.post_desc}</p>}

      {user && user.id === post.user_id && (
        <div className="flex gap-3">
          <button
            onClick={handleEdit}
            className="text-xs text-blue-500 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-xs text-red-500 hover:underline"
          >
            Delete
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
              onClick={() => {setShowCommentModal(true)}}
            />
            <p>{commentsCount}</p>
          </div>

          <img src="/svg/message.svg" alt="" />
        </div>
        <span className="text-xs text-gray-500 ml-2">
          {dayjs(post.created_at).fromNow()}
        </span>
      </div>
        
        {/* Modal für alle Kommentare */}
        {showCommentModal && (
          <CommentsModal allComments={comments} setShowCommentModal={setShowCommentModal} handleCommentSubmit={handleCommentSubmit} commentInput={commentInput} setCommentInput={setCommentInput} commentLoading={commentLoading}/>
        )}
        </article>
  );
};

export default SinglePost;
