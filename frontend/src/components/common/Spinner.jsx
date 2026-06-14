import React from 'react';

const Spinner = ({ size = 'md', fullScreen = false }) => {
    const sizes = {
        sm: 'h-5 w-5',
        md: 'h-10 w-10',
        lg: 'h-16 w-16',
    };

    const spinner = (
        <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-primary-600 ${sizes[size]}`} />
    );

    if (fullScreen) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                {spinner}
            </div>
        );
    }

    return <div className="flex items-center justify-center py-8">{spinner}</div>;
};

export default Spinner;