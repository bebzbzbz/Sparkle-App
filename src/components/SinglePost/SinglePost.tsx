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
  const [showCommentsModal,setShowCommentsModal] = useState<boolean>(false)
  const {openModal} = useContext(mainContext)

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
        console.log(commentData)
        console.log(post.id)
      }
  }

  useEffect(() => {
    fetchLikes();
    fetchCommentsCount();
  }, [post.id]);

  useEffect(() => {
    if(showCommentsModal){
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
              className="cursor-pointer h-6 transition ease-in-out hover:drop-shadow-xl"
            >
              <div className="h-7 -mt-[2px]">
                {likedByMe 
                ? <svg width="16" height="27" viewBox="0 0 16 27" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.06576 2.88946C7.11781 2.46976 7.72616 2.46976 7.77822 2.88946L8.40984 7.98196C8.62141 9.68775 9.73144 11.1491 11.318 11.8105L13.8064 12.8479C14.1009 12.9706 14.1009 13.3878 13.8064 13.5105L11.318 14.5479C9.73144 15.2093 8.62141 16.6706 8.40984 18.3764L7.77822 23.4689C7.72616 23.8886 7.11781 23.8886 7.06576 23.4689L6.43414 18.3764C6.22257 16.6706 5.11254 15.2093 3.52602 14.5479L1.03757 13.5105C0.743116 13.3878 0.743116 12.9706 1.03757 12.8479L3.52602 11.8105C5.11254 11.1491 6.22257 9.68775 6.43414 7.98196L7.06576 2.88946Z" fill="currentColor"/><path d="M12.5686 16.4671C12.6007 16.1841 13.0119 16.1841 13.0441 16.4671L13.2839 18.5766C13.3314 18.9944 13.5947 19.3566 13.9775 19.5306L15.3187 20.1406C15.5056 20.2256 15.5056 20.4912 15.3187 20.5762L13.9775 21.1862C13.5947 21.3602 13.3314 21.7224 13.2839 22.1402L13.0441 24.2497C13.0119 24.5327 12.6007 24.5327 12.5686 24.2497L12.3287 22.1402C12.2812 21.7224 12.0179 21.3602 11.6352 21.1862L10.294 20.5762C10.107 20.4912 10.107 20.2256 10.294 20.1406L11.6352 19.5306C12.0179 19.3566 12.2812 18.9944 12.3287 18.5766L12.5686 16.4671Z" fill="currentColor"/></svg>
                : <svg width="13" height="21" viewBox="0 0 13 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.41028 5.09473C6.68216 7.37646 8.1452 9.34181 10.2531 10.2568L11.4513 10.7773L10.2531 11.2979C8.14527 12.2129 6.68222 14.1783 6.41028 16.46L6.07239 19.293L5.7345 16.46C5.46257 14.1783 3.99947 12.2129 1.89172 11.2979L0.692505 10.7773L1.89172 10.2568C3.99949 9.34177 5.46264 7.37642 5.7345 5.09473L6.07239 2.26074L6.41028 5.09473Z" stroke="currentColor" stroke-width="0.957225"/></svg>}
              </div>
            </button>
            <p>{likesCount}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-6" onClick={() => {setShowCommentsModal(true)}}>
              <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.6187 13.6108C2.28505 14.2524 3.18881 14.6129 4.13117 14.6129H4.27612C5.17724 14.6129 5.90775 15.3434 5.90775 16.2445V18.5549L8.25732 16.8291C10.2176 15.3893 12.5872 14.6129 15.0195 14.6129C15.94 14.6129 16.6045 14.6129 16.6045 14.6129C17.5468 14.6129 18.4506 14.2524 19.1169 13.6108C19.7833 12.9692 20.1576 12.099 20.1576 11.1916V4.02815C20.1576 3.12079 19.7833 2.25059 19.1169 1.60899C18.4506 0.967383 17.5468 0.606934 16.6045 0.606934H4.13117C3.18881 0.606934 2.28505 0.967383 1.6187 1.60899C0.952353 2.25059 0.578003 3.12079 0.578003 4.02815V9.58092" stroke="currentColor" stroke-width="1.14214" stroke-miterlimit="10"/></svg>
            </div>
            <p>{commentsCount}</p>
          </div>
        </div>
        {/* bearbeiten wird nur angezeigt, wenn der post auch von dem eingeloggten user ist */}
        {openModal && user?.id === post.user_id 
        ? 
          <div 
            className="h-5"
            onClick={() => {setShowPostSettingModal(true)}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </div>
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
        <CommentsModal setShowCommentsModal={setShowCommentsModal}allComments={comments} handleCommentSubmit={handleCommentSubmit} commentInput={commentInput} setCommentInput={setCommentInput} commentLoading={commentLoading} fetchComments={fetchComments}/>
      )}

      {/* description */}
      {post.post_desc
      ? <p className="px-2 pb-5">{post.post_desc}</p> 
      : ""}
    </article>
  );
};

export default SinglePost;