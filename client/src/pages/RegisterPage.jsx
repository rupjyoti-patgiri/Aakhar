import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { API_BASE_URL } from '../App';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    async function handleRegister(ev) {
        ev.preventDefault();
        setError('');
        setSuccess('');
        try {
             const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
                method: 'POST',
                body: JSON.stringify({ username, email, password }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status === 201) {
                setSuccess('Registration successful! You can now log in.');
                setUsername('');
                setEmail('');
                setPassword('');
            } else {
                const errData = await response.json();
                setError(errData.message || 'Registration failed.');
            }
        } catch(e) {
            setError('An error occurred. Please try again.');
        }
    }

    return (
        <div className="flex items-center justify-center pt-16">
            <form onSubmit={handleRegister} className="w-full max-w-md bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 backdrop-blur-sm shadow-2xl shadow-indigo-900/20">
                <h1 className="text-3xl font-bold text-white text-center mb-6">Create an Account</h1>
                {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center">{error}</div>}
                {success && <div className="bg-green-500/20 text-green-300 p-3 rounded-lg mb-4 text-center">{success}</div>}
                <div className="space-y-6">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" placeholder="Username"
                               value={username} onChange={ev => setUsername(ev.target.value)}
                               className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pr-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
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
                <button type="submit" className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105">Register</button>
                 <p className="text-center text-gray-400 mt-6">
                    Already have an account? <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">Login here</Link>
                </p>
            </form>
        </div>
    );
}

export default RegisterPage;
