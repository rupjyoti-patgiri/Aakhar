import React from 'react';

function SkeletonPost() {
    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-gray-700/50 animate-pulse">
            <div className="w-full h-64 bg-gray-700 rounded-lg"></div>
            <div className="mt-4">
                <div className="h-6 w-3/4 bg-gray-700 rounded-md mb-3"></div>
                <div className="flex items-center text-sm text-gray-400 gap-4">
                    <div className="h-4 w-1/4 bg-gray-700 rounded-md"></div>
                    <div className="h-4 w-1/4 bg-gray-700 rounded-md"></div>
                </div>
                <div className="h-4 w-full bg-gray-700 rounded-md mt-4"></div>
                <div className="h-4 w-5/6 bg-gray-700 rounded-md mt-2"></div>
            </div>
        </div>
    );
}

export default SkeletonPost;
