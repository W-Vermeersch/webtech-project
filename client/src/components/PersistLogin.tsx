import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import useSignOut from "../hooks/useSignOut";
import Spinner from 'react-bootstrap/Spinner';


// Implemented with the help of the following tutorial: https://www.youtube.com/watch?v=27KeYk-5vJw&list=PL0Zuz27SZ-6PRCpm9clX0WiBEMB70FWwd&index=5
// This component is used to check if the user has a valid token and refresh it if necessary for the user to stay logged in

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    const signOut = useSignOut();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
                signOut();
            }
            finally {
                setIsLoading(false);
            }
        }

        !auth?.token ? verifyRefreshToken() : setIsLoading(false);

    }, [])

    return (
        <>
        {isLoading ? <Spinner animation="border" /> : <Outlet />}
        </>
    )

}

export default PersistLogin;
