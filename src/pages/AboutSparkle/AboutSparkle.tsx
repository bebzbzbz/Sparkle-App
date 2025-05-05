import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Collapse from "../../components/Collapse/Collapse";
import Socials from "../../components/Socials/Socials";

const AboutSparkle = () => {
    const navigate = useNavigate()

    const whatIsSparkle : string[] = [

        "Sparkle was created to be a second home for anyone who likes using social media but doesn't feel so cozy around the established ones.","On here you can share moments of joy and positivity to spread your spark with others around you. The goal of sparkle is to connect with other people and yourself and create a mindfulness for the little things, that make you happy everyday."
    ]
    const aboutTheCreators : string[] = [
        "This App was created as the final project in a frontend bootcamp. We put lots of sparks into this so feel free to check us out below.",
    ]

    return (  
        <>
        <Header 
            headerTitle="about sparkle" 
            imgLeft={<svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1L1.24808 6.16795C0.654343 6.56377 0.654342 7.43623 1.24808 7.83205L9 13" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>}
            imgLeftHeight="h-5"
            leftAction={() => navigate(-1)}/>

        <div className="flex flex-col justify-between h-full">
            <div className="mt-5">
                <Collapse 
                    title="What is Sparkle?" 
                    hiddenContent={whatIsSparkle} 
                    icon={
                    <svg width="35" height="34" viewBox="0 0 35 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.398 1.36936C18.946 0.167986 20.7501 0.609407 20.6815 1.92809L20.2672 9.89533C20.2214 10.7767 21.113 11.4027 21.9264 11.0602L27.3101 8.79343C28.4459 8.31518 29.4757 9.65902 28.7184 10.6314L25.0488 15.3435C24.5623 15.9682 24.8058 16.8846 25.5381 17.1855L33.2776 20.3651C34.457 20.8497 34.1615 22.5969 32.8884 22.6667L25.8285 23.0536C24.9878 23.0997 24.4564 23.9766 24.8045 24.7432L27.9686 31.7097C28.5049 32.8903 27.0426 33.9613 26.0788 33.0939L19.1903 26.8942C18.7283 26.4784 18.0249 26.4856 17.5715 26.9107L11.2095 32.8751C10.3933 33.6402 9.06713 32.9666 9.2035 31.8563L10.1168 24.42C10.2013 23.7326 9.68625 23.1173 8.99472 23.0794L1.46516 22.6667C0.192041 22.5969 -0.103435 20.8497 1.07594 20.3651L8.87839 17.1596C9.59116 16.8668 9.84533 15.9864 9.3983 15.3587L3.51779 7.10208C2.77252 6.05567 3.97553 4.73017 5.08908 5.37081L13.0458 9.9484C13.6571 10.3001 14.4384 10.0495 14.7311 9.40785L18.398 1.36936Z" fill="#B3BE31"/>
                    </svg>}
                />

                <Collapse 
                    title="Who made it?" 
                    hiddenContent={aboutTheCreators} 
                    icon={
                    <svg width="53" height="42" viewBox="0 0 53 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M43.1767 16.4829C42.9187 15.4509 34.1252 15.5795 33.1536 15.5717C31.2415 15.5564 28.1008 16.1057 26.3196 15.1161C25.0582 14.4153 21.308 15.5163 21.308 13.4625C21.308 11.8158 20.7005 10.1333 20.7005 8.58588C20.7005 7.05967 19.7893 5.89276 19.7893 4.33362C19.7893 3.6194 19.5592 3.10031 19.4856 2.51123C19.4075 1.88625 18.2707 1.54736 18.2707 2.37624C18.2707 5.26836 17.4418 4.33362 15.0815 4.33362C14.3208 4.33362 13.6503 4.41733 12.9722 4.02989C12.5836 3.80781 13.0293 0.294271 12.196 1.12756C11.653 1.67061 11.1735 2.82486 10.9642 3.55742C10.9486 3.61204 9.87626 4.4278 9.69868 4.56986C8.7715 5.31161 5.00935 4.63736 3.82653 4.63736C3.23918 4.63736 1.28541 5.46735 1.02544 5.98728C0.766889 6.50438 2.55536 7.8203 2.9322 8.1134C3.45015 8.51625 3.98393 8.93891 4.48461 9.32833C4.82521 9.59324 5.41304 9.531 5.81766 9.73331C6.27586 9.96241 6.33179 10.4343 6.72886 10.6445C7.83801 11.2317 8.24752 10.5866 8.24752 12.2307C8.24752 13.5468 8.24752 14.863 8.24752 16.1792C8.24752 21.0024 8.16666 26.1471 9.44557 30.6233C9.98271 32.5033 9.3369 34.6527 9.91805 36.5124C10.24 37.5427 10.3736 38.1615 10.3736 36.5967C10.3736 35.8514 10.6774 35.1732 10.6774 34.555C10.6774 33.7533 10.1124 29.3322 10.7449 28.6997C11.2135 28.231 12.0937 31.2092 12.196 31.6695C12.6031 33.5011 12.6934 35.3766 13.0397 37.2379C13.1952 38.0737 13.668 38.7725 13.7147 39.5666C13.7431 40.0487 14.7765 41.094 14.9128 40.1403C15.2861 37.5266 16.4483 34.7317 16.4483 32.1251C16.4483 31.3658 16.4483 30.6065 16.4483 29.8471C16.4483 28.3973 17.9969 28.9359 19.1819 28.9359C22.5906 28.9359 26.2603 29.5434 29.5088 29.5434C30.9824 29.5434 32.4561 29.5434 33.9298 29.5434C34.4416 29.5434 34.9535 29.5434 35.4653 29.5434C38.016 29.5434 37.8086 35.8886 37.9627 37.6092C38.0558 38.6494 37.6164 42.6268 39.1607 40.0728C39.9341 38.7937 39.9867 36.6411 40.8819 35.618C41.4905 34.9224 41.7384 33.0544 41.9449 32.1251C42.0259 31.7607 41.9618 31.2332 41.9618 32.0408C41.9618 33.4132 41.9618 34.7856 41.9618 36.158C41.9618 37.3339 41.2425 40.8595 43.008 39.0941C44.095 38.0071 44.5922 36.5015 45.0666 35.0781C45.6097 33.4488 45.3028 31.4237 45.3028 29.6953C45.3028 27.7034 46.214 25.6742 46.214 23.6206C46.214 21.2125 49.8534 20.0196 50.1457 17.681C50.2422 16.9089 50.5887 15.6457 51.1413 15.0317C51.5972 14.5252 51.6112 12.8828 51.8162 12.18C52.044 11.3991 52.2226 7.49554 51.31 9.8683C50.5714 11.7887 49.2983 14.137 47.8002 15.3355C46.4679 16.4013 44.5629 16.7866 42.873 16.7866" stroke="currentColor" stroke-width="1.32164" stroke-linecap="round"/>
                    <path d="M44.9991 21.6463C44.2022 21.7349 44.3418 22.7236 43.9191 22.8444C43.2499 23.0356 43.3784 23.216 42.873 23.4687" stroke="currentColor" stroke-width="1.32164" stroke-linecap="round"/>
                    <path d="M42.873 21.3426C42.9514 22.0477 43.6957 22.8803 44.088 23.4687" stroke="currentColor" stroke-width="1.32164" stroke-linecap="round"/>
                    <path d="M13.1073 6.45982C13.1073 6.85687 13.1247 6.90668 12.8035 7.06729" stroke="currentColor" stroke-width="1.32164" stroke-linecap="round"/>
                    <path d="M10.3737 5.85225C10.0656 5.88648 9.75376 6.05888 9.46246 6.15598" stroke="currentColor" stroke-width="1.32164" stroke-linecap="round"/>
                    <path d="M1.56542 5.85233C1.64158 4.63376 5.35824 5.5486 2.17288 5.5486C0.877724 5.5486 2.38458 4.88359 2.15601 5.68359C2.05867 6.02428 0.740075 5.85233 2.17288 5.85233" stroke="currentColor" stroke-width="1.32164" stroke-linecap="round"/>
                    </svg>}
                    extraElement= {<div className=" grid grid-cols-2 gap-x-10 gap-5 justify-center">
                    <Socials 
                        text="Bea"
                        linkG="https://github.com/bebzbzbz"
                        linkL="https://www.linkedin.com/in/beatrice-balzer/"
                        
                    />
                    <Socials 
                        text="Kiwi"
                        linkG="https://github.com/KiBohr"
                        linkL="https://www.linkedin.com/in/kiwi-b-3380bb352/"
                        
                    />
                    <Socials 
                        text="Peter"
                        linkG="https://github.com/PeterWolf242"
                        linkL="https://www.linkedin.com/in/peter-knappe-5323ab355/"
                        
                    />
                    <Socials 
                        text="Patrick"
                        linkG="https://github.com/PatrickZantz"
                        linkL="https://www.linkedin.com/in/beatrice-balzer/"
                        
                    />
                </div>}
                />
            </div>

    </div>
    </>
    );
}

export default AboutSparkle;