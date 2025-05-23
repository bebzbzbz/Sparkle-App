import { useContext, useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import IPost from "../../interfaces/IPost";
import SinglePost from "../SinglePost/SinglePost";
import { mainContext } from "../../context/MainProvider";
import { useLocation } from "react-router-dom";
import ILikedPost from "../../interfaces/ILikedPost";
import MainButton from "../MainButton/MainButton";

interface MiniFeedProps {
    profileId: string | undefined,
}

const MiniFeed = ({profileId} : MiniFeedProps) => {
    const [profilePosts, setProfilePosts] = useState<IPost[] | null>(null)
    const [likedPosts, setLikedPosts] = useState<ILikedPost[] | null>(null)
    const [fetchLimit, setFetchLimit] = useState<number>(12)
    const [allPostsCount, setAllPostsCount] = useState<number>(0)
    const [allFavsCount, setAllFavsCount] = useState<number>(0)
    
    const {setModalId, setOpenModal, timelineFeed} = useContext(mainContext)

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
                    const {data: likedPosts} = await supabase.from("likes").select("*, posts(*, profiles(username, profile_image_url, id))").eq("user_id", profileId).limit(fetchLimit).order("created_at", { ascending: false })
    
                    if(likedPosts) {
                        // der fetch gibt einen array zurück, deshalb müssen wir das erste objekt selektieren
                        setLikedPosts(likedPosts)
                    }

                     // Anzahl der gesamten gelikedten Posts in der Datenbank um den fetch abzugleichen (siehe button)
                    const {count: totalPosts} = await supabase
                    .from("likes")
                    .select("*, posts(*, profiles(username, profile_image_url, id))", { count: "exact", head: true })
                    .eq("user_id", profileId)

                    if(totalPosts) {
                        setAllFavsCount(totalPosts || 0)
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                // fetch für miniFeed auf den profilen
                try {
                    // fetch der profile, die mit der id des users/des params übereinstimmen
                    const {data: posts} = await supabase.from("posts").select("*").eq("user_id", profileId).limit(fetchLimit).order("created_at", { ascending: false })
    
                    if(posts) {
                        // der fetch gibt einen array zurück, deshalb müssen wir das erste objekt selektieren
                        setProfilePosts(posts)
                    }

                    // Anzahl der gesamten Posts in der Datenbank um den fetch abzugleichen (siehe button)
                    const {count: totalPosts} = await supabase
                    .from("posts")
                    .select("*", { count: "exact", head: true })
                    .eq("user_id", profileId)

                    if(totalPosts) {
                        setAllPostsCount(totalPosts || 0)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        } 
        fetchData()
    }, [profileId, fetchLimit])

    // je nachdem, ob wir uns auf der fav oder profil page befinden, wird der loading platzhalter dargestellt
    if(profilePosts === null && !favPage || likedPosts === null && favPage) {
        return (
            <article className="mb-20">
                <h2 className="text-center">Loading posts...</h2>
            </article>
        )
    } 
    if(profilePosts && !favPage) {
        return (  
            <article className="mb-20 flex flex-col items-center gap-5">
                <div className={`grid ${timelineFeed ? "grid-cols-1 gap-11" : "grid-cols-3 gap-2"}`}>
                    {/* sollte der user keine posts haben, wird stattdessen ein text angezeigt */}
                    {profilePosts.length > 0 ? profilePosts.map((post) => (
                        // je nach zustand des timelineFeed states wird entweder die grid- oder timelineansicht angzeigt
                        timelineFeed ? 
                            <SinglePost post={post} key={crypto.randomUUID()} userInfo={post.profiles}/>
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
                {profilePosts?.length !== allPostsCount && <MainButton textContent="Load more posts" type="button" onClick={() => setFetchLimit((prev) => prev + 9)}/>}
            </article>
        );
    }
    if(likedPosts && favPage) {
        return (  
            <article className="mb-20 flex flex-col gap-6 items-center">
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
                {likedPosts?.length !== allFavsCount && <MainButton textContent="Load more posts" type="button" onClick={() => setFetchLimit((prev) => prev + 9)}/>}
            </article>
        );
    }
}

export default MiniFeed;