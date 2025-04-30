import { useContext, useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import IPost from "../../interfaces/IPost";
import SinglePost from "../SinglePost/SinglePost";
import { mainContext } from "../../context/MainProvider";
import { useLocation } from "react-router-dom";
import ILikedPost from "../../interfaces/ILikedPost";

interface MiniFeedProps {
    profileId: string | undefined,
}

const MiniFeed = ({profileId} : MiniFeedProps) => {
    const [profilePosts, setProfilePosts] = useState<IPost[] | null>(null)
    const [likedPosts, setLikedPosts] = useState<ILikedPost[] | null>(null)
    const [timelineFeed, setTimelineFeed] = useState<boolean>(false)
    
    const {setModalId, setOpenModal} = useContext(mainContext)

    const location = useLocation()
    const favPage = location.pathname === "/favorites"

    // funktion für das modalfenster
    const showPostDetails = (id: string) => {
        setModalId(id)
        setOpenModal(true)
    }

    useEffect(() => {
        const fetchData = async () => {
            // fetch für miniFeed auf der favoriten Page
            if(favPage) {
                try {
                    // fetch der profile, die mit der id des users/des params übereinstimmen
                    const {data: likedPosts} = await supabase.from("likes").select("*, posts(*)").eq("user_id", profileId).order("created_at", { ascending: false })
    
                    if(likedPosts) {
                        // der fetch gibt einen array zurück, deshalb müssen wir das erste objekt selektieren
                        setLikedPosts(likedPosts)
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                // fetch für miniFeed auf den profilen
                try {
                    // fetch der profile, die mit der id des users/des params übereinstimmen
                    const {data: posts} = await supabase.from("posts").select("*").eq("user_id", profileId).order("created_at", { ascending: false })
    
                    if(posts) {
                        // der fetch gibt einen array zurück, deshalb müssen wir das erste objekt selektieren
                        setProfilePosts(posts)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        } 
        fetchData()
    }, [profileId])

    // je nachdem, ob wir uns auf der fav oder profil page befinden, wird der loading platzhalter dargestellt
    if(profilePosts === null && !favPage || likedPosts === null && favPage) {
        return (
            <article className="mb-20">
                <div className="grid grid-cols-3 justify-items-center gap-3 mb-5">
                    <div className="flex gap-2">
                        <img className="h-5 object-fill" src="/svg/feed-filled.svg" alt="four rectangles" />
                        <p>Feeds</p>
                    </div>
                </div>
                <h2 className="text-center">Loading posts...</h2>
            </article>
        )
    } 
    if(profilePosts && !favPage) {
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
                <div className={`grid ${timelineFeed ? "grid-cols-1 gap-11" : "grid-cols-3 gap-2"}`}>
                    {/* sollte der user keine posts haben, wird stattdessen ein text angezeigt */}
                    {profilePosts.length > 0 ? profilePosts.map((post) => (
                        // je nach zustand des timelineFeed states wird entweder die grid- oder timelineansicht angzeigt
                        timelineFeed ? 
                            <SinglePost post={post} key={crypto.randomUUID()} /> 
                        :
                        // onClick mit Funktion, Modalfenster status wird dann angezeigt, Componente anzeigen lassen, wenn geglickt

                            <img 
                                className="w-full aspect-square object-cover rounded-2xl transition ease-in-out hover:opacity-80" 
                                onClick={() => showPostDetails(post.id)}
                                src={post.post_media_url} 
                                alt="Miniature Post" 
                                key={crypto.randomUUID()} />
                    )) : <p className="col-span-3 text-center">No posts yet!</p>}
                </div>
    
            </article>
        );
    }
    if(likedPosts && favPage) {
        return (  
            <article className="mb-20">
                <div className="grid grid-cols-3 gap-2">
                    {/* sollte der user keine posts haben, wird stattdessen ein text angezeigt */}
                    {likedPosts.length > 0 ? likedPosts.map((post) => (
                        // je nach zustand des timelineFeed states wird entweder die grid- oder timelineansicht angzeigt
                        
                        // onClick mit Funktion, Modalfenster status wird dann angezeigt, Componente anzeigen lassen, wenn geglickt

                            <img 
                                className="w-full aspect-square object-cover rounded-2xl transition ease-in-out hover:opacity-80" 
                                onClick={() => showPostDetails(post.posts.id)}
                                src={post.posts.post_media_url} 
                                alt="Miniature Post" 
                                key={crypto.randomUUID()} />
                    )) : <p className="col-span-3 text-center">No liked posts yet!</p>}
                </div>
            </article>
        );
    }
}

export default MiniFeed;