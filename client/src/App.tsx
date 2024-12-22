import { Map } from "./components";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth.tsx";
import PersistLogin from "./components/PersistLogin.tsx";

import SignUpPage from "./pages/SignUpPage.tsx";
import LogInPage from "./pages/LogInPage.tsx";
import ResponsiveNavBar from "./components/navBar/ResponsiveNavBar.tsx";
import HomePage from "./pages/Homepage.tsx";
import CreatePost from "./components/posts/CreatePost.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import EditProfilePage from "./pages/EditingProfile/EditProfilePage.tsx";
import LeaderboardPage from "./pages/LeaderboardPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import FullPost from "./pages/FullPostPage.tsx";
import PageNotFound from "./pages/PageNotFound.tsx";


// define all the routes for the app
function App() {
  return (
    <>
      <ResponsiveNavBar />
      <Routes>
        <Route element={<PersistLogin />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/map" element={<Map />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/search" element={<SearchPage />} />

          <Route element={<RequireAuth />}>
            <Route path="/create-post" element={<CreatePost />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route path="/post/:post_id" element={<FullPost />} />
          </Route>
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
