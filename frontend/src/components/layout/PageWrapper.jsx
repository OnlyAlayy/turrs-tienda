import React from 'react';
import Navbar from './Navbar';
import CartDrawer from '../store/CartDrawer';
import Footer from './Footer';

const PageWrapper = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col antialiased selection:bg-[#74ACDF]/30">
            <Navbar />
            <CartDrawer />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default PageWrapper;
