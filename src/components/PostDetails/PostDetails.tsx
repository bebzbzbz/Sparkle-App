import { useContext, useEffect, useState } from "react";
import IPost from "../../interfaces/IPost";
import supabase from "../../utils/supabase";
import { mainContext } from "../../context/MainProvider";
import MainButton from "../MainButton/MainButton";



const PostDetails = () => {
    const {setOpenModal} = useContext(mainContext)

    const closeModal = () => {
        setOpenModal(false)
    }
    
    const {modalId, openModal} = useContext(mainContext)
    
    const [postDetails, setPostDetails] = useState<IPost>()

    // fetch von post, mit .single() wird nur ein objekt zurückgeben und kein array
    const getPost = async () => {
        try {
            const {data: postData} = await supabase.from("posts").select("*").eq("id", modalId).single()
        console.log(postData)
        setPostDetails(postData)
        } catch (error) {
            console.warn("postdetail fetch nope", error)
    
        }  
    }

    useEffect(()=>{
        getPost()
    },[openModal])

    console.log(postDetails)


    
    // styling von dem modalfenster
    return ( 
    <section onClick={() => closeModal()} className="fixed top-5 left-5  w-screen h-screen">
        <img className="h-[70%] w-[70%] opacity-95 rounded-2xl" src={postDetails?.post_media_url} alt="" />
        
    </section> );
}

export default PostDetails;