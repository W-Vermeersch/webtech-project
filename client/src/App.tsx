import { useState, useEffect} from 'react'
import {SignIn} from "./components/login/SignIn.tsx"
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
                    <Nav.Link as={Link} to="/home">Home</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/sign-in">Sign in</Nav.Link>
                </Nav.Item>
            </Nav>
            {/*Implementing Routes for respective Path */}
            <Routes>
                <Route path="/home" element={<Home/>}/>
                <Route path="/sign-in" element={<SignIn/>}>
                    {/*<Route path="team" element={<Team/>}/>*/}
                    {/*<Route path="company" element={<Company/>}/>*/}
                </Route>
            </Routes>
        </div>
        </Router>
    )
}

export default App
