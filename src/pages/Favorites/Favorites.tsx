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
            <Header headerTitle="Favorites" imgLeft="arrow-back" leftAction={() => navigate(-1)}/>
            <MiniFeed profileId={user?.id} />
            {openModal && <PostDetails/>}
        </>
    );
}

export default Favorites;