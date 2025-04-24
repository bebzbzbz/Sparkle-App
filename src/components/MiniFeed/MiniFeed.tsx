const MiniFeed = () => {
    return (  
        <article className="p-5 mb-20">
            <div className="flex items-center justify-start gap-3 mb-5">
                <div className="h-5 w-5">
                    <img className="h-full object-fill" src="/public/svg/feed-filled.svg" alt="four rectangles" />
                </div>
                <p>Feeds</p>
            </div>
            <div className="grid gird-col-3">
                <div className="h-30 w-30 ">
                    {/* hier kommt das map mit den post_images rein */}
                    <img className="h-full object-fill rounded-2xl transition ease-in-out hover:opacity-80" src="/public/svg/MiniFeed1.png" alt="" />
                </div>
            </div>

        </article>
    );
}

export default MiniFeed;