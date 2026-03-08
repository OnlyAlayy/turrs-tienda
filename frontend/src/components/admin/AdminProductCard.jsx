import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminProductCard = ({ product, onEdit, onDelete, onProductUpdate }) => {
    const { _id, name, brand, images, category, price, totalStock, sizes } = product;
    const image = images?.[0] || 'https://via.placeholder.com/400x500?text=No+Image';
    const [isEditingStock, setIsEditingStock] = useState(false);
    const [localSizes, setLocalSizes] = useState(sizes || []);
    const [isSaving, setIsSaving] = useState(false);

    // Format price
    const formatPrice = (p) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(p);
    };

    const handleStockChange = (sizeName, newStock) => {
        setLocalSizes(prev => prev.map(s => s.size === sizeName ? { ...s, stock: Math.max(0, newStock) } : s));
    };

    const handleSaveStock = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${_id}/stock`,
                { sizes: localSizes },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Swal.fire({
                icon: 'success',
                title: 'Stock actualizado',
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                background: '#0a0a0c',
                color: '#fff'
            });

            setIsEditingStock(false);
            if (onProductUpdate) {
                onProductUpdate(response.data);
            }
        } catch (error) {
            console.error('Error al guardar stock:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'No se pudo actualizar el stock',
                background: '#0a0a0c',
                color: '#fff'
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition group relative flex flex-col">
            {/* Image Container */}
            <div className="relative aspect-square w-full bg-[#050505]">
                <img
                    src={image}
                    alt={name}
                    className={`w-full h-full object-cover transition duration-300 ${isEditingStock ? 'brightness-[0.2]' : 'group-hover:brightness-75'}`}
                />

                {/* Badges */}
                <div className="absolute top-0 left-0 right-0 flex justify-between p-3 pointer-events-none z-10">
                    {/* Category Badge */}
                    <span className="bg-black/60 backdrop-blur-sm text-white/60 text-xs px-2 py-1 rounded-full">
                        {category}
                    </span>

                    {/* Stock Badge */}
                    {!isEditingStock && (
                        totalStock === 0 ? (
                            <span className="bg-red-400/20 text-red-400 text-xs px-2 py-1 rounded-full">Sin stock</span>
                        ) : totalStock < 5 ? (
                            <span className="bg-yellow-400/20 text-yellow-400 text-xs px-2 py-1 rounded-full">⚠ Poco stock</span>
                        ) : null
                    )}
                </div>

                {/* Stock Editor Overlay */}
                {isEditingStock && (
                    <div className="absolute inset-0 z-20 flex flex-col p-4 overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between mb-3 shrink-0">
                            <h4 className="text-white font-medium text-sm">Ajustar Stock</h4>
                            <button onClick={() => setIsEditingStock(false)} className="text-white/40 hover:text-white transition">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="space-y-2 flex-grow">
                            {localSizes.map((size) => (
                                <div key={size.size} className="flex items-center justify-between bg-white/5 rounded-lg p-2 border border-white/5">
                                    <span className="text-white/80 text-xs font-medium w-12">{size.size}</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleStockChange(size.size, size.stock - 1)}
                                            disabled={size.stock <= 0}
                                            className="w-6 h-6 rounded bg-black/40 text-white/60 flex items-center justify-center hover:bg-white/10 hover:text-white disabled:opacity-30 transition"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={size.stock}
                                            onChange={(e) => handleStockChange(size.size, parseInt(e.target.value) || 0)}
                                            className="w-12 h-6 bg-transparent border-none text-center text-white text-xs font-medium focus:ring-0 p-0"
                                            min="0"
                                        />
                                        <button
                                            onClick={() => handleStockChange(size.size, size.stock + 1)}
                                            className="w-6 h-6 rounded bg-black/40 text-white/60 flex items-center justify-center hover:bg-white/10 hover:text-white transition"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleSaveStock}
                            disabled={isSaving}
                            className="mt-3 w-full h-8 rounded-lg bg-white text-black font-medium text-xs hover:bg-white/90 transition disabled:opacity-50 shrink-0 flex items-center justify-center"
                        >
                            {isSaving ? 'Guardando...' : 'Guardar Stock'}
                        </button>
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className="p-4 flex flex-col flex-grow relative z-10">
                <p className="text-white/30 text-xs uppercase tracking-wide mb-1 flex-shrink-0">
                    {brand ? brand.replace('-', ' ') : 'Turrs'}
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
                    {/* Botón Editar - Izquierda */}
                    <button
                        onClick={() => onEdit(product)}
                        title="Editar detalles completos"
                        className="h-9 px-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-white/70 hover:text-white text-sm border border-white/10 flex items-center justify-center shrink-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    </button>

                    {/* Botón Stock - Centro Expandido */}
                    <button
                        onClick={() => setIsEditingStock(!isEditingStock)}
                        className={`flex-1 h-9 rounded-xl transition text-sm font-medium border flex items-center justify-center gap-1.5 ${isEditingStock
                            ? 'bg-white text-black border-white'
                            : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border-white/10'
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                        Stock
                    </button>

                    {/* Botón Eliminar - Derecha */}
                    <button
                        onClick={() => onDelete(product)}
                        title="Eliminar producto"
                        className="h-9 w-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition text-red-500 hover:text-red-400 border border-red-500/10 hover:border-red-500/20 flex items-center justify-center shrink-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProductCard;
