import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../utils/supabase";
import IPost from "../../interfaces/IPost";
import FeedImage from "../FeedImage/FeedImage";

const MiniFeed = () => {
    const [profilePosts, setProfilePosts] = useState<IPost[] | null>(null)
    const {userParam} = useParams()

    useEffect(() => {
        const fetchData = async () => {
            try {
                // fetch der profile, die mit der id des users/des params übereinstimmen
                const {data: posts} = await supabase.from("posts").select("*").eq("user_id", userParam)

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
                <div className="grid grid-cols-3 justify-items-center gap-3 mb-5">
                    <div className="flex gap-2">
                        <img className="h-5 object-fill" src="/public/svg/feed-filled.svg" alt="four rectangles" />
                        <p>Feeds</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {profilePosts.map((post) => (
                        post.media_type === 'image' ? (
                            <FeedImage
                                src={post.post_media_url || ''}
                                alt="Miniature Post" 
                                aspect="square"
                                maxSize={400}
                                key={post.id}
                            />
                        ) : post.media_type === 'video' ? (
                            <video
                                className="w-full aspect-square object-cover rounded-2xl transition ease-in-out hover:opacity-80"
                                src={post.post_media_url}
                                key={post.id}
                                controls
                            />
                        ) : null
                    ))}
                </div>
    
            </article>
        );
    }

}

export default MiniFeed;