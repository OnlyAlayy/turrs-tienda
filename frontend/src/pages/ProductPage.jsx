import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import SizeSelector from '../components/store/SizeSelector';
import QuantitySelector from '../components/store/QuantitySelector';
import AddToCartButton from '../components/store/AddToCartButton';
import FragranceNotes from '../components/store/FragranceNotes';
import { useCart } from '../contexts/CartContext';

const ProductPage = () => {
    const { id } = useParams(); // Using ID for now, adjust to simple slug later if preferred
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                // Assuming API supports fetching by ID
                const res = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(res.data);

                // Auto-select size if there's only one with stock
                if (res.data.sizes && res.data.sizes.length > 0) {
                    const availableSizes = res.data.sizes.filter(s => s.stock > 0);
                    if (availableSizes.length === 1) {
                        setSelectedSize(availableSizes[0].size);
                    }
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching product');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#74ACDF]/30 border-t-[#74ACDF] rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-center px-6">
                <h2 className="text-3xl font-bold text-white mb-4">Producto no encontrado</h2>
                <p className="text-white/60 mb-8 max-w-md">{error}</p>
                <button
                    onClick={() => navigate('/tienda')}
                    className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-[#74ACDF] transition-colors"
                >
                    Volver a la tienda
                </button>
            </div>
        );
    }

    const images = product.images?.length > 0 ? product.images : [product.image];
    const isPerfume = product.category === 'fragrances';

    // Find selected size stock
    const selectedSizeObj = product.sizes?.find(s => s.size === selectedSize);
    const maxStock = selectedSizeObj ? selectedSizeObj.stock : 0;
    const outOfStock = maxStock === 0;

    // Real price (apply discount if applicable)
    const isNew = product.flags?.includes('nuevo');
    const isBestseller = product.flags?.includes('destacado');

    const handleAddToCart = () => {
        if (!selectedSize) return;

        addToCart({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: images[0],
            size: selectedSize,
            quantity,
            brand: typeof product.brand === 'object' ? product.brand.name : product.brand,
        });
        // Add success toast logic here later
    };

    return (
        <div className="min-h-screen bg-[#050505] selection:bg-[#74ACDF]/30 pt-32 pb-24 px-6 lg:px-12 max-w-[1600px] mx-auto">

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 mb-12">
                <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Inicio</button>
                <span>/</span>
                <button onClick={() => navigate('/tienda')} className="hover:text-white transition-colors">Tienda</button>
                <span>/</span>
                <button
                    onClick={() => navigate(`/coleccion/${typeof product.brand === 'object' ? product.brand.slug : product.brand}`)}
                    className="hover:text-white transition-colors"
                >
                    {typeof product.brand === 'object' ? product.brand.name : product.brand}
                </button>
            </nav>

            <div className="flex flex-col md:flex-row gap-12 xl:gap-24">

                {/* Images Gallery */}
                <div className="w-full md:w-1/2 lg:w-3/5 flex flex-col-reverse md:flex-row gap-4 h-fit sticky top-32">
                    {/* Thumbnails */}
                    <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-24 shrink-0">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`w-20 h-24 md:w-24 md:h-32 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                            >
                                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover bg-[#0A0A0C]" />
                            </button>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="flex-1 rounded-2xl md:rounded-[2rem] overflow-hidden bg-[#0A0A0C] relative aspect-[4/5] md:aspect-auto md:h-[800px]">
                        {isNew && (
                            <span className="absolute top-6 left-6 z-10 bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg">
                                Nuevo
                            </span>
                        )}
                        {isBestseller && !isNew && (
                            <span className="absolute top-6 left-6 z-10 bg-[#C9A84C] text-black px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg">
                                Bestseller
                            </span>
                        )}

                        <motion.img
                            key={activeImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            src={images[activeImage]}
                            alt={product.name}
                            className="w-full h-full object-cover mix-blend-lighten"
                        />
                    </div>
                </div>

                {/* Product Info */}
                <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col">
                    <div className="mb-2">
                        <span className="text-[#C9A84C] text-sm font-bold tracking-widest uppercase">
                            {typeof product.brand === 'object' ? product.brand.name : product.brand}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6 leading-tight">
                        {product.name}
                    </h1>

                    <div className="text-3xl font-light text-white mb-8">
                        {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(product.price)}
                    </div>

                    <div className="prose prose-invert prose-p:text-white/70 prose-p:font-light prose-p:leading-relaxed mb-10">
                        <p>{product.description}</p>
                    </div>

                    {/* Fragrance Specifics */}
                    {isPerfume && product.fragranceProfile && (
                        <FragranceNotes fragrance={product.fragranceProfile} />
                    )}

                    {/* Sizes */}
                    {product.sizes && product.sizes.length > 0 && (
                        <SizeSelector
                            sizes={product.sizes}
                            selectedSize={selectedSize}
                            onSelectSize={setSelectedSize}
                            isPerfume={isPerfume}
                        />
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-auto mb-12">
                        <QuantitySelector
                            quantity={quantity}
                            setQuantity={setQuantity}
                            maxStock={maxStock || 1}
                        />
                        <div className="flex-1">
                            <AddToCartButton
                                handleAddToCart={handleAddToCart}
                                disabled={!selectedSize || outOfStock}
                                outOfStock={outOfStock && selectedSize}
                            />
                        </div>
                    </div>

                    {/* Extra Info Accordions or Specs */}
                    <div className="border-t border-white/10 pt-8 space-y-4">
                        <div className="flex items-center gap-4 text-white/60 text-sm">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            Envío gratis en compras superiores a $150.000
                        </div>
                        <div className="flex items-center gap-4 text-white/60 text-sm">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                            Devoluciones sin costo por 30 días
                        </div>
                        <div className="flex items-center gap-4 text-white/60 text-sm">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                            Pagos procesados de forma segura
                        </div>
                    </div>

                </div>
            </div>

            {/* Reviews Section Placeholder */}
            <div className="mt-24 pt-12 border-t border-white/10">
                <h2 className="text-2xl font-bold tracking-tight text-white mb-8">Reseñas del Producto</h2>
                <div className="w-full bg-[#0A0A0C] border border-white/5 rounded-[2rem] p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Aún no hay reseñas</h3>
                    <p className="text-white/50 text-sm max-w-sm mx-auto mb-8">Sé el primero en compartir tu opinión sobre este producto con la comunidad TURRS.</p>
                    <button className="text-[#C9A84C] font-bold text-sm uppercase tracking-widest hover:text-white transition-colors border-b border-[#C9A84C]/30 hover:border-white pb-1">
                        Escribir una reseña
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
