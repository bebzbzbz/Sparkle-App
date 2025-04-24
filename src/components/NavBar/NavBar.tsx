import { Link, useLocation } from "react-router-dom";

interface NavLinkProps {
    linkname: string,
    path: string,
    img: string
}

export const NavLink = ({linkname, path, img} : NavLinkProps) => {
    const location = useLocation()
    
    return (
        <Link 
            to={path}
            className={`flex flex-col items-center gap-1 hover:text-main transition-colors`}>
            <img 
                // falls die location mit dem linkpath übereinstimmt, wird das filled icon eingesetzt um den active zustand darzustellen
                src={`/svg/${img}${location.pathname === "/" + path ? `-filled` : ""}.svg`} 
                className="h-8 w-1/2"/>
            {linkname}
        </Link>
    )
}

const NavBar = () => {
    return (  
        <nav 
            className="flex w-screen justify-between border-t-gray-300 border-t-1 py-5 px-20">
            <NavLink 
                linkname="Home" 
                path="home" 
                img="home"/>
            <NavLink 
                linkname="Search" 
                path="search" 
                img="search"/>
            <NavLink 
                linkname="Upload" 
                path="newpost" 
                img="upload"/>
            <NavLink 
                linkname="Profile" 
                path="profile" 
                img="profile"/>
        </nav>
    );
}

export default NavBar