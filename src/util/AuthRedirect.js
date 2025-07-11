import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function AuthRedirect({ children }) {
    const [isAuth, setIsAuth] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        async function checkAuth() {
            try {
                const refresh = await axios.post(
                    `${BACKEND_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                console.log(refresh)

                const res = await axios.get(
                    `${BACKEND_URL}/auth/me`,
                    { withCredentials: true },
                );
                if (res) setIsAuth(true); else setIsAuth(false);
            } catch (err) {
                setIsAuth(false);
                nav("/");
            }
        }

        checkAuth();
    }, [nav]);

    if (isAuth === null) return <p>Loading...</p>;

    return isAuth ? children : null;
}

export default AuthRedirect;