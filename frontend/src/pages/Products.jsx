import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;

      const response = await axios.get('http://localhost:5000/api/products', { params });
      setProducts(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar los productos'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const categories = [...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-turrs-blue"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-turrs-title text-3xl text-turrs-blue mb-4 text-center">
          Nuestros Productos
        </h1>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-turrs-blue"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 text-gray-400 hover:text-turrs-blue"
              >
                🔍
              </button>
            </div>
          </form>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-turrs-blue"
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="card-turrs hover:shadow-xl transition-shadow">
            {product.images && product.images[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
            )}
            <div className="p-4">
              <h3 className="font-turrs-text font-semibold text-lg mb-2">{product.name}</h3>
              <p className="font-turrs-text text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-turrs-text font-bold text-turrs-blue text-xl">
                  ${product.price}
                </span>
                <button className="btn-turrs-red text-sm px-4 py-2">
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="font-turrs-text text-gray-500 text-lg">No se encontraron productos</p>
        </div>
      )}
    </div>
  );
};

export default Products;