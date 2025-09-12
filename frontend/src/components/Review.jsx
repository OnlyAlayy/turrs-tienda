import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';

const Review = ({ productId, reviews, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [ratingStats, setRatingStats] = useState([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchRatingStats();
  }, [reviews]);

  const fetchRatingStats = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/stats/${productId}`);
      setRatingStats(response.data);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      Swal.fire({
        icon: 'warning',
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para dejar una reseña',
        confirmButtonText: 'Iniciar sesión'
      });
      return;
    }

    if (rating === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona una calificación',
        text: 'Por favor, elige de 1 a 5 estrellas'
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/reviews', {
        productId,
        rating,
        comment
      });

      Swal.fire({
        icon: 'success',
        title: '¡Reseña enviada!',
        text: 'Gracias por tu opinión',
        timer: 1500,
        showConfirmButton: false
      });

      setRating(0);
      setComment('');
      setShowForm(false);
      onReviewAdded(response.data);

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al enviar la reseña'
      });
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const totalReviews = reviews.length;

  const getRatingPercentage = (star) => {
    const starCount = ratingStats.find(stat => stat._id === star)?.count || 0;
    return totalReviews > 0 ? (starCount / totalReviews) * 100 : 0;
  };

  return (
    <div className="card-turrs">
      <h3 className="font-turrs-text font-semibold text-xl mb-6">Opiniones de clientes</h3>

      {/* Resumen de calificaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="flex items-center mb-4">
            <div className="text-4xl font-bold text-turrs-blue mr-4">{averageRating}</div>
            <div>
              <div className="flex mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-xl ${star <= averageRating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="font-turrs-text text-gray-600 text-sm">
                Basado en {totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'}
              </p>
            </div>
          </div>

          {/* Barras de porcentaje */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center">
                <span className="font-turrs-text text-sm w-8">{star}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${getRatingPercentage(star)}%` }}
                  ></div>
                </div>
                <span className="font-turrs-text text-sm w-12 text-right">
                  {Math.round(getRatingPercentage(star))}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Botón para escribir reseña */}
        <div className="flex items-center justify-center">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="btn-turrs px-8 py-3 text-lg"
            >
              ✍️ Escribir reseña
            </button>
          ) : (
            <div className="text-center">
              <p className="font-turrs-text text-gray-600 mb-2">
                Comparte tu experiencia con este producto
              </p>
              <button
                onClick={() => setShowForm(false)}
                className="text-turrs-blue hover:underline"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h4 className="font-turrs-text font-semibold mb-4">Tu reseña</h4>
          
          <div className="mb-4">
            <label className="block font-turrs-text font-medium mb-2">Calificación</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-300 transition-colors`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-turrs-text font-medium mb-2">Comentario</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turrs-blue"
              placeholder="Comparte tu experiencia con este producto..."
              maxLength="500"
            />
            <p className="font-turrs-text text-sm text-gray-500 text-right">
              {comment.length}/500 caracteres
            </p>
          </div>

          <div className="flex space-x-4">
            <button type="submit" className="btn-turrs">
              📤 Enviar Reseña
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista de reseñas */}
      <div>
        <h4 className="font-turrs-text font-semibold mb-4">
          Reseñas de clientes ({totalReviews})
        </h4>
        
        {reviews.length === 0 ? (
          <p className="font-turrs-text text-gray-600 text-center py-8">
            Sé el primero en dejar una reseña para este producto
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="border-b pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center mb-1">
                      <div className="flex mr-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="font-turrs-text font-semibold">{review.userName}</span>
                    </div>
                    <p className="font-turrs-text text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <p className="font-turrs-text text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;
