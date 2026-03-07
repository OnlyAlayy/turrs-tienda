import React from 'react';

const AddToCartButton = ({ handleAddToCart, disabled, outOfStock }) => {
    return (
        <button
            onClick={handleAddToCart}
            disabled={disabled}
            className={`
        w-full h-14 rounded-full font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3
        ${outOfStock
                    ? 'bg-white/5 text-white/30 cursor-not-allowed border-none'
                    : disabled
                        ? 'bg-[#74ACDF]/50 text-white/50 cursor-not-allowed border-none'
                        : 'bg-white text-black hover:bg-[#74ACDF] hover:text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(116,172,223,0.3)]'}
      `}
        >
            {outOfStock ? (
                'Agotado'
            ) : (
                <>
                    <span>Añadir al Carrito</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                </>
            )}
        </button>
    );
};

export default AddToCartButton;
