import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import IPost from "../../interfaces/IPost";
import IUser from "../../interfaces/IUser";
import SinglePost from "../SinglePost/SinglePost";

interface MiniFeedProps {
    profile: IUser
}

const MiniFeed = ({profile} : MiniFeedProps) => {
    const [profilePosts, setProfilePosts] = useState<IPost[] | null>(null)
    const [timelineFeed, setTimelineFeed] = useState<boolean>(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // fetch der profile, die mit der id des users/des params übereinstimmen
                const {data: posts} = await supabase.from("posts").select("*").eq("user_id", profile.id).order("created_at", { ascending: false })

                if(posts) {
                    // der fetch gibt einen array zurück, deshalb müssen wir das erste objekt selektieren
                    setProfilePosts(posts)
                }
            } catch (error) {
                console.log(error)
            }
        } 
        fetchData()
    }, [])

    // sollten die profileposts nicht geladen werden, wird ein loadingstate dargestellt
    if(profilePosts === null) {
        return (
            <article className="mb-20">
                <div className="grid grid-cols-3 justify-items-center gap-3 mb-5">
                <div className="flex gap-2">
                    <img className="h-5 object-fill" src="/public/svg/feed-filled.svg" alt="four rectangles" />
                    <p>Feeds</p>
                </div>
            </div>
            <h2 className="text-center">Loading posts...</h2>
        </article>
        )
    } else {
        return (  
            <article className="mb-20">
                <div className="flex gap-5 justify-center mb-5 h-5">
                    {/* mit den icons wird die ansicht der beiträge an- und abgewählt */}
                    <img 
                        src={`/svg/feed${!timelineFeed ? "-filled" : ""}.svg`} 
                        alt="grid icon: four rectangles" 
                        onClick={() => {setTimelineFeed(false)}}/>
                    <img 
                        src={`/svg/timeline${timelineFeed ? "-filled" : ""}.svg`} 
                        alt="timeline icon: three bars on top of each other" 
                        onClick={() => setTimelineFeed(true)}/>
                </div>
                <div className={`grid ${timelineFeed ? "grid-cols-1" : "grid-cols-3"} gap-2`}>
                    {/* sollte der user keine posts haben, wird stattdessen ein text angezeigt */}
                    {profilePosts.length > 0 ? profilePosts.map((post) => (
                        // je nach zustand des timelineFeed states wird entweder die grid- oder timelineansicht angzeigt
                        timelineFeed ? 
                            <SinglePost post={post} key={post.id} /> 
                        :
                            <img 
                                className="w-full aspect-square object-cover rounded-2xl transition ease-in-out hover:opacity-80" 
                                src={post.post_image_url} 
                                alt="Miniature Post" 
                                key={post.id} />
                    )) : <p className="col-span-3 text-center">No posts yet!</p>}
                </div>
    
            </article>
        );
    }

}

export default MiniFeed;