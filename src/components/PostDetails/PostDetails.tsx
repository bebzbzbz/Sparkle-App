import { useContext, useEffect, useState } from "react";
import IPost from "../../interfaces/IPost";
import supabase from "../../utils/supabase";
import { mainContext } from "../../context/MainProvider";
import SinglePost from "../SinglePost/SinglePost";


// KommentarFunktion fehlt noch
// ! wenn die profilseite über die ppp angeklickt wird, scheint das Modalfenster nicht zu gehen! nachchecken
// ! wenn der text beim neuen post reinkopiert wird, scheint er über die breite zu gehen! checken

const PostDetails = () => {

    const {setOpenModal, modalId, openModal, user} = useContext(mainContext)
    
    const [postDetails, setPostDetails] = useState<IPost>()
    // aus SinglePost
    const [likesCount, setLikesCount] = useState<number>(0);
    const [likedByMe, setLikedByMe] = useState(false);

    

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

    // console.log(postDetails)

    //     // Likes fetch
    // const fetchLikes = async () => {
    //     const { count } = await supabase
    //     .from("likes")
    //     .select("*", { count: "exact", head: true })
    //     .eq("post_id", modalId);
    //     setLikesCount(count as number);
    //     if (user) {
    //         const { data: likeData } = await supabase
    //           .from("likes")
    //           .select("*")
    //           .eq("post_id", modalId)
    //           .eq("user_id", user.id)
    //           .single();
    //         setLikedByMe(!!likeData)
    //     }
    // }

    // useEffect(() => {
    //     fetchLikes()
    // },[])

    // const handleLike = async () => {
    //     if (!user) return;
    //     if (likedByMe) {
    //       await supabase
    //         .from("likes")
    //         .delete()
    //         .eq("post_id", modalId)
    //         .eq("user_id", user.id);
    //     } else {
    //       await supabase
    //         .from("likes")
    //         .insert({ post_id: modalId, user_id: user.id });
    //     }
    //     fetchLikes();
    //   };

    // // console.log("likes", likesCount)

    // styling von dem modalfenster
    return ( 
    <section className="absolute top-0 left-0 flex flex-col items-center justify-start w-screen h-screen bg-white/95 p-5">

        {postDetails && <SinglePost post={postDetails}/>}

        {/* <div className="relative p-5 h-[60vh] w-full "> */}
            {/* noch austauschen */}
            {/* <img onClick={() => closeModal()} className="cursor-pointer opacity-80 h-8 z-30 absolute top-10 right-10 transition ease-initial" src="/svg/cancel.svg" alt="x symbole" /> */}
        
           {/* hier muss noch ein fade unten hin, damit die schrift lesbar ist */}
            {/* <img className="object-cover h-full w-full rounded-4xl" src={postDetails?.post_media_url} alt={postDetails?.id} />

            <div className="absolute w-full px-8 bottom-9 left-0 flex items-center justify-between "> */}
                {/* location */}
                {/* {postDetails?.location &&
                <div className=" flex gap-1 items-center justify-center">
                    <img className="h-5" src="/svg/geotag.svg" alt="geotag" />
                    <p>{postDetails?.location}</p>
                </div>} */}
                {/* Date */}

                {/* <p>{postDetails?.created_at.slice(0,10).split("-").join(".")}</p>

            </div>
        </div> */}

        {/* <div className="w-[85%] flex items-center justify-start gap-5 mb-5"> */}
             {/* likes */}
            {/* <div onClick={handleLike} className="flex items-center justify-start gap-1 cursor-pointer">
                {likesCount >= 1 
                ? <img src="/svg/heart-filled.svg" alt="heart" /> 
                : <img src="/svg/heart.svg"/>}
                <p className="text-lg ">{likesCount}</p>
            </div> */}
            {/* comments Hier müssen noch die Kommentare eingebunden werden */}
            {/* <div className=" cursor-pointer flex items-center justify-start gap-1">
                <img src="/public/svg/comment.svg" alt="speach bubble" />
                <p className="text-lg ">{0}</p>
            </div>
        </div> */}
    
       {/* description */}
        {/* <div className="flex flex-col items-start justify-center w-[85%] transition ease-in-out: hover:shadow-sm">
            <p className="text-lg font-light">{postDetails?.post_desc}</p>
        </div> */}
        
    </section> );
}

export default PostDetails;