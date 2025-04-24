import ProfilePreviewCard from "../../components/ProfilePreviewCard/ProfilePreviewCard";

const SearchAll = () => {
    return ( 
        <section
            className="flex flex-col gap-10">
            <div
                className="relative">
                <input 
                    type="text" 
                    placeholder="Search members..." 
                    className="bg-gray-100 rounded-xl w-full px-10 py-4" />
                    <img 
                        src="/svg/search.svg"
                        alt="Magnifying glass"
                        className="absolute h-4 top-5 left-4" />
            </div>
            <div
                className="flex flex-col items-center gap-4">
                <img 
                    src="/svg/profile-filled.svg" 
                    alt="Profile Icon" />
                <div
                    className="h-1 bg-main w-full rounded-full"></div>
            </div>
            <article>
                {/* hier durch fetch mappen für gefundene members */}
                <ProfilePreviewCard/>
            </article>
        </section>
    );
}

export default SearchAll;