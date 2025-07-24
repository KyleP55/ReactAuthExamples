import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const AdminAccountPage = () => {
    const nav = useNavigate();
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/auth/me`, {
                    withCredentials: true,
                });
                setUser(res.data.user);

                // Fetch all users if admin
                if (res.data.user.role === 'admin') {
                    const userList = await axios.get(`${BACKEND_URL}/admin/users`, {
                        withCredentials: true,
                    });
                    setUsers(userList.data.users);
                } else {
                    nav('/account');
                }
            } catch (err) {
                setError('Failed to fetch user data. Please log in again.');
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(`${BACKEND_URL}/auth/logout`, {}, { withCredentials: true });
            nav('/');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const toggleRole = async (id) => {
        try {
            const res = await axios.patch(`${BACKEND_URL}/admin/role/${id}`, {}, {
                withCredentials: true,
            });
            setUsers((prev) =>
                prev.map((user) =>
                    user._id === id ? { ...user, role: res.data.user.role } : user
                )
            );
        } catch (err) {
            console.error('Role toggle failed:', err.response?.data || err.message);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            await axios.delete(`${BACKEND_URL}/admin/${id}`, {
                withCredentials: true,
            });
            setUsers((prev) => prev.filter((user) => user._id !== id));
        } catch (err) {
            console.error('Delete failed:', err.response?.data || err.message);
        }
    };

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

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto', textAlign: 'center' }}>
            <h2>👑 Admin Dashboard</h2>
            <p>Welcome, <strong>{user.name}</strong></p>
            <p>Email: <strong>{user.email}</strong></p>
            <p>Role: <strong>{user.role}</strong></p>
            <p>Login methods: {user.provider.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}</p>

            <p style={{ color: 'green' }}>You're logged in with full admin access.</p>
            <button className="grey" onClick={handleLogout}>Log Out</button>
            <br />
            <br />
            <button type="button" className="danger" onClick={handleDelete}>Delete Account</button>

            <hr />
            <h3>All Users</h3>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Providers</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u._id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>{u.provider.join(', ')}</td>
                            <td style={{ textAlign: 'right' }}>
                                {u.email != user.email && <>
                                    <button
                                        onClick={() => toggleRole(u._id)}
                                        className="primary"
                                        style={{ marginRight: '0.5rem' }}
                                    >
                                        Make {u.role === 'admin' ? 'User' : 'Admin'}
                                    </button>
                                    <button
                                        onClick={() => deleteUser(u._id)}
                                        className="danger"
                                    >
                                        Delete
                                    </button>
                                </>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminAccountPage;
