import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ProductFilter from '../components/store/ProductFilter';
import ProductCard from '../components/store/ProductCard';
import useProducts from '../hooks/useProducts';

// Dummy brand data for banners
const brandData = {
    'afa': { name: 'AFA', slogan: 'Tres estrellas. Una identidad.', banner: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=2000' },
    'adidas': { name: 'Adidas', slogan: 'Impossible is Nothing.', banner: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=2000' },
    'nike': { name: 'Nike', slogan: 'Just Do It.', banner: 'https://images.unsplash.com/photo-1552066344-2464c1135c32?auto=format&fit=crop&q=80&w=2000' },
    'lacoste': { name: 'Lacoste', slogan: 'Elegancia y Movimiento.', banner: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=2000' },
    'ralph-lauren': { name: 'Ralph Lauren', slogan: 'Estilo clásico atemporal.', banner: 'https://images.unsplash.com/photo-1588644485573-097486e92ef9?auto=format&fit=crop&q=80&w=2000' },
    'carolina-herrera': { name: 'Carolina Herrera', slogan: 'Sofisticación metropolitana.', banner: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=2000' },
    'perfumes': { name: 'Perfumes', slogan: 'Explora nuestra boutique de fragancias.', banner: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=2000' }
};

const CollectionPage = () => {
    const { brand } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    // Depending on whether brand is actually "perfumes" (which is a category, but the UI link is /coleccion/perfumes)
    // we map it correctly. The prompt allowed /coleccion/:brand.
    const isCategoryPerfumes = brand === 'perfumes';

    const filters = {
        brand: isCategoryPerfumes ? '' : brand,
        category: isCategoryPerfumes ? 'perfumes' : searchParams.get('category'),
        subcategory: searchParams.get('subcategory'),
        gender: searchParams.get('gender'),
        size: searchParams.get('size'),
        concentration: searchParams.get('concentration'),
    };

    const { products, loading, error } = useProducts(filters);
    const info = brandData[brand] || { name: brand.replace('-', ' ').toUpperCase(), slogan: 'Colección Exclusiva', banner: 'https://images.unsplash.com/photo-1556906781-9a412961c28c' };

    return (
        <div className="min-h-screen bg-[#050505] selection:bg-[#74ACDF]/30">

            {/* Dynamic Hero Banner */}
            <div className="relative h-[40vh] md:h-[50vh] w-full flex items-center justify-center overflow-hidden bg-[#0A0A0C]">
                <img
                    src={info.banner}
                    alt={info.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-black/80" />

                <div className="relative z-10 text-center px-6 mt-14">
                    <span className="text-[#C9A84C] text-sm font-bold tracking-widest uppercase mb-4 block">Colección Exclusiva</span>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-4 drop-shadow-lg">
                        {info.name}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 font-light">
                        {info.slogan}
                    </p>
                </div>
            </div>

            <div className="pt-12 pb-24 px-6 lg:px-12 max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-8 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                            Catálogo {info.name}
                        </h2>
                        <p className="text-white/60">
                            Descubre todos los productos disponibles de la colección.
                        </p>
                    </div>
                    <div className="text-white/60 text-sm mt-4 md:mt-0 bg-[#0A0A0C] px-4 py-2 rounded-full border border-white/5">
                        {products?.length || 0} Resultados
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                    {/* Sidebar - Hide Brand Filter for specific brands, but if it's "perfumes", don't hide it so they can filter by Carolina Herrera, etc. */}
                    <div className="w-full md:w-64 shrink-0">
                        <ProductFilter hideBrand={!isCategoryPerfumes} />
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
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

export default CollectionPage;
