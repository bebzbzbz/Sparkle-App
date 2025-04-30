import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { mainContext } from "../../context/MainProvider";

interface NavLinkProps {
	linkname: string,
	path: string,
	img: string,
    action?: () => void
}

export const NavLink = ({ linkname, path, img, action }: NavLinkProps) => {    
	const location = useLocation()

	return (
		<Link
			to={path}
			className={`flex flex-col items-center gap-1 hover:text-main transition-colors`}
            onClick={action}>
			<img
				// falls die location mit dem linkpath übereinstimmt, wird das filled icon eingesetzt um den active zustand darzustellen
				src={`/svg/${img}${location.pathname === "/" + path ? `-filled` : ""}.svg`}
				className="h-5 w-1/2" />
			{linkname}
		</Link>
	)
}

const NavBar = () => {
    const {setAllSearchedProfiles, setOpenModal} = useContext(mainContext)

    const closePostDetails = (()=> {
        setOpenModal(false)
    })

    return (  
        <nav 
            className="flex w-screen h-20 justify-between border-t-gray-300 border-t-1 pt-5 pb-7 px-8 fixed bottom-0 bg-white text-sm">
            <NavLink 
                linkname="Home" 
                path="home" 
                img="home"
                action={closePostDetails}
            />
            <NavLink 
                linkname="Explore" 
                path="explore" 
                img="explore"
                action={() => {setAllSearchedProfiles(null); closePostDetails()}}
            />
            <NavLink 
                linkname="Upload" 
                path="newpost" 
                img="upload"
                action={closePostDetails}
            />
            <NavLink 
                linkname="Search" 
                path="search" 
                img="search"
                action={() => {setAllSearchedProfiles(null); closePostDetails()}}
            />
            <NavLink
                linkname="Profile" 
                path="profile" 
                img="profile"
                action={closePostDetails}
            />
        </nav>
    );
}

export default NavBar
