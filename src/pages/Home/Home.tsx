import Header from "../../components/Header/Header";
import SinglePost from "../../components/SinglePost/SinglePost";

const Home = () => {
    return ( 
        <>
            <Header headerTitle="WhoCares" imgLeft="logo" imgRight1="heart" imgRight2="comment"/>
            <SinglePost/>
        </>
    );
}

export default Home;