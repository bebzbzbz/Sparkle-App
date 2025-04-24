interface HeaderProps {
    headerTitle: string,
    imgLeft: string,
    leftAction?: () => {},
    imgRight?: string,
    rightAction?: () => {}
}

const Header = ({headerTitle, imgLeft, leftAction, imgRight, rightAction} : HeaderProps) => {
    return (  
        <header 
            className="flex justify-between px-20">
            <h1
                className={`flex items-center gap-3 ${rightAction && "cursor-pointer"}`}
                onClick={() => {
                    // wenn eine aktion übergeben wurde, wird diese auslöst, ansonsten geschieht nichts
                    if(!!leftAction) {
                        leftAction
                    }
                }}>
                <img 
                    src={`/svg/${imgLeft}.svg`} 
                    alt="Logo" 
                    className="h-8"/>
                {headerTitle}
            </h1>
            {imgRight && 
            <img 
            src={`/svg/${imgRight}.svg`} 
            alt="Likes" 
            className={`${leftAction && "cursor-pointer"}`}
            onClick={() => {
                if(!!rightAction) {
                    rightAction
                }
            }}/>}
            
        </header>
    );
}

export default Header;