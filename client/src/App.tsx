import { useState, useEffect} from 'react'
import {Login} from "./components/login/Login.tsx"
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
    const [count, setCount] = useState(0);
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
            <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
            </button>
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
                    <Nav.Link><Link to="/home">Home</Link></Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link><Link to="/login">Login</Link></Nav.Link>
                </Nav.Item>
            </Nav>
            {/*Implementing Routes for respective Path */}
            <Routes>
                <Route path="/home" element={<Home/>}/>
                <Route path="/login" element={<Login/>}>
                    {/*<Route path="team" element={<Team/>}/>*/}
                    {/*<Route path="company" element={<Company/>}/>*/}
                </Route>
            </Routes>
        </div>
        </Router>
    )
}

export default App
