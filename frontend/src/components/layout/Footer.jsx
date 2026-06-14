import React from 'react';
import { Link } from 'react-router-dom';
import { FaGamepad, FaGithub, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <Link to="/" className="flex items-center gap-2 text-primary-600 dark:text-primary-500 font-bold text-lg">
                        <FaGamepad />
                        <span>GameRank</span>
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} GameRank. Game data provided by RAWG API.
                    </p>
                    <div className="flex gap-4 text-gray-500 dark:text-gray-400 text-lg">
                        <a href="https://github.com" target="_blank" rel="noreferrer"><FaGithub /></a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;