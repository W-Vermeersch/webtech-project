import { Map, Reroute } from "./components";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth.tsx";
import PersistLogin from "./components/PersistLogin.tsx";

import SignUpPage from "./pages/SignUpPage.tsx";
import LogInPage from "./pages/LogInPage.tsx";
import NavBar from "./components/navBar/NavBar.tsx";
import HomePage from "./pages/Homepage.tsx";
import CreatePost from "./components/posts/CreatePost.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import LeaderboardPage from "./pages/LeaderboardPage.tsx";
import PageNotFound from "./pages/PageNotFound.tsx";

import FullPost from "./pages/FullPostPage.tsx";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path="/create-post" element={<CreatePost />} />
          </Route>
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/post/:id" element={<FullPost />} />
          <Route path="/map" element={<Map />} />
        </Route>

        <Route path="/user">
          <Route path="sign-up" element={<SignUpPage />} />
          <Route path="log-in" element={<LogInPage />} />
        </Route>
        <Route path="/pageNotFound" element={<PageNotFound />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
