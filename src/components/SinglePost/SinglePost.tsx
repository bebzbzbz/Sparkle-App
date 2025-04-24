import ProfilePreviewCard from "../ProfilePreviewCard/ProfilePreviewCard";

interface SinglePost {
    
}

const SinglePost = () => {
    return (  
        <article className="flex flex-col gap-4 items-center justify-center mb-10">
            <ProfilePreviewCard/>
            {/* hier muss dann das gefetchte bild rein */}
            <div className="h-[100vw - 10px] w-[100vw - 10px] mb-2 transition ease-in-out hover:opacity-80 hover:drop-shadow-xl cursor-pointer">
                <img className="h-full w-full object-cover rounded-4xl" src="/public/svg/SinglePostPlaceholder.png" alt="placeholder" />

            </div>
            
            <div className="flex gap-6 self-start justify-start items-center">
                <div className="flex justify-between items-center gap-2">
                    {/* das herz braucht noch eine toggle funktion, die auch mit dem backend verbunden sein muss */}
                    <div className="cursor-pointer h-6 w-6 transition ease-in-out hover:drop-shadow-xl">
                        <img className="h-full object-fill"  src="/svg/heart-filled.svg" alt="heart emoji filled" />
                    </div>
                    {/* hier müssen die gefetchte anzahl an likes rein */}
                    <p>443</p>
                </div>
                
                <div className="flex justify-between items-center gap-2">
                    <div className="h-6 w-6 cursor-pointer transition ease-in-out hover:drop-shadow-xl">
                        <img className="h-full object-fill" src="/svg/comment.svg" alt="speechbubble" />
                    </div>
                    {/* hier müssen die gefetchte anzahl von comments rein */}
                    <p>264</p>
                </div>
                
                <img src="/svg/message.svg" alt="" />
            </div>

        </article>
            
        
    );
}

export default SinglePost;