import React, { createContext, useContext, useState } from 'react';

const QuickViewContext = createContext();

export const useQuickView = () => useContext(QuickViewContext);

export const QuickViewProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [product, setProduct] = useState(null);

    const openQuickView = (prod) => {
        setProduct(prod);
        setIsOpen(true);
    };

    const closeQuickView = () => {
        setIsOpen(false);
        setTimeout(() => setProduct(null), 300); // Allow exit animation to finish before clearing data
    };

    return (
        <QuickViewContext.Provider value={{ isOpen, product, openQuickView, closeQuickView }}>
            {children}
        </QuickViewContext.Provider>
    );
};
