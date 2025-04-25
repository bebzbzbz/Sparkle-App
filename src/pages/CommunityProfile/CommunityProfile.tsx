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
                const {data: profiles} = await supabase.from("profiles").select("*").eq("id", userParam)

                if(profiles) {
                    // der fetch gibt einen array zurück, deshalb müssen wir das erste objekt selektieren
                    setCommunityProfile(profiles[0])
                }
            } catch (error) {
                console.error(error)
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
                imgRight1="options"/>
                <ProfileInfo 
                    profile={communityProfile}/>
                <MainButton 
                    textContent="Follow" 
                    type="button" 
                    icon="follow"/>
                <MiniFeed profile={communityProfile}/>
            </section>
        );
    }
}

export default CommunityProfile;