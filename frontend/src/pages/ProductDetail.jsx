import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import Review from '../components/Review';
import Swal from 'sweetalert2';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Producto no encontrado',
        text: 'El producto que buscas no existe'
      });
      navigate('/products');
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/product/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    Swal.fire({
      icon: 'success',
      title: '¡Producto agregado!',
      text: `${product.name} se agregó al carrito`,
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleReviewAdded = (newReview) => {
    setReviews([newReview, ...reviews]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-turrs-blue"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="font-turrs-text text-2xl text-gray-600">Producto no encontrado</h2>
        <Link to="/products" className="btn-turrs mt-4 inline-block">
          Volver a productos
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex space-x-2 font-turrs-text text-sm text-gray-600">
          <li><Link to="/" className="hover:text-turrs-blue">Inicio</Link></li>
          <li>→</li>
          <li><Link to="/products" className="hover:text-turrs-blue">Productos</Link></li>
          <li>→</li>
          <li className="text-turrs-blue">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Galería de imágenes */}
        <div>
          <div className="mb-4">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-turrs-blue' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div>
          <h1 className="font-turrs-title text-3xl md:text-4xl text-turrs-black mb-4">
            {product.name}
          </h1>

          <div className="flex items-center mb-4">
            <span className="font-turrs-text font-bold text-2xl text-turrs-blue">
              ${product.price}
            </span>
            {product.stock > 0 ? (
              <span className="ml-4 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                ✓ En stock
              </span>
            ) : (
              <span className="ml-4 px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                ✗ Sin stock
              </span>
            )}
          </div>

          <p className="font-turrs-text text-gray-700 mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-6">
            <span className="font-turrs-text font-semibold">Categoría:</span>
            <span className="ml-2 font-turrs-text text-turrs-blue">{product.category}</span>
          </div>

          {/* Selector de cantidad y botón de compra */}
          {product.stock > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-turrs-text font-semibold">Cantidad:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-gray-600 hover:text-turrs-blue"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-turrs-text font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 text-gray-600 hover:text-turrs-blue"
                  >
                    +
                  </button>
                </div>
                <span className="font-turrs-text text-sm text-gray-600">
                  {product.stock} disponibles
                </span>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="btn-turrs-red px-8 py-3 text-lg flex-1"
                >
                  🛒 Agregar al carrito
                </button>
                <button className="btn-turrs px-8 py-3 text-lg flex-1">
                  💳 Comprar ahora
                </button>
              </div>
            </div>
          )}

          {product.stock === 0 && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-turrs-text text-gray-600">
                Este producto está actualmente agotado. ¡Vuelve pronto!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sección de reseñas */}
      <div className="mb-12">
        <Review 
          productId={id} 
          reviews={reviews} 
          onReviewAdded={handleReviewAdded} 
        />
      </div>

      {/* Productos relacionados (placeholder) */}
      <div>
        <h2 className="font-turrs-text text-2xl font-semibold mb-6">Productos relacionados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <p className="font-turrs-text text-gray-600">Próximamente...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;