import { Map, Reroute } from "./components";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage.tsx";
import NavBar from "./components/navBar/NavBar.tsx";
import HomePage from "./pages/Homepage.tsx";
import CreatePost from "./components/posts/CreatePost.tsx";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/user">
          {/*<Route path ="userId" element={<HomePage />} />*/}
          <Route path="sign-up" element={<SignUpPage />} />
          <Route path="login" element={<HomePage />} />
        </Route>
        <Route path="/create-post" element={<CreatePost/>}></Route>
        <Route path="/map" element={<Map />} />
        <Route path="*" element={<Reroute />} />
      </Routes>
    </>
  );
}

export default App;
