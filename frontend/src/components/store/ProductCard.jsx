import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'USD', // Using USD as seeded
        minimumFractionDigits: 0
    }).format(price);
};

const ProductCard = ({ product }) => {
    const { name, slug, price, compareAtPrice, images, brand, category, isNewArrival, isBestSeller, isLimitedEdition } = product;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group flex flex-col cursor-pointer"
        >
            <Link to={`/producto/${slug}`} className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#0A0A0C] mb-4 border border-white/5">
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {isLimitedEdition && <span className="px-3 py-1 bg-[#C9A84C] text-black text-[10px] font-bold uppercase tracking-widest rounded-full">Limited Edition</span>}
                    {isBestSeller && <span className="px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full">Best Seller</span>}
                    {isNewArrival && <span className="px-3 py-1 bg-[#74ACDF] text-black text-[10px] font-bold uppercase tracking-widest rounded-full">Nuevo</span>}
                </div>

                {/* Make image zoom and darken slightly on hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[1]" />

                <img
                    src={images[0] || 'https://via.placeholder.com/400x500?text=No+Image'}
                    alt={name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                />

                {/* Quick Add Button overlay */}
                <div className="absolute bottom-4 left-4 right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert('Vista Rápida próximamente'); }}
                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium py-3 rounded-full hover:bg-white hover:text-black hover:border-white transition-colors"
                    >
                        Vista Rápida
                    </button>
                </div>
            </Link>

            <div className="flex flex-col gap-1 px-1">
                <div className="flex justify-between items-start gap-4">
                    <Link to={`/producto/${slug}`} className="text-white/90 font-medium text-base hover:text-white transition-colors leading-tight line-clamp-2">
                        {name}
                    </Link>
                    <div className="flex flex-col items-end shrink-0">
                        <span className="text-white font-bold">{formatPrice(price)}</span>
                        {compareAtPrice && <span className="text-white/40 text-sm line-through">{formatPrice(compareAtPrice)}</span>}
                    </div>
                </div>
                <p className="text-white/40 text-sm capitalize">{brand.replace('-', ' ')} · {category}</p>
            </div>
        </motion.div>
    );
};

export default ProductCard;
