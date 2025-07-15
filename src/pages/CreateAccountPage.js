import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const Register = () => {
    const nav = useNavigate();
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        name: "",
        dob: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // Change Handler
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Create Account
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.dob || !form.password || !form.confirmPassword) return;

        if (form.password !== form.confirmPassword) {
            return setError('Passwords do not match');
        }

        const { name, dob, email, password } = form;

        try {
            const res = await axios.post(
                `${BACKEND_URL}/auth/register`,
                { name, dob, email, password },
                { withCredentials: true }
            );

            console.log("Register Success:", res.data);
            nav("/account");
        } catch (err) {
            console.error("Register Error:", err.response?.data || err.message);
            setError(err.response?.data.message);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Create Account</h2>
                <form onSubmit={handleCreate}>
                    <input name="name"
                        type="text"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <input name="dob"
                        type="date"
                        placeholder="Date of Birth"
                        value={form.dob}
                        onChange={handleChange}
                        required
                    />
                    <input name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <input name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <div className="button-group">
                        <button type="submit" className="primary">Create</button>
                        <button type="button" className="danger" onClick={() => nav("/")}>Back</button>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Register;
