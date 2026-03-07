import React from 'react';

const QuantitySelector = ({ quantity, setQuantity, maxStock }) => {
    const handleDecrement = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrement = () => {
        if (quantity < maxStock) setQuantity(quantity + 1);
    };

    return (
        <div className="flex items-center">
            <div className="flex items-center border border-white/20 rounded-full h-12 px-2 bg-[#0A0A0C]">
                <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="w-12 h-full flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 transition-colors"
                >
                    <svg width="14" height="2" viewBox="0 0 14 2" fill="currentColor"><rect width="14" height="2" rx="1" /></svg>
                </button>
                <div className="w-12 text-center text-white font-medium select-none">
                    {quantity}
                </div>
                <button
                    onClick={handleIncrement}
                    disabled={quantity >= maxStock}
                    className="w-12 h-full flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 transition-colors"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M8 0H6v6H0v2h6v6h2V8h6V6H8V0z" /></svg>
                </button>
            </div>
        </div>
    );
};

export default QuantitySelector;
