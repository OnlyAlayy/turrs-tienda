import React from 'react';

const AdminProductCard = ({ product, onEdit, onDelete }) => {
    const { name, brand, images, category, price, totalStock } = product;
    const image = images?.[0] || 'https://via.placeholder.com/400x500?text=No+Image';

    // Format price
    const formatPrice = (p) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(p);
    };

    return (
        <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition group relative flex flex-col">
            {/* Image Container */}
            <div className="relative aspect-square w-full bg-[#050505]">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:brightness-75 transition duration-300"
                />

                {/* Badges */}
                <div className="absolute top-0 left-0 right-0 flex justify-between p-3 pointer-events-none">
                    {/* Category Badge */}
                    <span className="bg-black/60 backdrop-blur-sm text-white/60 text-xs px-2 py-1 rounded-full">
                        {category}
                    </span>

                    {/* Stock Badge */}
                    {totalStock === 0 ? (
                        <span className="bg-red-400/20 text-red-400 text-xs px-2 py-1 rounded-full">Sin stock</span>
                    ) : totalStock < 5 ? (
                        <span className="bg-yellow-400/20 text-yellow-400 text-xs px-2 py-1 rounded-full">⚠ Poco stock</span>
                    ) : null}
                </div>
            </div>

            {/* Content Container */}
            <div className="p-4 flex flex-col flex-grow">
                <p className="text-white/30 text-xs uppercase tracking-wide mb-1 flex-shrink-0">
                    {brand.replace('-', ' ')}
                </p>
                <h3 className="text-white/90 text-sm font-semibold leading-tight line-clamp-2 mb-3 flex-grow title-font">
                    {name}
                </h3>

                {/* Price & Stock Row */}
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <span className="text-[#74ACDF] font-bold text-base">{formatPrice(price)}</span>
                    <span className="text-white/30 text-xs">{totalStock} en stock</span>
                </div>

                {/* Buttons Row */}
                <div className="flex gap-2 mt-auto flex-shrink-0">
                    <button
                        onClick={() => onEdit(product)}
                        className="flex-1 h-9 rounded-xl bg-white/5 hover:bg-white/10 transition text-white/70 hover:text-white text-sm border border-white/10 hover:border-white/20 flex items-center justify-center gap-1.5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        Editar
                    </button>

                    <button
                        onClick={() => onDelete(product)}
                        title="Eliminar producto"
                        className="h-9 w-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition text-red-400/60 hover:text-red-400 border border-red-500/10 hover:border-red-500/20 flex items-center justify-center shrink-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProductCard;
