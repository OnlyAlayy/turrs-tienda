import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ConfirmDeleteModal = ({ isOpen, onClose, product, onSuccess }) => {
    const [loading, setLoading] = useState(false);

    if (!isOpen || !product) return null;

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:5000/api/products/${product._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire({
                toast: true,
                position: 'bottom-end',
                icon: 'success',
                title: 'Producto eliminado',
                showConfirmButton: false,
                timer: 3000,
                background: '#0a0a0c',
                color: '#fff'
            });

            onSuccess(product._id);
            onClose();
        } catch (error) {
            console.error('Error deleting product', error);
            Swal.fire({
                toast: true,
                position: 'bottom-end',
                icon: 'error',
                title: 'Error al eliminar',
                showConfirmButton: false,
                timer: 3000,
                background: '#0a0a0c',
                color: '#fff'
            });
            onClose(); // Cerrar modal de todos modos
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="bg-[#0A0A0C] border border-red-500/20 rounded-2xl max-w-sm w-full mx-auto p-6 text-center relative z-10 shadow-2xl shadow-red-900/10">
                <div className="text-5xl text-red-400/60 mb-4 flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>

                <h2 className="text-white font-bold text-xl mb-2">¿Eliminar producto?</h2>

                <p className="text-white/50 text-sm mb-6">
                    Esta acción no se puede deshacer. El producto será eliminado permanentemente de la base de datos.
                </p>

                <div className="bg-white/5 rounded-xl px-4 py-3 mb-6">
                    <p className="text-white/70 text-sm italic line-clamp-2">
                        "{product.name}"
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 bg-white/5 hover:bg-white/10 transition border border-white/10 text-white/70 rounded-xl py-3 font-medium cursor-pointer"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 transition border border-red-500/30 text-red-400 rounded-xl py-3 font-medium flex items-center justify-center cursor-pointer"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-red-400/20 border-t-red-400 rounded-full animate-spin"></div>
                        ) : (
                            'Sí, eliminar'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
