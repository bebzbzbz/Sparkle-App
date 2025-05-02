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
        {/* Accordions! */}
            <Header 
                headerTitle="About Sparkle & Team" 
                imgLeft="arrow-back" 
                leftAction={() => navigate(-1)}/>
            <Collapse title="What is Sparkle?" hiddenContent={whatIsSparkle} icon="moon"/>
            <Collapse title="Who made it?" hiddenContent={aboutTheCreators} icon="heart"/>
        </>
    );
}

export default AboutSparkle;