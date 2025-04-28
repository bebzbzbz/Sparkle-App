import { useContext, useEffect, useState } from "react";
import IPost from "../../interfaces/IPost";
import supabase from "../../utils/supabase";
import { mainContext } from "../../context/MainProvider";



const PostDetails = () => {
    
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
    console.log("hhaha")

    
    // styling von dem modalfenster
    return ( 
    <section className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-black">
        <h1 className="bg-amber-300">hallo</h1>
    </section> );
}

export default PostDetails;