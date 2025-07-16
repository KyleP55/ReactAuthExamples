import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const AccountPage = () => {
    const nav = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/auth/me`, {
                    withCredentials: true,
                });
                setUser(res.data.user);
            } catch (err) {
                setError('Failed to fetch user data. Please log in again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(`${BACKEND_URL}/auth/logout`,
                {},
                { withCredentials: true }
            );
            nav('/');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Delete account?')) return;

        try {
            const res = await axios.delete(`${BACKEND_URL}/auth`, { withCredentials: true });
            if (res) {
                alert('Account Deleted');
                nav('/');
            }
        } catch (err) {
            console.error('Delete failed:', err.message);
        }
    };

    if (loading) return <p>Loading account info...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ maxWidth: '500px', margin: '2rem auto', textAlign: 'center' }}>
            <h2>✅ Authenticated</h2>
            <p>Welcome, <strong>{user.name || 'User'}</strong>!</p>
            <p>Email: <strong>{user.email}</strong></p>
            <p>Role: <strong>{user.role}</strong></p>
            <p>Login methods: {user.provider.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}</p>
            {!user.provider.includes('local') && <button onClick={() => nav('/addPassword')}>Add Password</button>}
            <p style={{ color: 'green' }}>You're logged in with full access.</p>
            <button type="button" className="grey" onClick={handleLogout}>Log Out</button>
            <br />
            <br />
            <button type="button" className="danger" onClick={handleDelete}>Delete Account</button>
        </div>
    );
};

export default AccountPage;
