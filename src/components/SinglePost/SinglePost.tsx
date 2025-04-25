import {useEffect, useState } from "react";
import ProfilePreviewCard from "../ProfilePreviewCard/ProfilePreviewCard";
import supabase from "../../utils/supabase";
import IPost from "../../interfaces/IPost";
import { useLocation } from "react-router-dom";

interface IPostProps{
    post: IPost,
}

interface ILikes {
    userId: string,
}

const SinglePost = ({post}: IPostProps) => {
    const location = useLocation()

    const [likes,setLikes] = useState<ILikes[]>()

    // fetch likes
    const fetchLikesData = async () => {
        try {
            const {data: likesData} = await supabase.from("likes").select("*").eq("post_id", post?.id )
            // console.log("likesData:",likesData)
            setLikes(likesData as ILikes[])
            
        } catch (error) {
            console.warn("Error while fetching LikesData", error)
        }
    }
    useEffect(()=>{
        fetchLikesData()
    },[])

    // console.log("LikesData",likes)


    return (  
        <article className="flex flex-col gap-4 items-center justify-center mb-10">
            {/* soll nicht auf der profile timeline auftauchen */}
            {!location.pathname.includes("users") && <ProfilePreviewCard />}
        
                <div>
                    <img className="object-cover rounded-4xl aspect-square mb-2 transition ease-in-out hover:opacity-80 hover:drop-shadow-xl cursor-pointer" src={post.post_image_url} alt={post.post_desc} />
                    
                    <div className="flex gap-6 self-start justify-start items-center">
                        <div className="flex justify-between items-center gap-2">
                        {/* das herz braucht noch eine toggle funktion, die auch mit dem backend verbunden sein muss */}
                        <div className="cursor-pointer h-6 w-6 transition ease-in-out hover:drop-shadow-xl">
                        <img className="h-full object-fill"  src="/svg/heart-filled.svg" alt="heart emoji filled" />
                    </div>
                        {/* über likes kann die length genutzt werden, weil die data ein Array ist */}
                        <p>{likes?.length}</p>
                    </div>
                
                    <div className="flex justify-between items-center gap-2">
                        <div className="h-6 w-6 cursor-pointer transition ease-in-out hover:drop-shadow-xl">
                            <img className="h-full object-fill" src="/svg/comment.svg" alt="speechbubble" />
                        </div>
                        {/* hier müssen die gefetchte anzahl von comments rein */}
                        <p>264</p>
                    </div>
            
                    <img src="/svg/message.svg" alt="" />
                        </div>
                </div>
        </article>

    );
}

export default SinglePost;