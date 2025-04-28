import { useEffect, useState } from "react";
import IUser from "../../interfaces/IUser";
import supabase from "../../utils/supabase";

interface ProfileInfoProps {
    profile: IUser
}

const ProfileInfo = ({profile} : ProfileInfoProps) => {
    const [numberOfPosts, setNumberOfPosts] = useState<number>(0)
    const [numberOfFollowers, setNumberOfFollowers] = useState<number>(0)
    const [numberOfFollowing, setNumberOfFollowing] = useState<number>(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data: posts} = await supabase.from("posts").select("*").eq("user_id", profile.id)
                const {data: followers} = await supabase.from("follows").select("*").eq("following_id", profile.id)
                const {data: following} = await supabase.from("posts").select("*").eq("follower_id", profile.id)

                if(posts) {
                    setNumberOfPosts(posts.length)
                }
                if (followers) {
                    setNumberOfFollowers(followers.length)
                }
                if(following) {
                    setNumberOfFollowing(following.length)
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [])


    return (  
        <article>
        {/* hier kommen username, profession, profile_desc und website rein */}
            <div className="flex flex-col items-center gap-2 mb-4">
                <img 
                    className="h-25 aspect-square object-cover rounded-full transition ease-in-out hover:drop-shadow-xl hover:opacity-90" 
                    src={profile?.profile_image_url || `/svg/pic-empty.svg`} 
                    alt={profile?.username} />
                <p className="text-2xl font-bold">{profile?.profile_name || "Anonymous"}</p>
                {profile?.profession && <p className="text-lg font-light">{profile?.profession}</p>}
                {profile?.profile_desc && <p className="text-sm font-extralight text-center">{profile?.profile_desc}</p>}
                {profile?.website && <a className="cursor-pointer text-sm text-blue-500 font-bold" href={profile?.website} target="_blank">{profile?.website}</a>}
            </div>

        {/* hier kommen anzahl von posts, followers und following rein */}
            <div className="grid grid-cols-3 items-center w-full">
                <div className="flex flex-col gap-1 items-center justify-center">
                    <p className="text-2xl font-bold">{numberOfPosts}</p>
                    <p className="text-sm font-extralight">Posts</p>
                </div>
                <div className="flex flex-col gap-1 items-center justify-center">
                    <p className="text-2xl font-bold">{numberOfFollowers}</p>
                    <p className="text-sm font-extralight">Followers</p>
                </div>
                <div className="flex flex-col gap-1 items-center justify-center">
                    <p className="text-2xl font-bold">{numberOfFollowing}</p>
                    <p className="text-sm font-extralight">Following</p>
                </div>
            </div>

        </article>
    );
}

export default ProfileInfo;