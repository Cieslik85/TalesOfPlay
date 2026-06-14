import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorMessage = ({ message = 'Something went wrong.', onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <FaExclamationTriangle className="text-4xl text-red-500 mb-3" />
            <p className="text-gray-700 dark:text-gray-300 mb-4">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                    Try Again
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;