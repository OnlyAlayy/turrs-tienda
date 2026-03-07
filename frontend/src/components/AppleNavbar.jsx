import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const AppleNavbar = () => {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 50], [0, 1]); // Fully transparent at 0, fully opaque after 50px

    return (
        <motion.nav
            style={{ opacity }}
            className="fixed top-0 w-full z-50 bg-black/75 backdrop-blur-md h-14 transition-opacity duration-300 flex items-center justify-between px-6 lg:px-12"
        >
            {/* Left: Logo */}
            <div className="flex-shrink-0">
                <span className="text-white font-medium tracking-tight text-lg flex items-center gap-1">
                    Argentina 2026 <span className="text-[#C9A84C] text-sm">★</span>
                </span>
            </div>

            {/* Center: Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
                {['La Camiseta', 'Historia', 'Identidad', 'Detalles', 'Conseguila'].map((link) => (
                    <a
                        key={link}
                        href={`#${link.toLowerCase().replace(' ', '-')}`}
                        className="text-sm text-white/70 hover:text-white transition-colors duration-200"
                    >
                        {link}
                    </a>
                ))}
            </div>

            {/* Right: CTA Button */}
            <div className="flex-shrink-0">
                <button className="bg-gradient-to-r from-[#74ACDF] to-[#C9A84C] text-white text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 transition-all shadow-lg shadow-[#74ACDF]/20">
                    Conseguí la tuya
                </button>
            </div>
        </motion.nav>
    );
};

export default AppleNavbar;
