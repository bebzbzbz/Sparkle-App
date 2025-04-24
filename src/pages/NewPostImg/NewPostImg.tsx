import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";

const NewPostImg = () => {
    // kamera/webcam option zum neues foto schießen
    // option zum foto hochladen von galerie
    // werden in supabase storage inserted
    const navigate = useNavigate()

    return ( 
        <>
            <Header headerTitle="New Post" imgLeft="cancel" leftAction={() => navigate(-1)}/>
        </>
    );
}

export default NewPostImg;