import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";

const Layout = () => {
    const location = useLocation()
    const newPostPage = location.pathname.includes("newpost")
    const editProfilePage = location.pathname === "profile/edit"
    const searchPage = location.pathname === "/search"

    return (  
        <>
            <main
                className={`px-5 ${!newPostPage && !editProfilePage ? "pb-10" : "pb-5"} pb-10 mb-30 ${!newPostPage && !searchPage ? "pt-20" : "pt-7"}`}>
                <Outlet/>
            </main>
            {
            !newPostPage && !editProfilePage && (
                <NavBar/>
            )}
        </>
    );
}

export default Layout;