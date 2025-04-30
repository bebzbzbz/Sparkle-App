import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";

const Layout = () => {
    const location = useLocation()
    const editProfilePage = location.pathname === "/profile/edit"
    const searchPage = location.pathname === "/search"

    return (  
        <>
            <main
                className={`px-3 ${!editProfilePage ? "mb-30" : "mb-0"} pb-10 ${!searchPage ? "pt-20" : "pt-4"}`}>
                <Outlet/>
            </main>
            {
            !editProfilePage && (
                <NavBar/>
            )}
        </>
    );
}

export default Layout;