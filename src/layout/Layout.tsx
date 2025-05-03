import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";

const Layout = () => {
	const location = useLocation()
	const editProfilePage = location.pathname === "profile/edit"
	const searchPage = location.pathname === "/search"

	return (
		<>
			<main
				className={`px-4 ${!editProfilePage ? "pb-10" : "pb-5"} pb-10 mb-30 ${searchPage && "pt-7"}`}>
				<Outlet />
			</main>
			{
				!editProfilePage && (
					<NavBar />
				)}
		</>
	);
}

export default Layout;
