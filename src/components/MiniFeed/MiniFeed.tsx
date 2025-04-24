const MiniFeed = () => {
    return (  
        <article className="mb-20">
            <div className="grid grid-cols-3 justify-items-center gap-3 mb-5">
                <div className="flex gap-2">
                    <img className="h-5 object-fill" src="/public/svg/feed-filled.svg" alt="four rectangles" />
                    <p>Feeds</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {/* hier kommt das map mit den post_images rein */}
                <img className="w-full aspect-square object-cover rounded-2xl transition ease-in-out wover:opacity-80" src="/svg/MiniFeed1.png" alt="" />
                <img className="w-full aspect-square object-cover rounded-2xl transition ease-in-out hover:opacity-80" src="/svg/MiniFeed1.png" alt="" />
                <img className="w-full aspect-square object-cover rounded-2xl transition ease-in-out hover:opacity-80" src="/svg/MiniFeed1.png" alt="" />
            </div>

        </article>
    );
}

export default MiniFeed;