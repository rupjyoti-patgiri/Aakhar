import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

function Layout() {
    return (
        <main className="bg-gray-900 text-gray-200 min-h-screen">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-gray-700/[0.2] [mask-image:linear-gradient(to_bottom,white_5%,transparent_100%)]"></div>
            <Header />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
                 <Outlet />
            </div>
        </main>
    );
}

export default Layout;
