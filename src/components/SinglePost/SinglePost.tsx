import ProfilePreviewCard from "../ProfilePreviewCard/ProfilePreviewCard";

interface SinglePost {
    
}

const SinglePost = () => {
    return (  
        <article className="flex flex-col gap-2 items-center justify-center mb-10">
            <ProfilePreviewCard/>
            <div className="h-[60vh] w-[80vw] mb-2">
                <img className="h-full w-full object-cover rounded-4xl" src="/public/svg/SinglePostPlaceholder.png" alt="placeholder" />
            </div>
            
            <div className="flex gap-10 self-start px-15 justify-start items-center">
                <div className="flex justify-between items-center gap-2">
                    <div className="h-8 w-8">
                        <img className="h-full object-fill"  src="/public/svg/heart-filled.svg" alt="heart emoji filled" />
                    </div>
                    <p className="">443</p>
                </div>
                
                <div className="flex justify-between items-center gap-2">
                    <div className="h-8 w-8">
                         <img className="h-full object-fill" src="/public/svg/comment.svg" alt="speechbubble" />
                    </div>
                    <p>264</p>
                </div>
                
            </div>

        </article>
            
        
    );
}

export default SinglePost;