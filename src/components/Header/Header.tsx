import { useNavigate } from "react-router-dom";

interface HeaderProps {
    headerTitle: string,
    imgLeft: string,
    leftLinkDestination?: string,
    imgRight1?: string,
    rightAction1?: () => void,
    imgRight2?: string,
    rightAction2?: () => void,
    imgRight3?: string,
    rightAction3?: () => void
}

const Header = ({headerTitle, imgLeft, leftLinkDestination, imgRight1, imgRight2, imgRight3, rightAction1, rightAction2, rightAction3} : HeaderProps) => {
    const navigate = useNavigate();

    return (  
        <header 
            className="flex justify-between px-20">
            <h1
                className={`flex items-center gap-3 ${leftLinkDestination && "cursor-pointer"}`}
                onClick={() => {
                    // wenn eine aktion übergeben wurde, wird diese auslöst, ansonsten geschieht nichts
                    if(!!leftLinkDestination) {
                        navigate(`/${leftLinkDestination}`)
                    }
                }}>
                <img 
                    src={`/svg/${imgLeft}.svg`} 
                    alt="Logo" 
                    className="h-8"/>
                {headerTitle}
            </h1>
            <div
                className="flex gap-5">
                {imgRight1 && 
                <img 
                src={`/svg/${imgRight1}.svg`} 
                alt="Likes" 
                className={`${rightAction1 && "cursor-pointer"}`}
                onClick={() => {
                    if(!!rightAction1) {
                        rightAction1
                    }
                }}/>}
                {imgRight2 && 
                <img 
                src={`/svg/${imgRight2}.svg`} 
                alt="Likes" 
                className={`${rightAction2 && "cursor-pointer"}`}
                onClick={() => {
                    if(!!rightAction2) {
                        rightAction2
                    }
                }}/>}
                {imgRight3 && 
                <img 
                src={`/svg/${imgRight3}.svg`} 
                alt="Likes" 
                className={`${rightAction3 && "cursor-pointer"}`}
                onClick={() => {
                    if(!!rightAction3) {
                        rightAction3
                    }
                }}/>}
            </div>
        </header>
    );
}

export default Header;