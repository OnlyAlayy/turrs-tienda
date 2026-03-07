import React from 'react';
import { useLocation } from 'react-router-dom';
import ProductFilter from '../components/store/ProductFilter';
import ProductCard from '../components/store/ProductCard';
import useProducts from '../hooks/useProducts';

const StorePage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    // Extract filters to pass to hook
    const filters = {
        category: searchParams.get('category'),
        brand: searchParams.get('brand'),
        subcategory: searchParams.get('subcategory'),
        gender: searchParams.get('gender'),
        search: searchParams.get('search')
    };

    const { products, loading, error } = useProducts(filters);

    return (
        <div className="min-h-screen bg-[#050505] pt-24 pb-24 px-6 lg:px-12 selection:bg-[#74ACDF]/30">
            <div className="max-w-[1600px] mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-8 mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
                            Tienda Oficial
                        </h1>
                        <p className="text-white/60 text-lg">
                            {filters.category ? `Mostrando: ${filters.category.replace('-', ' ')}` : 'Explora toda la colección premium.'}
                        </p>
                    </div>
                    <div className="text-white/60 text-sm mt-4 md:mt-0 bg-[#0A0A0C] px-4 py-2 rounded-full border border-white/5">
                        {products?.length || 0} Resultados
                    </div>
                </div>

                {/* Layout */}
                <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 shrink-0">
                        <ProductFilter />
                    </div>

                    {/* Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="w-full h-96 flex items-center justify-center">
                                <div className="w-12 h-12 border-4 border-[#74ACDF]/30 border-t-[#74ACDF] rounded-full animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="w-full h-96 flex flex-col items-center justify-center text-center">
                                <p className="text-red-400 mb-2">Error al cargar los productos.</p>
                                <p className="text-white/50 text-sm">{error}</p>
                            </div>
                        ) : products?.length === 0 ? (
                            <div className="w-full h-96 flex flex-col items-center justify-center text-center bg-[#0A0A0C] rounded-3xl border border-white/5 border-dashed">
                                <svg className="w-16 h-16 text-white/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <h3 className="text-xl font-bold text-white mb-2">No se encontraron productos</h3>
                                <p className="text-white/60">Intenta cambiar los filtros de búsqueda.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
                                {products.map((product) => (
                                    <ProductCard key={product._id || product.slug} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StorePage;
