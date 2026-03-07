import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const categories = [
    { value: '', label: 'Todas las Categorías' },
    { value: 'camisetas', label: 'Camisetas' },
    { value: 'ropa-deportiva', label: 'Ropa Deportiva' },
    { value: 'calzado', label: 'Calzado' },
    { value: 'perfumes', label: 'Perfumes' },
    { value: 'accesorios', label: 'Accesorios' },
    { value: 'equipamiento', label: 'Equipamiento' },
];

const brands = [
    { value: '', label: 'Todas las Marcas' },
    { value: 'afa', label: 'AFA' },
    { value: 'adidas', label: 'Adidas' },
    { value: 'nike', label: 'Nike' },
    { value: 'lacoste', label: 'Lacoste' },
    { value: 'ralph-lauren', label: 'Ralph Lauren' },
    { value: 'carolina-herrera', label: 'Carolina Herrera' },
];

const subcategories = [
    { value: 'buzos', label: 'Buzos' },
    { value: 'camperas', label: 'Camperas' },
    { value: 'shorts', label: 'Shorts' },
    { value: 'remeras', label: 'Remeras' },
    { value: 'futbol', label: 'Fútbol' },
    { value: 'running', label: 'Running' }
];

const sizes = ['S', 'M', 'L', 'XL', 'XXL', '39', '40', '41', '42', '43', '100ml', '75ml', '125ml'];

const ProductFilter = ({ hideBrand = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const currentCategory = searchParams.get('category') || '';
    const currentBrand = searchParams.get('brand') || '';
    const currentGender = searchParams.get('gender') || '';
    const currentSubcategory = searchParams.get('subcategory') || '';
    const currentSize = searchParams.get('size') || '';
    const currentConcentration = searchParams.get('concentration') || '';
    const currentSearch = searchParams.get('search') || '';

    const updateFilter = (key, value) => {
        if (value) {
            searchParams.set(key, value);
        } else {
            searchParams.delete(key);
        }
        navigate({ search: searchParams.toString() });
    };

    const clearFilters = () => {
        navigate({ pathname: location.pathname, search: '' });
    };

    const hasFilters = currentCategory || currentBrand || currentGender || currentSubcategory || currentSize || currentConcentration || currentSearch;

    return (
        <div className="w-full flex md:flex-col gap-8 pr-0 md:pr-8 md:border-r border-white/10 overflow-x-auto md:overflow-visible pb-4 md:pb-0 min-h-[500px]">
            <div className="min-w-[200px] md:min-w-0">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold tracking-tight text-lg">Filtros</h3>
                    {hasFilters && (
                        <button onClick={clearFilters} className="text-[#74ACDF] text-xs font-medium hover:text-white transition-colors">
                            Limpiar
                        </button>
                    )}
                </div>

                {/* Categories */}
                <div className="mb-8">
                    <h4 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Categoría</h4>
                    <div className="flex flex-col gap-3">
                        {categories.map((cat) => (
                            <label key={cat.value} className="flex items-center gap-3 cursor-pointer group" onClick={() => updateFilter('category', cat.value)}>
                                <div className={`w-4 h-4 rounded-sm border ${currentCategory === cat.value ? 'bg-[#74ACDF] border-[#74ACDF]' : 'border-white/20 group-hover:border-white/50'} flex items-center justify-center transition-colors`}>
                                    {currentCategory === cat.value && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                </div>
                                <span className={`text-sm ${currentCategory === cat.value ? 'text-white font-medium' : 'text-white/70 group-hover:text-white transition-colors'}`}>
                                    {cat.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Subcategories */}
                {(currentCategory === 'ropa-deportiva' || currentCategory === 'calzado') && (
                    <div className="mb-8">
                        <h4 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Subcategoría</h4>
                        <div className="flex flex-col gap-3">
                            {subcategories.map((sub) => (
                                <label key={sub.value} className="flex items-center gap-3 cursor-pointer group" onClick={() => updateFilter('subcategory', sub.value)}>
                                    <div className={`w-4 h-4 rounded-sm border ${currentSubcategory === sub.value ? 'bg-[#74ACDF] border-[#74ACDF]' : 'border-white/20 group-hover:border-white/50'} flex items-center justify-center transition-colors`}>
                                        {currentSubcategory === sub.value && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>
                                    <span className={`text-sm ${currentSubcategory === sub.value ? 'text-white font-medium' : 'text-white/70 group-hover:text-white transition-colors'}`}>
                                        {sub.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Brands */}
                {!hideBrand && (
                    <div className="mb-8">
                        <h4 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Marca</h4>
                        <div className="flex flex-col gap-3">
                            {brands.map((brand) => (
                                <label key={brand.value} className="flex items-center gap-3 cursor-pointer group" onClick={() => updateFilter('brand', brand.value)}>
                                    <div className={`w-4 h-4 rounded-sm border ${currentBrand === brand.value ? 'bg-[#74ACDF] border-[#74ACDF]' : 'border-white/20 group-hover:border-white/50'} flex items-center justify-center transition-colors`}>
                                        {currentBrand === brand.value && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>
                                    <span className={`text-sm ${currentBrand === brand.value ? 'text-white font-medium' : 'text-white/70 group-hover:text-white transition-colors'}`}>
                                        {brand.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sizes */}
                <div className="mb-8">
                    <h4 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Talle / Tamaño</h4>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => updateFilter('size', currentSize === size ? '' : size)}
                                className={`min-w-[40px] h-10 px-3 rounded flex items-center justify-center text-xs font-medium border transition-colors ${currentSize === size
                                    ? 'bg-white text-black border-white'
                                    : 'bg-transparent text-white/70 border-white/20 hover:border-white/50'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Perfume specific filters */}
                {currentCategory === 'perfumes' && (
                    <>
                        <div className="mb-8">
                            <h4 className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-4">Género</h4>
                            <div className="flex flex-col gap-3">
                                {[
                                    { value: '', label: 'Todos' },
                                    { value: 'masculino', label: 'Masculino' },
                                    { value: 'femenino', label: 'Femenino' },
                                    { value: 'unisex', label: 'Unisex' },
                                ].map((gender) => (
                                    <label key={gender.value} className="flex items-center gap-3 cursor-pointer group" onClick={() => updateFilter('gender', gender.value)}>
                                        <div className={`w-4 h-4 rounded-full border ${currentGender === gender.value ? 'bg-[#C9A84C] border-[#C9A84C]' : 'border-white/20 group-hover:border-white/50'} flex items-center justify-center transition-colors`}>
                                            {currentGender === gender.value && <div className="w-1.5 h-1.5 bg-[#050505] rounded-full" />}
                                        </div>
                                        <span className={`text-sm ${currentGender === gender.value ? 'text-white font-medium' : 'text-white/70 group-hover:text-white transition-colors'}`}>
                                            {gender.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h4 className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-4">Concentración</h4>
                            <div className="flex flex-col gap-3">
                                {[
                                    { value: 'Eau de Toilette', label: 'Eau de Toilette' },
                                    { value: 'Eau de Parfum', label: 'Eau de Parfum' },
                                    { value: 'Parfum', label: 'Parfum' },
                                ].map((conc) => (
                                    <label key={conc.value} className="flex items-center gap-3 cursor-pointer group" onClick={() => updateFilter('concentration', conc.value)}>
                                        <div className={`w-4 h-4 rounded-sm border ${currentConcentration === conc.value ? 'bg-[#C9A84C] border-[#C9A84C]' : 'border-white/20 group-hover:border-white/50'} flex items-center justify-center transition-colors`}>
                                            {currentConcentration === conc.value && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                        </div>
                                        <span className={`text-sm ${currentConcentration === conc.value ? 'text-white font-medium' : 'text-white/70 group-hover:text-white transition-colors'}`}>
                                            {conc.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductFilter;
