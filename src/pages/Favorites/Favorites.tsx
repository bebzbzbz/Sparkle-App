import { useContext } from "react";
import MiniFeed from "../../components/MiniFeed/MiniFeed";
import { mainContext } from "../../context/MainProvider";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";
import PostDetails from "../../components/PostDetails/PostDetails";

const Favorites = () => {
    const {loggedInUser, openModal} = useContext(mainContext)
    const navigate = useNavigate()

    return (  
        <>
            <Header headerTitle="Favorites" imgLeft="arrow-back" leftAction={() => navigate(-1)}/>
            <MiniFeed profileId={loggedInUser?.id} />
            {openModal && <PostDetails/>}
        </>
    );
}

export default Favorites;