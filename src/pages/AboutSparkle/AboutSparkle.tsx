import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Collapse from "../../components/Collapse/Collapse";

const AboutSparkle = () => {
    const navigate = useNavigate()

    const whatIsSparkle : string[] = [
        "test test",
        "hallo",
        "Hallo und hhuhduifhdisufhdshfjkdhfkjdhfkd"
    ]
    const aboutTheCreators : string[] = [
        "test test",
        "we're a team of four:",
        "kiwi",
        "bea",
        "peter",
        "patrick"
    ]

    return (  
        <>
            <Header 
            headerTitle="About Sparkle & Team" 
            imgLeft={<svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1L1.24808 6.16795C0.654343 6.56377 0.654342 7.43623 1.24808 7.83205L9 13" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>}
            leftAction={() => navigate(-1)}/>
            <Collapse title="What is Sparkle?" hiddenContent={whatIsSparkle} icon="moon"/>
            <Collapse title="Who made it?" hiddenContent={aboutTheCreators} icon="heart"/>
        </>
    );
}

export default AboutSparkle;