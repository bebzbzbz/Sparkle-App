import { useEffect, useState } from "react";
import MainButton from "../../components/MainButton/MainButton";
import MiniFeed from "../../components/MiniFeed/MiniFeed";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import IUser from "../../interfaces/IUser";
import Header from "../../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../utils/supabase";

const CommunityProfile = () => {
    const {userParam} = useParams()

    const [communityProfile, setCommunityProfile] = useState<IUser | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // fetch der profile, die mit der id des users/des params übereinstimmen
                const {data: profile} = await supabase.from("profiles").select("*").eq("id", userParam)

                if(profile) {
                    // der fetch gibt einen array zurück, deshalb müssen wir das erste objekt selektieren
                    setCommunityProfile(profile[0] as unknown as IUser)
                }
            } catch (error) {
                console.log(error)
            }
        } 
        fetchData()
    }, [])

    const navigate = useNavigate()

    if(communityProfile === null) {
        return (
            <section>
                <h2 className="text-center">Loading profile...</h2>
            </section>
        )
    } else {
        return (  
            <section className="flex flex-col gap-5">
                <Header 
                headerTitle={communityProfile?.username || ""} 
                imgLeft="arrow-back"
                leftAction={() => navigate(-1)}
                iconsRight={[
                    { name: "options", onClick: () => {}, alt: "Optionen" }
                ]}
                />
                <ProfileInfo 
                    profilePicUrl={communityProfile?.profile_image_url} 
                    username={communityProfile?.username || ""} 
                    name={communityProfile?.profile_name || ""}
                    profession={communityProfile?.profession || ""} 
                    profile_desc={communityProfile?.profile_desc || ""} 
                    website={communityProfile?.website || ""}/>
                <MainButton 
                    textContent="Follow" 
                    type="button" 
                    icon="follow"/>
                <MiniFeed/>
            </section>
        );
    }
}

export default CommunityProfile;