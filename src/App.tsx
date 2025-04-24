import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import Layout from "./layout/Layout"
import SignUp from "./pages/SignUp/SignUp"
import Home from "./pages/Home/Home"
import CommunityProfile from "./pages/CommunityProfile/CommunityProfile"
import SearchAll from "./pages/SearchAll/SearchAll"
import UserProfile from "./pages/UserProfile/UserProfile"
import NewPostImg from "./pages/NewPostImg/NewPostImg"
import NewPostUpload from "./pages/NewPostUpload/NewPostUpload"
import EditProfile from "./pages/EditProfile/EditProfile"
import Login from "./pages/Login/Login"

function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path={"/"} element={<Layout/>}>
      <Route index element={<SignUp/>}/>
      <Route path="login" element={<Login/>}/>
      <Route path="home" element={<Home/>}/>
      <Route path="profile" element={<UserProfile/>}/>
      <Route path="profile/edit" element={<EditProfile/>}/>
      <Route path="users/:userParam" element={<CommunityProfile/>}/>
      <Route path="search" element={<SearchAll/>}/>
      <Route path="newpost" element={<NewPostImg/>}/>
      <Route path="newpost/upload" element={<NewPostUpload/>}/>
    </Route>
  ))

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App