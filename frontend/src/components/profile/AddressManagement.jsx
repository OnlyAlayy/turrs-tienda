import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

const AddressManagement = ({ addresses: initialAddresses, onAddressesUpdate }) => {
    const { token } = useAuth();
    const [addresses, setAddresses] = useState(initialAddresses || []);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const emptyAddress = {
        label: 'Casa', firstName: '', lastName: '', dni: '', phone: '',
        street: '', streetNumber: '', floor: '', apartment: '',
        city: '', province: '', postalCode: '', isDefault: false
    };

    const [formData, setFormData] = useState(emptyAddress);

    const handleEdit = (address) => {
        setFormData(address);
        setEditingId(address._id);
        setIsEditing(true);
    };

    const handleAdd = () => {
        if (addresses.length >= 3) {
            Swal.fire({ icon: 'warning', text: 'Solo puedes tener hasta 3 direcciones.', background: '#0a0a0c', color: '#fff' });
            return;
        }
        setFormData(emptyAddress);
        setEditingId(null);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditingId(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res;
            if (editingId) {
                res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/addresses/${editingId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/addresses`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setAddresses(res.data.addresses);
            onAddressesUpdate(res.data.addresses);
            setIsEditing(false);
            Swal.fire({ icon: 'success', text: res.data.message, background: '#0a0a0c', color: '#fff', timer: 1500, showConfirmButton: false });
        } catch (error) {
            Swal.fire({ icon: 'error', text: error.response?.data?.message || 'Error guardando dirección', background: '#0a0a0c', color: '#fff' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar dirección?',
            text: "No podrás revertir esto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#0a0a0c', color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                const res = await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/addresses/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAddresses(res.data.addresses);
                onAddressesUpdate(res.data.addresses);
                Swal.fire({ icon: 'success', text: 'Dirección eliminada', background: '#0a0a0c', color: '#fff', timer: 1500, showConfirmButton: false });
            } catch (error) {
                Swal.fire({ icon: 'error', text: 'Error eliminando dirección', background: '#0a0a0c', color: '#fff' });
            }
        }
    };

    return (
        <section className="mt-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">Direcciones de Envío</h2>
                {!isEditing && addresses.length < 3 && (
                    <button onClick={handleAdd} className="text-[#74ACDF] text-sm hover:underline font-medium">
                        + Nueva Dirección
                    </button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
                    <h3 className="text-lg font-medium border-b border-white/10 pb-4 mb-4">
                        {editingId ? 'Editar Dirección' : 'Agregar Dirección'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Etiqueta (ej. Casa, Trabajo)</label>
                            <input required type="text" name="label" value={formData.label} onChange={handleChange} className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF]/50" />
                        </div>
                        <div>
                            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Nombre quien recibe</label>
                            <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF]/50" />
                        </div>
                        <div>
                            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Apellido</label>
                            <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF]/50" />
                        </div>
                        <div>
                            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">DNI</label>
                            <input required type="text" name="dni" value={formData.dni} onChange={handleChange} className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF]/50" />
                        </div>
                        <div>
                            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Teléfono</label>
                            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF]/50" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Calle</label>
                            <input required type="text" name="street" value={formData.street} onChange={handleChange} className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF]/50" />
                        </div>
                        <div>
                            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Número</label>
                            <input required type="text" name="streetNumber" value={formData.streetNumber} onChange={handleChange} className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF]/50" />
                        </div>
                        <div>
                            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Piso / Depto (Opcional)</label>
                            <div className="flex gap-2">
                                <input type="text" name="floor" placeholder="Piso" value={formData.floor} onChange={handleChange} className="w-1/2 bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF]/50" />
                                <input type="text" name="apartment" placeholder="Depto" value={formData.apartment} onChange={handleChange} className="w-1/2 bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF]/50" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Ciudad</label>
                            <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF]/50" />
                        </div>
                        <div>
                            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Provincia</label>
                            <input required type="text" name="province" value={formData.province} onChange={handleChange} className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF]/50" />
                        </div>
                        <div>
                            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Código Postal</label>
                            <input required type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF]/50" />
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" name="isDefault" id="isDefault" checked={formData.isDefault} onChange={handleChange} className="w-5 h-5 accent-[#74ACDF]" />
                            <label htmlFor="isDefault" className="text-white/80 text-sm">Establecer como dirección principal</label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                        <button type="button" onClick={handleCancel} className="px-6 py-3 rounded-xl font-medium text-white/60 hover:text-white transition-colors">Cancelar</button>
                        <button type="submit" disabled={loading} className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-white/90 transition-colors flex items-center gap-2">
                            {loading ? 'Guardando...' : 'Guardar Dirección'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {addresses.length === 0 ? (
                        <div className="col-span-full bg-white/5 rounded-2xl p-8 text-center border border-white/10">
                            <p className="text-white/40 mb-4">No tienes direcciones guardadas.</p>
                            <button onClick={handleAdd} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
                                Agregar mi primera dirección
                            </button>
                        </div>
                    ) : (
                        addresses.map((address) => (
                            <div key={address._id} className={`bg-[#0A0A0C] border p-6 rounded-2xl relative ${address.isDefault ? 'border-[#74ACDF]/50 shadow-[0_0_15px_rgba(116,172,223,0.1)]' : 'border-white/5'}`}>
                                {address.isDefault && <span className="absolute top-4 right-4 bg-[#74ACDF]/20 text-[#74ACDF] text-[10px] uppercase font-bold px-2 py-1 rounded-full">Principal</span>}
                                <h3 className="font-bold text-lg mb-1">{address.label}</h3>
                                <p className="text-white/60 text-sm mb-4 leading-relaxed">
                                    {address.firstName} {address.lastName}<br />
                                    {address.street} {address.streetNumber} {address.floor && address.apartment ? `${address.floor} ${address.apartment}` : ''}<br />
                                    {address.city}, {address.province} {address.postalCode}
                                </p>
                                <div className="flex items-center gap-4 text-sm font-medium">
                                    <button onClick={() => handleEdit(address)} className="text-[#74ACDF] hover:underline">Editar</button>
                                    <button onClick={() => handleDelete(address._id)} className="text-red-400 hover:text-red-300 hover:underline">Eliminar</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </section>
    );
};

export default AddressManagement;
