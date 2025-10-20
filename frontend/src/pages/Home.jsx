// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

// Importar imágenes locales como respaldo
import banner1 from '../assets/images/prod1.jpg';
import banner2 from '../assets/images/prod2.jpg';
import banner3 from '../assets/images/prod3.jpg';

const Home = () => {
  const { getCartItemsCount } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
  try {
    // Primero intentamos con la ruta de destacados
    const response = await axios.get('http://localhost:5000/api/products/featured');
    setFeaturedProducts(response.data);
  } catch (error) {
    console.error('Error cargando productos destacados, intentando con todos los productos:', error);
    try {
      // Si falla, intentamos con la ruta de todos los productos
      const response = await axios.get('http://localhost:5000/api/products');
      // Tomamos los primeros 3 productos como destacados
      const featuredProducts = response.data.slice(0, 3);
      setFeaturedProducts(featuredProducts);
    } catch (secondError) {
      console.error('Error cargando todos los productos:', secondError);
      // Productos de respaldo en caso de error
      setFeaturedProducts([
        {
          _id: '1',
          name: 'Camiseta Classic',
          price: 29.99,
          images: [banner1],
          description: 'Camiseta de alta calidad'
        },
        {
          _id: '2',
          name: 'Hoodie Urban', 
          price: 59.99,
          images: [banner2],
          description: 'Hoodie urbano'
        },
        {
          _id: '3',
          name: 'Gorra Snapback',
          price: 24.99,
          images: [banner3],
          description: 'Gorra estilo snapback'
        }
      ]);
    }
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-turrs-blue"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-96 bg-gradient-to-r from-turrs-blue to-blue-600">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div>
            <h1 className="font-turrs-title text-4xl md:text-6xl text-turrs-white mb-4 drop-shadow-lg">
              TURRS
            </h1>
            <p className="font-turrs-text text-xl text-turrs-white mb-8">
              Estilo urbano con actitud
            </p>
            <Link to="/products" className="btn-turrs-red text-lg px-8 py-3">
              Descubrir Colección
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-turrs-title text-3xl text-center text-turrs-black mb-12">
            Productos Destacados
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <div key={product._id} className="card-turrs text-center hover:shadow-xl transition-shadow">
                <img 
                  src={product.images?.[0] || banner1} 
                  alt={product.name} 
                  className="w-full h-48 object-cover rounded-t-lg mb-4" 
                />
                <h3 className="font-turrs-text font-semibold text-lg mb-2">{product.name}</h3>
                <p className="font-turrs-text text-turrs-blue font-bold text-xl mb-4">${product.price}</p>
                <Link to={`/products/${product._id}`} className="btn-turrs-red text-sm">
                  Ver Producto
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/products" className="btn-turrs px-8 py-3 text-lg">
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h3 className="font-turrs-title text-3xl text-center text-turrs-black mb-12">
            ¿Por qué elegir TURRS?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-turrs text-center">
              <div className="w-16 h-16 bg-turrs-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🚚</span>
              </div>
              <h4 className="font-turrs-text font-semibold text-lg mb-3">Envío Gratis</h4>
              <p className="font-turrs-text text-gray-600">Envío gratuito en compras superiores a $50.000</p>
            </div>

            <div className="card-turrs text-center">
              <div className="w-16 h-16 bg-turrs-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">💯</span>
              </div>
              <h4 className="font-turrs-text font-semibold text-lg mb-3">Calidad Premium</h4>
              <p className="font-turrs-text text-gray-600">Productos de la más alta calidad garantizada</p>
            </div>

            <div className="card-turrs text-center">
              <div className="w-16 h-16 bg-turrs-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🔄</span>
              </div>
              <h4 className="font-turrs-text font-semibold text-lg mb-3">Devoluciones</h4>
              <p className="font-turrs-text text-gray-600">30 días para devoluciones sin problemas</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;