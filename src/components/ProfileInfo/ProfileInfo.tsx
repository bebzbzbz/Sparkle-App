interface ProfileInfoProps {
    profilePicUrl?: string
    username: string,
    name: string,
    profession?: string,
    profile_desc: string,
    website?: string
}

const ProfileInfo = ({profilePicUrl, username, name, profession, profile_desc, website} : ProfileInfoProps) => {
    return (  
        <article>
        {/* hier kommen username, profession, profile_desc und website rein */}
            <div className="flex flex-col items-center gap-2 mb-4">
                <img 
                    className="h-25 aspect-square object-cover rounded-full transition ease-in-out hover:drop-shadow-xl hover:opacity-90" 
                    src={profilePicUrl || `/svg/pic-empty.svg`} 
                    alt={username} />
                <p className="text-2xl font-bold">{name}</p>
                <p className="text-lg font-light">{profession || ""}</p>
                <p className="text-sm font-extralight text-center">{profile_desc}</p>
                <a className="cursor-pointer text-sm text-blue-500 font-bold" href="">{website || ""}</a>
            </div>

        {/* hier kommen anzahl von posts, followers und following rein */}
            <div className="grid grid-cols-3 items-center w-full">
                <div className="flex flex-col gap-1 items-center justify-center">
                    <p className="text-2xl font-bold">1</p>
                    <p className="text-sm font-extralight">Posts</p>
                </div>
                <div className="flex flex-col gap-1 items-center justify-center">
                    <p className="text-2xl font-bold">2</p>
                    <p className="text-sm font-extralight">Followers</p>
                </div>
                <div className="flex flex-col gap-1 items-center justify-center">
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-sm font-extralight">Following</p>
                </div>
            </div>

        </article>
    );
}

export default ProfileInfo;