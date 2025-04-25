import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../utils/supabase";
import IPost from "../../interfaces/IPost";

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

    console.log(profilePosts)

    return (  
        <article className="mb-20">
            <div className="grid grid-cols-3 justify-items-center gap-3 mb-5">
                <div className="flex gap-2">
                    <img className="h-5 object-fill" src="/public/svg/feed-filled.svg" alt="four rectangles" />
                    <p>Feeds</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {profilePosts ? profilePosts.map((post) => (
                    <img 
                        className="w-full aspect-square object-cover rounded-2xl transition ease-in-out wover:opacity-80" 
                        src={post.post_image_url} 
                        alt="Miniature Post" 
                        key={crypto.randomUUID()}/>
                )) : <></>}
            </div>

        </article>
    );
}

export default MiniFeed;