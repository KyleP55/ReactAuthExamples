import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function AddPasswordPage() {
    const nav = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!password || !confirmPassword) return setError("All fields are required.");
        if (password !== confirmPassword) return setError("Passwords do not match.");

        try {
            await axios.post(`${BACKEND_URL}/auth/setPassword`, { password }, { withCredentials: true });
            nav("/account");
        } catch (err) {
            console.error("Add Password Error:", err.response?.data || err.message);
            setError(err.response?.data.message || "Something went wrong.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Add Password</h2>
                <form onSubmit={handleSubmit}>
                    <input name="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <input name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <div className="button-group">
                        <button type="submit" className="primary">Create</button>
                        <button type="button" className="danger" onClick={() => nav("/account")}>Back</button>
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default AddPasswordPage;
