// frontend/src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import AdminProductCard from '../../components/admin/AdminProductCard';
import ProductEditModal from '../../components/admin/ProductEditModal';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import OrderDetailModal, { STATUS_STYLES, formatPrice, formatDate } from '../../components/admin/OrderDetailModal';
import StatsTab from '../../components/admin/StatsTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // Product Modals State
  const [isProductEditModalOpen, setIsProductEditModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState(null);
  const [selectedProductForDelete, setSelectedProductForDelete] = useState(null);

  // Product Filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('Todas');

  const { user } = useAuth();

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersStats, setOrdersStats] = useState(null);
  const [ordersTotal, setOrdersTotal] = useState(0);

  // Orders Filters & Pagination
  const [orderSearch, setOrderSearch] = useState('');
  const [orderSearchInputValue, setOrderSearchInputValue] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('Todos los estados');
  const [orderDateFrom, setOrderDateFrom] = useState('');
  const [orderDateTo, setOrderDateTo] = useState('');
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);

  // Order Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, orderPage, orderStatusFilter, orderSearch, orderDateFrom, orderDateTo]);

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setOrderSearch(orderSearchInputValue);
      setOrderPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [orderSearchInputValue]);

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

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const token = localStorage.getItem('token');
      const params = {
        page: orderPage,
        limit: 10
      };

      if (orderStatusFilter !== 'Todos los estados') {
        const statusMap = {
          'Pendiente': 'pending',
          'Pagado': 'paid',
          'Procesando': 'processing',
          'En camino': 'shipped',
          'Entregado': 'delivered',
          'Cancelado': 'cancelled'
        };
        params.status = statusMap[orderStatusFilter] || orderStatusFilter;
      }
      if (orderSearch) params.search = orderSearch;
      if (orderDateFrom) params.dateFrom = orderDateFrom;
      if (orderDateTo) params.dateTo = orderDateTo;

      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      setOrders(response.data.orders);
      setOrdersTotal(response.data.total);
      setOrderTotalPages(response.data.totalPages);
      setOrdersStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cargar las órdenes', background: '#0a0a0c', color: '#fff' });
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleOrderUpdate = (updatedOrder) => {
    setOrders(orders.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    fetchOrders(); // Optionally refetch for exact stats
  };

  const handleDeleteProduct = (product) => {
    setSelectedProductForDelete(product);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProductForEdit(product);
    setIsProductEditModalOpen(true);
  };

  const handleAddProduct = () => {
    setSelectedProductForEdit(null); // null means create new
    setIsProductEditModalOpen(true);
  };

  const handleProductSaved = () => {
    fetchProducts(); // Refresh list
  };

  const handleProductDeleted = () => {
    fetchProducts();
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
            className={`py-2 px-4 font-turrs-text font-medium ${activeTab === 'products'
              ? 'border-b-2 border-turrs-blue text-turrs-blue'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Productos
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-4 font-turrs-text font-medium ${activeTab === 'orders'
              ? 'border-b-2 border-turrs-blue text-turrs-blue'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Órdenes
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-2 px-4 font-turrs-text font-medium ${activeTab === 'stats'
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
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-white font-bold text-2xl">Productos</h2>
              <p className="text-white/50 text-sm mt-1">Gestiona el inventario ({products.length})</p>
            </div>

            <button
              onClick={handleAddProduct}
              className="bg-gradient-to-r from-turrs-blue to-purple-600 hover:from-turrs-blue/80 hover:to-purple-600/80 text-white px-6 py-2.5 rounded-xl font-medium transition flex items-center justify-center gap-2 shadow-lg shadow-turrs-blue/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Agregar Producto
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-turrs-blue/50 transition"
              />
            </div>
            <select
              value={productCategoryFilter}
              onChange={(e) => setProductCategoryFilter(e.target.value)}
              className="bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-turrs-blue/50 transition appearance-none md:w-48"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.5)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em 1.2em' }}
            >
              <option value="Todas">Todas las categorías</option>
              <option value="Ropa">Ropa</option>
              <option value="Accesorios">Accesorios</option>
              <option value="Perfumes">Perfumes</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products
              .filter(p => productCategoryFilter === 'Todas' || p.category === productCategoryFilter)
              .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
              .map((product) => (
                <AdminProductCard
                  key={product._id}
                  product={product}
                  onEdit={() => handleEditProduct(product)}
                  onDelete={() => handleDeleteProduct(product)}
                />
              ))}
          </div>

          {products.length === 0 && !loading && (
            <div className="text-center py-20 bg-white/5 border border-white/5 rounded-2xl">
              <p className="text-white/40 mb-2">No hay productos en el inventario</p>
              <button onClick={handleAddProduct} className="text-turrs-blue hover:text-white transition font-medium">
                Crear el primer producto
              </button>
            </div>
          )}

          <ProductEditModal
            isOpen={isProductEditModalOpen}
            onClose={() => setIsProductEditModalOpen(false)}
            product={selectedProductForEdit}
            onSaved={handleProductSaved}
          />

          <ConfirmDeleteModal
            isOpen={isConfirmDeleteModalOpen}
            onClose={() => setIsConfirmDeleteModalOpen(false)}
            product={selectedProductForDelete}
            onSuccess={handleProductDeleted}
          />
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Stats Bar */}
          {ordersStats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0A0A0C] border border-white/5 p-4 rounded-2xl">
                <p className="text-white/40 text-xs mb-1 uppercase tracking-wider font-semibold">T. Ingresos</p>
                <p className="text-2xl font-bold text-white">{formatPrice(ordersStats.totalRevenue)}</p>
              </div>
              <div className="bg-[#0A0A0C] border border-white/5 p-4 rounded-2xl">
                <p className="text-white/40 text-xs mb-1 uppercase tracking-wider font-semibold">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-400">{ordersStats.pendingCount + ordersStats.processingCount}</p>
              </div>
              <div className="bg-[#0A0A0C] border border-white/5 p-4 rounded-2xl">
                <p className="text-white/40 text-xs mb-1 uppercase tracking-wider font-semibold">En Tránsito</p>
                <p className="text-2xl font-bold text-blue-400">{ordersStats.shippedCount}</p>
              </div>
              <div className="bg-[#0A0A0C] border border-white/5 p-4 rounded-2xl">
                <p className="text-white/40 text-xs mb-1 uppercase tracking-wider font-semibold">Entregados</p>
                <p className="text-2xl font-bold text-green-400">{ordersStats.deliveredCount}</p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-[#0A0A0C] border border-white/5 p-4 rounded-2xl flex flex-col lg:flex-row gap-4">
            <input
              type="text"
              placeholder="Buscar por ID, email, nombre..."
              value={orderSearchInputValue}
              onChange={(e) => setOrderSearchInputValue(e.target.value)}
              className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#74ACDF]"
            />
            <select
              value={orderStatusFilter}
              onChange={(e) => { setOrderStatusFilter(e.target.value); setOrderPage(1); }}
              className="bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#74ACDF] appearance-none cursor-pointer"
            >
              <option value="Todos los estados">Todos los estados</option>
              <option value="Pendiente">⏳ Pendiente</option>
              <option value="Pagado">✅ Pagado</option>
              <option value="Procesando">⚙️ Procesando</option>
              <option value="En camino">🚚 En camino</option>
              <option value="Entregado">📦 Entregado</option>
              <option value="Cancelado">❌ Cancelado</option>
            </select>
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={orderDateFrom}
                onChange={(e) => { setOrderDateFrom(e.target.value); setOrderPage(1); }}
                className="bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#74ACDF] [color-scheme:dark]"
              />
              <span className="text-white/40 text-sm">a</span>
              <input
                type="date"
                value={orderDateTo}
                onChange={(e) => { setOrderDateTo(e.target.value); setOrderPage(1); }}
                className="bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#74ACDF] [color-scheme:dark]"
              />
            </div>
            {(orderSearch || orderStatusFilter !== 'Todos los estados' || orderDateFrom || orderDateTo) && (
              <button
                onClick={() => {
                  setOrderSearch('');
                  setOrderSearchInputValue('');
                  setOrderStatusFilter('Todos los estados');
                  setOrderDateFrom('');
                  setOrderDateTo('');
                  setOrderPage(1);
                }}
                className="text-[#74ACDF] text-sm hover:text-white transition px-2"
              >
                Limpiar Filtros
              </button>
            )}
          </div>

          {/* Orders List & Loading */}
          {ordersLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-2 border-white/20 border-t-[#74ACDF] rounded-full animate-spin"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-[#0A0A0C] border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No se encontraron órdenes</h3>
              <p className="text-white/40 text-sm">Intenta ajustar los filtros de búsqueda.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block bg-[#0A0A0C] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm text-white/70">
                  <thead className="text-xs text-white/50 uppercase bg-black/50 border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4 font-medium">Orden</th>
                      <th className="px-6 py-4 font-medium">Cliente</th>
                      <th className="px-6 py-4 font-medium">Total</th>
                      <th className="px-6 py-4 font-medium">Estado</th>
                      <th className="px-6 py-4 font-medium text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map(order => {
                      const userInfo = order.userId || {};
                      const badge = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
                      const { date, time } = formatDate(order.createdAt);

                      return (
                        <tr key={order._id} className="hover:bg-white/[0.02] transition">
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <span className="font-mono text-white/90 text-xs">#{order._id.slice(-8).toUpperCase()}</span>
                              <div className="flex gap-1">
                                {order.products.slice(0, 3).map((item, i) => (
                                  <div key={i} className="w-8 h-8 rounded bg-black border border-white/10 overflow-hidden" title={item.productId?.name}>
                                    {item.productId?.images?.[0] && (
                                      <img src={item.productId.images[0]} alt="" className="w-full h-full object-cover mix-blend-lighten" />
                                    )}
                                  </div>
                                ))}
                                {order.products.length > 3 && (
                                  <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[10px]">+{(order.products.length - 3)}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0 text-xs">
                                {userInfo.avatar ? <img src={userInfo.avatar} alt="A" className="w-full h-full object-cover" /> : userInfo.firstName?.[0]?.toUpperCase() || '?'}
                              </div>
                              <div>
                                <p className="text-white/90 font-medium">{userInfo.firstName ? `${userInfo.firstName} ${userInfo.lastName}` : (userInfo.name || 'Sin nombre')}</p>
                                <p className="text-xs text-white/40 line-clamp-1 max-w-[150px]">{userInfo.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-white font-medium">
                            {formatPrice(order.total)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text} whitespace-nowrap`}>
                              {badge.label}
                            </span>
                            <div className="mt-2 text-xs">
                              <p className="text-white/60">{date}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true); }}
                              className="text-[#74ACDF] hover:text-white transition text-sm font-medium bg-[#74ACDF]/10 hover:bg-[#74ACDF]/20 px-3 py-1.5 rounded-lg"
                            >
                              Ver Detalle
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="md:hidden space-y-4">
                {orders.map(order => {
                  const userInfo = order.userId || {};
                  const badge = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
                  const { date } = formatDate(order.createdAt);

                  return (
                    <div key={order._id} className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-mono text-white/90 text-sm">#{order._id.slice(-8).toUpperCase()}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0 text-xs">
                          {userInfo.avatar ? <img src={userInfo.avatar} alt="A" className="w-full h-full object-cover" /> : userInfo.firstName?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="text-white/90 text-sm font-medium">{userInfo.firstName ? `${userInfo.firstName} ${userInfo.lastName}` : (userInfo.name || 'Sin nombre')}</p>
                          <p className="text-xs text-white/40">{date}</p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-white font-bold">{formatPrice(order.total)}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true); }}
                        className="w-full bg-white/5 hover:bg-white/10 text-white/70 py-2 rounded-xl text-sm transition"
                      >
                        Ver Detalle Completo
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {orderTotalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    onClick={() => setOrderPage(p => Math.max(1, p - 1))}
                    disabled={orderPage === 1}
                    className="w-10 h-10 rounded-xl bg-[#0A0A0C] border border-white/10 text-white/50 hover:text-white disabled:opacity-30 flex items-center justify-center transition"
                  >
                    ←
                  </button>
                  <span className="flex items-center text-white/40 text-sm">
                    Página {orderPage} de {orderTotalPages}
                  </span>
                  <button
                    onClick={() => setOrderPage(p => Math.min(orderTotalPages, p + 1))}
                    disabled={orderPage === orderTotalPages}
                    className="w-10 h-10 rounded-xl bg-[#0A0A0C] border border-white/10 text-white/50 hover:text-white disabled:opacity-30 flex items-center justify-center transition"
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}

          <OrderDetailModal
            isOpen={isOrderModalOpen}
            onClose={() => setIsOrderModalOpen(false)}
            order={selectedOrder}
            onOrderUpdate={handleOrderUpdate}
          />
        </div>
      )}

      {activeTab === 'stats' && (
        <StatsTab />
      )}
    </div>
  );
};

export default AdminDashboard;