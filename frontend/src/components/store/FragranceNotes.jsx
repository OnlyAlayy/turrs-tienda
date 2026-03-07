import React from 'react';

const FragranceNotes = ({ fragrance }) => {
    if (!fragrance) return null;

    return (
        <div className="mb-10 bg-[#0A0A0C] border border-white/5 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 tracking-tight flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                Perfil Olfativo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 mb-6">
                <div>
                    <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Concentración</h4>
                    <p className="text-white font-medium">{fragrance.concentration}</p>
                </div>
                {fragrance.gender && (
                    <div>
                        <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Género</h4>
                        <p className="text-white font-medium capitalize">{fragrance.gender}</p>
                    </div>
                )}
                {fragrance.longevity && (
                    <div>
                        <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Longevidad</h4>
                        <p className="text-white font-medium">{fragrance.longevity}</p>
                    </div>
                )}
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
                {fragrance.topNotes && fragrance.topNotes.length > 0 && (
                    <div>
                        <h4 className="text-[#74ACDF] text-xs font-bold uppercase tracking-widest mb-1">Notas de Salida</h4>
                        <p className="text-white/80 text-sm">{fragrance.topNotes.join(' · ')}</p>
                    </div>
                )}
                {fragrance.heartNotes && fragrance.heartNotes.length > 0 && (
                    <div>
                        <h4 className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-1">Notas de Corazón</h4>
                        <p className="text-white/80 text-sm">{fragrance.heartNotes.join(' · ')}</p>
                    </div>
                )}
                {fragrance.baseNotes && fragrance.baseNotes.length > 0 && (
                    <div>
                        <h4 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Notas de Fondo</h4>
                        <p className="text-white/80 text-sm">{fragrance.baseNotes.join(' · ')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FragranceNotes;
