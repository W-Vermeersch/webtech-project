import { Map, Reroute } from "./components";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";
import RequireAuth from "@auth-kit/react-router/RequireAuth";

import SignUpPage from "./pages/SignUpPage.tsx";
import LogInPage from "./pages/LogInPage.tsx";
import NavBar from "./components/navBar/NavBar.tsx";
import HomePage from "./pages/Homepage.tsx";
import CreatePost from "./components/posts/CreatePost.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import LeaderboardPage from "./pages/LeaderboardPage.tsx";

import FullPost from "./components/posts/FullPost.tsx";

/*
<Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/user">
          {<Route path ="userId" element={<HomePage />} />}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="sign-up" element={<SignUpPage />} />
          <Route path="log-in" element={<LogInPage />} />
        </Route>
        <Route path="/map" element={<Map />} />
        <Route path="*" element={<Reroute />} />
      </Routes>
*/



function App() {
  return (
    <>
      <NavBar />
      <FullPost />
      
    </>
  );
}

export default App;
