import { useContext, useEffect, useState } from "react";
import IPost from "../../interfaces/IPost";
import supabase from "../../utils/supabase";
import { mainContext } from "../../context/MainProvider";
import SinglePost from "../SinglePost/SinglePost";

const PostDetails = () => {

    const {modalId, openModal} = useContext(mainContext)
    
    const [postDetails, setPostDetails] = useState<IPost>()

    // fetch von post, mit .single() wird nur ein objekt zurückgeben und kein array
    const getPost = async () => {
        try {
            const {data: postData} = await supabase.from("posts").select("*").eq("id", modalId).single()
        // console.log(postData)
        setPostDetails(postData)
        } catch (error) {
            console.warn("postdetail fetch nope", error)
        }  
    }
    useEffect(()=>{
        getPost()
    },[openModal])

    return ( 
    <section className="fixed overflow-auto top-0 left-0 flex flex-col items-center justify-start w-screen h-screen bg-light/90 p-5">
        {postDetails && <SinglePost post={postDetails}/>}
    </section> );
}

export default PostDetails;