import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import useSignOut from "../hooks/useSignOut";
import Spinner from 'react-bootstrap/Spinner';

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
