import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";

const Layout = () => {
    return (  
        <>
            <main
                className="px-5 pb-10 mb-30 pt-20">
                <Outlet/>
            </main>
            <NavBar/>
        </>
    );
}

export default Layout;