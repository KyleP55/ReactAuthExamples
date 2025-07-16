import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const Login = () => {
    const nav = useNavigate();
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    // Change Handler
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // On Native Log In
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                `${BACKEND_URL}/auth/login`,
                form,
                { withCredentials: true }
            );
            nav("/account");
        } catch (err) {
            console.error("Login Error:", err.response?.data || err.message);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Sign In</h2>
                <form onSubmit={handleLogin}>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <div className="button-group">
                        <button type="submit" className="primary">Sign In</button>
                        <button type="button" className="secondary" onClick={() => nav("/createAccount")}>Create Account</button>
                    </div>
                </form>

                <p className="or-divider">or sign in with</p>

                <div className="social-buttons">
                    <a href="http://localhost:5000/auth/google">
                        <button className="google">Google</button>
                    </a>
                    <a href="http://localhost:5000/auth/google">
                        <button className="facebook">Facebook</button>
                    </a>
                    <a href="http://localhost:5000/auth/google">
                        <button className="github">GitHub</button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
