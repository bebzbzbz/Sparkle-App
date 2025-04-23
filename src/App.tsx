import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import Layout from "./layout/Layout"
import SignUp from "./pages/SignUp/SignUp"

function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path={"/"} element={<Layout/>}>
      <Route index element={<SignUp/>}/>
    </Route>
  ))

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App