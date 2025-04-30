import dayjs from "dayjs";
import { useAuth } from "../../context/MainProvider";
import IComment from "../../interfaces/IComment";
import supabase from "../../utils/supabase";
import { useState } from "react";

interface CommentsModalProps {
  allComments: IComment[],
  setShowCommentModal: (showCommentModal: boolean) => void,
  handleCommentSubmit: (e: React.FormEvent) => Promise<void>,
  commentInput: string,
  setCommentInput: (commentInput: string) => void,
  commentLoading: boolean,
  fetchComments: () => Promise<void>
}

const CommentsModal = ({allComments, setShowCommentModal, handleCommentSubmit, commentInput, commentLoading, setCommentInput, fetchComments} : CommentsModalProps) => {
    const { user } = useAuth();
    const [areYouSure, setAreYouSure] = useState<string | null>(null)

    const handleDelete = async (comment_id: string) => {
      // Lösche den Comment aus der Datenbank
      if(areYouSure !== comment_id) {
        setAreYouSure(comment_id)
      } else {
        await supabase.from("comments").delete().eq("id", comment_id);
        setAreYouSure(null)
        fetchComments()
      }
    };

    const handleCloseModal = () => {
      setAreYouSure(null)
      setShowCommentModal(false)
    }
  
    return (  
      <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 mx-3 max-w-md w-full relative flex flex-col gap-5">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-black">✕</button>
            <h2 className="text-lg font-semibold">Comments</h2>
            {user && (
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-1 border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none"
                disabled={commentLoading}
              />
              <button
                type="submit"
                // button ist nicht klickbar wenn nicht eingegeben wurde oder der kommentar gerade lädt
                disabled={commentLoading || !commentInput.trim()}
                className="bg-main text-white px-3 py-1 rounded-md text-sm font-semibold disabled:opacity-50"
              >
                Post
              </button>
          </form>
          )}
          <div className="max-h-100 overflow-y-auto flex flex-col gap-3">
            {allComments.length === 0 && (
              <p className="text-gray-500">No comments yet. Be the first!</p>
            )}
            {allComments.map((c) => (
              <div key={crypto.randomUUID()} className="flex gap-2">
                <img src={c.profiles?.profile_image_url} alt="" className="object-cover rounded-full h-8 w-8" />

                <div className="w-full">

                  <span className="font-semibold">
                    {c.profiles?.username}{" "}
                  </span>

                  {c.text_content} 

                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 block">
                      {dayjs(c.created_at).fromNow()}
                    </span>
                    {user && user.id === c.user_id && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      {areYouSure === c.id ? "Are you sure to delete?" : "Delete"}
                    </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}

export default CommentsModal;