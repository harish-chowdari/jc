import React from 'react';

const SecondaryLoader = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="w-5 m-[2px] h-5 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
    );
};

export default SecondaryLoader;