import React from 'react';
import { Link } from 'react-router-dom';
import { FaGamepad } from 'react-icons/fa';

const NotFoundPage = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <FaGamepad className="text-6xl text-primary-600 mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">404</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Page not found. The level you're looking for doesn't exist.</p>
            <Link to="/" className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">
                Go Home
            </Link>
        </div>
    );
};

export default NotFoundPage;