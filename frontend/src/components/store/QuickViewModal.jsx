import React, { useState, useEffect } from 'react';
import { useQuickView } from '../../contexts/QuickViewContext';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const QuickViewModal = () => {
    const { isOpen, product, closeQuickView } = useQuickView();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedVolume, setSelectedVolume] = useState('');

    useEffect(() => {
        if (isOpen && product) {
            setSelectedImage(0);
            setQuantity(1);
            setSelectedSize(product.sizes?.length > 0 ? product.sizes[0] : '');
            setSelectedVolume(product.volumes?.length > 0 ? product.volumes[0] : '');
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, product]);

    if (!isOpen || !product) return null;

    const handleAddToCart = () => {
        if (product.sizes?.length > 0 && !selectedSize) {
            Swal.fire({ icon: 'warning', text: 'Por favor selecciona un talle.' });
            return;
        }
        if (product.volumes?.length > 0 && !selectedVolume) {
            Swal.fire({ icon: 'warning', text: 'Por favor selecciona un volumen.' });
            return;
        }

        // Create product variant for cart
        const productToAdd = {
            ...product,
            selectedSize,
            selectedVolume
        };

        addToCart(productToAdd, quantity);
        closeQuickView();
        Swal.fire({
            icon: 'success',
            title: '¡Agregado!',
            text: `${product.name} se agregó al carrito`,
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: 'bottom-end'
        });
    };

    const handleViewFullProduct = () => {
        closeQuickView();
        navigate(`/product/${product._id}`);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="absolute inset-0" onClick={closeQuickView}></div>

            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-fadeIn">

                {/* Close Button */}
                <button
                    onClick={closeQuickView}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/50 backdrop-blur hover:bg-white rounded-full flex items-center justify-center transition shadow-sm border border-gray-100 text-gray-800"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Left: Image Gallery */}
                <div className="md:w-1/2 bg-gray-50 p-6 flex flex-col">
                    <div className="flex-1 relative aspect-square rounded-xl overflow-hidden mb-4 bg-white border border-gray-100 flex items-center justify-center">
                        {product.images && product.images.length > 0 ? (
                            <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-contain" />
                        ) : (
                            <span className="text-gray-400">Sin imagen</span>
                        )}
                        {product.stock === 0 && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md bg-opacity-90">
                                Agotado
                            </div>
                        )}
                    </div>
                    {product.images?.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === idx ? 'border-turrs-blue shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100 bg-white'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Product Details */}
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                    <div className="flex-1">
                        <p className="text-turrs-blue font-medium text-sm mb-2">{product.category}</p>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h2>

                        <div className="flex items-end gap-3 mb-6">
                            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                            {product.compareAtPrice && (
                                <span className="text-lg text-gray-400 line-through mb-0.5">${product.compareAtPrice}</span>
                            )}
                        </div>

                        <p className="text-gray-600 text-sm mb-8 leading-relaxed line-clamp-4">
                            {product.description}
                        </p>

                        {/* Variants */}
                        {product.sizes?.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Talle</h4>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-12 h-10 rounded-lg font-medium text-sm transition-all border ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.volumes?.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Volumen</h4>
                                <div className="flex flex-wrap gap-2">
                                    {product.volumes.map(vol => (
                                        <button
                                            key={vol}
                                            onClick={() => setSelectedVolume(vol)}
                                            className={`px-4 h-10 rounded-lg font-medium text-sm transition-all border ${selectedVolume === vol ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}`}
                                        >
                                            {vol}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-8">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Cantidad</h4>
                            <div className="flex items-center">
                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 h-12">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-black transition"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        readOnly
                                        className="w-12 h-full bg-transparent text-center font-semibold text-gray-900 focus:outline-none"
                                    />
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-12 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-black transition"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="ml-4 text-sm text-gray-500">
                                    {product.stock} disponibles
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-gray-100 space-y-3 mt-4">
                        <button
                            disabled={product.stock === 0}
                            onClick={handleAddToCart}
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${product.stock > 0 ? 'bg-turrs-blue hover:bg-blue-600 shadow-lg shadow-blue-500/30' : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
                        </button>

                        <button
                            onClick={handleViewFullProduct}
                            className="w-full py-3 rounded-xl font-semibold text-gray-600 hover:text-turrs-blue hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                        >
                            Ver detalles completos
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default QuickViewModal;
