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
                <div>
                <svg width="20" height="26" viewBox="0 0 20 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.0433 10.8701C12.7689 10.8701 14.9784 8.66063 14.9784 5.93507C14.9784 3.2095 12.7689 1 10.0433 1C7.31778 1 5.10828 3.2095 5.10828 5.93507C5.10828 8.66063 7.31778 10.8701 10.0433 10.8701Z" fill="currentColor" stroke="currentColor" stroke-width="1.57576"/><path d="M10.3033 14.9398C12.8966 14.9398 15.2146 15.5322 16.8629 16.4593C18.5299 17.397 19.394 18.5976 19.3942 19.7874C19.3942 20.9774 18.5301 22.1787 16.8629 23.1165C15.2146 24.0437 12.8966 24.636 10.3033 24.6361C7.71012 24.6361 5.39209 24.0436 3.74377 23.1165C2.07644 22.1787 1.21252 20.9775 1.21252 19.7874C1.21274 18.5975 2.07665 17.3971 3.74377 16.4593C5.39209 15.5322 7.7101 14.9398 10.3033 14.9398Z" fill="currentColor" stroke="currentColor" stroke-width="1.21212"/></svg>
                </div>
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