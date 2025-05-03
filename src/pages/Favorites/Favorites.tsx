import { useContext } from "react";
import MiniFeed from "../../components/MiniFeed/MiniFeed";
import { mainContext, useAuth } from "../../context/MainProvider";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";
import PostDetails from "../../components/PostDetails/PostDetails";

const Favorites = () => {
    const {openModal} = useContext(mainContext)
    const navigate = useNavigate()
    const {user} = useAuth()

    return (  
        <>
            <Header 
            headerTitle="Favorites" 
            imgLeft={<svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1L1.24808 6.16795C0.654343 6.56377 0.654342 7.43623 1.24808 7.83205L9 13" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>} 
            leftAction={() => navigate(-1)}/>
            <MiniFeed profileId={user?.id} />
            {openModal && <PostDetails/>}
        </>
    );
}

export default Favorites;