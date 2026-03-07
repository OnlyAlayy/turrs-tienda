import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AvatarUpload from '../components/profile/AvatarUpload';
import AddressManagement from '../components/profile/AddressManagement';

const ProfilePage = () => {
    const { user, token, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('datos'); // 'datos' or 'pedidos'

    // Perfil State
    const [profileData, setProfileData] = useState({
        name: '', email: '', phone: '', firstName: '', lastName: '', dni: ''
    });
    const [isSavingBase, setIsSavingBase] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
    const [addresses, setAddresses] = useState([]);

    // Passwords State
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [isSavingPass, setIsSavingPass] = useState(false);
    const [passMessage, setPassMessage] = useState({ type: '', text: '' });

    // Orders State
    const [orders, setOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);

    const navigate = useNavigate();

    // Headers config for Axios
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    useEffect(() => {
        if (!user) return;
        setProfileData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            dni: user.dni || ''
        });
        fetchOrders();
        fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/me`, config);
            setProfileData({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                dni: data.dni || ''
            });
            setAddresses(data.addresses || []);
        } catch (error) {
            console.error('Error fetching profile', error);
        }
    };

    const fetchOrders = async () => {
        setIsLoadingOrders(true);
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/my-orders`, config);
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoadingOrders(false);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSavingBase(true);
        setProfileMessage({ type: '', text: '' });
        try {
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, {
                name: profileData.name,
                phone: profileData.phone,
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                dni: profileData.dni
            }, config);
            setProfileMessage({ type: 'success', text: 'Datos actualizados correctamente.' });

            // Recargar perfil (o disparar fetchProfile)
            fetchProfile();
        } catch (error) {
            setProfileMessage({ type: 'error', text: 'Error al actualizar datos.' });
        } finally {
            setIsSavingBase(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPassMessage({ type: '', text: '' });

        if (passwords.newPassword.length < 6) {
            setPassMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres.' });
            return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            setPassMessage({ type: 'error', text: 'Las nuevas contraseñas no coinciden.' });
            return;
        }

        setIsSavingPass(true);
        try {
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/change-password`, {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            }, config);
            setPassMessage({ type: 'success', text: 'Contraseña actualizada correctamente.' });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setPassMessage({ type: 'error', text: error.response?.data?.message || 'Error al cambiar contraseña.' });
        } finally {
            setIsSavingPass(false);
        }
    };

    const getStatusBadge = (status) => {
        const types = {
            'pending': { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'Pendiente' },
            'processing': { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'En proceso' },
            'shipped': { bg: 'bg-purple-500/10', text: 'text-purple-500', label: 'Enviado' },
            'delivered': { bg: 'bg-green-500/10', text: 'text-green-500', label: 'Entregado' },
            'cancelled': { bg: 'bg-red-500/10', text: 'text-red-500', label: 'Cancelado' }
        };
        const current = types[status] || types['pending'];
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${current.bg} ${current.text}`}>
                {current.label}
            </span>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#050505] min-h-screen text-white pt-24 pb-16"
        >
            <div className="max-w-6xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Mi Perfil</h1>
                        <p className="text-white/40">Gestioná tus datos personales y comprobantes de compra.</p>
                    </div>
                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="text-white/40 hover:text-red-400 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        Cerrar Sesión
                    </button>
                </div>

                {/* Main Layout */}
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Tabs */}
                    <div className="lg:w-1/4 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                        <button
                            onClick={() => setActiveTab('datos')}
                            className={`flex items-center gap-3 px-5 py-4 rounded-xl text-left whitespace-nowrap transition-all ${activeTab === 'datos' ? 'bg-[#111111] text-white font-medium border border-white/10' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            Mis Datos
                        </button>
                        <button
                            onClick={() => setActiveTab('pedidos')}
                            className={`flex items-center gap-3 px-5 py-4 rounded-xl text-left whitespace-nowrap transition-all ${activeTab === 'pedidos' ? 'bg-[#111111] text-white font-medium border border-white/10' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            Mis Pedidos
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="lg:w-3/4">
                        <AnimatePresence mode="wait">

                            {/* MIS DATOS */}
                            {activeTab === 'datos' && (
                                <motion.div
                                    key="datos"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-12"
                                >
                                    {/* Información Personal */}
                                    <section>
                                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                            Información Personal
                                        </h2>

                                        <div className="mb-8">
                                            <AvatarUpload currentAvatar={user?.avatar} />
                                        </div>

                                        <form onSubmit={handleProfileSubmit} className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="md:col-span-2">
                                                    <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Email (No editable)</label>
                                                    <input
                                                        type="email"
                                                        value={profileData.email} disabled
                                                        className="w-full bg-[#050505] border border-white/5 rounded-xl px-4 py-3 text-white/40 cursor-not-allowed"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Nombre</label>
                                                    <input
                                                        type="text"
                                                        value={profileData.firstName || profileData.name.split(' ')[0]}
                                                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                                        required
                                                        className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF]/50 transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Apellido</label>
                                                    <input
                                                        type="text"
                                                        value={profileData.lastName || profileData.name.split(' ').slice(1).join(' ')}
                                                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                                        required
                                                        className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF]/50 transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">DNI</label>
                                                    <input
                                                        type="text"
                                                        value={profileData.dni}
                                                        onChange={(e) => setProfileData({ ...profileData, dni: e.target.value.replace(/[^0-9]/g, '') })}
                                                        required
                                                        placeholder="XX.XXX.XXX"
                                                        className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF]/50 transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Teléfono</label>
                                                    <input
                                                        type="tel"
                                                        value={profileData.phone}
                                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value.replace(/[^0-9+ ]/g, '') })}
                                                        required
                                                        placeholder="+54 11 ..."
                                                        className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF]/50 transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            {profileMessage.text && (
                                                <div className={`p-4 rounded-xl text-sm ${profileMessage.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                    {profileMessage.text}
                                                </div>
                                            )}

                                            <div className="flex justify-end pt-2">
                                                <button
                                                    type="submit" disabled={isSavingBase}
                                                    className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-white/90 transition-colors flex items-center gap-2"
                                                >
                                                    {isSavingBase && (
                                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                                        </svg>
                                                    )}
                                                    Guardar Cambios
                                                </button>
                                            </div>
                                        </form>
                                    </section>

                                    {/* Direcciones (Address Management) */}
                                    <AddressManagement addresses={addresses} onAddressesUpdate={setAddresses} />

                                    {/* Seguridad */}
                                    <section>
                                        <h2 className="text-xl font-bold mb-6">Seguridad</h2>
                                        <form onSubmit={handlePasswordSubmit} className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="md:col-span-2">
                                                    <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Contraseña Actual</label>
                                                    <input
                                                        type="password" required
                                                        value={passwords.currentPassword}
                                                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                                        className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF]/50 transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Nueva Contraseña</label>
                                                    <input
                                                        type="password" required
                                                        value={passwords.newPassword}
                                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                                        className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF]/50 transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Confirmar Nueva Contraseña</label>
                                                    <input
                                                        type="password" required
                                                        value={passwords.confirmPassword}
                                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                                        className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF]/50 transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            {passMessage.text && (
                                                <div className={`p-4 rounded-xl text-sm ${passMessage.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                    {passMessage.text}
                                                </div>
                                            )}

                                            <div className="flex justify-end pt-2">
                                                <button
                                                    type="submit" disabled={isSavingPass}
                                                    className="bg-white/10 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors flex items-center gap-2"
                                                >
                                                    {isSavingPass && (
                                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                                        </svg>
                                                    )}
                                                    Cambiar Contraseña
                                                </button>
                                            </div>
                                        </form>
                                    </section>
                                </motion.div>
                            )}

                            {/* MIS PEDIDOS */}
                            {activeTab === 'pedidos' && (
                                <motion.div
                                    key="pedidos"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <h2 className="text-xl font-bold mb-6">Mis Pedidos</h2>

                                    {isLoadingOrders ? (
                                        <div className="flex justify-center items-center py-20">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#74ACDF]"></div>
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-12 text-center flex flex-col items-center">
                                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                                <svg className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                            </div>
                                            <h3 className="text-xl font-medium text-white/80 mb-2">Aún no hay pedidos</h3>
                                            <p className="text-white/40 mb-8 max-w-sm">No realizaste ninguna compra todavía. Descubrí nuestra colección.</p>
                                            <Link to="/tienda" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-white/90 transition-colors">
                                                Ir a la tienda
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div key={order._id} className="bg-[#0A0A0C] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
                                                    <div className="p-6 md:p-8">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                                            <div>
                                                                <p className="text-white/40 text-sm tracking-wider uppercase mb-1">Orden #{order._id.slice(-6).toUpperCase()}</p>
                                                                <p className="text-white font-medium">{new Date(order.createdAt).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-xl font-bold">${order.totalAmount.toLocaleString('es-AR')}</span>
                                                                {getStatusBadge(order.status)}
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col gap-4">
                                                            {order.products.map((item, idx) => (
                                                                <div key={idx} className="flex flex-col sm:flex-row items-center gap-6 bg-[#111111] p-4 rounded-xl border border-white/5">
                                                                    <div className="w-20 h-20 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                                                                        {item.productId?.images?.[0] ? (
                                                                            <img src={item.productId.images[0]} alt={item.productId.name} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center text-white/10">IMG</div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 text-center sm:text-left">
                                                                        <h4 className="font-medium text-white/90 mb-1">{item.productId?.name || 'Producto no disponible'}</h4>
                                                                        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 text-sm text-white/40">
                                                                            <span>Talle: {item.size}</span>
                                                                            <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                                                                            <span>Cant: {item.quantity}</span>
                                                                            <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                                                                            <span>${item.price.toLocaleString('es-AR')}</span>
                                                                        </div>
                                                                    </div>
                                                                    {order.status === 'delivered' && (
                                                                        <button className="text-sm font-medium text-[#74ACDF] hover:text-white transition-colors">
                                                                            Volver a comprar
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

export default ProfilePage;
