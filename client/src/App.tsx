import { useState, useEffect} from 'react'

import {Map, SignIn} from "./components"
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css'
import axios from 'axios'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    // useNavigate,
    // Outlet,
} from "react-router-dom";

function Home(){
    const [array, setArray] = useState([])

    const fetchApi = async () => {
        const response = await axios.get("http://localhost:5000");
        setArray(response.data.fruits)
        console.log(response.data.fruits);
    }

    useEffect(() => {
        fetchApi();
    }, []);

    return (
        <>
            {array.map((fruit, index) => (<div key={index}><p>{fruit}</p><br></br></div>))}
        </>
    )
}

function App() {


    return (
        <Router>
            <div>
                <Nav>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/home">Home</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/user/sign-in">Sign in</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/map">Map</Nav.Link>
                    </Nav.Item>
                </Nav>
                {/*Implementing Routes for respective Path */}
                <div>
                    <Routes>
                        <Route path="/home" element={<Home/>}/>
                        <Route path="/user">
                            <Route path="sign-in" element={<SignIn/>}/>
                            {/*<Route path="login" element={<Login/>}/>*/}
                        </Route>
                        <Route path="/map" element={<Map/>}/>
                    </Routes>
                </div>
            </div>
        </Router>
    )
}

export default App
