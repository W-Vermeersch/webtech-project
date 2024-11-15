import { useState, useEffect } from "react";

import { Map, Reroute } from "./components";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import RouteToServer from "./infos.ts";
import SignUpPage from "./pages/SignUpPage.tsx";
import NavBar from "./components/navBar/NavBar.tsx";

function Home() {
  const [array, setArray] = useState([]);

  const fetchApi = async () => {
    const response = await axios.get(RouteToServer("/"));
    setArray(response.data.fruits);
    console.log(response.data.fruits);
  };

  useEffect(() => {
    fetchApi();
  }, []);

  return array.map((fruit, index) => (
    <div key={index}>
      <p>{fruit}</p>
      <br />
    </div>
  ));
}

function App() {
  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/user">
          <Route path="sign-up" element={<SignUpPage />} />
          {/*<Route path="login" element={<Login/>}/>*/}
        </Route>
        <Route path="/map" element={<Map />} />
        <Route path="*" element={<Reroute />} />
      </Routes>
    </>
  );
}

export default App;
