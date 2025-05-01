import { useContext, useEffect, useState } from "react";
import { mainContext, useAuth } from "../../context/MainProvider";
import supabase from "../../utils/supabase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import FeedImage from "../FeedImage/FeedImage";
import IPost from "../../interfaces/IPost";
import ProfilePreviewCard from "../ProfilePreviewCard/ProfilePreviewCard";
import CommentsModal from "../CommentsModal/CommentsModal";
import IComment from "../../interfaces/IComment";
import PostSettingModal from "../PostSettingModal/PostSettingModal";
import IUser from "../../interfaces/IUser";
dayjs.extend(relativeTime);

interface IPostProps {
  post: IPost;
  userInfo?: IUser
}

const SinglePost = ({ post, userInfo }: IPostProps) => {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(0);
  const [likedByMe, setLikedByMe] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [comments, setComments] = useState<IComment[]>([]);
  const [showPostSettingModal, setShowPostSettingModal] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const {openModal, showCommentsModal, setShowCommentsModal} = useContext(mainContext)

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
      .select("*, profiles(id, profile_image_url, username)")
      .eq("post_id", post.id)
      .order("created_at", { ascending: false })
      if(commentData) {
        setComments(commentData);
      }
  }

  useEffect(() => {
    fetchLikes();
    fetchCommentsCount();
  }, [post.id, comments]);

  useEffect(() => {
    if(!!showCommentsModal){
      fetchComments();
    }
  }, [showCommentsModal]);

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
      fetchCommentsCount();
      if (showCommentsModal) fetchComments();
    } catch (err) {
      // Fehlerbehandlung (optional)
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <article className="flex flex-col gap-4">
      {!openModal && (
        <ProfilePreviewCard profile={userInfo} geoTag={post.location} />
      )}
      <div>
        {post.media_type === "image" ? (
          <FeedImage
            src={post.post_media_url}
            alt={post.post_desc}
            aspect="square"
            maxSize={1200}
            geoTag={post.location}
            time ={post.created_at.slice(0,10).split("-").join(".")}
          />
        ) : post.media_type === "video" ? (
          <video
            className="h-full w-full object-cover rounded-4xl aspect-square mb-2 transition ease-in-out hover:opacity-80 hover:drop-shadow-xl cursor-pointer"
            src={post.post_media_url}
            controls
          />
        ) : null}
      </div>

      <div className="flex items-center justify-between px-2">
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
              onClick={() => {setShowCommentsModal(true)}}
            />
            <p>{commentsCount}</p>
          </div>
        </div>
        {/* bearbeiten wird nur angezeigt, wenn der post auch von dem eingeloggten user ist */}
        {openModal && user?.id === post.user_id 
        ? <img
            className=" h-5 object-fill"
            src="/svg/settings.svg"
            alt="gear"
            onClick={() => {setShowPostSettingModal(true)}}
            />
        : <span className="text-xs text-gray-500 ml-2">
          {dayjs(post.created_at).fromNow()}
          </span>
        }

          {/* Modal für Einstellungen */}
          {showPostSettingModal && 
          <PostSettingModal post={post} setShowPostSettingModal={setShowPostSettingModal}/>}
        
        
      </div>        
      {/* Modal für alle Kommentare */}
      {showCommentsModal && (
        <CommentsModal allComments={comments} handleCommentSubmit={handleCommentSubmit} commentInput={commentInput} setCommentInput={setCommentInput} commentLoading={commentLoading} fetchComments={fetchComments}/>
      )}

      {/* description */}
      {post.post_desc
      ? <p className="px-2">{post.post_desc}</p> 
      : ""}
    </article>
  );
};

export default SinglePost;