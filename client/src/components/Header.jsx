import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Edit, LogOut } from 'lucide-react';
import { API_BASE_URL } from '../App';

function Header() {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const navigate = useNavigate();
    
    async function logout() {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
            method: 'GET',
            credentials: 'include',
        });
        if (response.ok) {
            setUserInfo(null);
            navigate('/login'); 
        }
    }

    const username = userInfo?.username;

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 mt-4 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-lg">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-white tracking-tighter">
                        Aakhar<span className="text-indigo-500">.</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        {username && (
                            <>
                                <Link to="/create" className="hidden sm:inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                                    <Edit size={16} />
                                    New Post
                                </Link>
                                <button onClick={logout} className="flex items-center gap-2 bg-gray-700 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                                    <LogOut size={16} />
                                    <span className="hidden sm:inline">Logout ({username})</span>
                                </button>
                            </>
                        )}
                        {!username && (
                             <>
                                <Link to="/login" className="text-gray-300 hover:text-white font-semibold transition-colors duration-300">Login</Link>
                                <Link to="/register" className="bg-gray-100 hover:bg-white text-gray-900 font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">Register</Link>
                            </>
                        )}
                    </div>
                </div>
                 {username && (
                    <Link to="/create" className="sm:hidden mt-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
                        <Edit size={16} />
                        Create New Post
                    </Link>
                )}
            </nav>
        </header>
    );
}

export default Header;

