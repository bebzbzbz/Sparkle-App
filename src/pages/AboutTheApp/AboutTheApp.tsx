import { useNavigate } from "react-router-dom";
import Accordion from "../../components/Accordion/Accordion";
import Header from "../../components/Header/Header";

const AboutTheApp = () => {
    const navigate = useNavigate()

    const whatIsSparkle : string[] = [
        "test test",
        "hallo"
    ]
    const aboutTheCreators : string[] = [
        "test test",
        "hallo",
        "we're a team of four:",
        "kiwi",
        "bea",
        "peter",
        "patrick"
    ]

    return (  
        <>
        {/* Accordions! */}
            <Header headerTitle="About the App" imgLeft="arrow-back" leftAction={() => navigate(-1)}/>
            <Accordion title="What is Sparkle?" hiddenContent={whatIsSparkle}/>
            <Accordion title="About the Creators!" hiddenContent={aboutTheCreators}/>
        </>
    );
}

export default AboutTheApp;