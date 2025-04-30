import { useContext } from "react";
import { mainContext } from "../../context/MainProvider";
import supabase from "../../utils/supabase";
import IPost from "../../interfaces/IPost";

interface IPostSettingModalProps{
    post: IPost,
    setShowPostSettingModal: (value: boolean) => void,
}

const PostSettingModal = ({post,setShowPostSettingModal}:IPostSettingModalProps) => {
    
    const {user} = useContext(mainContext)

    const closeModule = (()=> {
        setShowPostSettingModal(false)
    })

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
       <section 
       className="inset-0 fixed bg-white/50 shadow-2xl"
       onClick={closeModule}>

        <div className=" flex flex-col gap-8 items-center justify-start p-5 rounded-4xl absolute w-1/2 h-1/6 top-40 left-[25%] bg-white/90 ">
        <h1 className="text-xl font-bold">Post Settings</h1>
        {user && user.id === post.user_id &&(
            <div className="flex items-center justify-around gap-5">
                <div>
                <button
                className=" text-xl cursor-pointer transition ease-in-out hover:font-bold"
                onClick={handleEdit}>edit</button>
                </div>

                <div>
                    <button
                    className=" text-xl cursor-pointer transition ease-in-out hover:font-bold hover:text-red-500"
                    onClick={handleDelete}>delete</button>
                </div>
            </div>
        )}
        </div>
       </section>
     ); 
}
 export default PostSettingModal;