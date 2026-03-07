import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 selection:bg-[#74ACDF]/30">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-8xl md:text-[150px] font-black text-white/5 tracking-tighter mb-4"
            >
                404
            </motion.h1>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative z-10 -mt-16 md:-mt-24 mb-8"
            >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">Página no encontrada</h2>
                <p className="text-white/50 max-w-sm mx-auto text-sm md:text-base">
                    La ruta que estás buscando no existe, ha sido movida o ya no está disponible.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Link
                    to="/"
                    className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-[#74ACDF] hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(116,172,223,0.3)]"
                >
                    Volver al Inicio
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
