import React from 'react';
import { motion } from 'framer-motion';

const GuiaTallesPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#050505] min-h-screen text-white pt-24 pb-16"
        >
            <div className="max-w-3xl mx-auto px-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-[#74ACDF] bg-clip-text text-transparent mb-4">
                    Guía de Talles
                </h1>
                <p className="text-white/40 text-sm mb-12">
                    Todas las medidas están expresadas en centímetros. En caso de duda entre dos talles, te recomendamos el talle mayor.
                </p>

                <div className="space-y-12">
                    {/* Tabla 1 */}
                    <div>
                        <h3 className="text-[#74ACDF] text-xs tracking-[0.3em] uppercase mb-4 font-semibold">INDUMENTARIA</h3>
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#0A0A0C] text-white/40 text-xs uppercase tracking-wide">
                                    <tr>
                                        <th className="px-4 py-3">Talle</th>
                                        <th className="px-4 py-3">Pecho (cm)</th>
                                        <th className="px-4 py-3">Largo (cm)</th>
                                        <th className="px-4 py-3">Manga (cm)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { t: 'S', p: '88-92', l: '68', m: '60' },
                                        { t: 'M', p: '93-97', l: '70', m: '62' },
                                        { t: 'L', p: '98-103', l: '72', m: '64' },
                                        { t: 'XL', p: '104-110', l: '74', m: '66' },
                                        { t: 'XXL', p: '111-118', l: '76', m: '68' },
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                                            <td className="px-4 py-3 font-semibold text-[#74ACDF]">{row.t}</td>
                                            <td className="px-4 py-3 text-white/70">{row.p}</td>
                                            <td className="px-4 py-3 text-white/70">{row.l}</td>
                                            <td className="px-4 py-3 text-white/70">{row.m}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Tabla 2 */}
                    <div>
                        <h3 className="text-[#74ACDF] text-xs tracking-[0.3em] uppercase mb-4 font-semibold">SHORTS Y PANTALONES</h3>
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#0A0A0C] text-white/40 text-xs uppercase tracking-wide">
                                    <tr>
                                        <th className="px-4 py-3">Talle</th>
                                        <th className="px-4 py-3">Cintura (cm)</th>
                                        <th className="px-4 py-3">Largo (cm)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { t: 'S', c: '72-76', l: '95' },
                                        { t: 'M', c: '77-82', l: '97' },
                                        { t: 'L', c: '83-88', l: '99' },
                                        { t: 'XL', c: '89-95', l: '101' },
                                        { t: 'XXL', c: '96-102', l: '103' },
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                                            <td className="px-4 py-3 font-semibold text-[#74ACDF]">{row.t}</td>
                                            <td className="px-4 py-3 text-white/70">{row.c}</td>
                                            <td className="px-4 py-3 text-white/70">{row.l}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Tabla 3 */}
                    <div>
                        <h3 className="text-[#74ACDF] text-xs tracking-[0.3em] uppercase mb-4 font-semibold">CALZADO</h3>
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#0A0A0C] text-white/40 text-xs uppercase tracking-wide">
                                    <tr>
                                        <th className="px-4 py-3">EU</th>
                                        <th className="px-4 py-3">UK</th>
                                        <th className="px-4 py-3">US</th>
                                        <th className="px-4 py-3">CM</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { eu: '38', uk: '5', us: '6', cm: '24' },
                                        { eu: '39', uk: '6', us: '7', cm: '25' },
                                        { eu: '40', uk: '6.5', us: '7.5', cm: '25.5' },
                                        { eu: '41', uk: '7', us: '8', cm: '26' },
                                        { eu: '42', uk: '8', us: '9', cm: '27' },
                                        { eu: '43', uk: '9', us: '10', cm: '28' },
                                        { eu: '44', uk: '9.5', us: '10.5', cm: '28.5' },
                                        { eu: '45', uk: '10', us: '11', cm: '29' },
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                                            <td className="px-4 py-3 font-semibold text-[#74ACDF]">{row.eu}</td>
                                            <td className="px-4 py-3 text-white/70">{row.uk}</td>
                                            <td className="px-4 py-3 text-white/70">{row.us}</td>
                                            <td className="px-4 py-3 text-white/70">{row.cm}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 mt-10">
                    <p className="text-white/50 text-sm">
                        💡 Consejo: Si estás entre dos talles, te recomendamos el talle mayor para mayor comodidad. Para ropa de entrenamiento ajustada, elegí tu talle exacto.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default GuiaTallesPage;
