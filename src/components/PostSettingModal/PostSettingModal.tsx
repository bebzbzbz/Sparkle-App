import { useContext } from "react";
import { mainContext } from "../../context/MainProvider";
import supabase from "../../utils/supabase";
import IPost from "../../interfaces/IPost";

interface IPostSettingModalProps{
    post: IPost,
}

const PostSettingModal = ({post}:IPostSettingModalProps) => {
    
    const {user} = useContext(mainContext)

    const handleEdit = () => {
        // Navigiere zur Edit-Seite oder öffne ein Edit-Modal
        // Beispiel: navigate(`/editpost/${post.id}`)
      };
      const handleDelete = async () => {
        // Lösche den Post aus der Datenbank
        await supabase.from("posts").delete().eq("id", post.id);
        // Optional: Seite neu laden oder Post aus dem State entfernen
      };

    return ( 
       <section className="inset-0 fixed bg-white/50">

        <div className=" flex items-start justify-center p-5 rounded-4xl absolute w-1/2 h-1/4 top-40 left-[25%] bg-white/90 ">
        <h1>Edit Post</h1>
        {user && user.id === post.user_id }

        </div>





        {/* {user && user.id === post.user_id && (
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
                )} */}
       </section>
     ); 
}
 export default PostSettingModal;