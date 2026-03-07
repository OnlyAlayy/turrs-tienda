import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

const AvatarUpload = ({ currentAvatar }) => {
    const fileInputRef = useRef(null);
    const { token, user, login } = useAuth(); // We might need to refresh user or just rely on context update if we have an update function. We'll refresh via window.location.reload() or we can just fetch verify again
    const [isUploading, setIsUploading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(currentAvatar || null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            Swal.fire({
                icon: 'error',
                title: 'Formato inválido',
                text: 'Por favor selecciona una imagen.',
                background: '#0a0a0c',
                color: '#fff',
                confirmButtonColor: '#74ACDF'
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({
                icon: 'error',
                title: 'Archivo muy grande',
                text: 'La imagen no debe superar los 5MB.',
                background: '#0a0a0c',
                color: '#fff',
                confirmButtonColor: '#74ACDF'
            });
            return;
        }

        // Mostrar preview local rápido
        const localUrl = URL.createObjectURL(file);
        setAvatarPreview(localUrl);

        // Subir
        setIsUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile-photo`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setAvatarPreview(import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + response.data.avatar : 'http://localhost:5000' + response.data.avatar);

            Swal.fire({
                icon: 'success',
                title: 'Foto actualizada',
                text: 'Tu foto de perfil se ha guardado con éxito.',
                background: '#0a0a0c',
                color: '#fff',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                // Recargar para propagar el avatar en el navbar global si no tenemos un setUser explicit
                window.location.reload();
            });

        } catch (error) {
            console.error(error);
            setAvatarPreview(currentAvatar); // revertir
            Swal.fire({
                icon: 'error',
                title: 'Error al subir',
                text: error.response?.data?.message || 'Error desconocido al subir la imagen.',
                background: '#0a0a0c',
                color: '#fff',
                confirmButtonColor: '#74ACDF'
            });
        } finally {
            setIsUploading(false);
        }
    };

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const displayUrl = avatarPreview ? (avatarPreview.startsWith('blob:') ? avatarPreview : (avatarPreview.startsWith('http') ? avatarPreview : `${API_BASE}${avatarPreview}`)) : null;

    return (
        <div className="relative group inline-block">
            <div
                onClick={handleClick}
                className={`w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 bg-black/50 cursor-pointer relative ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
                {displayUrl ? (
                    <img src={displayUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30 text-3xl font-bold uppercase">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
                    </div>
                )}

                {/* Hover overlay camera icon */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
            />

            {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white/20 border-t-[#74ACDF] rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
};

export default AvatarUpload;
