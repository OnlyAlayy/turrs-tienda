import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const CATEGORIES = ['camisetas', 'ropa-deportiva', 'calzado', 'perfumes', 'accesorios', 'coleccionables', 'equipamiento'];
const BRANDS = ['afa', 'adidas', 'nike', 'puma', 'under-armour', 'carolina-herrera', 'lacoste', 'ralph-lauren', 'turrs', 'sin-marca'];

// Helper to get default sizes by category
const getDefaultSizes = (category) => {
    if (category === 'perfumes') return ['30ml', '50ml', '100ml', '200ml'];
    if (category === 'calzado') return ['38', '39', '40', '41', '42', '43', '44', '45'];
    return ['S', 'M', 'L', 'XL', 'XXL'];
};

const ProductEditModal = ({ isOpen, onClose, product, onSuccess }) => {
    const isEditMode = !!product;

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        shortDescription: '',
        description: '',
        category: 'camisetas',
        brand: 'turrs',
        price: '',
        compareAtPrice: '',
        images: [''], // Start with one empty slot
        sizes: [],
        isActive: true,
        isFeatured: false,
        isLimitedEdition: false,
        isNewArrival: false,
        isBestSeller: false
    });

    const [loading, setLoading] = useState(false);

    // Initialize or Reset Form
    useEffect(() => {
        if (isOpen) {
            if (isEditMode && product) {
                // Ensure sizes array is populated correctly from product
                const currentSizes = getDefaultSizes(product.category).map(sizeLabel => {
                    const existing = product.sizes?.find(s => s.size === sizeLabel);
                    return { size: sizeLabel, stock: existing ? existing.stock : 0 };
                });

                setFormData({
                    name: product.name || '',
                    slug: product.slug || '',
                    shortDescription: product.shortDescription || '',
                    description: product.description || '',
                    category: product.category || 'camisetas',
                    brand: product.brand || 'turrs',
                    price: product.price || '',
                    compareAtPrice: product.compareAtPrice || '',
                    images: product.images?.length ? [...product.images] : [''],
                    sizes: currentSizes,
                    isActive: product.isActive ?? true,
                    isFeatured: product.isFeatured ?? false,
                    isLimitedEdition: product.isLimitedEdition ?? false,
                    isNewArrival: product.isNewArrival ?? false,
                    isBestSeller: product.isBestSeller ?? false
                });
            } else {
                setFormData({
                    name: '',
                    slug: '',
                    shortDescription: '',
                    description: '',
                    category: 'camisetas',
                    brand: 'turrs',
                    price: '',
                    compareAtPrice: '',
                    images: [''],
                    sizes: getDefaultSizes('camisetas').map(s => ({ size: s, stock: 0 })),
                    isActive: true,
                    isFeatured: false,
                    isLimitedEdition: false,
                    isNewArrival: false,
                    isBestSeller: false
                });
            }
        }
    }, [isOpen, isEditMode, product]);

    // Update sizes when category changes
    useEffect(() => {
        if (!isOpen) return; // Don't trigger when closing
        // Only auto-update sizes array layout if we are creating or if the user actively changed the category.
        // We handle this in the handler to avoid weird resets on initial load.
    }, [formData.category]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCategoryChange = (e) => {
        const newCat = e.target.value;
        const newSizeLayout = getDefaultSizes(newCat).map(s => ({ size: s, stock: 0 }));
        setFormData(prev => ({
            ...prev,
            category: newCat,
            sizes: newSizeLayout
        }));
    };

    const handleSizeStockChange = (sizeLabel, value) => {
        const val = parseInt(value, 10);
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.map(s => s.size === sizeLabel ? { ...s, stock: isNaN(val) ? 0 : val } : s)
        }));
    };

    const handleImageUrlChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const addImageSlot = () => {
        setFormData({ ...formData, images: [...formData.images, ''] });
    };

    const removeImageSlot = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        if (newImages.length === 0) newImages.push(''); // Always keep at least one
        setFormData({ ...formData, images: newImages });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // Cleanup empty image URLs
            const cleanData = { ...formData };
            cleanData.images = cleanData.images.filter(img => img.trim() !== '');
            // Auto-slug if empty in CREATE mode
            if (!isEditMode && !cleanData.slug) {
                cleanData.slug = cleanData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            }

            // Clean price numbers
            cleanData.price = Number(cleanData.price);
            if (cleanData.compareAtPrice) {
                cleanData.compareAtPrice = Number(cleanData.compareAtPrice);
            } else {
                delete cleanData.compareAtPrice;
            }

            let res;
            if (isEditMode) {
                res = await axios.put(`http://localhost:5000/api/products/${product._id}`, cleanData, { headers });
                Swal.fire({
                    toast: true,
                    position: 'bottom-end',
                    icon: 'success',
                    title: 'Producto actualizado',
                    showConfirmButton: false,
                    timer: 3000,
                    background: '#0a0a0c',
                    color: '#fff'
                });
            } else {
                res = await axios.post('http://localhost:5000/api/products', cleanData, { headers });
                Swal.fire({
                    toast: true,
                    position: 'bottom-end',
                    icon: 'success',
                    title: 'Producto creado',
                    showConfirmButton: false,
                    timer: 3000,
                    background: '#0a0a0c',
                    color: '#fff'
                });
            }

            onSuccess(res.data, isEditMode);
            onClose();
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error al guardar',
                text: error.response?.data?.message || 'Verificá los datos e intentá nuevamente.',
                background: '#0a0a0c',
                color: '#fff',
                confirmButtonColor: '#74ACDF'
            });
        } finally {
            setLoading(false);
        }
    };


    if (!isOpen) return null;

    // Toggle styling helper
    const ToggleSwitch = ({ checked, onChange, name }) => (
        <div
            onClick={() => onChange({ target: { name, type: 'checkbox', checked: !checked } })}
            className={`w-10 h-6 rounded-full transition-colors cursor-pointer relative flex items-center ${checked ? 'bg-[#74ACDF]' : 'bg-white/10'}`}
        >
            <div className={`w-4 h-4 bg-white rounded-full absolute transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
        </div>
    );

    const getGridCols = () => {
        if (formData.category === 'perfumes' || formData.category === 'calzado') return 'grid-cols-4';
        return 'grid-cols-5';
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center py-10 px-4">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="bg-[#0A0A0C] border border-white/10 rounded-3xl w-full max-w-2xl max-h-full overflow-y-auto relative z-10 custom-scrollbar">

                {/* Header */}
                <div className="sticky top-0 bg-[#0A0A0C]/90 backdrop-blur-md p-6 border-b border-white/5 flex justify-between items-center z-20">
                    <div>
                        <h2 className="text-2xl font-bold text-white font-turrs-title leading-none">
                            {isEditMode ? 'Editar Producto' : 'Nuevo Producto'}
                        </h2>
                        {isEditMode && <p className="text-white/40 text-sm mt-1">{product.name}</p>}
                    </div>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-10">

                    {/* Basic Info */}
                    <section>
                        <h3 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4 font-semibold">Información Básica</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">Nombre del producto *</label>
                                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white w-full placeholder:text-white/20 focus:border-[#74ACDF]/50 outline-none transition" />
                            </div>
                            <div>
                                <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">Slug</label>
                                <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white w-full placeholder:text-white/20 focus:border-[#74ACDF]/50 outline-none transition" />
                                <p className="text-white/20 text-xs mt-1">Se usa en la URL: /producto/slug (Se autogenera si se deja vacío)</p>
                            </div>
                            <div>
                                <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">Descripción corta *</label>
                                <textarea required name="shortDescription" rows="2" value={formData.shortDescription} onChange={handleChange} className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white w-full placeholder:text-white/20 focus:border-[#74ACDF]/50 outline-none transition resize-none"></textarea>
                            </div>
                            <div>
                                <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">Descripción completa</label>
                                <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white w-full placeholder:text-white/20 focus:border-[#74ACDF]/50 outline-none transition resize-y"></textarea>
                            </div>
                        </div>
                    </section>

                    {/* Category & Brand */}
                    <section>
                        <h3 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4 font-semibold">Categoría y Marca</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">Categoría *</label>
                                <select required name="category" value={formData.category} onChange={handleCategoryChange} className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white w-full focus:border-[#74ACDF]/50 outline-none transition appearance-none">
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat.replace('-', ' ')}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">Marca *</label>
                                <select required name="brand" value={formData.brand} onChange={handleChange} className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white w-full focus:border-[#74ACDF]/50 outline-none transition appearance-none">
                                    {BRANDS.map(b => (
                                        <option key={b} value={b}>{b.replace('-', ' ')}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Pricing */}
                    <section>
                        <h3 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4 font-semibold">Precios</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">Precio (USD) *</label>
                                <input required type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleChange} className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white w-full placeholder:text-white/20 focus:border-[#74ACDF]/50 outline-none transition" />
                            </div>
                            <div>
                                <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">Precio Tachado / Compare At</label>
                                <input type="number" step="0.01" min="0" name="compareAtPrice" value={formData.compareAtPrice} onChange={handleChange} className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white w-full placeholder:text-white/20 focus:border-[#74ACDF]/50 outline-none transition" />
                                <p className="text-white/20 text-xs mt-1">Dejar vacío si no hay descuento</p>
                            </div>
                        </div>
                    </section>

                    {/* Stock & Sizes */}
                    <section>
                        <h3 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4 font-semibold">Stock y Talles</h3>
                        <div className={`grid gap-4 ${getGridCols()}`}>
                            {formData.sizes.map((sField, i) => (
                                <div key={i} className="flex flex-col">
                                    <label className="text-white/60 text-xs text-center mb-1">{sField.size}</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={sField.stock}
                                        onChange={(e) => handleSizeStockChange(sField.size, e.target.value)}
                                        className="w-full text-center bg-[#050505] border border-white/10 rounded-lg py-2 text-white text-sm focus:border-[#74ACDF]/50 outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Images */}
                    <section>
                        <h3 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4 font-semibold">Imágenes</h3>
                        <div className="space-y-3">
                            {formData.images.map((imgUrl, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#050505] border border-white/5 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                                        {imgUrl ? <img src={imgUrl} alt="prev" className="w-full h-full object-cover" /> : <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                                    </div>
                                    <input
                                        type="url"
                                        value={imgUrl}
                                        onChange={(e) => handleImageUrlChange(i, e.target.value)}
                                        placeholder="https://images.unsplash.com/..."
                                        className="flex-1 bg-[#050505] border border-white/10 rounded-xl px-4 py-2 text-white text-sm placeholder:text-white/20 focus:border-[#74ACDF]/50 outline-none"
                                    />
                                    <button type="button" onClick={() => removeImageSlot(i)} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition flex items-center justify-center shrink-0">
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={addImageSlot} className="text-[#74ACDF] text-sm font-medium hover:text-white transition flex items-center gap-1 mt-2">
                                <span>+</span> Agregar imagen
                            </button>
                            <p className="text-white/20 text-xs">La primera imagen es la principal</p>
                        </div>
                    </section>

                    {/* Flags */}
                    <section>
                        <h3 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4 font-semibold">Configuración</h3>
                        <div className="space-y-4">
                            {[
                                { name: 'isActive', label: 'Producto activo' },
                                { name: 'isFeatured', label: 'Producto destacado' },
                                { name: 'isLimitedEdition', label: 'Edición limitada' },
                                { name: 'isNewArrival', label: 'Nuevo' },
                                { name: 'isBestSeller', label: 'Más vendido' }
                            ].map(flag => (
                                <div key={flag.name} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.05] p-3 rounded-xl">
                                    <span className="text-white/80 text-sm">{flag.label}</span>
                                    <ToggleSwitch name={flag.name} checked={formData[flag.name]} onChange={handleChange} />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Footer Actions */}
                    <div className="flex justify-between items-center mt-8 border-t border-white/5 pt-6 pb-2">
                        <span className="text-white/20 text-xs">* Campos requeridos</span>
                        <div className="flex gap-3">
                            <button type="button" onClick={onClose} disabled={loading} className="px-6 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition font-medium text-sm">
                                Cancelar
                            </button>
                            <button type="submit" disabled={loading} className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#74ACDF] to-[#C9A84C] text-[#050505] hover:opacity-90 transition font-bold text-sm min-w-[150px]">
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-[#050505]/20 border-t-[#050505] rounded-full animate-spin"></div>
                                        Guardando...
                                    </span>
                                ) : (
                                    isEditMode ? 'Guardar cambios' : 'Crear producto'
                                )}
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ProductEditModal;
