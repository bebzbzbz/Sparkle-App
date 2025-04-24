//  hier müssen insgesamt noch params mit den profile_ids verbunden werden

const ProfileInfo = () => {
    return (  
        <article className="p-5">
        {/* hier kommen username, profession, profile_desc und website rein */}
            <div className="flex flex-col items-center justify-cente gap-2 mb-4">
                <div className="h-25 w-25 transition ease-in-out hover:drop-shadow-xl hover:opacity-90">
                    <img className="h-full object-fill rounded-full" src="/public/svg/ProfilePlaceholder.svg" alt="" />
                </div>
                <p className="text-2xl font-bold">username</p>
                <p className="text-lg font-light">profession</p>
                <p className="text-sm font-extralight">profile_desc</p>
                <a className="cursor-pointer text-sm text-blue-500 font-bold" href="">website</a>
            </div>

        {/* hier kommen anzahl von posts, followers und following rein */}
            <div className="flex justify-evenly items-center">
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