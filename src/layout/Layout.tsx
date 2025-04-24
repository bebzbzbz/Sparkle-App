import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";

const Layout = () => {
    return (  
        <>
            <main
                className="px-15 py-10 mb-30">
                <Outlet/>
            </main>
            <NavBar/>
        </>
    );
}

export default Layout;