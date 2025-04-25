import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import SinglePost from "../../components/SinglePost/SinglePost";
import supabase from "../../utils/supabase";

export interface ISinglePost {
    id:string,
    user_id:string,
    post_desc:string,
    post_image_url: string,
}

const Home = () => {
    const [posts,setPosts] = useState<ISinglePost[]>()

    // fetch posts
    const fetchPostsData = async () => {
        try{
            const {data} = await supabase.from("posts").select("*")
            // console.log("postData:",data)
            setPosts(data as ISinglePost[])
        }catch(error){
            console.warn("error while fetching PostsData",error)
        }
    }
    // console.log("postsData:",posts)

    useEffect(() => {
        fetchPostsData()
    }, [])


    return (
        <>
        <Header headerTitle="WhoCares" imgLeft="logo" imgRight1="heart" imgRight2="comment"/>

        {posts?.map((post: ISinglePost)=>{
            return(
                <div key={post.id}>
                     <SinglePost post={post} postId={post.id}/>
                </div>
            )})}
        </>
    )
}

export default Home
