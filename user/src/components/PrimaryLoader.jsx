import React from "react";

const PrimaryLoader = ({ isLoading }) => {
  if (!isLoading) return null;

    return (
        <div>
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                <div className="relative w-13 h-13">
                <div className="absolute inset-0 border-4 border-gray-300 rounded-full animate-spin"></div>
                <div className="absolute inset-0 border-t-4 border-green-600 rounded-full animate-spin-fast"></div>
                </div>
            </div>
            <style>
                {`
                    @keyframes spin-fast {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                    }
                    .animate-spin-fast {
                    animation: spin-fast 0.5s linear infinite;
                    }
                `}
            </style>
        </div>
    );
};

export default PrimaryLoader;
