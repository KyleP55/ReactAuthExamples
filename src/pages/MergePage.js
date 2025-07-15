import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function MergePage() {
    const nav = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const email = searchParams.get('email');
    const [password, setPassword] = useState('');
    const provider = searchParams.get('provider');
    const providerId = searchParams.get('providerId');

    const handleMerge = async () => {
        if (provider.includes('local') && password.length === 0) return setError('Password required for merge');
        setLoading(true);
        try {
            const res = await axios.post(`${BACKEND_URL}/auth/merge`, {
                email,
                provider,
                providerId,
                password
            }, { withCredentials: true });

            if (res.data.success) {
                nav('/account');
            } else {
                setError('Merge failed.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        nav('/');
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto', textAlign: 'center' }}>
            <h2>Merge Account</h2>
            <p>
                An account with the email <strong>{email}</strong> already exists.
            </p>
            <p>
                Would you like to link your <strong>{provider}</strong> account to your existing account?
            </p>
            {provider.includes('local') &&
                <input name="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ marginTop: '1.5rem' }}>
                <button onClick={handleMerge} disabled={loading} style={{ marginRight: '1rem' }}>
                    {loading ? 'Merging...' : 'Yes, merge accounts'}
                </button>
                <button onClick={handleCancel} disabled={loading}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default MergePage;