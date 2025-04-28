import { useContext, useRef } from "react";
import ProfilePreviewCard from "../../components/ProfilePreviewCard/ProfilePreviewCard";
import supabase from "../../utils/supabase";
import IUser from "../../interfaces/IUser";
import { mainContext } from "../../context/MainProvider";

const SearchAll = () => {
    const {allSearchedProfiles, setAllSearchedProfiles} = useContext(mainContext)
    const searchUserRef = useRef<HTMLInputElement>(null)

    const handleInput = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()

        const fetchData = async () => {
            try {
                const {data: profiles} = await supabase.from("profiles").select().ilike("username", `%${searchUserRef.current?.value}%`).order("created_at", { ascending: false })

                if(profiles) {
                    setAllSearchedProfiles(profiles || [])
                }
            } catch (error) {
                console.log(error)
            }
        } 
        fetchData()
    }

    return ( 
        <section
            className="flex flex-col gap-7">
            <div
                className="relative">
                <form 
                    className="searchAll"
                    onSubmit={handleInput}
                    >
                    <input 
                        type="text" 
                        placeholder="Search members..." 
                        className="bg-gray-100 rounded-xl w-full px-10 py-4" 
                        ref={searchUserRef}/>
                    <img 
                        src="/svg/search.svg"
                        alt="Magnifying glass"
                        className="absolute h-4 top-5 left-4" />
                </form>
            </div>
            <div
                className="flex flex-col items-center gap-4">
                <img 
                    src="/svg/profile-filled.svg" 
                    alt="Profile Icon" />
                <div
                    className="h-1 bg-main w-full rounded-full"></div>
            </div>
            <article 
                className="flex flex-col gap-4">
                {allSearchedProfiles && allSearchedProfiles.map((profile: IUser) => {
                
                return (<ProfilePreviewCard
                    profile={profile} key={crypto.randomUUID()}
                    />
                )})}
            </article>
        </section>
    );
}

export default SearchAll;