import React, { useState, useEffect } from 'react';
import { useQuickView } from '../../contexts/QuickViewContext';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import AddToCartButton from './AddToCartButton';
import FragranceNotes from './FragranceNotes';

const QuickViewModal = () => {
    const { isOpen, product, closeQuickView } = useQuickView();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');

    useEffect(() => {
        if (isOpen && product) {
            setSelectedImage(0);
            setQuantity(1);

            // Auto-select size if there's only one with stock
            if (product.sizes?.length > 0) {
                const availableSizes = product.sizes.filter(s => s.stock > 0);
                if (availableSizes.length === 1) {
                    setSelectedSize(availableSizes[0].size);
                } else {
                    setSelectedSize(''); // Reset if multiple or none
                }
            } else {
                setSelectedSize('');
            }
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, product]);

    if (!product) return null;

    const images = product.images?.length > 0 ? product.images : [product.image || 'https://via.placeholder.com/400x500?text=No+Image'];
    const isPerfume = product.category === 'fragrances';

    // Find selected size stock
    const selectedSizeObj = product.sizes?.find(s => s.size === selectedSize);
    const maxStock = selectedSizeObj ? selectedSizeObj.stock : 0;
    const outOfStock = product.totalStock === 0 || maxStock === 0;

    // Real price
    const isNew = product.flags?.includes('nuevo');
    const isBestseller = product.flags?.includes('destacado');

    const handleAddToCart = () => {
        if (!selectedSize && product.sizes?.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: isPerfume ? 'Por favor selecciona un tamaño.' : 'Por favor selecciona un talle.',
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                background: '#0a0a0c',
                color: '#fff'
            });
            return;
        }

        addToCart({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: images[0],
            size: selectedSize,
            quantity,
            brand: typeof product.brand === 'object' ? product.brand.name : product.brand,
        });

        closeQuickView();
    };

    const handleViewFullProduct = () => {
        closeQuickView();
        // Uses slug instead of _id to fix 404
        if (product.slug) {
            navigate(`/producto/${product.slug}`);
        } else {
            navigate(`/producto/${product._id}`); // Fallback if no slug
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeQuickView}
                        className="absolute inset-0"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-5xl bg-[#0A0A0C] border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] rounded-none sm:rounded-2xl"
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeQuickView}
                            className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 backdrop-blur hover:bg-white/10 rounded-full flex items-center justify-center transition border border-white/10 text-white/70 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Left: Image Gallery */}
                        <div className="md:w-1/2 relative bg-[#050505] flex flex-col items-center">
                            {/* Main Image */}
                            <div className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] flex items-center justify-center overflow-hidden">
                                <motion.img
                                    key={selectedImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    src={images[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />

                                {/* Floating Badges */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                    {isNew && (
                                        <span className="bg-white text-black px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                                            Nuevo
                                        </span>
                                    )}
                                    {isBestseller && (
                                        <span className="bg-[#74ACDF] text-black px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(116,172,223,0.3)]">
                                            Best Seller
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`relative w-12 h-12 rounded-xl overflow-hidden transition-all duration-300 ${activeImage === idx
                                                ? 'border-2 border-white scale-110 shadow-lg'
                                                : 'border border-transparent opacity-50 hover:opacity-100'
                                                }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Product Details */}
                        <div className="md:w-1/2 flex flex-col CustomScrollbar max-h-[90vh] overflow-y-auto">
                            <div className="p-6 md:p-8 flex-1">
                                {/* Header Info */}
                                <div className="mb-6">
                                    <p className="text-[#74ACDF] uppercase tracking-widest text-xs font-bold mb-2">
                                        {typeof product.brand === 'object' ? product.brand.name : product.brand}
                                    </p>
                                    <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4 title-font">
                                        {product.name}
                                    </h1>
                                    <div className="flex items-end gap-3">
                                        <span className="text-2xl font-bold text-white">
                                            ${new Intl.NumberFormat('es-AR').format(product.price)}
                                        </span>
                                        {product.compareAtPrice && (
                                            <span className="text-lg text-white/40 line-through mb-0.5">
                                                ${new Intl.NumberFormat('es-AR').format(product.compareAtPrice)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="prose prose-invert prose-sm mb-8">
                                    <p className="text-white/60 leading-relaxed max-w-none line-clamp-3">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Size Selector */}
                                <SizeSelector
                                    sizes={product.sizes}
                                    selectedSize={selectedSize}
                                    onSelectSize={(size) => {
                                        setSelectedSize(size);
                                        setQuantity(1); // Reset quantity when size changes
                                    }}
                                    isPerfume={isPerfume}
                                />

                                {/* Perfume Notes (if applicable) */}
                                {isPerfume && product.fragranceProfile && (
                                    <FragranceNotes
                                        profile={product.fragranceProfile}
                                    />
                                )}

                                {/* Quantity & Add to Cart Container */}
                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <QuantitySelector
                                        quantity={quantity}
                                        setQuantity={setQuantity}
                                        maxStock={maxStock}
                                    />
                                    <div className="flex-1">
                                        <AddToCartButton
                                            onClick={handleAddToCart}
                                            disabled={outOfStock || (!selectedSize && product.sizes?.length > 0)}
                                            isOutOfStock={outOfStock}
                                            text={outOfStock ? 'Sin Stock' : (selectedSize || product.sizes?.length === 0 ? 'Agregar al Carrito' : 'Selecciona un talle')}
                                        />
                                    </div>
                                </div>

                                {/* View Full Details Link */}
                                <div className="mt-6 flex justify-center">
                                    <button
                                        onClick={handleViewFullProduct}
                                        className="text-white/50 hover:text-white transition-colors text-sm underline underline-offset-4 flex items-center gap-2"
                                    >
                                        Ver detalles completos
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default QuickViewModal;
