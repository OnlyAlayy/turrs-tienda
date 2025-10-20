import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ProductForm = ({ isOpen, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: ['']
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: formData.images.filter(img => img.trim() !== '')
      };

      const response = await axios.post('http://localhost:5000/api/products', productData);
      
      Swal.fire({
        icon: 'success',
        title: '¡Producto agregado!',
        text: 'El producto se ha agregado correctamente'
      });

      onProductAdded(response.data);
      onClose();
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        images: ['']
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al agregar el producto'
      });
    } finally {
      setLoading(false);
    }
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, '']
    });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-turrs-title text-2xl text-turrs-blue">Agregar Producto</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-turrs-text text-sm font-medium text-gray-700 mb-1">
                Nombre del Producto *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turrs-blue"
              />
            </div>

            <div>
              <label className="block font-turrs-text text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turrs-blue"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-turrs-text text-sm font-medium text-gray-700 mb-1">
                  Precio *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turrs-blue"
                />
              </div>

              <div>
                <label className="block font-turrs-text text-sm font-medium text-gray-700 mb-1">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turrs-blue"
                />
              </div>
            </div>

            <div>
              <label className="block font-turrs-text text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turrs-blue"
                placeholder="Ej: Ropa, Accesorios, etc."
              />
            </div>

            <div>
              <label className="block font-turrs-text text-sm font-medium text-gray-700 mb-1">
                Imágenes (URLs)
              </label>
              {formData.images.map((image, index) => (
                <input
                  key={index}
                  type="url"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder={`URL de la imagen ${index + 1}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turrs-blue mb-2"
                />
              ))}
              <button
                type="button"
                onClick={addImageField}
                className="btn-turrs text-sm"
              >
                + Agregar otra imagen
              </button>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-turrs px-6 py-2 disabled:opacity-50"
              >
                {loading ? 'Agregando...' : 'Agregar Producto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;