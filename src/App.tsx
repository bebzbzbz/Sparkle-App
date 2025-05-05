import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from "react-router-dom"
import Layout from "./layout/Layout"
import SignUp from "./pages/SignUp/SignUp"
import Home from "./pages/Home/Home"
import CommunityProfile from "./pages/CommunityProfile/CommunityProfile"
import SearchAll from "./pages/SearchAll/SearchAll"
import UserProfile from "./pages/UserProfile/UserProfile"
import EditProfile from "./pages/EditProfile/EditProfile"
import Login from "./pages/Login/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import Favorites from "./pages/Favorites/Favorites"
import NewPost from "./pages/NewPost/NewPost"
import Explore from "./pages/Explore/Explore"
import AboutSparkle from "./pages/AboutSparkle/AboutSparkle"
import IntroPage from "./pages/IntroPage/IntroPage"

function App() {
	const router = createBrowserRouter(createRoutesFromElements(
		<>
			<Route path="/signup" element={<SignUp />} />
			<Route path="/login" element={<Login />} />
			<Route path="intropage" element={<IntroPage />} />
			<Route element={<ProtectedRoute />}>
				<Route path="/" element={<Layout />}>
					<Route index element={<Navigate to="/IntroPage" replace />} />
					<Route path="home" element={<Home />} />
					<Route path="explore" element={<Explore />} />
					<Route path="profile" element={<UserProfile />} />
					<Route path="profile/edit" element={<EditProfile />} />
					<Route path="users/:userParam" element={<CommunityProfile />} />
					<Route path="search" element={<SearchAll />} />
					<Route path="newpost" element={<NewPost />} />
					<Route path="favorites" element={<Favorites />} />
					<Route path="about-sparkle" element={<AboutSparkle />} />
				</Route>
			</Route>
		</>
	))

	return (
		<>
			<RouterProvider router={router} />
		</>
	)
}

export default App
