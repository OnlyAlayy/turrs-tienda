// frontend/src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import ProductForm from '../../components/admin/ProductForm';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
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

  const handleDeleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C0392B',
      cancelButtonColor: '#5DADE2',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${productId}`);
        setProducts(products.filter(p => p._id !== productId));
        Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
      }
    }
  };

  const handleProductAdded = (newProduct) => {
    setProducts([...products, newProduct]);
  };

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
        <h1 className="font-turrs-title text-3xl text-turrs-blue mb-2">
          Panel de Administración
        </h1>
        <p className="font-turrs-text text-gray-600">
          Bienvenido, {user?.name || user?.email || 'Administrador'}. Gestiona tu tienda desde aquí.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2 px-4 font-turrs-text font-medium ${
              activeTab === 'products'
                ? 'border-b-2 border-turrs-blue text-turrs-blue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Productos
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-4 font-turrs-text font-medium ${
              activeTab === 'orders'
                ? 'border-b-2 border-turrs-blue text-turrs-blue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Órdenes
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-2 px-4 font-turrs-text font-medium ${
              activeTab === 'stats'
                ? 'border-b-2 border-turrs-blue text-turrs-blue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Estadísticas
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-turrs-text text-2xl font-semibold">Gestión de Productos</h2>
            <button 
              onClick={() => setShowProductForm(true)}
              className="btn-turrs"
            >
              + Agregar Producto
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="card-turrs">
                {product.images && product.images[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                  />
                )}
                <h3 className="font-turrs-text font-semibold text-lg mb-2">{product.name}</h3>
                <p className="font-turrs-text text-gray-600 text-sm mb-2 line-clamp-2">
                  {product.description}
                </p>
                <p className="font-turrs-text font-bold text-turrs-blue mb-4">
                  ${product.price}
                </p>
                <div className="flex space-x-2">
                  <button className="btn-turrs text-sm px-3 py-1">
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="btn-turrs-red text-sm px-3 py-1"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="font-turrs-text text-gray-500">No hay productos registrados</p>
            </div>
          )}

          {/* Modal Form */}
          <ProductForm 
            isOpen={showProductForm}
            onClose={() => setShowProductForm(false)}
            onProductAdded={handleProductAdded}
          />
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h2 className="font-turrs-text text-2xl font-semibold mb-6">Gestión de Órdenes</h2>
          <p className="font-turrs-text text-gray-500">Próximamente...</p>
        </div>
      )}

      {activeTab === 'stats' && (
        <div>
          <h2 className="font-turrs-text text-2xl font-semibold mb-6">Estadísticas</h2>
          <p className="font-turrs-text text-gray-500">Próximamente...</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;