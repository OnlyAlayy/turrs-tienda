import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatPrice, formatDate } from './OrderDetailModal';

const StatsTab = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-turrs-blue"></div>
            </div>
        );
    }

    if (!stats) return <div className="text-white/50 text-center py-10">No se pudieron cargar las estadísticas.</div>;

    const maxRevenue = Math.max(...stats.monthlyRevenue.map(m => m.total), 1); // Avoid division by 0

    return (
        <div className="space-y-6">
            <h2 className="text-white font-bold text-2xl mb-6">Estadísticas Generales</h2>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0A0A0C] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition group-hover:bg-green-500/20"></div>
                    <div className="relative z-10">
                        <p className="text-white/40 text-sm mb-1 font-medium">Ingresos Totales</p>
                        <p className="text-3xl font-bold text-white">{formatPrice(stats.totalRevenue)}</p>
                    </div>
                </div>

                <div className="bg-[#0A0A0C] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition group-hover:bg-blue-500/20"></div>
                    <div className="relative z-10">
                        <p className="text-white/40 text-sm mb-1 font-medium">Ventas Totales</p>
                        <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
                    </div>
                </div>

                <div className="bg-[#0A0A0C] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition group-hover:bg-purple-500/20"></div>
                    <div className="relative z-10">
                        <p className="text-white/40 text-sm mb-1 font-medium">Productos Activos</p>
                        <p className="text-3xl font-bold text-white">{stats.activeProducts}</p>
                    </div>
                </div>

                <div className="bg-[#0A0A0C] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition group-hover:bg-orange-500/20"></div>
                    <div className="relative z-10">
                        <p className="text-white/40 text-sm mb-1 font-medium">Usuarios</p>
                        <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Revenue Chart */}
                <div className="lg:col-span-2 bg-[#0A0A0C] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-white font-semibold text-lg mb-6">Ingresos (Últimos 6 Meses)</h3>
                    <div className="h-64 flex items-end justify-between md:justify-around gap-2 md:gap-4 px-2">
                        {stats.monthlyRevenue.map((data, index) => {
                            const heightPercentage = (data.total / maxRevenue) * 100;
                            return (
                                <div key={index} className="flex flex-col justify-end items-center group w-12 md:w-16">
                                    <div className="w-full relative flex justify-center h-full items-end pb-2">
                                        {/* Tooltip */}
                                        <div className="absolute -top-10 bg-white text-black text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-10">
                                            {formatPrice(data.total)}
                                        </div>
                                        {/* Bar */}
                                        <div
                                            className="w-full max-w-[40px] bg-gradient-to-t from-turrs-blue/20 to-turrs-blue rounded-t-sm transition-all duration-500"
                                            style={{ height: `${heightPercentage}%`, minHeight: '4px' }}
                                        ></div>
                                    </div>
                                    {/* Label */}
                                    <p className="text-white/40 text-xs mt-3 select-none text-center hidden md:block">{data.month}</p>
                                    <p className="text-white/40 text-[10px] mt-2 select-none text-center md:hidden">{data.month.split(' ')[0]}</p>
                                </div>
                            );
                        })}
                        {stats.monthlyRevenue.length === 0 && (
                            <div className="w-full text-center text-white/40 self-center">No hay datos de ingresos en los últimos 6 meses.</div>
                        )}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 flex flex-col">
                    <h3 className="text-white font-semibold text-lg mb-6">Top 5 Productos</h3>
                    <div className="flex-1 flex flex-col justify-between gap-4">
                        {stats.topProducts.map((product, index) => {
                            const maxSold = stats.topProducts.length > 0 ? stats.topProducts[0].totalSold : 1;
                            const percent = (product.totalSold / maxSold) * 100;
                            return (
                                <div key={product._id} className="flex items-center gap-3">
                                    <span className="text-white/20 font-bold text-xl w-4 text-center">{index + 1}</span>
                                    {product.image ? (
                                        <img src={product.image} className="w-10 h-10 rounded object-cover bg-white/5" alt={product.name} />
                                    ) : (
                                        <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center">
                                            <span className="text-white/20 text-xs text-center leading-none">N/A</span>
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white/80 text-sm font-medium truncate mb-1">{product.name}</p>
                                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                            <div className="bg-turrs-blue h-full rounded-full" style={{ width: `${percent}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-turrs-blue font-bold text-sm leading-tight">{product.totalSold}</p>
                                        <p className="text-white/30 text-[10px] uppercase">Vendidos</p>
                                    </div>
                                </div>
                            );
                        })}
                        {stats.topProducts.length === 0 && (
                            <div className="text-center text-white/40 py-10">No hay datos de ventas aún</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Orders summary by status & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Orders by Status */}
                <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-white font-semibold text-lg mb-6">Órdenes por Estado</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Pendiente', field: 'pending', color: 'bg-yellow-500' },
                            { label: 'Pagado', field: 'paid', color: 'bg-blue-500' },
                            { label: 'Procesando', field: 'processing', color: 'bg-orange-500' },
                            { label: 'Enviado', field: 'shipped', color: 'bg-purple-500' },
                            { label: 'Entregado', field: 'delivered', color: 'bg-green-500' },
                            { label: 'Cancelado', field: 'cancelled', color: 'bg-red-500' },
                        ].map(status => {
                            const count = stats.ordersByStatus[status.field] || 0;
                            // Calculate max count for the bar UI
                            const validCounts = Object.values(stats.ordersByStatus).filter(val => typeof val === 'number');
                            const maxCount = validCounts.length > 0 ? Math.max(...validCounts, 1) : 1;
                            const percent = (count / maxCount) * 100;

                            return (
                                <div key={status.field} className="relative">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-white/70">{status.label}</span>
                                        <span className="text-white font-medium">{count}</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2">
                                        <div className={`${status.color} h-full rounded-full`} style={{ width: `${percent}%` }}></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Recent Orders List */}
                <div className="lg:col-span-2 bg-[#0A0A0C] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-white font-semibold text-lg mb-6">Últimas 5 Órdenes</h3>
                    {stats.recentOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                                        <th className="pb-3 px-4 font-medium">Orden</th>
                                        <th className="pb-3 px-4 font-medium">Cliente</th>
                                        <th className="pb-3 px-4 font-medium">Fecha</th>
                                        <th className="pb-3 px-4 font-medium text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentOrders.map((order, idx) => (
                                        <tr key={order._id} className={idx !== stats.recentOrders.length - 1 ? "border-b border-white/5" : ""}>
                                            <td className="py-4 px-4 whitespace-nowrap">
                                                <span className="text-white/80 font-mono text-xs">#{order._id.slice(-6)}</span>
                                            </td>
                                            <td className="py-4 px-4 min-w-[150px]">
                                                <p className="text-white/90 text-sm truncate">{order.userId?.name || 'Usuario Eliminado'}</p>
                                                <p className="text-white/40 text-xs truncate">{order.userId?.email || 'N/A'}</p>
                                            </td>
                                            <td className="py-4 px-4 text-white/60 text-sm whitespace-nowrap">
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td className="py-4 px-4 text-right whitespace-nowrap">
                                                <span className="text-white font-semibold">{formatPrice(order.total)}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center text-white/40 py-10">No hay órdenes recientes</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatsTab;
