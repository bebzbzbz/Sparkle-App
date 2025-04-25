import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import SinglePost from "../../components/SinglePost/SinglePost";
import supabase from "../../utils/supabase";
import IPost from "../../interfaces/IPost";

const Home = () => {
    const [posts,setPosts] = useState<IPost[]>()

    // fetch posts
    const fetchPostsData = async () => {
        try{
            const {data} = await supabase.from("posts").select("*").order("created_at", { ascending: false })
            // console.log("postData:",data)
            setPosts(data as IPost[])
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

        {posts?.map((post: IPost)=>{
            return(
                <div key={post.id}>
                    <SinglePost post={post}/>
                </div>
            )})}
        </>
    )
}

export default Home
