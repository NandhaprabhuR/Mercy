import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthView.css';

export default function AuthView() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic frontend validation
        if (username.length < 3) {
            setStatus('Username must be at least 3 characters.');
            return;
        }
        if (password.length < 6) {
            setStatus('Password must be at least 6 characters.');
            return;
        }

        setStatus('Loading...');

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

        try {
            const res = await fetch(`http://localhost:5001${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok && data.user) {
                // Log them into React AuthContext
                login({
                    id: data.user.id,
                    username: data.user.username,
                    role: data.user.role,
                    token: data.token
                });

                // Redirect Admin to dashboard, Consumer to home
                if (data.user.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                setStatus(data.message || 'Authentication failed.');
            }
        } catch (err) {
            console.error(err);
            setStatus('Network Error.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="brand-logo-text brand-font">NexCart</span>
                    <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            required
                            minLength={3}
                            maxLength={20}
                            pattern="^[a-zA-Z0-9_]+$"
                            title="Username can only contain letters, numbers, and underscores."
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="•••••••• (min 6 chars)"
                        />
                    </div>

                    <button type="submit" className="auth-submit-btn">
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                    {status && <p className="status-msg">{status}</p>}
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            className="toggle-auth-btn"
                            onClick={() => { setIsLogin(!isLogin); setStatus(null); }}
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
