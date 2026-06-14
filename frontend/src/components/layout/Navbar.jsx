import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGamepad, FaSearch, FaUserCircle, FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/games?search=${encodeURIComponent(search.trim())}`);
            setSearch('');
            setMenuOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    return (
        <nav className="bg-white dark:bg-dark-800 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2 text-primary-600 dark:text-primary-500 font-bold text-xl">
                        <FaGamepad />
                        <span>GameRank</span>
                    </Link>

                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search games..."
                                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        </div>
                    </form>

                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/games" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-500 font-medium">
                            Browse
                        </Link>
                        <Link to="/rankings" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-500 font-medium">
                            Rankings
                        </Link>
                        <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 text-lg" aria-label="Toggle theme">
                            {theme === 'light' ? <FaMoon /> : <FaSun />}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link to={`/profile/${user.username}`} className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-primary-600">
                                    <FaUserCircle className="text-xl" />
                                    <span className="font-medium">{user.username}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-dark-900 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-dark-700 font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="px-3 py-1.5 rounded-lg text-gray-700 dark:text-gray-200 hover:text-primary-600 font-medium">
                                    Login
                                </Link>
                                <Link to="/register" className="px-3 py-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-medium">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    <button className="md:hidden text-2xl text-gray-700 dark:text-gray-200" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {menuOpen && (
                    <div className="md:hidden pb-4 space-y-3">
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search games..."
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </form>
                        <Link to="/games" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-200 font-medium">
                            Browse Games
                        </Link>
                        <Link to="/rankings" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-200 font-medium">
                            Rankings
                        </Link>
                        <button onClick={toggleTheme} className="block text-gray-700 dark:text-gray-200 font-medium">
                            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                        </button>
                        {user ? (
                            <>
                                <Link to={`/profile/${user.username}`} onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-200 font-medium">
                                    Profile ({user.username})
                                </Link>
                                <button onClick={handleLogout} className="block text-left w-full text-gray-700 dark:text-gray-200 font-medium">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-200 font-medium">
                                    Login
                                </Link>
                                <Link to="/register" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-200 font-medium">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;