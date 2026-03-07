import React from 'react';

const SizeSelector = ({ sizes, selectedSize, onSelectSize, isPerfume }) => {
    if (!sizes || sizes.length === 0) return null;

    // Single size (e.g. accessories with "Única")
    if (sizes.length === 1 && sizes[0].size === 'Única') {
        return (
            <div className="mb-8">
                <span className="text-white/60 text-sm mb-3 block">{isPerfume ? 'Tamaño Único' : 'Talle Único'}</span>
            </div>
        );
    }

    return (
        <div className="mb-8">
            <div className="flex justify-between items-end mb-3">
                <span className="text-white font-medium">Seleccionar {isPerfume ? 'Tamaño/Capacidad' : 'Talle'}</span>
                {!isPerfume && (
                    <button className="text-white/40 text-xs underline underline-offset-2 hover:text-white transition-colors">
                        Guía de Talles
                    </button>
                )}
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3">
                {sizes.map(({ size, stock }) => {
                    const isOutOfStock = stock === 0;
                    const isSelected = selectedSize === size;

                    return (
                        <button
                            key={size}
                            disabled={isOutOfStock}
                            onClick={() => onSelectSize(size)}
                            className={`
                relative h-12 flex items-center justify-center rounded-lg border text-sm font-medium transition-all duration-200
                ${isOutOfStock
                                    ? 'border-white/5 text-white/20 bg-[#0A0A0C] cursor-not-allowed'
                                    : isSelected
                                        ? 'border-white bg-white text-black'
                                        : 'border-white/20 text-white hover:border-white/60 bg-transparent'}
              `}
                        >
                            {size}
                            {isOutOfStock && (
                                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                                    <div className="w-full h-px bg-white/20 rotate-45 transform origin-center" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SizeSelector;
