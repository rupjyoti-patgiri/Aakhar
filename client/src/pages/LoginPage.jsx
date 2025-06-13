import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Mail, Lock } from 'lucide-react';
import { API_BASE_URL } from '../App';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setUserInfo } = useContext(UserContext);
    const navigate = useNavigate();

    async function handleLogin(ev) {
        ev.preventDefault();
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setUserInfo(data);
                navigate('/');
            } else {
                 const errData = await response.json();
                 setError(errData.message || 'Login failed. Please check your credentials.');
            }
        } catch (e) {
            setError('An error occurred. Please try again.');
        }
    }

    return (
        <div className="flex items-center justify-center pt-16">
            <form onSubmit={handleLogin} className="w-full max-w-md bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 backdrop-blur-sm shadow-2xl shadow-indigo-900/20">
                <h1 className="text-3xl font-bold text-white text-center mb-6">Welcome Back</h1>
                {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center">{error}</div>}
                <div className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="email" placeholder="Email Address"
                               value={email} onChange={ev => setEmail(ev.target.value)}
                               className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pr-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="password" placeholder="Password"
                               value={password} onChange={ev => setPassword(ev.target.value)}
                               className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pr-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                </div>
                <button type="submit" className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105">Login</button>
                <p className="text-center text-gray-400 mt-6">
                    Don't have an account? <Link to="/auth/signup" className="font-semibold text-indigo-400 hover:text-indigo-300">Register here</Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;
