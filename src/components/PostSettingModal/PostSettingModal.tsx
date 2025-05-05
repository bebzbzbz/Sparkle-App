import { useContext, useState } from "react";
import { mainContext } from "../../context/MainProvider";
import supabase from "../../utils/supabase";
import IPost from "../../interfaces/IPost";
import { useNavigate } from "react-router-dom";

interface IPostSettingModalProps {
  post: IPost;
  setShowPostSettingModal: (value: boolean) => void;
}

const PostSettingModal = ({
  post,
  setShowPostSettingModal,
}: IPostSettingModalProps) => {
  const { user } = useContext(mainContext);
  const navigate = useNavigate();

  const closeModule = () => {
    setShowPostSettingModal(false);
  };

  const[security, setSecurity] = useState<boolean>(false)

  const handleEdit = () => {
    // Speichere den Post im Session Storage für die Bearbeitung
    sessionStorage.setItem("editPost", JSON.stringify(post));
    // Navigiere zur Edit-Seite
    navigate("/newpost?edit=true");
    // Schließe das Modal
    setShowPostSettingModal(false);
  };

  const handleDelete = async () => {
    // Lösche den Post aus der Datenbank
    if (security === false) {
        setSecurity(true)
    } else {
        await supabase.from("posts").delete().eq("id", post.id);
      // Optional: Seite neu laden oder Post aus dem State entfernen
        setShowPostSettingModal(false);
        setSecurity(false)
        window.location.reload();
        console.log(security)
    }
  };


  return (
    <div className="flex justify-center items-center w-screen h-screen fixed top-0 left-0">
      <div
      onClick={closeModule}
      className="inset-0 z-10 fixed bg-light/70">
      </div>

      <div className="z-20 flex flex-col gap-5 items-center px-6 py-5 rounded-4xl w-60 bg-light/90 border border-main text-center">
        <h2 className="text-4xl font-bold">post settings</h2>
        {user && user.id === post.user_id && (
          <div className="grid grid-cols-2 items-center">
            <div>
              <button
                className=" text-xl p-5 cursor-pointer transition ease-in-out hover:font-bold"
                onClick={handleEdit}
              >
                edit
              </button>
            </div>

            <div>
              <button
                className="p-5 text-xl cursor-pointer transition ease-in-out hover:font-bold hover:text-red-500"
                onClick={handleDelete}
              >
                {security 
                ? "sure to delete?"
                : "delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PostSettingModal;
